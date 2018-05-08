import { Entity, Identity } from "typescript-dddbase";

export function ResolveAll<E extends Entity<Identity<any>>>(entities: {
    [key: string]: E;
}): E[] {
    return Object.keys(entities)
        .map(key => Number(key))
        .sort((a, b) => a - b)
        .map(key => entities[String(key)]);
}
