import * as React from "react";
import {RewriteRuleEntity} from "../../../domain/rewrite-rule/rewrite-rule-entity";
import {GlobalProps} from "../index";
import {RewriteRuleRow} from "./rewrite-rule-row";

export class RewriteRules extends React.Component<GlobalProps, {}> {
    onClick(rewriteRule: RewriteRuleEntity, event: React.MouseEvent<HTMLTableRowElement>) {
        event.preventDefault();

        this.props.selectRewriteRule(rewriteRule.getIdentity());
    }

    render() {
        return <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Header</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    { this.props.rewriteRules.map((rewriteRule) => {
                        return <RewriteRuleRow
                            key={rewriteRule.id}
                            onSelect={this.onClick.bind(this, rewriteRule)}
                            rewriteRule={rewriteRule}
                        />;
                    }) }
                </tbody>
            </table>
        </div>;
    }
}