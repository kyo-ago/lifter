"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_value_object_1 = require("../../../base/value-objects/base-value-object");
class ClientRequestUrl extends base_value_object_1.BaseValueObject {
    constructor(reqestUrl) {
        super(reqestUrl);
        this.reqestUrl = reqestUrl;
    }
    getPathname() {
        return this.reqestUrl.pathname;
    }
    getHref() {
        return this.reqestUrl.href;
    }
}
exports.ClientRequestUrl = ClientRequestUrl;
