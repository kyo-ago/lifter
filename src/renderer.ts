import {AutoResponderEntryRepository} from "./domain/auto-responder-entry/auto-responder-entry-repository";
import {ProxyService} from "./domain/proxy/proxy-service";

import {Render} from "./ui/render";
import {ClientRequestRepository} from "./domain/client-request/client-request-repository";

let autoResponderEntryRepository = new AutoResponderEntryRepository();
let clientRequestRepository      = new ClientRequestRepository();
let proxyService                 = new ProxyService(autoResponderEntryRepository, clientRequestRepository);

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
