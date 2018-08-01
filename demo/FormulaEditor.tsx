/**
 * Created by W.X. on 2018/7/31.
 */
import * as React from "react";
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Presenter from './presenter';
import './css/editor.scss';

export interface FormulaEditorProps {
    presenter: Presenter;
}

@observer
@autobind
export default class FormulaEditor extends React.Component<FormulaEditorProps, any> {

    private input: any;

    @observable
    private formula: string = '';

    render() {
        return (
            <div className="editor">
                <div className="typeSwitchs">目标字段类型</div>
                <div className="formulaArea">{this.formula}</div>
                <div className="pannel">
                    <div className="fieldsPannel">字段</div>
                    {this.renderOperationPannel()}
                </div>
            </div>
        );
    }

    renderOperationPannel() {
        return (
            <div className="operationPannel">
                <div>输入</div>
                <div>
                    <input type="text" ref={(ref) => this.input = ref} />
                    <button type="button" onClick={this.onAddInputValue}>加入</button>
                </div>
                <div>基本运算符号</div>
                <div>字段类型关联运算符号</div>
            </div>
        );
    }

    onAddInputValue() {
        console.info(this.input.value);
        this.formula = this.formula + this.input.value;
        this.input.value = '';
    }

}