import * as React from "react";
import { RewriteRuleEntity } from "../../../../../../domains/editing/rewrite-rule/rewrite-rule-entity";

export class RewriteRuleRow extends React.Component<
    {
        rewriteRule: RewriteRuleEntity;
        onSelect: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    },
    {}
> {
    render() {
        return (
            <tr
                className={this.props.rewriteRule.selected ? "rewrite-rule-row__selected" : ""}
                onMouseDown={this.props.onSelect}
            >
                <td>{this.props.rewriteRule.action}</td>
                <td>{this.props.rewriteRule.header}</td>
                <td>{this.props.rewriteRule.value}</td>
            </tr>
        );
    }
}
