import { ProxyCommandGrantStatus } from "../../../../../../lifter-common/build/index";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class ProxyCommandGrantSetting extends BaseValueObject<boolean> {
    static getGranted(): ProxyCommandGrantSetting {
        return new ProxyCommandGrantSetting(true);
    }
    static getNotGranted(): ProxyCommandGrantSetting {
        return new ProxyCommandGrantSetting(false);
    }

    isGranted(): boolean {
        return this.value;
    }

    callGranted(granted: () => Promise<void>): Promise<void> {
        return this.match({
            Grant: () => granted(),
            notGrant: () => Promise.resolve(void 0),
        });
    }

    match<T>(matchCase: { Grant: () => T; notGrant: () => T }): T {
        return this.isGranted() ? matchCase.Grant() : matchCase.notGrant();
    }

    getStatus(): ProxyCommandGrantStatus {
        return this.value ? "On" : "Off";
    }
}
