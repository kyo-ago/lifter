"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const client_request_entity_1 = require("../client-request-entity");
const client_request_identity_1 = require("../client-request-identity");
const client_request_url_1 = require("../value-objects/client-request-url");
class ClientRequestFactory {
    constructor() {
        this.identity = 0;
    }
    static fromJSON(clientRequestEntityJSON) {
        return new client_request_entity_1.ClientRequestEntity(
            new client_request_identity_1.ClientRequestIdentity(clientRequestEntityJSON.id),
            new client_request_url_1.ClientRequestUrl(url_1.parse(clientRequestEntityJSON.href))
        );
    }
    create(url) {
        return new client_request_entity_1.ClientRequestEntity(
            new client_request_identity_1.ClientRequestIdentity(this.identity++),
            new client_request_url_1.ClientRequestUrl(url)
        );
    }
    createFromString(href) {
        return new client_request_entity_1.ClientRequestEntity(
            new client_request_identity_1.ClientRequestIdentity(this.identity++),
            new client_request_url_1.ClientRequestUrl(url_1.parse(href))
        );
    }
}
exports.ClientRequestFactory = ClientRequestFactory;
