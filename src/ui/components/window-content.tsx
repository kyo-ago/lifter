import * as React from "react";
import {AutoResponderBox} from './auto-responder-box'
import {ClientRequestBox} from "./client-request-box";

export class WindowContent extends React.Component<{}, {}> {
    render() {
        return (
            <div className="window-content">
                <div className="pane-group">
                    <AutoResponderBox entries={[]} />
                    <ClientRequestBox entries={[]} />
                </div>
            </div>
        );
    }
}