import { BaseValueObject } from "@kyo-ago/lifter-common";
import { Url } from "url";

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
