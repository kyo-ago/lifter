import { AbstractAutoResponderEntryEntity } from "@kyo-ago/lifter-main/build/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import * as React from "react";
import { GlobalProps } from "../index";

export class AutoResponderBox extends React.Component<GlobalProps, {}> {
    onContextmenu(evn: React.MouseEvent<any>, id: number) {
        evn.preventDefault();
        evn.stopPropagation();
        this.props.contextmenuAutoResponderEntry(id);
    }

    render() {
        let entries = (this.props.autoResponderEntries || []).map((entry: AbstractAutoResponderEntryEntity) => {
            let className = entry.type === "Directory" ? "icon-folder" : "icon-doc";
            return (
                <span
                    className="nav-group-item"
                    title={entry.path.value}
                    key={entry.id}
                    onContextMenu={env => this.onContextmenu(env, entry.id)}
                >
                    <span className={`icon ${className}`} />
                    {entry.pattern.value}
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
