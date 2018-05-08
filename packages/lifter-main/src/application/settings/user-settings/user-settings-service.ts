import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
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
    private observable: Rx.Subject<boolean> = new Rx.Subject();

    constructor(private readonly userSettingsStorage: UserSettingsStorage) {}

    getUserSetting(): getUserSetting {
        return {
            getNoAutoEnableProxy: (): boolean => {
                return this.getNoAutoEnableProxy();
            },
            changeNoAutoEnableProxy: (): Promise<boolean> => {
                return this.changeNoAutoEnableProxy();
            },
            getNoPacFileProxy: (): boolean => {
                return this.getNoPacFileProxy();
            },
            changeNoPacFileProxy: (): Promise<boolean> => {
                return this.changeNoPacFileProxy();
            },
        };
    }

    getNoAutoEnableProxy() {
        return this.userSettingsStorage.resolve("noAutoEnableProxy");
    }
    changeNoAutoEnableProxy() {
        return this.userSettingsStorage.toggle("noAutoEnableProxy");
    }

    getNoPacFileProxy() {
        return this.userSettingsStorage.resolve("noPacFileProxy");
    }
    async changeNoPacFileProxy() {
        let newSetting = await this.userSettingsStorage.toggle(
            "noPacFileProxy",
        );
        this.observable.next(newSetting);
        return newSetting;
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

    onChangeNoPacFileProxy(callback: (noPacFileProxy: boolean) => void): void {
        this.observable.subscribe(callback);
    }
}
