import * as Rx from "rxjs/Rx";
import {async} from "rxjs/scheduler/async";
import {networksetupProxy} from "../../settings/lib/networksetup-proxy-command";
import {NetworkInterfaceRepository} from "../../settings/network-interface/lifecycle/network-interface-repository";
import {AutoResponderEntryRepository} from "../auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {LOCAL_PAC_FILE_URL} from "../../../settings";
import {NetworkInterfaceEntity} from "../../settings/network-interface/network-interface-entity";

export class PacFileService {
    constructor(
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

    async load() {
        await this.setAutoProxyUrl();

        let observable = new Rx.Subject();

        this.autoResponderEntryRepository.addChangeEvent(() => observable.next());
        let autoResponderEntryEntries = await this.autoResponderEntryRepository.resolveAll();
        if (autoResponderEntryEntries.length) {
            observable.next();
        }

        observable
            .throttleTime(300, async, {
                leading: true,
                trailing: false,
            })
            .subscribe(() => this.reload())
        ;
    }

    private setAutoProxyUrl() {
        return this.callAllEnableInterface((networkInterfaceEntity) => {
            return networksetupProxy.setautoproxyurl(networkInterfaceEntity.serviceName, LOCAL_PAC_FILE_URL);
        });
    }

    private reload() {
        return this.callAllEnableInterface(async (networkInterfaceEntity) => {
            await networksetupProxy.setautoproxystate(networkInterfaceEntity.serviceName, "off");
            await networksetupProxy.setautoproxystate(networkInterfaceEntity.serviceName, "on");
        });
    }

    private async callAllEnableInterface(callback: (networkInterfaceEntity: NetworkInterfaceEntity) => Promise<any>) {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        let promises = networkInterfaceEntities.map(callback);
        return Promise.all(promises);
    }
}
