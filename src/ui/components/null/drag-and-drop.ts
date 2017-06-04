import * as React from "react";
import {GlobalProps} from "../index";

export class DragAndDropHandler extends React.Component<GlobalProps, {}> {
    render(): any {
        window.addEventListener("drop", (e) => {
            if (!e.dataTransfer || !e.dataTransfer.files.length) {
                return;
            }
            this.props.fileDrop(Array.from(e.dataTransfer.files));
        });

        return null;
    }
}
