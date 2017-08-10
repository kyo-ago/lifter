import * as React from "react";
import {GlobalProps} from "../index";

export class RewriteRules extends React.Component<GlobalProps, any> {
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
                <tr>
                    <td>variables.scss</td>
                    <td>Document</td>
                    <td>Oct 13, 2015</td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
}