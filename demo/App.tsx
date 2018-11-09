/**
 * Created by W.X. on 2018/7/31.
 */

import * as React from "react";
import { observer } from 'mobx-react';
import FormulaEditor from './FormulaEditor';
import Presenter from './presenter';
import './css/index.scss';

@observer
export default class App extends React.Component<any, any> {

    private presenter: Presenter;

    constructor(props, context) {
        super(props, context);
        this.presenter = new Presenter();
    }

    render() {
        return this.renderFormulaEditor();
    }

    // renderFormulaTransform() {
    //     return (
    //         <div>
    //             <div className="demoTitle">Formula-Transform 等式因子转换器</div>
    //             <div className="container">
    //             </div>
    //         </div>
    //     );
    // }

    renderFormulaEditor() {
        return (
            <div>
                <div className="demoTitle">X-Formula is a customer formula lib</div>
                <div className="container">
                    <div className="exampleTest">
                        { this.renderPresenterTest() }
                    </div>
                    <FormulaEditor presenter={this.presenter} />
                    <div className="summary">
                        <div>运算符说明</div>
                        <ul>
                            数值型
                            <li>支持算式运算符：+,-,*,/</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    renderPresenterTest() {

        const tdStyle: any = {
            padding: 3,
            backgroundColor: '#f6f6f6',
            height: 24,
        };

        const tdSuccessStyle: any = Object.assign({}, tdStyle, {backgroundColor: '#dcedc8'});
        const tdErrorStyle: any = Object.assign({}, tdStyle, {backgroundColor: '#f48fb1'});
        const tdLabelStyle: any = Object.assign({}, tdStyle, {color: 'blue', backgroundColor: '#ffffff'});

        const trs = this.presenter.examples.map((exam, index) => {
            if(exam.type === 'label') {
                return (
                    <tr key={"exam"+index}>
                        <td style={tdLabelStyle} colSpan={6}>{exam.text}</td>
                    </tr>
                );
            }
            else {
                let tdStyle = exam.success ? tdSuccessStyle : tdErrorStyle;
                let params = JSON.stringify(exam.params);
                if(exam.needGetFn) {
                    params = "formaula.getVariable获取";
                }
                else if(exam.getVariable) {
                    params = "传入的getVariable获取";
                }
                return (
                    <tr key={"exam"+index}>
                        <td style={tdStyle}>{exam.type}</td>
                        <td style={tdStyle}>{exam.formula}</td>
                        <td style={tdStyle}>{params}</td>
                        <td style={tdStyle}>{exam.result}</td>
                        <td style={tdStyle}>{exam.computeResult}</td>
                        <td style={tdStyle}>{exam.success?"√":"×"}</td>
                    </tr>
                );
            }
        });

        return (
            <table style={{width:'100%', border:'1px solid #dddddd'}} cellSpacing="2">
                <tbody>
                <tr>
                    <td style={tdStyle}>类型</td>
                    <td style={tdStyle}>公式</td>
                    <td style={tdStyle}>参数</td>
                    <td style={tdStyle}>期望结果</td>
                    <td style={tdStyle}>结果</td>
                    <td style={tdStyle}>正确</td>
                </tr>
                {trs}
                </tbody>
            </table>
        );
    }

}