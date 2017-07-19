import * as React from "react";
import {GlobalProps} from "../index";

export class SubmitForm extends React.Component<GlobalProps, any> {
    render() {
        return <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions">
                <button className="btn btn-default">
                    Cancel
                </button>

                <button className="btn btn-primary pull-right">
                    Save
                </button>
            </div>
        </footer>;
    }
}
