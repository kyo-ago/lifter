/// <reference path="./global.d.ts" />

import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";
import * as Mode from "stat-mode";
import * as sudo from "sudo-prompt";
import * as promisify from "es6-promisify";
import * as crypto from "crypto";

export type IOResult = {
    stdout: string;
    stderr: string;
};

const promisedFsStat = promisify(fs.stat, fs);
const promisedSudoExec = promisify(sudo.exec, {
    thisArg: sudo,
    multiArgs: true
});

export class NetworksetupProxy {
    constructor(
        private sudoApplicationName: string = "electron sudo application",
        private PROXY_SETTING_COMMAND = path.join(__dirname, `./rust/proxy-setting`)
    ) {}

    async grant(): Promise<IOResult> {
        let [stdout, stderr]: string[] = await promisedSudoExec(
            `chown 0:0 "${this.PROXY_SETTING_COMMAND}" && chmod 4755 "${this.PROXY_SETTING_COMMAND}"`,
            {
                name: this.sudoApplicationName
            }
        );
        return { stdout, stderr };
    }

    async hasGrant(): Promise<boolean> {
        let stat = await promisedFsStat(this.PROXY_SETTING_COMMAND);
        let mode = new Mode(stat);
        if (Number(stat.uid) !== 0) return false;
        if (mode.toOctal() !== "4755") return false;
        return true;
    }

    setwebproxy(
        networkservice: string,
        domain: string,
        port?: string,
        authenticated?: string,
        username?: string,
        password?: string
    ): Promise<IOResult> {
        let args = [port, authenticated, username, password].filter(arg => arg);
        return this.exec(`-setwebproxy`, [networkservice, domain].concat(<string[]>args));
    }

    setsecurewebproxy(
        networkservice: string,
        domain: string,
        port?: string,
        authenticated?: string,
        username?: string,
        password?: string
    ): Promise<IOResult> {
        let args = [port, authenticated, username, password].filter(arg => arg);
        return this.exec(`-setsecurewebproxy`, [networkservice, domain].concat(<string[]>args));
    }

    setwebproxystate(networkservice: string, enabled: string): Promise<IOResult> {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }

    setsecurewebproxystate(networkservice: string, enabled: string): Promise<IOResult> {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }

    setproxybypassdomains(networkservice: string, domains: string[]): Promise<IOResult> {
        return this.exec(`-setproxybypassdomains`, [networkservice].concat(domains));
    }

    setautoproxyurl(networkservice: string, url: string): Promise<IOResult> {
        return this.exec(`-setautoproxyurl`, [networkservice, url]);
    }

    setautoproxystate(networkservice: string, enabled: string): Promise<IOResult> {
        return this.exec(`-setautoproxystate`, [networkservice, enabled]);
    }

    addtrustedcert(certificatePath: string): Promise<IOResult> {
        return this.exec(`add-trusted-cert`, ["-p", "ssl", certificatePath]);
    }

    deletecertificate(certificateName: string): Promise<IOResult> {
        return this.exec(`delete-certificate`, ["-c", certificateName]);
    }

    private exec(command: string, params: string[]): Promise<IOResult> {
        return execa(this.PROXY_SETTING_COMMAND, [command].concat(this.getSscapedParams(params)));
    }

    private getSscapedParams(params: string[]): string[] {
        return params
            .map(param => param || "")
            .map(param => param.replace(/[\\"]/g, "\\$&"))
            .map(param => (param.match(/\W/) ? `"${param}"` : param))
            .map(param => param || '""');
    }
}
