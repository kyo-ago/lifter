"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_dddbase_1 = require("typescript-dddbase");
const resolve_all_1 = require("../../../libs/resolve-all");
class ClientRequestRepository extends typescript_dddbase_1.OnMemoryRepository {
    resolveAll() {
        return resolve_all_1.ResolveAll(this.entities);
    }
}
exports.ClientRequestRepository = ClientRequestRepository;
