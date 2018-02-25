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

    it("addAutoResponderEntities", async () => {
        let application = await createApplication();
        let callback = getCallback("addAutoResponderEntities");

        let results = await callback({}, [__filename]);
        assert(results[0].type === "File");
        assert(results[0].path === __filename);

        let mainState = await application.getMainState();
        assert(mainState.autoResponderEntries.length === 1);
        assert(mainState.autoResponderEntries[0].type === "File");
        assert(mainState.autoResponderEntries[0].path === __filename);
    });

    it("fetchAutoResponderEntities", async () => {
        await createApplication();

        let beforeCallback = getCallback("fetchAutoResponderEntities");
        let beforeResults = await beforeCallback({}, void 0);
        assert(beforeResults.length === 0);

        let addCallback = getCallback("addAutoResponderEntities");
        await addCallback({}, [__filename]);

        let afterCallback = getCallback("fetchAutoResponderEntities");
        let afterResults = await afterCallback({}, void 0);
        assert(afterResults.length === 1);
    });

    it("deleteAutoResponderEntities", async () => {
        await createApplication();

        let addCallback = getCallback("addAutoResponderEntities");
        await addCallback({}, [__filename]);

        let fetchCallback = getCallback("fetchAutoResponderEntities");
        let fetchResults = await fetchCallback({}, void 0);

        let deleteCallback = getCallback("deleteAutoResponderEntities");
        await deleteCallback({}, fetchResults.map((res) => res.id));

        let afterResults = await fetchCallback({}, void 0);
        assert(afterResults.length === 0);
    });

    let changeStateTest = async (callback, key, name, result) => {
        MockStateEvent.emit(key, name);
        let callbackResult = await callback({}, void 0);
        assert(callbackResult === result);
    };

    let getMainState = async () => {
        let application = await createApplication();
        return await application.getMainState();
    };

    it("changeCertificateStatus", async () => {
        assert((await getMainState()).certificateState === "missing");

        let callback = getCallback("changeCertificateStatus");
        await changeStateTest(callback, "updateCertificateState", "missing", "installed");
        await changeStateTest(callback, "updateCertificateState", "installed", "missing");
    });

    it("changeProxyCommandGrantStatus", async () => {
        assert((await getMainState()).proxyCommandGrantStatus === "Off");

        let callback = getCallback("changeProxyCommandGrantStatus");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "initialize", "On");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "CancelGrant", "Off");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "Off", "On");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "On", "Off");
    });

    it("changeProxyCommandGrantStatus", async () => {
        assert((await getMainState()).proxyCommandGrantStatus === "Off");

        let callback = getCallback("changeProxyCommandGrantStatus");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "initialize", "On");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "CancelGrant", "Off");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "Off", "On");
        await changeStateTest(callback, "updateProxyCommandGrantStatus", "On", "Off");
    });

    it("changeProxySettingStatus", async () => {
        assert((await getMainState()).proxySettingStatus === "Off");

        let callback = getCallback("changeProxySettingStatus");
        await changeStateTest(callback, "updateProxySettingState", "initialize", "On");
        await changeStateTest(callback, "updateProxySettingState", "Off", "On");
        await changeStateTest(callback, "updateProxySettingState", "On", "Off");
    });

    it("changeNoAutoEnableProxySetting", async () => {
        assert(!(await getMainState()).noAutoEnableProxySetting);

        let callback = getCallback("changeNoAutoEnableProxySetting");
        assert(await callback({}, void 0));
    });

    it("noPacFileProxySetting", async () => {
        assert(!(await getMainState()).noPacFileProxySetting);

        let callback = getCallback("changeNoPacFileProxySetting");
        assert(await callback({}, void 0));
    });
});
