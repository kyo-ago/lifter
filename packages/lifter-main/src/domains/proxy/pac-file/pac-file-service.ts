import * as Rx from "rxjs/Rx";
import { async } from "rxjs/scheduler/async";
import { PROXY_SERVER_NAME } from "../../../settings";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworksetupProxyService } from "../../settings/networksetup-proxy-service/networksetup-proxy-service";
import { AutoResponderRepository } from "../auto-responder/lifecycle/auto-responder-repositoty";

export class PacFileService {
    constructor(
        private autoResponderRepository: AutoResponderRepository,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
    ) {}

    async load() {
        if (this.userSettingStorage.resolve("noPacFileProxy")) {
            return;
        }

        await this.networksetupProxyService.setAutoProxyUrl();

        let observable = new Rx.Subject();
        observable
            .throttleTime(300, async, {
                leading: true,
                trailing: true,
            })
            .subscribe(() => this.networksetupProxyService.reloadAutoProxyUrl());

        this.autoResponderRepository.addChangeEvent(() => observable.next());
        let autoResponderEntries = await this.autoResponderRepository.resolveAll();
        if (autoResponderEntries.length) {
            observable.next();
        }
    }

    async getContent(): Promise<string> {
        let autoResponderEntries = await this.autoResponderRepository.resolveAll();
        let codeSttrings = autoResponderEntries.map(autoResponderEntity => {
            return autoResponderEntity.pattern.getMatchCodeString(`PROXY ${PROXY_SERVER_NAME}`);
        });
        return `
            function FindProxyForURL(url, host) {
                ${codeSttrings.join("\n")}
            	return "DIRECT";
            }
        `;
    }
}
