"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime = require("mime");
const base_entity_1 = require("../../base/base-entity");
class LocalFileResponderEntity extends base_entity_1.BaseEntity {
    constructor(identity, path, type, size) {
        super(identity);
        this.path = path;
        this.type = type;
        this.size = size;
    }
    getBody() {
        return this.path.getBody();
    }
    getHeader() {
        return {
            "content-length": this.getContentLength(),
            "content-type": this.getContentType()
        };
    }
    getContentType() {
        return this.type.value || mime.getType(this.path.value);
    }
    getContentLength() {
        return this.size.value;
    }
}
exports.LocalFileResponderEntity = LocalFileResponderEntity;
