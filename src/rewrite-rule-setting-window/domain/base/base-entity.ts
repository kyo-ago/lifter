import {Entity, Identity} from "typescript-dddbase";

export class BaseEntity<ID extends Identity<any>> extends Entity<ID> {
    get id() {
        return this.getIdentity().getValue();
    }
}