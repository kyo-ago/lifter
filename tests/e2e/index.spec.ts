import {Application} from "spectron";
import * as assert from "assert";
import * as Path from "path";

describe('application launch', () => {
    let application: Application;
    beforeEach(() => {
        application = new Application({
            path: `${Path.join('.', 'node_modules', '.bin', 'electron')}`,
            args: [Path.join('.')],
        });
        return application.start();
    });

    afterEach(() => {
        if (application && application.isRunning()) {
            return application.stop();
        }
    });

    it('shows an initial window', async () => {
        let count = await application.client.getWindowCount();
        assert.equal(count, 1);
    });
});
