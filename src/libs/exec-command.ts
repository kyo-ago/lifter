import {exec} from "child_process";

import {SECURITY_COMMAND, NETWORK_SETUP_COMMAND} from "../domain/settings";

export interface IOResult {
    stdout: string;
    stderr: string;
}

let execCommand = (command: string, param: string[]): Promise<IOResult> => {
    return new Promise((resolve, reject) => {
        exec(`${command} ${param.join(' ')}`, (error: string, stdout: string, stderr: string) => {
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
