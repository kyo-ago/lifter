import { Url } from "url";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class ClientRequestUrl extends BaseValueObject<Url> {
    constructor(private reqestUrl: Url) {
        super(reqestUrl);
    }

    getPathname(): string {
        return this.reqestUrl.pathname || "";
    }

    getPathSearch(): string {
        return `${this.getPathname()}${this.reqestUrl.search || ""}`;
    }

    getHref(): string {
        return this.reqestUrl.href || "";
    }
}
