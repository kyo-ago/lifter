import {getSecureWebproxy, getWebproxy} from "../../../../../libs/exec-commands";
import {PromisedSetTimeout} from "../../../../libs/promised-set-timeout";
import {WaitFor} from "../../../../libs/wait-for";
import {ParseGetwebproxyCommand} from "../../specs/parse-getwebproxy-command";
import {ProxySettingDeviceEntity} from "../proxy-setting-device-entity";

// export for tests
export function ChangeProxyCommandExecute(
    setCommand: () => Promise<any>,
    getCommand: () => Promise<string>,
    checkResult: (result: string) => boolean,
): Promise<boolean> {
    return WaitFor<boolean>(async () => {
        await setCommand();
        await PromisedSetTimeout(100);
        let stdout = await getCommand();
        return checkResult(stdout);
    }, 100, 3);
}

export async function ChangeProxyCommand(
    proxySettingDeviceEntity: ProxySettingDeviceEntity,
    setCommand: () => Promise<any>,
    setSecureCommand: () => Promise<any>,
    stdoutResult: boolean,
): Promise<void> {
    let result = await Promise.all([
        ChangeProxyCommandExecute(
            setCommand,
            () => getWebproxy(proxySettingDeviceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
        ChangeProxyCommandExecute(
            setSecureCommand,
            () => getSecureWebproxy(proxySettingDeviceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
    ]);
    if (!result) throw new Error('change proxy settings error');
}
