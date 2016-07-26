import {FileFactory} from "./domain/file/file-factory";
import {FileRepository} from "./domain/file/file-repository";
let fileRepository = new FileRepository();

window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("dragleave", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());
document.body.addEventListener("dragend", (e) => e.preventDefault());

window.addEventListener("drop", (e) => {
    let dfiles = Array.from(e.dataTransfer.files);
    let files = dfiles.map((file) => FileFactory.createFile(file));
    fileRepository.storeList(files);
});
