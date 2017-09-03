import * as Url from "url";
import {BaseValueObject} from "../../../share/base/value-objects/base-value-object";

export class ClientRequestUrl extends BaseValueObject<string> {
    private reqestUrl: Url.Url;

    constructor(
        _value: string,
    ) {
        super(_value);
        this.reqestUrl = Url.parse(_value);
    }

    getPathname() {
        return this.reqestUrl.pathname;
    }
}