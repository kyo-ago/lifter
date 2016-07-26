"use strict";
const typescript_dddbase_1 = require("typescript-dddbase");
class FileEntity extends typescript_dddbase_1.Entity {
    constructor(identity, name, path, type) {
        super(identity);
        this.name = name;
        this.path = path;
        this.type = type;
    }
}
exports.FileEntity = FileEntity;
