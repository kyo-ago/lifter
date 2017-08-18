import {ChangeProxyCommandExecute, PromisedSetTimeout} from "./change-proxy-command";
import * as sinon from "sinon";

describe('ChangeProxyCommand', () => {
    it('succeed', async () => {
        let result = await ChangeProxyCommandExecute(
            () => Promise.resolve(),
            () => Promise.resolve(''),
            () => true,
        );
        expect(result).toBe(true);
    });

    it('failed', async () => {
        (<any>PromisedSetTimeout).wait = 1;
        let result;
        let spy = sinon.spy(() => false);
        result = await ChangeProxyCommandExecute(
            () => Promise.resolve(),
            () => Promise.resolve(''),
            spy,
        );
        expect(result).toBe(false);
        expect(spy.callCount).toBe(3);
    });
});
