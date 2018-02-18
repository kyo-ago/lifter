import { ElectronIpcMap, } from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import * as sinon from "sinon";

import { createApplication } from "../../mocks/create-services";
import { MockStateEvent } from "../../mocks/mock-state-event";
import { mockLifterCommon } from "../../mocks/require-mocks/@lifter/lifter-common";

describe("UIEventService", () => {
    let getCallback = <K extends keyof ElectronIpcMap>(eventName: K): (event: any, message: any) => Promise<ElectronIpcMap[K]> => {
        let spyCall = mockLifterCommon.ipc.subscribe.withArgs(eventName, sinon.match.func);
        return spyCall.getCall(0).args[1];
    };

    it("addAutoResponderEntryEntities", async () => {
        let application = await createApplication();
        let callback = getCallback("addAutoResponderEntryEntities");

        let results = await callback({}, [__filename]);
        assert(results[0].type === "File");
        assert(results[0].path === __filename);

        let mainState = await application.getMainState();
        assert(mainState.autoResponderEntries.length === 1);
        assert(mainState.autoResponderEntries[0].type === "File");
        assert(mainState.autoResponderEntries[0].path === __filename);
    });

    it("fetchAutoResponderEntryEntities", async () => {
        await createApplication();

        let beforeCallback = getCallback("fetchAutoResponderEntryEntities");
        let beforeResults = await beforeCallback({}, void 0);
        assert(beforeResults.length === 0);

        let addCallback = getCallback("addAutoResponderEntryEntities");
        await addCallback({}, [__filename]);

        let afterCallback = getCallback("fetchAutoResponderEntryEntities");
        let afterResults = await afterCallback({}, void 0);
        assert(afterResults.length === 1);
    });

    it("changeCertificateStatus", async () => {
        let application = await createApplication();
        let mainState = await application.getMainState();
        assert(mainState.certificateState === "missing");

        let callback = getCallback("changeCertificateStatus");
        MockStateEvent.emit("updateCertificateState", "missing");
        let result = await callback({}, void 0);
        assert(result === "installed");

        MockStateEvent.emit("updateCertificateState", "installed");
        let installedResult = await callback({}, void 0);
        assert(installedResult === "missing");
    });
});
