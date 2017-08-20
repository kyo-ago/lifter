import * as React from "react";
import {RewriteRuleEntity} from "../../../domain/rewrite-rule/rewrite-rule-entity";
import {GlobalProps} from "../index";

export class TopForm extends React.Component<GlobalProps, {}> {
    private urlElem: HTMLInputElement;
    private actionElem: HTMLSelectElement;
    private headerElem: HTMLInputElement;
    private valueElem: HTMLInputElement;

    onCancelClick() {
        this.props.cancelRewriteRule();
    }

    onSaveClick() {
        this.props.saveRewriteRule(
            this.urlElem.value,
            this.actionElem.value,
            this.headerElem.value,
            this.valueElem.value
        );
    }

    render() {
        let currentRewriteRule = this.props.currentRewriteRule;
        let getValue = (mapper: (rewriteRule: RewriteRuleEntity) => string) => currentRewriteRule.map(mapper).getOrElse(() => '');
        let cancelButton = currentRewriteRule.match({
            Some: () => <button className="btn btn-default" onClick={this.onCancelClick.bind(this)}>Cancel</button>,
            None: () => null,
        });

        return <div className="top-form">
            <form className="form-table" onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => (e.key === "Enter") && e.preventDefault()}>
                <div className="top-form__top">
                    <input type="text" className="form-control top-form__input-url"
                           placeholder="http://example.com/**.js"
                           defaultValue={getValue((rewriteRule) => rewriteRule.url)}
                           ref={(elem) => this.urlElem = elem}
                    />
                </div>
                <div className="top-form__bottom">
                    <select className="form-control form-table-cell top-form__select-action"
                            ref={(elem) => this.actionElem = elem}
                            defaultValue={getValue((rewriteRule) => rewriteRule.action)}
                    >
                        <option>Add</option>
                        <option>Modify</option>
                        <option>Delete</option>
                    </select>
                    <label className="form-table-cell">
                        Header
                        <input type="text" className="form-control top-form__input-header"
                               placeholder="Content-Type"
                               ref={(elem) => this.headerElem = elem}
                               defaultValue={getValue((rewriteRule) => rewriteRule.header)}
                        />
                    </label>
                    <label className="form-table-cell">
                        Value
                        <input type="text" className="form-control top-form__input-value"
                               placeholder="text/html; charset=utf-8"
                               ref={(elem) => this.valueElem = elem}
                               defaultValue={getValue((rewriteRule) => rewriteRule.value)}
                        />
                    </label>
                    <div className="top-form__btn-block">
                        {cancelButton}
                        <button className="btn btn-primary top-form__btn-primary" onClick={this.onSaveClick.bind(this)}>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>;
    }
}