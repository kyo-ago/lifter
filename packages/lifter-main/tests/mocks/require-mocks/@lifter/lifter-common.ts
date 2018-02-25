import "mocha";
import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

let stub = {
    ipc: sandbox.stub({
        subscribe: () => {},
        publish: () => {},
        addWindow: () => {},
        removeWindow: () => {},
    }),
};

mockRequire("@lifter/lifter-common", stub);
export const mockLifterCommon = stub;

afterEach(() => {
    sandbox.resetHistory();
});
