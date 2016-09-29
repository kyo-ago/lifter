import {ServerResponse, IncomingMessage} from "http";
import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {ClientRequestUrl} from "../client-request/client-request-url";
import {ClientRequestRepository} from "../client-request/client-request-repository";

const http = require('http');
const net = require('net');

const Proxy = require('http-mitm-proxy');
const proxy = Proxy();
declare class Buffer {
    constructor(...args: any[]);
}

export class ProxyService {
    private HTTP_PORT = 8080;

    constructor(
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private clientRequestRepository: ClientRequestRepository,
    ) {
    }

    createServer() {
        proxy.onError((ctx: any, err: any) => {
            console.error('proxy error:', err);
        });

        proxy.onRequest((ctx: any, callback: any) => {
            let encrypted = ctx.clientToProxyRequest.client.encrypted;
            let host = ctx.clientToProxyRequest.headers.host;
            let url = ctx.clientToProxyRequest.url;
            let href = `http${encrypted ? `s` : ``}://${host}${url}`;

            let clientRequestUrl = new ClientRequestUrl(href);
            this.clientRequestRepository.storeRequest(clientRequestUrl);
            this.autoResponderEntryRepository.findMatchEntry(clientRequestUrl).then((result) => {
                if (!result) {
                    return callback();
                }
                ctx.proxyToClientResponse.writeHead(200, result.getHeader());
                result.getBody().then((body) => {
                    ctx.proxyToClientResponse.end(body);
                });
            });
        });

        proxy.listen({
            port: this.HTTP_PORT,
            silent: true
        }, (err: any) => {
            if (err) {
                console.error(err);
            }
        });
    }
}
