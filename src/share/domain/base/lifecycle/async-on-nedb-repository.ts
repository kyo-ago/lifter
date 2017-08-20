import {Identity, Entity} from "typescript-dddbase";
import * as Datastore from "nedb";

export interface NedbMapper<ID extends Identity<ID>, E extends Entity<any>> {
    toEntity(json: Object): E;
    toJSON(entity: E): Object;
}

export class AsyncOnNedbRepository<ID extends Identity<any>, E extends Entity<ID>> {
    constructor(private datastore: Datastore, private mapper:  NedbMapper<ID, E>) {
    }

    async resolveAll(): Promise<E[]> {
        return new Promise((resolve, reject) => {
            this.datastore.find({}, (err: Error, data: any[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(data.map((d) => this.mapper.toEntity(d)));
            })
        });
    }

    resolve(identity: ID): Promise<E | undefined | null> {
        return new Promise((resolve, reject) => {
            this.datastore.find({
                id: identity.getValue()
            }, (err: Error, data: any) => {
                if (err) {
                    return reject(err);
                }
                let entity = this.mapper.toEntity(data);
                resolve(entity);
            })
        });
    }

    store(entity: E): Promise<E> {
        return new Promise((resolve, reject) => {
            let json = this.mapper.toJSON(entity);
            let id = entity.getIdentity().getValue();
            this.datastore.update({'id': String(id)}, json, {upsert:true}, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(entity);
            });
        });
    }

    storeList(entityList: E[]): Promise<E[]> {
        return Promise.all(entityList.map((i) => this.store(i)));
    }

    deleteByEntity(entity: E): Promise<AsyncOnNedbRepository<ID, E>> {
        return this.deleteByIdentity(entity.getIdentity());
    }

    deleteByIdentity(identity: ID): Promise<AsyncOnNedbRepository<ID, E>> {
        return new Promise((resolve, reject) => {
            let id = identity.getValue();
            this.datastore.remove({'id': String(id)}, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });
    }
}