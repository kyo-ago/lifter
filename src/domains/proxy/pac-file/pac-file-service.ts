import * as Rx from "rxjs/Rx";
import {async} from "rxjs/scheduler/async";
import {PROXY_SERVER_NAME} from "../../../settings";
import {NetworksetupProxyService} from "../../settings/networksetup-proxy-service/networksetup-proxy-service";
import {NetworkInterfaceRepository} from "../../settings/network-interface/lifecycle/network-interface-repository";
import {NetworkInterfaceEntity} from "../../settings/network-interface/network-interface-entity";
import {AutoResponderEntryRepository} from "../auto-responder-entry/lifecycle/auto-responder-entry-repositoty";

export class PacFileService {
    constructor(
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

    async load() {
        await this.setAutoProxyUrl();

        let observable = new Rx.Subject();
        observable
            .throttleTime(300, async, {
                leading: true,
                trailing: true,
            })
            .subscribe(() => this.reload())
        ;

        this.autoResponderEntryRepository.addChangeEvent(() => observable.next());
        let autoResponderEntryEntries = await this.autoResponderEntryRepository.resolveAll();
        if (autoResponderEntryEntries.length) {
            observable.next();
        }
    }

    async getContent(): Promise<string> {
        let autoResponderEntryEntries = await this.autoResponderEntryRepository.resolveAll();
        let codeSttrings = autoResponderEntryEntries.map((autoResponderEntryEntity) => {
            return autoResponderEntryEntity.pattern.getMatchCodeString(`PROXY ${PROXY_SERVER_NAME}`);
        });
        return `
            function FindProxyForURL(url, host) {
                ${codeSttrings.join('\n')}
            	return "DIRECT";
            }
        `;
    }

    clearAutoProxyUrl(): Promise<void> {
        return this.networksetupProxyService.getNetworksetupProxy()
            .map((networksetupProxy) => this.callAllEnableInterface((ni) => ni.clearAutoProxyUrl(networksetupProxy)))
            .getOrElse(() => Promise.resolve(undefined))
        ;
    }

    private setAutoProxyUrl() {
        return this.networksetupProxyService.getNetworksetupProxy()
            .map((networksetupProxy) => this.callAllEnableInterface((ni) => ni.setAutoProxyUrl(networksetupProxy)))
            .getOrElse(() => Promise.resolve(undefined))
        ;
    }

    private reload() {
        return this.networksetupProxyService.getNetworksetupProxy()
            .map((networksetupProxy) => this.callAllEnableInterface((ni) => ni.reloadAutoProxyUrl(networksetupProxy)))
            .getOrElse(() => Promise.resolve(undefined))
        ;
    }

    private async callAllEnableInterface(callback: (networkInterfaceEntity: NetworkInterfaceEntity) => Promise<any>) {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let promises = networkInterfaceEntities.map(callback);
        return await Promise.all(promises);
    }
}
