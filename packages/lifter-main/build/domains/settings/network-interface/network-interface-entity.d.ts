import { NetworksetupProxy } from "networksetup-proxy";
import { BaseEntity } from "../../base/base-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";
import { NetworkInterfaceIdentity } from "./network-interface-identity";
import { NetworkInterfaceName } from "./value-objects/network-interface-name";
import { NetworkInterfaceServiceName } from "./value-objects/network-interface-service-name";
export declare class NetworkInterfaceEntity extends BaseEntity<NetworkInterfaceIdentity> {
    private _name;
    private _serviceName;
    enabled: boolean;
    constructor(
        identity: NetworkInterfaceIdentity,
        _name: NetworkInterfaceName,
        _serviceName: NetworkInterfaceServiceName,
        enabled: boolean
    );
    readonly name: string;
    readonly serviceName: string;
    enableProxy(networksetupProxy: NetworksetupProxy): Promise<void>;
    disableProxy(networksetupProxy: NetworksetupProxy): Promise<void>;
    setProxyBypassDomains(
        networksetupProxy: NetworksetupProxy,
        proxyBypassDomainEntities: ProxyBypassDomainEntity[]
    ): Promise<{
        stdout: string;
        stderr: string;
    }>;
    setAutoProxyUrl(networksetupProxy: NetworksetupProxy): Promise<void>;
    reloadAutoProxyUrl(networksetupProxy: NetworksetupProxy): Promise<void>;
    clearAutoProxyUrl(networksetupProxy: NetworksetupProxy): Promise<void>;
    isProxing(): Promise<boolean>;
}
