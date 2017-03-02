import * as React from "react";
import {eventEmitter} from "../../libs/event-emitter";

export interface ClientRequestBoxEntry {
    id: number;
    url: string;
}

export class ClientRequestBox extends React.Component<{
    entries: ClientRequestBoxEntry[];
}, {}> {
    onContextmenu() {
        eventEmitter.emit("contextmenuClientRequest");
    }

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