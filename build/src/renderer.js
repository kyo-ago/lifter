"use strict";
const file_factory_1 = require("./domain/file/file-factory");
const file_repository_1 = require("./domain/file/file-repository");
const proxy_service_1 = require("./domain/proxy/proxy-service");
let fileRepository = new file_repository_1.FileRepository();
let proxyService = new proxy_service_1.ProxyService();
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("dragleave", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());
document.body.addEventListener("dragend", (e) => e.preventDefault());
window.addEventListener("drop", (e) => {
    let dfiles = Array.from(e.dataTransfer.files);
    let files = dfiles.map((file) => file_factory_1.FileFactory.createFile(file));
    fileRepository.storeList(files);
});
proxyService.createServer();
