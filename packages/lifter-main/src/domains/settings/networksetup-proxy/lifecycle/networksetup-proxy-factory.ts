import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { NetworksetupProxyEntity } from "../networksetup-proxy-entity";
import { NetworksetupProxyGranted } from "../vaue-objects/networksetup-proxy-granted";

export class NetworksetupProxyFactory {
    create(isGrant: boolean, networksetupProxy: NetworksetupProxy): NetworksetupProxyEntity {
        return new NetworksetupProxyEntity(
            networksetupProxy,
            new NetworksetupProxyGranted(isGrant),
        );
    }
}
