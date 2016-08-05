import {ServerResponse} from "http";
import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {Url} from "url";
import {IncomingMessage} from "http";

const http = require('http');
const NodeUrl = require('url');
const net = require('net');

export class ProxyService {
    private HTTP_PORT = 8080;

    constructor(private autoResponderEntryRepository: AutoResponderEntryRepository) {
    }

    createServer() {
        var server = http.createServer((cliReq: IncomingMessage, cliRes: ServerResponse) => {
            var reqestUrl = NodeUrl.parse(cliReq.url);

            this.autoResponderEntryRepository.findMatchEntry(reqestUrl.pathname).then((result) => {
                if (!result) {
                    return this.requestProxyToServer(reqestUrl, cliReq, cliRes);
                }
                cliRes.writeHead(200, result.getHeader());
                result.getBody().then((body) => {
                    cliRes.write(body);
                    cliRes.end();
                });
            });
        }).listen(this.HTTP_PORT);

        server.on('clientError', (err: any, cliSoc: any) => {
            cliSoc.end();
            this.printError(err, 'cliErr', '');
        });

        server.on('connect', (cliReq: any, cliSoc: any, cliHead: any) => {
            let svrSoc: any;
            let reqestUrl = NodeUrl.parse('https://' + cliReq.url);
            this.autoResponderEntryRepository.findMatchEntry(reqestUrl.pathname).then((result) => {
                if (!result) {
                    svrSoc = net.connect(reqestUrl.port || 443, reqestUrl.hostname, () => {
                        cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
                        if (cliHead && cliHead.length) svrSoc.write(cliHead);
                        cliSoc.pipe(svrSoc);
                    });
                    svrSoc.pipe(cliSoc);
                    svrSoc.on('error', this.funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
                    cliSoc.on('error', (err: any) => {
                        if (svrSoc) svrSoc.end();
                        this.printError(err, 'cliSoc', cliReq.url);
                    });
                    return;
                }
                cliSoc.writeHead(200, result.getHeader());
                result.getBody().then((body) => {
                    cliSoc.write(body);
                    cliSoc.end();
                });
            });
        });

        server.on('connection', (cliSoc: any) => {
            cliSoc.$agent = new http.Agent({keepAlive: true});
            cliSoc.$agent.on('error', (err: any) => console.log('agent:', err));
        });
    }

    private printError(err: string, msg: string, url: string) {
        console.error('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err);
    }

    private funcOnSocErr(soc: any, msg: string, url: string) {
        return (err: string) => {
            soc.end();
            this.printError(err, msg, url);
        };
    }

    private requestProxyToServer(url: Url, cliReq: IncomingMessage, cliRes: ServerResponse) {
        let port = url.port || 80;
        let svrReq = http.request({
            host: url.hostname,
            port: port,
            path: url.path,
            method: cliReq.method,
            headers: cliReq.headers,
            agent: (<any>cliReq.socket).$agent
        }, (svrRes: any) => {
            cliRes.writeHead(svrRes.statusCode, svrRes.headers);
            svrRes.pipe(cliRes);
        });
        cliReq.pipe(svrReq);
        svrReq.on('error', (err: any) => {
            let escapedUrl = cliReq.url.replace(/./, (_) => `&#${_};`);
            cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
            cliRes.end('<h1>' + err.message + '<br/>' + escapedUrl + '</h1>');
            this.printError(err, 'svrReq', url.hostname + ':' + port);
        });
    }
}
