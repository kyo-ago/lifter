"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseValueObject {
    constructor(_value) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
}
exports.BaseValueObject = BaseValueObject;
