import {NetworksetupProxy} from "networksetup-proxy";
import {getProxyByPassDomains, getSecureWebproxy, getWebproxy} from "../../../libs/exec-commands";
import {LOCAL_PAC_FILE_URL, NETWORK_HOST_NAME, PROXY_PORT} from "../../../settings";
import {BaseEntity} from '../../share/base/base-entity';
import {ParseGetwebproxyCommand} from "../libs/parse-getwebproxy-command";
import {ProxyBypassDomainEntity} from "../proxy-bypass-domain/proxy-bypass-domain-entity";
import {NetworkInterfaceIdentity} from './network-interface-identity';
import {ChangeProxyCommand} from "./specs/change-proxy-command";
import {NetworkInterfaceName} from './value-objects/network-interface-name';
import {NetworkInterfaceServiceName} from "./value-objects/network-interface-service-name";

export class NetworkInterfaceEntity extends BaseEntity<NetworkInterfaceIdentity> {
    constructor(
        identity: NetworkInterfaceIdentity,
        private _name: NetworkInterfaceName,
        private _serviceName: NetworkInterfaceServiceName,
        public enabled: boolean,
    ) {
        super(identity);
    }

    get name() {
        return this._name.value;
    }

    get serviceName() {
        return this._serviceName.value;
    }

    async enableProxy(networksetupProxy: NetworksetupProxy) {
        if (await this.isProxing()) return;

        return await ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxy(this.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(this.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }
    async disableProxy(networksetupProxy: NetworksetupProxy) {
        if (!(await this.isProxing())) return;

        return await ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxystate(this.serviceName, 'off'),
            () => networksetupProxy.setsecurewebproxystate(this.serviceName, 'off'),
            false
        );
    }

    async setProxyBypassDomains(networksetupProxy: NetworksetupProxy, proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        if (!(await this.isProxing())) return;

        let proxyBypassDomains = proxyBypassDomainEntities.map((entity) => entity.name);

        let domain = await getProxyByPassDomains(this);
        let domains = domain.split(/\n/).concat(proxyBypassDomains);
        let uniqueDomains = Array.from(new Set(domains));
        return await networksetupProxy.setproxybypassdomains(this.serviceName, uniqueDomains);
    }

    async setAutoProxyUrl(networksetupProxy: NetworksetupProxy) {
        if (!this.enabled) {
            return false;
        }

        return networksetupProxy.setautoproxyurl(this.serviceName, LOCAL_PAC_FILE_URL);
    }

    async reloadAutoProxyUrl(networksetupProxy: NetworksetupProxy) {
        if (!this.enabled) {
            return false;
        }

        await networksetupProxy.setautoproxystate(this.serviceName, "off");
        await networksetupProxy.setautoproxystate(this.serviceName, "on");
    }

    async clearAutoProxyUrl(networksetupProxy: NetworksetupProxy) {
        if (!this.enabled) {
            return false;
        }

        await networksetupProxy.setautoproxyurl(this.serviceName, '');
        await networksetupProxy.setautoproxystate(this.serviceName, "off");
    }

    async isProxing() {
        if (!this.enabled) {
            return false;
        }

        let results: string[] = await Promise.all([
            getWebproxy(this),
            getSecureWebproxy(this),
        ]);
        let result = results.find((stdout) => ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }
}
