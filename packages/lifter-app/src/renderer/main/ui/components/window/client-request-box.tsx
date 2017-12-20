import { ClientRequestEntity } from "@kyo-ago/lifter-main/build/domains/proxy/client-request/client-request-entity";
import * as React from "react";
import { GlobalProps } from "../index";

export class ClientRequestBox extends React.Component<GlobalProps, {}> {
    render() {
        let entries = (this.props.clientRequestEntries || []).map((entry: ClientRequestEntity) => {
            return (
                <tr key={entry.id}>
                    <td>{entry.href}</td>
                </tr>
            );
        });
        return (
            <div className="pane">
                <table className="table-striped">
                    <thead>
                        <tr>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>{entries}</tbody>
                </table>
            </div>
        );
    }
}
