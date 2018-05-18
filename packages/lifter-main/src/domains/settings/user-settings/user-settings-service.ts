import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
import { UserSettingsStorage } from "./user-settings-storage";

export interface getUserSetting {
    getNoAutoEnableProxy: () => boolean;
    changeNoAutoEnableProxy: () => Promise<boolean>;
    getNoPacFileProxy: () => boolean;
    changeNoPacFileProxy: () => Promise<boolean>;
}

export interface MatchPattern<T> {
    Some?: () => T;
    None?: () => T;
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

    isAutoEnableProxy<T>(matchPattern: MatchPattern<T>): T {
        if (this.userSettingsStorage.resolve("noAutoEnableProxy")) {
            return matchPattern.None ? matchPattern.None() : undefined;
        }
        return matchPattern.Some ? matchPattern.Some() : undefined;
    }

    isPacFileProxy<T>(matchPattern: MatchPattern<T>): T {
        if (this.userSettingsStorage.resolve("noPacFileProxy")) {
            return matchPattern.None ? matchPattern.None() : undefined;
        }
        return matchPattern.Some ? matchPattern.Some() : undefined;
    }

    onChangeNoPacFileProxy(callback: (noPacFileProxy: boolean) => void): void {
        this.observable.subscribe(callback);
    }
}
