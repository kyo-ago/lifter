"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_file_responder_entity_1 = require("../local-file-responder-entity");
const local_file_responder_identity_1 = require("../local-file-responder-identity");
const local_file_responder_path_1 = require("../value-objects/local-file-responder-path");
const local_file_responder_size_1 = require("../value-objects/local-file-responder-size");
const local_file_responder_type_1 = require("../value-objects/local-file-responder-type");
class LocalFileResponderFactory {
    constructor() {
        this.identity = 0;
    }
    create(param) {
        return new local_file_responder_entity_1.LocalFileResponderEntity(
            new local_file_responder_identity_1.LocalFileResponderIdentity(this.identity++),
            new local_file_responder_path_1.LocalFileResponderPath(param.path),
            new local_file_responder_type_1.LocalFileResponderType(param.type),
            new local_file_responder_size_1.LocalFileResponderSize(param.size)
        );
    }
}
exports.LocalFileResponderFactory = LocalFileResponderFactory;
