import * as React from "react";
import {GlobalProps} from "../index";

export class SubmitForm extends React.Component<GlobalProps, {}> {
    onCancelClick() {
        this.props.cancelAllRewriteRule();
    }

    onSaveClick() {
        this.props.saveAllRewriteRule();
    }

    render() {
        return <footer className="toolbar toolbar-footer form-bottom">
            <div className="toolbar-actions">
                <button className="btn btn-default" onClick={this.onCancelClick.bind(this)}>
                    Cancel
                </button>

                <button className="btn btn-primary pull-right" onClick={this.onSaveClick.bind(this)}>
                    Save
                </button>
            </div>
        </footer>;
    }
}
