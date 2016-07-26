"use strict";
const file_identity_1 = require("./file-identity");
const file_entity_1 = require("./file-entity");
const file_name_1 = require("./file-name");
const file_path_1 = require("./file-path");
const file_type_1 = require("./file-type");
class FileFactory {
    static createFile(file) {
        return new file_entity_1.FileEntity(new file_identity_1.FileIdentity(this.identity++), new file_name_1.FileName(file.name), new file_path_1.FilePath(file.path), new file_type_1.FileType(file.type));
    }
}
FileFactory.identity = 0;
exports.FileFactory = FileFactory;
