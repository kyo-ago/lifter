import * as React from "react";
import {GlobalProps} from "../index";
import {RewriteRuleRow} from "./rewrite-rule-row";

export class RewriteRules extends React.Component<GlobalProps, {}> {
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
                    { this.props.rewriteRules.map((rewriteRule) => <RewriteRuleRow rewriteRule={rewriteRule} />) }
                </tbody>
            </table>
        </div>;
    }
}