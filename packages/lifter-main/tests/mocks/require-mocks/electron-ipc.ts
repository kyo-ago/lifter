import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let stub = sinon.stub({
    subscribe: () => undefined,
});
mockRequire("electron-ipc", stub);
afterEach(() => {
    stub.subscribe.reset();
});
