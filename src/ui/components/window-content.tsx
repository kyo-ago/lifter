import * as React from "react";
import {AutoResponderBox} from './auto-responder-box'
import {ClientRequestBox} from "./client-request-box";
import {AppState} from "../reducers/index";

export class WindowContent extends React.Component<AppState, {}> {
    render() {
        return (
            <div className="window-content">
                <div className="pane-group">
                    <AutoResponderBox entries={this.props.autoResponderEntries} />
                    <ClientRequestBox entries={this.props.clientRequestEntries} />
                </div>
            </div>
        );
    }
}