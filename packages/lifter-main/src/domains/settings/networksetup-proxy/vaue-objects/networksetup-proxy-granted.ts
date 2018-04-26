import { ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class NetworksetupProxyGranted extends BaseValueObject<boolean> {
    static getGranted(): NetworksetupProxyGranted {
        return new NetworksetupProxyGranted(true);
    }
    static getNotGranted(): NetworksetupProxyGranted {
        return new NetworksetupProxyGranted(false);
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

    match<T>(matchCase: {
        Grant: () => T;
        notGrant: () => T;
    }): T {
        return this.isGranted()
            ? matchCase.Grant()
            : matchCase.notGrant()
        ;
    }

    getStatus(): ProxyCommandGrantStatus {
        return this.value ? "On" : "Off";
    }
}
