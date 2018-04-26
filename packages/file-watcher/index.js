const fs = require("fs");
const path = require("path");
const debounce = require("throttle-debounce/debounce");

module.exports = function watch(filePath, callback, debounceTime = 300) {
    let targetDir = path.dirname(filePath);
    let targetFile = path.basename(filePath);
    let debounceCallback = debounce(debounceTime, callback);
    let watcher = fs.watch(targetDir, (_, fileName) => {
        if (fileName !== targetFile) {
            return;
        }
        debounceCallback();
    });
    return () => {
        watcher.close();
    };
};
