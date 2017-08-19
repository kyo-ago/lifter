import * as React from "react";
import {RewriteRuleEntity} from "../../../domain/rewrite-rule/rewrite-rule-entity";
import {GlobalProps} from "../index";

export class TopForm extends React.Component<GlobalProps, {}> {
    private actionElem: HTMLSelectElement;
    private headerElem: HTMLInputElement;
    private valueElem: HTMLInputElement;

    onCancelClick() {
        this.props.cancelRewriteRule();
    }

    onSaveClick() {
        this.props.saveRewriteRule(
            this.actionElem.value,
            this.headerElem.value,
            this.valueElem.value
        );
    }

    render() {
        let currentRewriteRule = this.props.currentRewriteRule;
        let getValue = (mapper: (rewriteRule: RewriteRuleEntity) => string) => currentRewriteRule.map(mapper).getOrElse(() => '');

        return <div className="top-form">
            <form className="form-table">
                <select className="form-control form-table-cell"
                    ref={(elem) => this.actionElem = elem}
                    value={getValue((rewriteRule) => rewriteRule.action)}
                >
                    <option>Add</option>
                    <option>Modify</option>
                    <option>Delete</option>
                </select>
                <label className="form-table-cell">
                    Header
                    <input type="text" className="form-control"
                        placeholder="Content-Type"
                        ref={(elem) => this.headerElem = elem}
                        value={getValue((rewriteRule) => rewriteRule.header)}
                    />
                </label>
                <label className="form-table-cell">
                    Value
                    <input type="text" className="form-control"
                        placeholder="text/html; charset=utf-8"
                        ref={(elem) => this.valueElem = elem}
                        value={getValue((rewriteRule) => rewriteRule.value)}
                    />
                </label>
                {
                    currentRewriteRule.match({
                        Some: () => <button className="btn btn-default" onClick={this.onCancelClick.bind(this)}>Cancel</button>,
                        None: () => null,
                    })
                }
                <button className="btn btn-primary pull-right" onClick={this.onSaveClick.bind(this)}>
                    Save
                </button>
            </form>
        </div>;
    }
}