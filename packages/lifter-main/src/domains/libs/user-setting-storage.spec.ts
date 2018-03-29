import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../test/mocks/create-services";
import { UserSettingStorage } from "./user-setting-storage";

describe("UserSettingStorage", () => {
    let userSettingStorage: UserSettingStorage;
    beforeEach(async () => {
        let application = await createApplication();
        userSettingStorage = application.getServiceContext().userSettingStorage;
    });

    let getUserSetting = () => {
        return userSettingStorage.getUserSetting();
    };

    it("getNoAutoEnableProxy", async () => {
        let result = getUserSetting().getNoAutoEnableProxy();
        assert(result === false);
    });

    it("changeNoAutoEnableProxy", async () => {
        let result = await getUserSetting().changeNoAutoEnableProxy();
        assert(result === true);
    });

    it("getNoPacFileProxy", async () => {
        let result = getUserSetting().getNoPacFileProxy();
        assert(result === false);
    });

    it("changeNoPacFileProxy", async () => {
        let result = await getUserSetting().changeNoPacFileProxy();
        assert(result === true);
    });
});
