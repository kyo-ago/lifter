import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

let stub = sandbox.stub({
    onError: () => undefined,
    onRequest: () => undefined,
    listen: () => undefined,
});
mockRequire("http-mitm-proxy", () => stub);

afterEach(() => {
    sandbox.reset();
});
