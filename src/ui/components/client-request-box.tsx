import * as React from "react";

export interface ClientRequestBoxEntry {
    id: number;
    url: string;
}

export class ClientRequestBox extends React.Component<{
    entries: ClientRequestBoxEntry[];
}, {}> {
    render() {
        let entries = (this.props.entries || []).map((entry: ClientRequestBoxEntry) => {
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