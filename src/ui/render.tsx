import * as React from "react";
import * as ReactDOM from "react-dom";

import {AutoResponderBox} from "./auto-responder-box";

export function Render(entries: any) {
    ReactDOM.render(
        <AutoResponderBox entries={entries} />,
        document.getElementById('main')
    );
}
