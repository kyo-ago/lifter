"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function throwableCommand(promisedCommand) {
    let { stdout, stderr } = await promisedCommand;
    if (stderr) {
        throw new Error(stderr);
    }
    return stdout;
}
exports.throwableCommand = throwableCommand;
