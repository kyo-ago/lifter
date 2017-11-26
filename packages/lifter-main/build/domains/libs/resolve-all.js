"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ResolveAll(entities) {
    return Object.keys(entities)
        .map(key => Number(key))
        .sort((a, b) => a - b)
        .map(key => entities[String(key)]);
}
exports.ResolveAll = ResolveAll;
