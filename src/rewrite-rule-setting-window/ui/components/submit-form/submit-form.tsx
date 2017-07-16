import * as React from "react";
import {GlobalProps} from "../index";

export class SubmitForm extends React.Component<GlobalProps, any> {
    render() {
        return <footer class="toolbar toolbar-footer">
            <div class="toolbar-actions">
                <button class="btn btn-default">
                    Cancel
                </button>

                <button class="btn btn-primary pull-right">
                    Save
                </button>
            </div>
        </footer>;
    }
}