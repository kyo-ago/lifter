import * as mockRequire from "mock-require";
import * as sinon from "sinon";

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
