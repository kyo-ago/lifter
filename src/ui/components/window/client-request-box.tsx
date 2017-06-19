import * as React from "react";
import {GlobalProps} from "../index";
import {ClientRequestEntity} from "../../../domain/client-request/client-request-entity";

export class ClientRequestBox extends React.Component<GlobalProps, {}> {
    render() {
        let entries = (this.props.clientRequestEntries || []).map((entry: ClientRequestEntity) => {
            return (
                <tr key={entry.id}>
                    <td>{entry.url}</td>
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
                    <tbody>
                        {entries}
                    </tbody>
                </table>
            </div>
        );
    }
}