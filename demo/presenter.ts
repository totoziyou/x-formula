/**
 * Created by W.X. on 2018/7/31.
 */

import { observable } from 'mobx';
import {formulaInstance} from '../src';

export default class Presenter {

    public examples: any;

    @observable
    public isFinish: boolean = false;

    constructor() {
        this.init();
    }

    init() {

        formulaInstance.registrySymbol('%');

        formulaInstance.registryFunction({
            name: 'test',
            func: this.testFunc,
            paramsType: ['number', 'number']
        });

        this.doTest();
        
        console.info("===============================");

        // this.testString();
        // this.testNumber();

        // formulaInstance.getVariablesHook = this.getVariable;

    }

    doTest() {
        const exampleString:Array<any> = [
            { type: 'label', text: '基本字符串连接'},
            { type: 'string', formula: "建筑：+年", params: null, result: '建筑：年', getVariable: null },
            { type: 'string', formula: "(中国)建筑：+(年)", params: null, result: '(中国)建筑：(年)', getVariable: null },
            { type: 'label', text: '字符串与变量连接'},
            {
                type: 'string', formula: "zz(中国)+str+年", params: {str:'=插入的变量='},
                result: 'zz(中国)=插入的变量=年', getVariable: null },
            {
                type: 'string', formula: "(中国)建筑：+str+年", params: null,
                result: '(中国)建筑：<这是从Fn里获得的值>年', getVariable: null, needGetFn: true
            },
            {
                type: 'string', formula: "(中国)建筑：+nnn(str)+年", params: null,
                result: '(中国)建筑：nnn(str)年', getVariable: this.getVariable
            },
            { type: 'label', text: '带算式的字符串'},
            {
                type: 'string', formula: "(中国)建筑：+3*5+年", params: null,
                result: '(中国)建筑：15年', getVariable: null
            },
            {
                type: 'string', formula: "(中国)建筑：+3*5-3+年", params: null,
                result: '(中国)建筑：12年', getVariable: null
            },
            {
                type: 'string', formula: "(中)建+3*5-3+年+3*4/2+月", params: null,
                result: '(中)建12年6月', getVariable: null
            }
        ];

        const exampleNumber:Array<any> = [
            { type: 'label', text: '纯算式'},
            { type: 'number', formula: "5+3", params: null, result: 5+3, getVariable: null },
            { type: 'number', formula: "5-3", params: null, result: 5-3, getVariable: null },
            { type: 'number', formula: "5*3", params: null, result: 5*3, getVariable: null },
            { type: 'number', formula: "5/3", params: null, result: 5/3, getVariable: null },
            { type: 'number', formula: "5%3", params: null, result: 5%3, getVariable: null },
            { type: 'number', formula: "5+3-2*6/2", params: null, result: 5+3-2*6/2, getVariable: null },

            { type: 'label', text: '变量算式'},
            { type: 'number', formula: "a+b", params: {a:1, b:2}, result: 3, getVariable: null },
            { type: 'number', formula: "a*b-c", params: null, result: (5*3-1), getVariable: null, needGetFn: true },

            { type: 'label', text: '带括号的单层及多层'},
            { type: 'number', formula: "a*(3+5)", params: {a:3}, result: (3*(3+5)), getVariable: null },
            { type: 'number', formula: "a+2*(3*(7-b))/3", params: {a:1, b:2}, result: (1+2*(3*(7-2))/3), getVariable: null },
            { type: 'number', formula: "a*((a+4)/(b-3))", params: {a:2, b:5}, result: (2*((2+4)/(5-3))), getVariable: null },

            { type: 'label', text: 'Math方法'},
            { type: 'number', formula: "a+Math.floor(5.3)", params: {a:5}, result: (5+Math.floor(5.3)), getVariable: null },
            { type: 'number', formula: "a*Math.abs(b)+5", params: {a:1, b:-3}, result: (1*Math.abs(-3)+5), getVariable: null },

            { type: 'label', text: '自定义的方法'},
            { type: 'number', formula: "a+2*(3*test(a,b))/3", params: {a:2, b:5}, result: (2+2*(3*this.testFunc(2,5))/3), getVariable: null },
            { type: 'number', formula: "a*test(b,c)", params: null, result: (5*this.testFunc(3,1)), getVariable: null, needGetFn: true },
        ];

        const examples = exampleString.concat(exampleNumber);

        this.examples = examples.map((e) => {

            if(e.type === 'label') return e;

            if(e.needGetFn) {
                formulaInstance.getVariablesHook = this.getVariable;
            }

            console.info("---------------", e.formula);
            const result = formulaInstance.compute(e.type, e.params, e.formula, e.getVariable);
            console.info("结果", result, result === e.result ? "正确" : "错误");
            console.info("   ");

            formulaInstance.getVariablesHook = null;

            return Object.assign({}, e, {
                computeResult: result,
                success: result === e.result
            });
        });

        console.info(this.examples);

        this.isFinish = true;
    }

    getVariable(variableName) {
        const variables = {
            a: 5,
            b: 3,
            c: 1,
            str: '<这是从Fn里获得的值>'
        };
        console.info("getVariable->", variableName, variables[variableName]);
        return variables[variableName] || variableName;
    }

    testFunc(a, b) {
        return a+b;
    }

}
