import * as fs from "fs";
import { BaseValueObject } from "../domains/base/value-objects/base-value-object";
import {
    DEVELOP_PROXY_SETTING_COMMAND_PATH,
    PRODUCTION_PROXY_SETTING_COMMAND_PATH,
} from "../settings";

export class ProxyCommandPath extends BaseValueObject<string> {
    static async getPath(): Promise<ProxyCommandPath> {
        let fsExists = (path: string) =>
            new Promise(resolve => fs.exists(path, resolve));
        if (await fsExists(DEVELOP_PROXY_SETTING_COMMAND_PATH)) {
            return new ProxyCommandPath(DEVELOP_PROXY_SETTING_COMMAND_PATH);
        }
        if (await fsExists(PRODUCTION_PROXY_SETTING_COMMAND_PATH)) {
            return new ProxyCommandPath(PRODUCTION_PROXY_SETTING_COMMAND_PATH);
        }
        throw new Error("Missing networksetup-proxy command");
    }
}
