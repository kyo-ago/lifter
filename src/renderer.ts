import {FileFactory} from "./domain/file/file-factory";
import {FileRepository} from "./domain/file/file-repository";
let fileRepository = new FileRepository();

window.ondragover = function (e) {
    e.preventDefault();
};
window.ondragleave = document.body.ondragend = function (e) {
    e.preventDefault();
};
window.ondrop = function (e) {
    e.preventDefault();
    let files = Array.from(e.dataTransfer.files).map((file) => FileFactory.createFile(file));
    fileRepository.storeList()
};
