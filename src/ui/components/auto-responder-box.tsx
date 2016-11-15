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
            let className = entry.type === '' ? 'icon-folder' : 'icon-doc';
            return (
                <span className="nav-group-item" title={entry.path} key={entry.id}>
                    <span className={`icon ${className}`}></span>
                    {entry.pattern}
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