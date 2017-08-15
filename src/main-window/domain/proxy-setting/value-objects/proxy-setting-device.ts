import {BaseValueObject} from "../../../../share/domain/base/value-object";
import {getSecureWebproxy, getWebproxy} from "../../../libs/exec-command";
import {networksetupProxy} from "../../../libs/networksetup-proxy-command";
import {NETWORK_HOST_NAME, PROXY_PORT} from "../../settings";
import {ParseGetwebproxyCommand} from "../specs/parse-getwebproxy-command";

export class ProxySettingDevice extends BaseValueObject<string> {
    async hasProxy(): Promise<boolean> {
        let results: string[] = await Promise.all([
            getWebproxy(this),
            getSecureWebproxy(this),
        ]);
        let result = results.find((stdout) => ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }

    enableProxy(): Promise<void> {
        return Promise.all([
            this.changeProxy(
                () => networksetupProxy.setwebproxy(this.value, NETWORK_HOST_NAME, String(PROXY_PORT)),
                getWebproxy,
                true,
            ),
            this.changeProxy(
                () => networksetupProxy.setsecurewebproxy(this.value, NETWORK_HOST_NAME, String(PROXY_PORT)),
                getSecureWebproxy,
                true,
            ),
        ]);
    }

    disableProxy(): Promise<void> {
        return Promise.all([
            this.changeProxy(
                () => networksetupProxy.setwebproxystate(this.value, 'off'),
                getWebproxy,
                false,
            ),
            this.changeProxy(
                () => networksetupProxy.setsecurewebproxystate(this.value, 'off'),
                getSecureWebproxy,
                false,
            ),
        ]);
    }

    private async changeProxy(
        setCommand: () => Promise<any>,
        getCommand: (device: ProxySettingDevice) => Promise<string>,
        stdoutResult: boolean
    ): Promise<void> {
        let allResult: boolean = await [...Array(3)].reduce(async (base: Promise<boolean>, cur: number) => {
            if (await base) return true;
            await setCommand();
            let stdout = await getCommand(this);
            if (ParseGetwebproxyCommand(stdout) === stdoutResult) {
                return true;
            }
            await new Promise((result) => setTimeout(result, 100));
            return false;
        }, Promise.resolve(false));
        if (!allResult) throw new Error('change proxy settings error');
    }
}
