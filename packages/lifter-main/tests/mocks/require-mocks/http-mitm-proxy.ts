import * as sinon from "sinon";
import * as mockRequire from "mock-require";

let stub = sinon.stub({
    onError: () => undefined,
    onRequest: () => undefined,
    listen: () => undefined,
});
mockRequire("http-mitm-proxy", () => stub);
afterEach(() => {
    stub.onError.reset();
    stub.onRequest.reset();
    stub.listen.reset();
});
