import * as React from "react";
import { GlobalProps } from "../index";

export class OpenRewriteRuleSettingWindowBox extends React.Component<GlobalProps, {}> {
    onClick() {
        this.props.openRewriteRuleSettingWindow();
    }

    render() {
        return (
            <button
                className="btn btn-default"
                title="Open rewrite rule setting window"
                onClick={this.onClick.bind(this)}
            >
                <span className="icon icon-export" />
            </button>
        );
    }
}
