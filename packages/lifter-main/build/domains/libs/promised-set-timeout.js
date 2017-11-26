"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PromisedSetTimeout(wait) {
    return new Promise(result => setTimeout(result, PromisedSetTimeout.wait || wait));
}
exports.PromisedSetTimeout = PromisedSetTimeout;
