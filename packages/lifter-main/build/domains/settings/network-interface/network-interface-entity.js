"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../../settings");
const base_entity_1 = require("../../base/base-entity");
const exec_commands_1 = require("../../libs/exec-commands");
const parse_getwebproxy_command_1 = require("./specs/parse-getwebproxy-command");
class NetworkInterfaceEntity extends base_entity_1.BaseEntity {
    constructor(identity, _name, _serviceName, enabled) {
        super(identity);
        this._name = _name;
        this._serviceName = _serviceName;
        this.enabled = enabled;
    }
    get name() {
        return this._name.value;
    }
    get serviceName() {
        return this._serviceName.value;
    }
    async enableProxy(networksetupProxy) {
        if (await this.isProxing()) return;
        await Promise.all([
            networksetupProxy.setwebproxy(
                this.serviceName,
                settings_1.NETWORK_HOST_NAME,
                String(settings_1.PROXY_PORT)
            ),
            networksetupProxy.setsecurewebproxy(
                this.serviceName,
                settings_1.NETWORK_HOST_NAME,
                String(settings_1.PROXY_PORT)
            )
        ]);
    }
    async disableProxy(networksetupProxy) {
        if (!await this.isProxing()) return;
        await Promise.all([
            networksetupProxy.setwebproxystate(this.serviceName, "off"),
            networksetupProxy.setsecurewebproxystate(this.serviceName, "off")
        ]);
    }
    async setProxyBypassDomains(networksetupProxy, proxyBypassDomainEntities) {
        if (!await this.isProxing()) return;
        let proxyBypassDomains = proxyBypassDomainEntities.map(entity => entity.name);
        let domain = await exec_commands_1.getProxyByPassDomains(this);
        let domains = domain.split(/\n/).concat(proxyBypassDomains);
        let uniqueDomains = Array.from(new Set(domains));
        return await networksetupProxy.setproxybypassdomains(this.serviceName, uniqueDomains);
    }
    async setAutoProxyUrl(networksetupProxy) {
        if (!this.enabled) {
            return;
        }
        await networksetupProxy.setautoproxyurl(this.serviceName, settings_1.LOCAL_PAC_FILE_URL);
    }
    async reloadAutoProxyUrl(networksetupProxy) {
        if (!this.enabled) {
            return;
        }
        await Promise.all([
            networksetupProxy.setautoproxystate(this.serviceName, "off"),
            networksetupProxy.setautoproxystate(this.serviceName, "on")
        ]);
    }
    async clearAutoProxyUrl(networksetupProxy) {
        if (!this.enabled) {
            return;
        }
        await Promise.all([
            networksetupProxy.setautoproxyurl(this.serviceName, ""),
            networksetupProxy.setautoproxystate(this.serviceName, "off")
        ]);
    }
    async isProxing() {
        if (!this.enabled) {
            return false;
        }
        let results = await Promise.all([exec_commands_1.getWebproxy(this), exec_commands_1.getSecureWebproxy(this)]);
        let result = results.find(stdout => parse_getwebproxy_command_1.ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }
}
exports.NetworkInterfaceEntity = NetworkInterfaceEntity;
