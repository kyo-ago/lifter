import * as React from "react";

export interface AutoResponderBoxEntry {
    id: number;
    pattern: string;
    path: string;
    type: string;
}

export class AutoResponderBox extends React.Component<{
    entries: AutoResponderBoxEntry[];
}, {}> {
    render() {
        let entries = (this.props.entries || []).map((entry: AutoResponderBoxEntry) => {
            return (
                <span className="nav-group-item" key={entry.id}>
                    <span className="icon icon-home"></span>
                    connors
                </span>
            );
        });
        return (
            <div className="pane pane-sm sidebar">
                <nav className="nav-group">
                    <h5 className="nav-group-title">Auto responder</h5>
                    {entries}
                </nav>
            </div>
        );
    }
}