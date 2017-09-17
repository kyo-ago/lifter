import * as sinon from 'sinon';
import {PromisedSetTimeout} from '../../../../libs/promised-set-timeout';
import {ChangeProxyCommandExecute} from './change-proxy-command';

describe('ChangeProxyCommand', () => {
    it('succeed', async () => {
        let result = await ChangeProxyCommandExecute(
            () => Promise.resolve({
                stdout: '',
                stderr: '',
            }),
            () => Promise.resolve(''),
            () => true,
        );
        expect(result).toBe(true);
    });

    it('failed', async () => {
        (<any>PromisedSetTimeout).wait = 1;
        let spy = sinon.spy(() => false);
        let result = await ChangeProxyCommandExecute(
            () => Promise.resolve({
                stdout: '',
                stderr: '',
            }),
            () => Promise.resolve(''),
            spy,
        );
        expect(result).toBeNull();
        expect(spy.callCount).toBe(3);
    });
});
