/// <reference types="nedb" />
import Datastore = require("nedb");
import { Entity, Identity } from "typescript-dddbase";
export interface NedbMapper<ID extends Identity<any>, E extends Entity<ID>> {
    toEntity(json: any): E;
    toJSON(entity: E): any;
}
export abstract class AsyncOnNedbRepository<ID extends Identity<any>, E extends Entity<ID>> {
    private mapper;
    private datastore;
    private find;
    private update;
    private remove;
    private loadDatabase;
    private entities;
    constructor(dataStoreOptions: Datastore.DataStoreOptions, mapper: NedbMapper<ID, E>);
    load(): Promise<void>;
    resolveAll(): Promise<E[]>;
    resolve(identity: ID): Promise<E>;
    store(entity: E): Promise<E>;
    storeList(entityList: E[]): Promise<E[]>;
    deleteByEntity(entity: E): Promise<AsyncOnNedbRepository<ID, E>>;
    deleteByIdentity(identity: ID): Promise<AsyncOnNedbRepository<ID, E>>;
    overwriteAll(entities: E[]): Promise<E[]>;
    protected deleteAll(): Promise<any>;
}
