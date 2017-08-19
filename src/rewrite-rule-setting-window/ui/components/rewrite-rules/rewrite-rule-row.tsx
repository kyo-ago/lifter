import * as React from "react";
import {RewriteRuleEntity} from "../../../domain/rewrite-rule/rewrite-rule-entity";

export class RewriteRuleRow extends React.Component<{
    rewriteRule: RewriteRuleEntity;
}, {}> {
    render() {
        return <tr className={this.props.rewriteRule.selected ? 'selected' : ''}>
            <td>{this.props.rewriteRule.action}</td>
            <td>{this.props.rewriteRule.header}</td>
            <td>{this.props.rewriteRule.value}</td>
        </tr> ;
    }
}