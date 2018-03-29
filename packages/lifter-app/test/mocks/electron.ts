import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

mockRequire("electron", sandbox.stub({
    remote: {
        require: () => {},
    },
}));

afterEach(() => {
    sandbox.resetHistory();
});
