import { Entity, Identity } from "typescript-dddbase";
export declare function ResolveAll<E extends Entity<Identity<any>>>(entities: { [key: string]: E }): E[];
