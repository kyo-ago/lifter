import { Url } from "url";
import { BaseValueObject } from "../../../share/base/value-objects/base-value-object";

export class ClientRequestUrl extends BaseValueObject<Url> {
    constructor(private reqestUrl: Url) {
        super(reqestUrl);
    }

    getPathname() {
        return this.reqestUrl.pathname;
    }

    getHref() {
        return this.reqestUrl.href;
    }
}
