import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { UserSettingsService } from "./user-settings-service";

describe("UserSettingsService", () => {
    let userSettingsService: UserSettingsService;
    beforeEach(async () => {
        let container = await getTestContainer();
        userSettingsService = container.get(UserSettingsService);
    });

    let getUserSetting = () => {
        return userSettingsService.getUserSetting();
    };

    it("getAutoEnableProxy", async () => {
        let result = getUserSetting().getAutoEnableProxy();
        assert(result === "On");
    });

    it("changeAutoEnableProxy", async () => {
        let result = await getUserSetting().changeAutoEnableProxy();
        assert(result === "Off");
    });

    it("getPacFileProxy", async () => {
        let result = getUserSetting().getPacFileProxy();
        assert(result === "On");
    });

    it("changePacFileProxy", async () => {
        let result = await getUserSetting().changePacFileProxy();
        assert(result === "Off");
    });
});
