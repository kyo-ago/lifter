import {Application} from "spectron";
import * as assert from "assert";
import * as Path from "path";

describe('application launch', function () {
    this.timeout(10000);

    beforeEach(function () {
        this.app = new Application({
            path: `${Path.join('.', 'node_modules', '.bin', 'electron')}`,
            args: [Path.join('.')],
        });
        return this.app.start();
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('shows an initial window', function () {
        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1);
        });
    });
});
