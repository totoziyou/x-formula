/**
 * Created by W.X. on 2018/7/30.
 */

const baseOperationSymbols = {
    "+": "+",
    "-": "-",
    "*": "x",
    "/": "/",
};

export default class Formula {

    private symbols: any;

    constructor() {
        this.symbols = (<any>Object).assign({}, baseOperationSymbols);
    }

    /**
     * registry a new operation symbol
     */
    registrySymbol(string) {

    }

    /**
     * registry a new operation function
     * @param fn
     */
    registryFunction(fn:{name:string, paramsNumber: number}) {

    }

    /**
     * parse formula string
     */
    parse() {

    }

    /**
     * compute the result of formula
     * 根据公式带入参数算出结果
     * @param params
     * @param formulaString
     */
    run(params, formulaString) {

    }

}