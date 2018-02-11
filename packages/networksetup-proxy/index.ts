/// <reference path="./global.d.ts" />

import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";
import * as Mode from "stat-mode";
import { exec } from "sudo-prompt";
import { promisify } from "util";

export type IOResult = {
    stdout: string;
    stderr: string;
};

export type Enabled = "on" | "off";

const promisedFsStat = promisify(fs.stat);
const promisedSudoExec = promisify(exec);

export class NetworksetupProxy {
    constructor(
        private sudoApplicationName: string = "electron sudo application",
        private PROXY_SETTING_COMMAND = path.join(__dirname, `./rust/proxy-setting`),
    ) {}

    async grant(): Promise<IOResult> {
        let [stdout, stderr]: string[] = await promisedSudoExec(
            `chown 0:0 "${this.PROXY_SETTING_COMMAND}" && chmod 4755 "${this.PROXY_SETTING_COMMAND}"`,
            {
                name: this.sudoApplicationName,
            },
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
        port: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        let args = [authenticated, username, password].filter(arg => arg);
        return this.exec(`-setwebproxy`, [networkservice, port].concat(<string[]>args));
    }

    setsecurewebproxy(
        networkservice: string,
        domain: string,
        port: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        let args = [authenticated, username, password].filter(arg => arg);
        return this.exec(`-setsecurewebproxy`, [networkservice, port].concat(<string[]>args));
    }

    setwebproxystate(networkservice: string, enabled: Enabled): Promise<IOResult> {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }

    setsecurewebproxystate(networkservice: string, enabled: Enabled): Promise<IOResult> {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }

    setproxybypassdomains(networkservice: string, domains: string[]): Promise<IOResult> {
        return this.exec(`-setproxybypassdomains`, [networkservice].concat(domains));
    }

    setautoproxyurl(networkservice: string, post: string): Promise<IOResult> {
        return this.exec(`-setautoproxyurl`, [networkservice, post]);
    }

    setautoproxystate(networkservice: string, enabled: Enabled): Promise<IOResult> {
        return this.exec(`-setautoproxystate`, [networkservice, enabled]);
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
