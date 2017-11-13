import * as Rx from "rxjs/Rx";
import {async} from "rxjs/scheduler/async";
import {PROXY_SERVER_NAME} from "../../../settings";
import {NetworksetupProxyService} from "../../settings/networksetup-proxy-service/networksetup-proxy-service";
import {AutoResponderEntryRepository} from "../auto-responder-entry/lifecycle/auto-responder-entry-repositoty";

export class PacFileService {
    constructor(
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private networksetupProxyService: NetworksetupProxyService,
    ) {
    }

    async load() {
        await this.networksetupProxyService.setAutoProxyUrl();

        let observable = new Rx.Subject();
        observable
            .throttleTime(300, async, {
                leading: true,
                trailing: true,
            })
            .subscribe(() => this.networksetupProxyService.reloadAutoProxyUrl())
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
}
