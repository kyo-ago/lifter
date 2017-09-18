import {Entity, Identity, OnMemoryRepository} from 'typescript-dddbase';

export abstract class ResolveAllOnMemoryRepository<
    ID extends Identity<any>,
    E extends Entity<ID>
> extends OnMemoryRepository<ID, E> {
    resolveAll(): E[] {
        return Object.keys(this.entities)
            .map((key) => Number(key))
            .sort((a, b) => a - b)
            .map((key) => this.entities[String(key)])
        ;
    }
}
