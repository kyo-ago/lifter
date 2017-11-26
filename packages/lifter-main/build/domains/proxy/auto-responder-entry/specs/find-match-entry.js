"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FindMatchEntry {
    constructor(localFileResponderFactory, clientRequestEntity) {
        this.localFileResponderFactory = localFileResponderFactory;
        this.clientRequestEntity = clientRequestEntity;
    }
    async getLocalFileResponder(promise, entity) {
        let result = await promise;
        if (result) return result;
        let localFileResponderParam = await entity.getMatchResponder(this.clientRequestEntity);
        if (!localFileResponderParam) {
            return null;
        }
        return this.localFileResponderFactory.create(localFileResponderParam);
    }
}
exports.FindMatchEntry = FindMatchEntry;
