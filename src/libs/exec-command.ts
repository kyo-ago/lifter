import {PROXY_SETTING_COMMAND, SECURITY_COMMAND, NETWORK_SETUP_COMMAND} from "../domain/settings";

const fs = require('fs');
const exec = require('child_process').exec;
const Sudoer = require('electron-sudo');

const sudoer = new (Sudoer.default ? Sudoer.default : Sudoer)({name: 'electron sudo application'});

export interface IOResult {
    stdout: string;
    stderr: string;
}

let execCommand = (command: string, param: string[]) => {
    return new Promise((resolve, reject) => {
        (<any>exec)(`${command} ${param.join(' ')}`, (error: string, stdout: string, stderr: string) => {
            if (error && !stderr) {
                return reject(error);
            }
            resolve({stdout, stderr});
        });
    });
};

export function execSecurityCommand(param: string[]) {
    return execCommand(SECURITY_COMMAND, param);
}

export function execNetworkCommand(param: string[]) {
    return execCommand(NETWORK_SETUP_COMMAND, param);
}

export function execSuNetworkCommand(param: string[]) {
    return execCommand(PROXY_SETTING_COMMAND, param);
}

export function execGrantNetworkCommand() {
    return new Promise((resolve, reject) => {
        fs.chmod(PROXY_SETTING_COMMAND, `4755`, (err: any) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }).then(() => {
        return sudoer.exec(`chown 0:0 ${PROXY_SETTING_COMMAND}`);
    });
}
