import {AutoResponderEntryRepository} from "./domain/auto-responder-entry/auto-responder-entry-repository";
import {ProxyService} from "./domain/proxy/proxy-service";

import {Render} from "./ui/render";

let autoResponderEntryRepository = new AutoResponderEntryRepository();
let proxyService                 = new ProxyService(autoResponderEntryRepository);

window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("dragleave", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());
document.body.addEventListener("dragend", (e) => e.preventDefault());

window.addEventListener("drop", (e) => {
    autoResponderEntryRepository.storeFilesList(Array.from(e.dataTransfer.files));
    autoResponderEntryRepository.getFilesList().then((files) => {
        Render(files);
    });
});

proxyService.createServer();
