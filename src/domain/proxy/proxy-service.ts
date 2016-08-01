import {ServerResponse} from "http";
import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";

const http = require('http');
const NodeUrl = require('url');
const net = require('net');

export class ProxyService {
    private HTTP_PORT = 8080;
    private PROXY_URL: string | null = null;
    private PROXY_HOST = this.PROXY_URL ?  NodeUrl.parse(this.PROXY_URL).hostname    : null;
    private PROXY_PORT = this.PROXY_URL ? (NodeUrl.parse(this.PROXY_URL).port || 80) : null;

    constructor(private autoResponderEntryRepository: AutoResponderEntryRepository) {
    }

    createServer() {
        var server = http.createServer((cliReq: any, cliRes: ServerResponse) => {
            var cliSoc = cliReq.socket || cliReq.connection;
            var x = NodeUrl.parse(cliReq.url);

            let proxyServer = () => {
                var svrReq = http.request({host: this.PROXY_HOST || x.hostname,
                                              port: this.PROXY_PORT || x.port || 80,
                                              path: this.PROXY_URL ? cliReq.url : x.path,
                                              method: cliReq.method, headers: cliReq.headers,
                                              agent: cliSoc.$agent}, (svrRes: any) => {
                    cliRes.writeHead(svrRes.statusCode, svrRes.headers);
                    svrRes.pipe(cliRes);
                });
                cliReq.pipe(svrReq);
                svrReq.on('error', (err: any) => {
                    cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
                    cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
                    this.printError(err, 'svrReq', x.hostname + ':' + (x.port || 80));
                });
            };

            this.autoResponderEntryRepository.findMatchEntry(x.pathname).then((result) => {
                if (!result) {
                    return proxyServer();
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
            var svrSoc: any, x = NodeUrl.parse('https://' + cliReq.url);
            if (this.PROXY_URL) {
                var svrReq = http.request({host: this.PROXY_HOST, port: this.PROXY_PORT,
                                              path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
                                              agent: cliSoc.$agent});
                svrReq.end();
                svrReq.on('connect', (svrRes: any, svrSoc2: any, svrHead: any) => {
                    svrSoc = svrSoc2;
                    cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
                    if (cliHead && cliHead.length) svrSoc.write(cliHead);
                    if (svrHead && svrHead.length) cliSoc.write(svrHead);
                    svrSoc.pipe(cliSoc);
                    cliSoc.pipe(svrSoc);
                    svrSoc.on('error', this.funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
                });
                svrReq.on('error', this.funcOnSocErr(cliSoc, 'svrRq2', cliReq.url));
            } else {
                svrSoc = net.connect(x.port || 443, x.hostname, () => {
                    cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
                    if (cliHead && cliHead.length) svrSoc.write(cliHead);
                    cliSoc.pipe(svrSoc);
                });
                svrSoc.pipe(cliSoc);
                svrSoc.on('error', this.funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
            }
            cliSoc.on('error', (err: any) => {
                if (svrSoc) svrSoc.end();
                this.printError(err, 'cliSoc', cliReq.url);
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
}
