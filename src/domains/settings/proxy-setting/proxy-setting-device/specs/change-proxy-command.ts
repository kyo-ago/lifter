import {IOResult} from 'networksetup-proxy';
import {getSecureWebproxy, getWebproxy} from '../../../../../libs/exec-commands';
import {throwableCommand} from '../../../../../libs/throwable-command';
import {PromisedSetTimeout} from '../../../../libs/promised-set-timeout';
import {WaitFor} from '../../../../libs/wait-for';
import {ParseGetwebproxyCommand} from '../../specs/parse-getwebproxy-command';
import {ProxySettingDeviceEntity} from '../proxy-setting-device-entity';

// export for tests
export function ChangeProxyCommandExecute(
    setCommand: () => Promise<IOResult>,
    getCommand: () => Promise<string>,
    checkResult: (result: string) => boolean,
): Promise<boolean> {
    return WaitFor<boolean>(async () => {
        let result = await throwableCommand(setCommand());
        if (result) throw new Error(result);
        await PromisedSetTimeout(100);
        let stdout = await getCommand();
        return checkResult(stdout);
    }, 100, 3);
}

export async function ChangeProxyCommand(
    proxySettingDeviceEntity: ProxySettingDeviceEntity,
    setCommand: () => Promise<IOResult>,
    setSecureCommand: () => Promise<IOResult>,
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
    if (!result.filter((_) => _).length) throw new Error('change proxy settings error');
}
