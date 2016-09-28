import * as React from "react";

export interface ClientRequestBoxEntry {
    id: number;
    pattern: string;
    path: string;
    type: string;
}

export class ClientRequestBox extends React.Component<{
    entries: ClientRequestBoxEntry[]
}, {}> {
    render() {
        let entries = (this.props.entries || []).map((entry: ClientRequestBoxEntry) => {
            return (
                <div key={entry.id}>
                    <span>{entry.pattern}</span>
                    <span>{entry.path}</span>
                    <span>{entry.type}</span>
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