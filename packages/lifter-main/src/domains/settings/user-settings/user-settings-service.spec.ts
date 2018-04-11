import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { UserSettingsService } from "./user-settings-service";

describe("UserSettingsService", () => {
    let userSettingsService: UserSettingsService;
    beforeEach(async () => {
        let application = await createApplication();
        userSettingsService = application.getServiceContext().userSettingsService;
    });

    let getUserSetting = () => {
        return userSettingsService.getUserSetting();
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
