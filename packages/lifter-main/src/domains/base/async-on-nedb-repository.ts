import promisify = require("es6-promisify");
import Datastore = require("nedb");
import { Entity, Identity } from "typescript-dddbase";
import {ResolveAll} from "../libs/resolve-all";

export interface NedbMapper<ID extends Identity<any>, E extends Entity<ID>> {
    toEntity(json: any): E;
    toJSON(entity: E): any;
}

export abstract class AsyncOnNedbRepository<ID extends Identity<any>, E extends Entity<ID>> {
    private datastore: Datastore;
    private find: (query: any) => Promise<any[]>;
    private update: (query: any, value: any, option: any) => Promise<any>;
    private remove: (query: any, option: any) => Promise<any>;
    private loadDatabase: () => Promise<void>;

    private entities: { [key: string]: E } = {};

    constructor(dataStoreOptions: Datastore.DataStoreOptions, private mapper: NedbMapper<ID, E>) {
        this.datastore = new Datastore(dataStoreOptions);
        this.find = promisify(this.datastore.find, this.datastore);
        this.update = promisify(this.datastore.update, this.datastore);
        this.remove = promisify(this.datastore.remove, this.datastore);
        this.loadDatabase = promisify(this.datastore.loadDatabase, this.datastore);
    }

    async load(): Promise<void> {
        await this.loadDatabase();
        let data = await this.find({});
        this.entities = data.map(d => this.mapper.toEntity(d)).reduce(
            (base, cur) => {
                base[String(cur.getIdentity().getValue())] = cur;
                return base;
            },
            <{ [key: string]: E }>{}
        );
    }

    async resolveAll(): Promise<E[]> {
        return ResolveAll(this.entities);
    }

    async resolve(identity: ID): Promise<E> {
        return this.entities[identity.getValue()];
    }

    async store(entity: E): Promise<E> {
        let json = this.mapper.toJSON(entity);
        let id = entity.getIdentity().getValue();
        await this.update({ id: id }, json, { upsert: true });
        this.entities[id] = entity;
        return entity;
    }

    storeList(entityList: E[]): Promise<E[]> {
        return Promise.all(entityList.map(i => this.store(i)));
    }

    deleteByEntity(entity: E): Promise<AsyncOnNedbRepository<ID, E>> {
        return this.deleteByIdentity(entity.getIdentity());
    }

    async deleteByIdentity(identity: ID): Promise<AsyncOnNedbRepository<ID, E>> {
        let id = identity.getValue();
        await this.remove({ id: id }, {});
        delete this.entities[id];
        return this;
    }

    async overwriteAll(entities: E[]): Promise<E[]> {
        await this.deleteAll();
        return this.storeList(entities);
    }

    protected deleteAll(): Promise<any> {
        return this.remove({}, { multi: true });
    }
}
