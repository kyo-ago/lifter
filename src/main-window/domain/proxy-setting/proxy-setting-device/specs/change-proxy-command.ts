import {PromisedSetTimeout} from "../../../../../share/libs/promised-set-timeout";
import {ExecCommand} from "../../../../libs/exec-command";
import {ParseGetwebproxyCommand} from "../../specs/parse-getwebproxy-command";
import {ProxySettingDeviceEntity} from "../proxy-setting-device-entity";

// export for only tests
export function ChangeProxyCommandExecute(
    setCommand: () => Promise<any>,
    getCommand: () => Promise<string>,
    checkResult: (result: string) => boolean,
): Promise<boolean> {
    return [...Array(3)].reduce(async (base: Promise<boolean>, cur: number) => {
        if (await base) return true;
        await setCommand();
        let stdout = await getCommand();
        if (checkResult(stdout)) {
            return true;
        }
        await PromisedSetTimeout(100);
        return false;
    }, Promise.resolve(false));
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
            () => ExecCommand.getWebproxy(proxySettingDeviceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
        ChangeProxyCommandExecute(
            setSecureCommand,
            () => ExecCommand.getSecureWebproxy(proxySettingDeviceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
    ]);
    if (!result) throw new Error('change proxy settings error');
}
