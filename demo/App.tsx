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
        return (
            <div>
                <div className="demoTitle">X-Formula is a customer formula lib</div>
                <div className="container">
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

}