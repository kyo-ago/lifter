import * as promisify from 'es6-promisify';
import * as fs from 'fs';
import {None, Option, Some} from "monapt";
import {NetworksetupProxy} from 'networksetup-proxy';
import {throwableCommand} from "../../../libs/throwable-command";
import {
    APPLICATION_NAME,
    DEVELOP_PROXY_SETTING_COMMAND_PATH,
    PRODUCTION_PROXY_SETTING_COMMAND_PATH
} from '../../../settings';
import {UserSettingStorage} from "../../libs/user-setting-storage";

export class NetworksetupProxyService {
    private _networksetupProxy: NetworksetupProxy;
    private _isGranted: boolean;

    constructor(private userSettingStorage: UserSettingStorage) {
    }

    get isGranted(): boolean {
        return this._isGranted;
    }

    async load() {
        let path = await this.getCommandPath();
        this._networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
        this._isGranted = await this._networksetupProxy.hasGrant();
        if (this._isGranted) {
            return;
        }

        let noGrant = this.userSettingStorage.resolve("noGrant");
        if (noGrant) {
            return;
        }

        return await this.grantProxyCommand();
    }

    getNetworksetupProxy(): Option<NetworksetupProxy> {
        if (this._isGranted) {
            return new Some(this._networksetupProxy);
        }
        return None;
    }

    async grantProxyCommand(): Promise<boolean> {
        let result = await throwableCommand(this._networksetupProxy.grant());
        if (result) {
            this._isGranted = true;
            return true;
        }

        await this.userSettingStorage.store("noGrant", true);
        return false;
    }

    private async getCommandPath(): Promise<string> {
        let fsExists = promisify(fs.exists, fs);
        if (await fsExists(DEVELOP_PROXY_SETTING_COMMAND_PATH)) {
            return DEVELOP_PROXY_SETTING_COMMAND_PATH;
        }
        if (await fsExists(PRODUCTION_PROXY_SETTING_COMMAND_PATH)) {
            return PRODUCTION_PROXY_SETTING_COMMAND_PATH;
        }
        throw new Error('Missing networksetup-proxy command');
    }
}
