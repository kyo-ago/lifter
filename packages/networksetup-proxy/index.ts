/// <reference path="./global.d.ts" />

import * as Watch from "@lifter/file-watcher";
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

function copyFile(src: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let r = fs.createReadStream(src);
        let w = fs.createWriteStream(dest);
        r.on("error", reject);
        w.on("error", reject);
        w.on("close", resolve);
        r.pipe(w);
    });
}

const promisedFsStat = promisify(fs.stat);
const promisedFsUnlink = promisify(fs.unlink);
const promisedFsCopyFile = fs.copyFile ? promisify(fs.copyFile) : copyFile;
const promisedFsRename = promisify(fs.rename);
const promisedSudoExec = promisify(exec);

export class NetworksetupProxy {
    private grantCommand: string[];
    constructor(
        private sudoApplicationName: string = "electron sudo application",
        private PROXY_SETTING_COMMAND = path.join(
            __dirname,
            `./rust/proxy-setting`,
        ),
    ) {
        this.grantCommand = [
            `chown 0:0 "${this.PROXY_SETTING_COMMAND}"`,
            `chmod 4755 "${this.PROXY_SETTING_COMMAND}"`,
        ];
    }

    async hasGrant(): Promise<boolean> {
        let stat = await promisedFsStat(this.PROXY_SETTING_COMMAND);
        let mode = new Mode(stat);
        if (Number(stat.uid) !== 0) return false;
        if (mode.toOctal() !== "4755") return false;
        return true;
    }

    async grant(): Promise<IOResult> {
        let [stdout, stderr]: string[] = await promisedSudoExec(
            this.grantCommand.join(" && "),
            {
                name: this.sudoApplicationName,
            },
        );
        return { stdout, stderr };
    }

    getGrantCommand(): string {
        return `sudo ${this.grantCommand.join(" && sudo ")}`;
    }

    async removeGrant(): Promise<IOResult> {
        let basename = path.basename(this.PROXY_SETTING_COMMAND);
        let dirname = path.dirname(this.PROXY_SETTING_COMMAND);
        let tempolaryFileName = `${dirname}/tmp_${basename}`;
        await promisedFsCopyFile(this.PROXY_SETTING_COMMAND, tempolaryFileName);
        await promisedFsUnlink(this.PROXY_SETTING_COMMAND);
        await promisedFsRename(tempolaryFileName, this.PROXY_SETTING_COMMAND);
        return { stdout: "", stderr: "" };
    }

    getRemoveGrantCommands(): string[] {
        let basename = path.basename(this.PROXY_SETTING_COMMAND);
        let dirname = path.dirname(this.PROXY_SETTING_COMMAND);
        let tempolaryFileName = `${dirname}/tmp_${basename}`;
        return [
            `cp ${this.PROXY_SETTING_COMMAND} ${tempolaryFileName}`,
            `rm -f ${this.PROXY_SETTING_COMMAND}`,
            `cp ${tempolaryFileName} ${this.PROXY_SETTING_COMMAND}`,
        ];
    }

    watchGrantCommands(callback: (result: boolean) => void): () => void {
        return Watch(this.PROXY_SETTING_COMMAND, async () =>
            callback(await this.hasGrant()),
        );
    }

    setwebproxy(
        networkservice: string,
        _: string, // domain
        port: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        let args = [authenticated, username, password].filter(arg => arg);
        return this.exec(
            `-setwebproxy`,
            [networkservice, port].concat(<string[]>args),
        );
    }

    setsecurewebproxy(
        networkservice: string,
        _: string, // domain
        port: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        let args = [authenticated, username, password].filter(arg => arg);
        return this.exec(
            `-setsecurewebproxy`,
            [networkservice, port].concat(<string[]>args),
        );
    }

    setwebproxystate(
        networkservice: string,
        enabled: Enabled,
    ): Promise<IOResult> {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }

    setsecurewebproxystate(
        networkservice: string,
        enabled: Enabled,
    ): Promise<IOResult> {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }

    setproxybypassdomains(
        networkservice: string,
        domains: string[],
    ): Promise<IOResult> {
        return this.exec(
            `-setproxybypassdomains`,
            [networkservice].concat(domains),
        );
    }

    setautoproxyurl(networkservice: string, port: string): Promise<IOResult> {
        return this.exec(`-setautoproxyurl`, [networkservice, port]);
    }

    setautoproxystate(
        networkservice: string,
        enabled: Enabled,
    ): Promise<IOResult> {
        return this.exec(`-setautoproxystate`, [networkservice, enabled]);
    }

    private exec(command: string, params: string[]): Promise<IOResult> {
        return execa(
            this.PROXY_SETTING_COMMAND,
            [command].concat(this.getSscapedParams(params)),
        );
    }

    private getSscapedParams(params: string[]): string[] {
        return params
            .map(param => param || "")
            .map(param => param.replace(/[\\"]/g, "\\$&"))
            .map(param => (param.match(/\W/) ? `"${param}"` : param))
            .map(param => param || '""');
    }
}
