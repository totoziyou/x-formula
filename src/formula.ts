/**
 * Created by W.X. on 2018/7/30.
 */

const baseOperationSymbols = {
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
};

export default class Formula {

    private symbols: any;

    private functions: any = {};

    private getVariable: Function;

    constructor() {
        this.symbols = (<any>Object).assign({}, baseOperationSymbols);
    }

    /**
     * registry a new operation symbol
     */
    registrySymbol(str:string) {
        if(this.symbols[str]) {
            throw new Error("已经存在相同的符号");
        }
        else if(str.length > 1) {
            throw new Error("只能注册一个字符的算式符号");
        }
        else {
            this.symbols[str] = str;
        }
    }

    /**
     * registry a new operation function
     * @param fnObj
     */
    registryFunction(fnObj:{name:string, func: Function, paramsType: Array<string>}) {
        console.info("函数注册", fnObj.name);
        if(this.functions[fnObj.name]) {
            throw new Error("已经存在相同名称方法");
        }
        else {
            this.functions[fnObj.name] = {
                func: fnObj.func,
                paramsType: fnObj.paramsType
            }
        }
    }

    /**
     * parse formula string
     */
    parse(formulaString: string, isPart:boolean = false) {
        const len = formulaString.length;
        let formulaArray: Array<any> = [];
        let checkStr = '';
        let isFunc = false;
        let funcParams = '';

        for(let i=0; i<len; i++) {
            const char = formulaString[i];
            if(this.symbols[char]) {
                if(checkStr !== '') {
                    formulaArray.push(checkStr);
                }
                formulaArray.push(this.symbols[char]);
                checkStr = '';
            }
            else if(char === '(') {
                //如果发现当前字符是(, 需要判断是否一下几种情况
                // 1. 某种函数处理：  test();
                // 2. 聚合处理：  (a+b);
                // 3. 纯粹是一段文本： (如果）是这样 / 如果(他）是这样
                if(checkStr === '') {
                    const rightStr = formulaString.slice(i+1, len);
                    // console.info("剩余部分", rightStr);
                    const parsePart:any = this.parse(rightStr, true);
                    // console.info(parsePart);
                    if(parsePart.partArray.length === 1) {
                        checkStr += `(${parsePart.partArray[0]})`;
                    }
                    else {
                        formulaArray.push(parsePart.partArray);
                    }
                    i = i + parsePart.length;
                    // console.info("游标指向->", i, formulaString.slice(i, i+1));
                }
                else {
                    // 判断是否某个函数
                    if(this.functions[checkStr]) {
                        isFunc = true;
                        formulaArray.push({
                            isMath: false,
                            funcName: checkStr
                        });
                    }
                    //是否使用Math函数
                    else if(checkStr.indexOf('Math.') === 0) {
                        isFunc = true;
                        formulaArray.push({
                            isMath: true,
                            funcName: checkStr.split('Math.')[1]
                        })
                    }
                    else {
                        checkStr += char;
                    }
                }
            }
            else if(char === ')') {
                if(isFunc) {
                    formulaArray[formulaArray.length-1].params = funcParams.split(',');
                    checkStr = '';
                    funcParams = '';
                    isFunc = false;
                }
                else {
                    if(isPart) {
                        if(checkStr) {
                            formulaArray.push(checkStr);
                        }
                        return {
                            partArray: formulaArray,
                            length: i+1
                        };
                    }
                    else {
                        checkStr += char;
                    }
                }
            }
            else {
                checkStr += char;
                if(isFunc) {
                    funcParams += char;
                }
            }
        }
        if(checkStr !== '') {
            formulaArray.push(checkStr);
        }
        console.info("解析完成", formulaArray);
        return formulaArray;
    }

    /**
     * 设置获得公式里变量值的方法
     */
    set getVariablesHook (fn: Function) {
        this.getVariable = fn;
    }

    /**
     * compute the result of formula
     * 根据公式带入参数算出结果
     * @param type
     * @param params
     * @param formulaString
     * @param getVariables
     */
    compute(type:string, params:any, formulaString: string, getVariables?: Function) {
        // console.info("--------------------");
        console.info("结果类型", type);
        // console.info("使用的公式", formulaString);
        const formulaArray = this.parse(formulaString);
        return this.computeWithParseArray(type, params, formulaArray, getVariables);
    }

    /**
     * compute the result of array which is come from parse formula-string
     * 根据公式解析完成数组带入参数算出结果
     * @param type
     * @param params
     * @param formulaParseArray
     * @param getVariables
     * @returns {any}
     */
    computeWithParseArray(type:string, params:any, formulaParseArray:any, getVariables?:Function) {
        try {
            const operationString = this.preHandlerParamsAndFunc(type, params, formulaParseArray, getVariables);
            console.info("对公式中的变量和函数进行预处理", operationString);
            if(type === 'number') {
                return this.computeNumber(operationString);
            }
            else {
                return this.computeString(operationString);
            }
        }
        catch(err) {
            throw new Error(err);
        }
    }

    /**
     * 对公式和变量进行预处理
     */
    preHandlerParamsAndFunc(type, params, formulaArray, getVariables) {
        let operationString = '';
        const getVariablesFn = this.getVariable || getVariables;
        formulaArray.forEach((item) => {
            //如果是数组则表示一个()内的局部运算
            if(item instanceof Array) {
                const partStr = this.preHandlerParamsAndFunc(type, params, item, getVariablesFn);
                operationString += type === 'number' ? `(${partStr})` : partStr;
            }
            //如果item没有funcName, 表示item只是个字符串
            else if(item && !item.funcName) {
                let value;
                //如果有外部的获取变量的方法，则调用方法来获得变量对应的值
                if(getVariablesFn && !this.symbols[item]) {
                    value = getVariablesFn(item);
                }
                //如果没有该方法，再根据传入的params来判断是否有对应的变量值
                else if(params && params[item]) {
                    value = params[item];
                }
                //判断是否基本算式符号
                else if(this.symbols[item]) {
                    value = item;
                }
                //否则需要转换成数字
                else {
                    value = type === 'number' ? parseFloat(item) : item;
                }

                if(type === 'number' || this.symbols[item]) {
                    operationString += value;
                }
                else {
                    operationString += isNaN(value) ? `"${value}"` : parseFloat(value);
                }

            }
            //如果item有funcName, 表示是一个函数运算
            else {
                //如果是对象，则认为是使用了函数操作, 则需要执行函数获得结果代入
                let funcResult;
                const {isMath, funcName} = item;
                console.info(item);
                if(isMath) {
                    const funcParams = item.params.map((paramName) => {
                        if(getVariablesFn){
                            return getVariablesFn(paramName);
                        }
                        else {
                            return parseFloat(params[paramName]||paramName);
                        }
                    });
                    funcResult = Math[funcName].apply(null, funcParams);
                }
                else {
                    const {func, paramsType} = this.functions[item.funcName];
                    const funcParams = item.params.map((paramName, index) => {
                        if(getVariablesFn) {
                            return getVariablesFn(paramName);
                        }
                        else {
                            let value = params[paramName]||paramName;
                            if(paramsType[index] === 'number') {
                                value = parseFloat(value);
                            }
                            return value;
                        }
                    });
                    funcResult = func.apply(null, funcParams);
                }
                if(type === 'number') {
                    operationString += funcResult;
                }
                else {
                    operationString += isNaN(funcResult) ? `"${funcResult}"` : parseFloat(funcResult);
                }

            }
        });
        return operationString;
    }

    computeNumber(operationString) {
        const result = eval(operationString);
        console.info("转换成纯算式是:",operationString);
        // console.info("计算结果是:", result);
        return result;
    }

    computeString(str) {
        const operationArray = str.split('"');
        console.info(operationArray);
        const operationString = operationArray.map((operation) => {
            let len = operation.length;
            if(len > 2 && operation[0]=== '+' && operation[len-1] === '+') {
                return `+(${operation.slice(1, len-1)})+`
            }
            else {
                return operation;
            }
        }).join('"');
        console.info("string类型的最终计算式", operationString);
        return  eval(operationString)
    }

}