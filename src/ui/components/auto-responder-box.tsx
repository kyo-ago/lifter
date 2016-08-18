import * as React from "react";

export interface AutoResponderBoxEntry {
    id: number;
    pattern: string;
    path: string;
    type: string;
}

export class AutoResponderBox extends React.Component<{
    entries: AutoResponderBoxEntry[]
}, {}> {
    render() {
        let entries = this.props.entries.map((entry: AutoResponderBoxEntry) => {
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