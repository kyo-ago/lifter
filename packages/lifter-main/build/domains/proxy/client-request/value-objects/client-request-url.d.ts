/// <reference types="node" />
import { Url } from "url";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";
export declare class ClientRequestUrl extends BaseValueObject<Url> {
    private reqestUrl;
    constructor(reqestUrl: Url);
    getPathname(): string;
    getHref(): string;
}
