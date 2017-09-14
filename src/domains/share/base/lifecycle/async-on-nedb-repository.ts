import * as promisify from 'es6-promisify';
import * as Datastore from 'nedb';
import {Entity, Identity} from 'typescript-dddbase';

export interface NedbMapper<ID extends Identity<ID>, E extends Entity<any>> {
    toEntity(json: Object): E;
    toJSON(entity: E): Object;
}

export abstract class AsyncOnNedbRepository<ID extends Identity<any>, E extends Entity<ID>> {
    private find: (query: any) => Promise<any[]>;
    private findOne: (query: any) => Promise<any>;
    private update: (query: any, value: any, option: any) => Promise<any>;
    private remove: (query: any, option: any) => Promise<any>;

    constructor(private datastore: Datastore, private mapper:  NedbMapper<ID, E>) {
        this.find = promisify(this.datastore.find, this.datastore);
        this.findOne = promisify(this.datastore.findOne, this.datastore);
        this.update = promisify(this.datastore.update, this.datastore);
        this.remove = promisify(this.datastore.remove, this.datastore);
    }

    async resolveAll(): Promise<E[]> {
        let data = await this.find({});
        return data.map((d) => this.mapper.toEntity(d));
    }

    async resolve(identity: ID): Promise<E> {
        let data = await this.findOne({ id: identity.getValue(), });
        return this.mapper.toEntity(data);
    }

    async store(entity: E): Promise<E> {
        let json = this.mapper.toJSON(entity);
        let id = entity.getIdentity().getValue();
        await this.update({'id': String(id)}, json, {upsert:true});
        return entity;
    }

    storeList(entityList: E[]): Promise<E[]> {
        return Promise.all(entityList.map((i) => this.store(i)));
    }

    deleteByEntity(entity: E): Promise<AsyncOnNedbRepository<ID, E>> {
        return this.deleteByIdentity(entity.getIdentity());
    }

    async deleteByIdentity(identity: ID): Promise<AsyncOnNedbRepository<ID, E>> {
        let id = identity.getValue();
        await this.remove({'id': String(id)}, {});
        return this;
    }
}