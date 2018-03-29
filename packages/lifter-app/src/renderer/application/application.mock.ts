import * as sinon from "sinon";
import { Application } from "./application";

let sandbox = sinon.createSandbox();

let applicationMock = sandbox.createStubInstance(Application);
applicationMock.getCurrentState.callsFake(() => ({}));

afterEach(() => {
    sandbox.resetHistory();
});

export const ApplicationMock = applicationMock;
