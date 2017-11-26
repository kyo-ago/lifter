"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promisify = require("es6-promisify");
const Datastore = require("nedb");
const resolve_all_1 = require("../libs/resolve-all");
class AsyncOnNedbRepository {
    constructor(dataStoreOptions, mapper) {
        this.mapper = mapper;
        this.entities = {};
        this.datastore = new Datastore(dataStoreOptions);
        this.find = promisify(this.datastore.find, this.datastore);
        this.update = promisify(this.datastore.update, this.datastore);
        this.remove = promisify(this.datastore.remove, this.datastore);
        this.loadDatabase = promisify(this.datastore.loadDatabase, this.datastore);
    }
    async load() {
        await this.loadDatabase();
        let data = await this.find({});
        this.entities = data.map(d => this.mapper.toEntity(d)).reduce((base, cur) => {
            base[String(cur.getIdentity().getValue())] = cur;
            return base;
        }, {});
    }
    async resolveAll() {
        return resolve_all_1.ResolveAll(this.entities);
    }
    async resolve(identity) {
        return this.entities[identity.getValue()];
    }
    async store(entity) {
        let json = this.mapper.toJSON(entity);
        let id = entity.getIdentity().getValue();
        await this.update({ id: id }, json, { upsert: true });
        this.entities[id] = entity;
        return entity;
    }
    storeList(entityList) {
        return Promise.all(entityList.map(i => this.store(i)));
    }
    deleteByEntity(entity) {
        return this.deleteByIdentity(entity.getIdentity());
    }
    async deleteByIdentity(identity) {
        let id = identity.getValue();
        await this.remove({ id: id }, {});
        delete this.entities[id];
        return this;
    }
    async overwriteAll(entities) {
        await this.deleteAll();
        return this.storeList(entities);
    }
    deleteAll() {
        return this.remove({}, { multi: true });
    }
}
exports.AsyncOnNedbRepository = AsyncOnNedbRepository;
