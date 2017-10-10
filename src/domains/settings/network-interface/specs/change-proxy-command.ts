import {IOResult} from 'networksetup-proxy';
import {getSecureWebproxy, getWebproxy} from '../../../../libs/exec-commands';
import {throwableCommand} from '../../../../libs/throwable-command';
import {PromisedSetTimeout} from '../../../libs/promised-set-timeout';
import {WaitFor} from '../../../libs/wait-for';
import {ParseGetwebproxyCommand} from '../../proxy-setting/specs/parse-getwebproxy-command';
import {NetworkInterfaceEntity} from '../network-interface-entity';

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
    networkInterfaceEntity: NetworkInterfaceEntity,
    setCommand: () => Promise<IOResult>,
    setSecureCommand: () => Promise<IOResult>,
    stdoutResult: boolean,
): Promise<void> {
    let result = await Promise.all([
        ChangeProxyCommandExecute(
            setCommand,
            () => getWebproxy(networkInterfaceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
        ChangeProxyCommandExecute(
            setSecureCommand,
            () => getSecureWebproxy(networkInterfaceEntity),
            (result: string) => ParseGetwebproxyCommand(result) === stdoutResult,
        ),
    ]);
    if (!result.filter((_) => _).length) throw new Error('change proxy settings error');
}
