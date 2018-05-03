import { injectable } from "inversify";
import { UserSettingsStorage } from "./user-settings-storage";

export interface getUserSetting {
    getNoAutoEnableProxy: () => boolean;
    changeNoAutoEnableProxy: () => Promise<boolean>;
    getNoPacFileProxy: () => boolean;
    changeNoPacFileProxy: () => Promise<boolean>;
}

export interface MatchPattern {
    Some?: () => any;
    None?: () => any;
}

@injectable()
export class UserSettingsService {
    constructor(private readonly userSettingsStorage: UserSettingsStorage) {}

    getUserSetting(): getUserSetting {
        return {
            getNoAutoEnableProxy: (): boolean => {
                return this.userSettingsStorage.resolve("noAutoEnableProxy");
            },
            changeNoAutoEnableProxy: (): Promise<boolean> => {
                return this.userSettingsStorage.toggle("noAutoEnableProxy");
            },
            getNoPacFileProxy: (): boolean => {
                return this.userSettingsStorage.resolve("noPacFileProxy");
            },
            changeNoPacFileProxy: (): Promise<boolean> => {
                return this.userSettingsStorage.toggle("noPacFileProxy");
            },
        };
    }

    isAutoEnableProxy(matchPattern: MatchPattern): any {
        return this.userSettingsStorage.resolve("noAutoEnableProxy")
            ? matchPattern.Some && matchPattern.Some()
            : matchPattern.None && matchPattern.None();
    }

    isPacFileProxy(matchPattern: MatchPattern): any {
        return this.userSettingsStorage.resolve("noPacFileProxy")
            ? matchPattern.Some && matchPattern.Some()
            : matchPattern.None && matchPattern.None();
    }
}
