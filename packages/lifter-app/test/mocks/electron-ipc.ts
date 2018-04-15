import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

mockRequire(
    "electron-ipc",
    sandbox.stub(require("../../mocks/electron-ipc")),
);

afterEach(() => {
    sandbox.resetHistory();
});
