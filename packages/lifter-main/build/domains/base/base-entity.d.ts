import { Entity, Identity } from "typescript-dddbase";
export abstract class BaseEntity<ID extends Identity<any>> extends Entity<ID> {
    readonly id: any;
}
