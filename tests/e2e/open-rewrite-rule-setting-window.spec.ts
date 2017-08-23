import {TestApplication} from "./spectron";
import {PromisedSetTimeout} from "../../src/share/libs/promised-set-timeout";

describe('openRewriteRuleSettingWindow', () => {
    beforeAll(async () => {
        await TestApplication.start();
        for (let i = 5; i; i--) {
            let result = await TestApplication.webContents.executeJavaScript(`application.isContentRendering`);
            if (result) return;
            await PromisedSetTimeout(100);
        }
        throw new Error('application.isContentRendering timeout');
    });

    it('open successful', async () => {
        await TestApplication.webContents.executeJavaScript(`application.openRewriteRuleSettingWindow()`);
        let win = (<any>TestApplication).rendererProcess.mainModule();
        console.log(win)
//        expect(result).toBeNull();
    });
});
