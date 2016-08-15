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
        proxy.onError(function(ctx: any, err: any) {
            console.error('proxy error:', err);
        });

        proxy.onRequest(function(ctx: any, callback: any) {
            if (ctx.clientToProxyRequest.headers.host == 'www.google.com'
                && ctx.clientToProxyRequest.url.indexOf('/search') == 0) {
                ctx.use(Proxy.gunzip);

                ctx.onResponseData(function(ctx: any, chunk: any, callback: any) {
                    chunk = new Buffer(chunk.toString().replace(/<h3.*?<\/h3>/g, '<h3>Pwned!</h3>'));
                    return callback(null, chunk);
                });
            }
            return callback();
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
