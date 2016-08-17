import {Url} from "url";
const NodeUrl = require('url');

export class ClientRequestUrl {
    private reqestUrl: Url
    constructor(
        private value: string,
    ) {
        this.reqestUrl = NodeUrl.parse(value);
    }

    getValue() {
        return this.value;
    }

    getPathname() {
        return this.reqestUrl.pathname;
    }
}