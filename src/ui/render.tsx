import * as React from "react";
import * as ReactDOM from "react-dom";

import {AutoResponderBox} from "./auto-responder-box";

export function Render(files: any) {
    ReactDOM.render(
        <AutoResponderBox entries={files} />,
        document.getElementById('main')
    );
}
