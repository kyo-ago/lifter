"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const async_on_nedb_repository_1 = require("../../../base/async-on-nedb-repository");
const find_match_entry_1 = require("../specs/find-match-entry");
const auto_responder_entry_factory_1 = require("./auto-responder-entry-factory");
class AutoResponderEntryRepository extends async_on_nedb_repository_1.AsyncOnNedbRepository {
    constructor(projectEntity, localFileResponderFactory) {
        super(projectEntity.getDataStoreOptions("autoResponderEntryRepository"), {
            toEntity: json => {
                return auto_responder_entry_factory_1.AutoResponderEntryFactory.fromJSON(json);
            },
            toJSON: entity => {
                return entity.json;
            }
        });
        this.localFileResponderFactory = localFileResponderFactory;
        this.event = new events_1.EventEmitter();
    }
    async findMatchEntry(clientRequestEntity) {
        let findMatchEntry = new find_match_entry_1.FindMatchEntry(this.localFileResponderFactory, clientRequestEntity);
        let entries = await this.resolveAll();
        return entries.reduce((promise, entity) => {
            return findMatchEntry.getLocalFileResponder(promise, entity);
        }, Promise.resolve(null));
    }
    async load() {
        let result = await super.load();
        this.event.emit("change");
        return result;
    }
    async store(entity) {
        let result = await super.store(entity);
        this.event.emit("change");
        return result;
    }
    async deleteByIdentity(identity) {
        let result = await super.deleteByIdentity(identity);
        this.event.emit("change");
        return result;
    }
    addChangeEvent(callback) {
        this.event.addListener("change", callback);
    }
}
exports.AutoResponderEntryRepository = AutoResponderEntryRepository;
