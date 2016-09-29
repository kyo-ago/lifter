import {Url} from "url";
import {BaseValueObject} from "../base/value-object";
const NodeUrl = require('url');

export class ClientRequestUrl extends BaseValueObject<string> {
    private reqestUrl: Url
    constructor(
        _value: string,
    ) {
        super(_value);
        this.reqestUrl = NodeUrl.parse(_value);
    }

    getPathname() {
        return this.reqestUrl.pathname;
    }
}