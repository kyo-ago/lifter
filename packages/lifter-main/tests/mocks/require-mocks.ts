import * as sinon from "sinon";
import * as mockRequire from "mock-require";

mockRequire("electron-ipc", {
    subscribe: sinon.spy((...args) => undefined),
});

mockRequire("@lifter/networksetup-proxy", {
    NetworksetupProxy: class {
        hasGrant() {
            return new Promise((resolve) => resolve(false));
        }
    }
});

mockRequire("http-mitm-proxy", () => {
    return {
        onError: sinon.spy((...args) => undefined),
        onRequest: sinon.spy((...args) => undefined),
        listen: sinon.spy((...args) => undefined),
    };
});

export function RequireMocks() {}
