import {WaitFor} from "../../src/share/libs/wait-for";
import {TestApplication} from "./spectron";
import {PromisedSetTimeout} from "../../src/share/libs/promised-set-timeout";

describe('openRewriteRuleSettingWindow', () => {
    beforeAll(async () => {
        await TestApplication.start();
        await TestApplication.client.waitUntilWindowLoaded();
        return WaitFor<boolean>(async () => {
            let result = await TestApplication.webContents.executeJavaScript(
                `() => {application.isContentRendering}`,
                false,
                (result: any) => {
                    console.log(result.isContentRendering, Object.keys(result))
                }
            );
            console.log(result.isContentRendering, Object.keys(result))
        }, 100, 5);
    });

    it('open successful', async () => {
        await TestApplication.webContents.executeJavaScript(`application.openRewriteRuleSettingWindow()`);
        await WaitFor<boolean>(async () => {
            if (await TestApplication.client.getWindowCount() !== 2) return false;
            let result = await TestApplication.webContents.executeJavaScript(`document.querySelector('#rewriteRuleSettingApp')`);
            console.log(result)
            return result;
        }, 100, 5);
        // TestApplication.electron.BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`!!document.querySelector('#rewriteRuleSettingApp')`);
//        expect(result).toBeNull();
    });
});
