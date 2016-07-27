"use strict";
const http = require('http');
const NodeUrl = require('url');
const net = require('net');
const fs = require('fs');
class ProxyService {
    constructor() {
        this.HTTP_PORT = 8080;
        this.PROXY_URL = null;
        this.PROXY_HOST = this.PROXY_URL ? NodeUrl.parse(this.PROXY_URL).hostname : null;
        this.PROXY_PORT = this.PROXY_URL ? (NodeUrl.parse(this.PROXY_URL).port || 80) : null;
    }
    createServer() {
        var server = http.createServer((cliReq, cliRes) => {
            var cliSoc = cliReq.socket || cliReq.connection;
            var x = NodeUrl.parse(cliReq.url);
            // let matchFile = Targets.find((file) => {
            //     return x.pathname.includes(`/${file.name}`);
            // });
            // if (matchFile) {
            //     return fs.readFile(matchFile.path, (err, data) => {
            //         if (err) throw err;
            //         cliRes.writeHead(200, {'Content-Type': 'text/plain'});
            //         cliRes.write(data);
            //         cliRes.end();
            //     });
            // }
            var svrReq = http.request({ host: this.PROXY_HOST || x.hostname,
                port: this.PROXY_PORT || x.port || 80,
                path: this.PROXY_URL ? cliReq.url : x.path,
                method: cliReq.method, headers: cliReq.headers,
                agent: cliSoc.$agent }, (svrRes) => {
                cliRes.writeHead(svrRes.statusCode, svrRes.headers);
                svrRes.pipe(cliRes);
            });
            cliReq.pipe(svrReq);
            svrReq.on('error', (err) => {
                cliRes.writeHead(400, err.message, { 'content-type': 'text/html' });
                cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
                this.printError(err, 'svrReq', x.hostname + ':' + (x.port || 80));
            });
        }).listen(this.HTTP_PORT);
        server.on('clientError', (err, cliSoc) => {
            cliSoc.end();
            this.printError(err, 'cliErr', '');
        });
        server.on('connect', (cliReq, cliSoc, cliHead) => {
            var svrSoc, x = NodeUrl.parse('https://' + cliReq.url);
            if (this.PROXY_URL) {
                var svrReq = http.request({ host: this.PROXY_HOST, port: this.PROXY_PORT,
                    path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
                    agent: cliSoc.$agent });
                svrReq.end();
                svrReq.on('connect', (svrRes, svrSoc2, svrHead) => {
                    svrSoc = svrSoc2;
                    cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
                    if (cliHead && cliHead.length)
                        svrSoc.write(cliHead);
                    if (svrHead && svrHead.length)
                        cliSoc.write(svrHead);
                    svrSoc.pipe(cliSoc);
                    cliSoc.pipe(svrSoc);
                    svrSoc.on('error', this.funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
                });
                svrReq.on('error', this.funcOnSocErr(cliSoc, 'svrRq2', cliReq.url));
            }
            else {
                svrSoc = net.connect(x.port || 443, x.hostname, () => {
                    cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
                    if (cliHead && cliHead.length)
                        svrSoc.write(cliHead);
                    cliSoc.pipe(svrSoc);
                });
                svrSoc.pipe(cliSoc);
                svrSoc.on('error', this.funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
            }
            cliSoc.on('error', (err) => {
                if (svrSoc)
                    svrSoc.end();
                this.printError(err, 'cliSoc', cliReq.url);
            });
        });
        server.on('connection', (cliSoc) => {
            cliSoc.$agent = new http.Agent({ keepAlive: true });
            cliSoc.$agent.on('error', (err) => console.log('agent:', err));
        });
    }
    printError(err, msg, url) {
        console.error('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err);
    }
    funcOnSocErr(soc, msg, url) {
        return (err) => {
            soc.end();
            this.printError(err, msg, url);
        };
    }
}
exports.ProxyService = ProxyService;
