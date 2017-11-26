"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_dddbase_1 = require("typescript-dddbase");
class BaseEntity extends typescript_dddbase_1.Entity {
    get id() {
        return this.getIdentity().getValue();
    }
}
exports.BaseEntity = BaseEntity;
