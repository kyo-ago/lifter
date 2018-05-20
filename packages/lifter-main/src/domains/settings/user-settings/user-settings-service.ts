import {
    AutoEnableProxyStatus,
    PacFileProxyStatus,
} from "@lifter/lifter-common";
import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
import { UserSettingsStorage } from "./user-settings-storage";

export interface getUserSetting {
    getAutoEnableProxy: () => AutoEnableProxyStatus;
    changeAutoEnableProxy: () => Promise<AutoEnableProxyStatus>;
    getPacFileProxy: () => PacFileProxyStatus;
    changePacFileProxy: () => Promise<PacFileProxyStatus>;
}

export interface MatchPattern<T> {
    On: () => T;
    Off: () => T;
}

@injectable()
export class UserSettingsService {
    private observable: Rx.Subject<PacFileProxyStatus> = new Rx.Subject();

    constructor(private readonly userSettingsStorage: UserSettingsStorage) {}

    getUserSetting(): getUserSetting {
        return {
            getAutoEnableProxy: (): AutoEnableProxyStatus => {
                return this.getAutoEnableProxy();
            },
            changeAutoEnableProxy: (): Promise<AutoEnableProxyStatus> => {
                return this.changeAutoEnableProxy();
            },
            getPacFileProxy: (): PacFileProxyStatus => {
                return this.getPacFileProxy();
            },
            changePacFileProxy: (): Promise<PacFileProxyStatus> => {
                return this.changePacFileProxy();
            },
        };
    }

    getAutoEnableProxy(): AutoEnableProxyStatus {
        return this.changeAutoEnableProxyStorageToStatus(
            this.userSettingsStorage.resolve("autoEnableProxy"),
        );
    }
    async changeAutoEnableProxy(): Promise<AutoEnableProxyStatus> {
        return this.changeAutoEnableProxyStorageToStatus(
            await this.userSettingsStorage.toggle("autoEnableProxy"),
        );
    }

    getPacFileProxy(): PacFileProxyStatus {
        return this.changePacFileProxyStorageToStatus(
            this.userSettingsStorage.resolve("pacFileProxy"),
        );
    }
    async changePacFileProxy(): Promise<PacFileProxyStatus> {
        let newSetting = await this.userSettingsStorage.toggle("pacFileProxy");
        let newStatus = this.changePacFileProxyStorageToStatus(newSetting);
        this.observable.next(newStatus);
        return newStatus;
    }

    isAutoEnableProxy<T>(matchPattern: Partial<MatchPattern<T>>): T {
        if (this.userSettingsStorage.resolve("autoEnableProxy")) {
            return matchPattern.On ? matchPattern.On() : undefined;
        }
        return matchPattern.Off ? matchPattern.Off() : undefined;
    }

    isPacFileProxy<T>(matchPattern: Partial<MatchPattern<T>>): T {
        if (this.userSettingsStorage.resolve("pacFileProxy")) {
            return matchPattern.On ? matchPattern.On() : undefined;
        }
        return matchPattern.Off ? matchPattern.Off() : undefined;
    }

    onChangePacFileProxy(
        callback: (pacFileProxyStatus: PacFileProxyStatus) => void,
    ): void {
        this.observable.subscribe(callback);
    }

    private changeAutoEnableProxyStorageToStatus(
        setting: boolean,
    ): AutoEnableProxyStatus {
        return setting ? "On" : "Off";
    }

    private changePacFileProxyStorageToStatus(
        setting: boolean,
    ): PacFileProxyStatus {
        return setting ? "On" : "Off";
    }
}
