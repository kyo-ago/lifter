import * as sinon from "sinon";
import * as mockRequire from "mock-require";

let stub = sinon.stub({
    subscribe: () => undefined,
});
mockRequire("electron-ipc", stub);
afterEach(() => {
    stub.subscribe.reset();
});
