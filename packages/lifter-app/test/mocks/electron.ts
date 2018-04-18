import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

mockRequire("electron", sandbox.stub(require("../../mocks/electron")));

afterEach(() => {
    sandbox.resetHistory();
});
