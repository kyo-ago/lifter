'use strict';
var http = require('http');
var NodeUrl = require('url');
var net = require('net');
var fs = require('fs');

var HTTP_PORT = 8080;  // internal proxy server port
var PROXY_URL = null;  // external proxy server URL
var PROXY_HOST = PROXY_URL ?  NodeUrl.parse(PROXY_URL).hostname    : null;
var PROXY_PORT = PROXY_URL ? (NodeUrl.parse(PROXY_URL).port || 80) : null;

let Targets = [];

function printError(err, msg, url) {
    console.log('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err);
}

var server = http.createServer(function onCliReq(cliReq, cliRes) {
    var cliSoc = cliReq.socket || cliReq.connection;
    var x = NodeUrl.parse(cliReq.url);
    let matchFile = Targets.find((file) => {
        return x.pathname.includes(`/${file.name}`);
    });
    if (matchFile) {
        return fs.readFile(matchFile.path, (err, data) => {
            if (err) throw err;
            cliRes.writeHead(200, {'Content-Type': 'text/plain'});
            cliRes.write(data);
            cliRes.end();
        });
    }
    var svrReq = http.request({host: PROXY_HOST || x.hostname,
        port: PROXY_PORT || x.port || 80,
        path: PROXY_URL ? cliReq.url : x.path,
        method: cliReq.method, headers: cliReq.headers,
        agent: cliSoc.$agent}, function onSvrRes(svrRes) {
        cliRes.writeHead(svrRes.statusCode, svrRes.headers);
        svrRes.pipe(cliRes);
    });
    cliReq.pipe(svrReq);
    svrReq.on('error', function onSvrReqErr(err) {
        cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
        cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
        printError(err, 'svrReq', x.hostname + ':' + (x.port || 80));
    });
}).listen(HTTP_PORT);

server.on('clientError', function onCliErr(err, cliSoc) {
    cliSoc.end();
    printError(err, 'cliErr', '');
});

server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
    var svrSoc, x = NodeUrl.parse('https://' + cliReq.url);
    if (PROXY_URL) {
        var svrReq = http.request({host: PROXY_HOST, port: PROXY_PORT,
            path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
            agent: cliSoc.$agent});
        svrReq.end();
        svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
            svrSoc = svrSoc2;
            cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
            if (cliHead && cliHead.length) svrSoc.write(cliHead);
            if (svrHead && svrHead.length) cliSoc.write(svrHead);
            svrSoc.pipe(cliSoc);
            cliSoc.pipe(svrSoc);
            svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
        });
        svrReq.on('error', funcOnSocErr(cliSoc, 'svrRq2', cliReq.url));
    } else {
        svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
            cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
            if (cliHead && cliHead.length) svrSoc.write(cliHead);
            cliSoc.pipe(svrSoc);
        });
        svrSoc.pipe(cliSoc);
        svrSoc.on('error', funcOnSocErr(cliSoc, 'svrSoc', cliReq.url));
    }
    cliSoc.on('error', function onCliSocErr(err) {
        if (svrSoc) svrSoc.end();
        printError(err, 'cliSoc', cliReq.url);
    });
    function funcOnSocErr(soc, msg, url) {
        return err => (soc.end(), printError(err, msg, url));
    }
});

server.on('connection', function onConn(cliSoc) {
    cliSoc.$agent = new http.Agent({keepAlive: true});
    cliSoc.$agent.on('error', err => console.log('agent:', err));
});

console.log('http proxy server started on port ' + HTTP_PORT +
    (PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : ''));




window.ondragover = function (e) {
    e.preventDefault();
};
window.ondragleave = document.body.ondragend = function (e) {
    e.preventDefault();
};
window.ondrop = function (e) {
    e.preventDefault();
    let files = Array.from(e.dataTransfer.files).map((file) => file);
    Targets = Targets.concat(files);
};
