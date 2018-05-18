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
