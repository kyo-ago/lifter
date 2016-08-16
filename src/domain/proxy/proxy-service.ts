import {ServerResponse} from "http";
import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {Url} from "url";
import {IncomingMessage} from "http";

const http = require('http');
const NodeUrl = require('url');
const net = require('net');

const Proxy = require('http-mitm-proxy');
const proxy = Proxy();
declare class Buffer {
    constructor(...args: any[]);
}

export class ProxyService {
    private HTTP_PORT = 8080;

    constructor(private autoResponderEntryRepository: AutoResponderEntryRepository) {
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
            let reqestUrl = NodeUrl.parse(href);

            this.autoResponderEntryRepository.findMatchEntry(reqestUrl.pathname).then((result) => {
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
