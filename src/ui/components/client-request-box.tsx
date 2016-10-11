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
                <div key={entry.id}>
                    <span>{entry.url}</span>
                </div>
            );
        });
        return (
            <div className="entries">
                {entries}
            </div>
        );
    }
}