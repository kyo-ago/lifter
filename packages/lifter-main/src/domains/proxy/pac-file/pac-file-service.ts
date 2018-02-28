import { async } from "rxjs/scheduler/async";
import { PROXY_SERVER_NAME } from "../../../settings";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworksetupProxyService } from "../../settings/networksetup-proxy-service/networksetup-proxy-service";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientResponderContext } from "../client-responder/lib/client-responder-context";

export class PacFileService {
    constructor(
        private autoResponderService: AutoResponderService,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
    ) {}

    async load() {
        if (this.userSettingStorage.resolve("noPacFileProxy")) {
            return;
        }

        await this.networksetupProxyService.setAutoProxyUrl();

        this.autoResponderService
            .observable
            .throttleTime(300, async, {
                leading: true,
                trailing: true,
            })
            .subscribe(() => this.networksetupProxyService.reloadAutoProxyUrl())
        ;
    }

    async start() {
        await this.networksetupProxyService.setAutoProxyUrl();
    }

    async stop() {
        await this.networksetupProxyService.clearAutoProxyUrl();
    }

    async response(clientResponderContext: ClientResponderContext) {
        let content = await this.getContent();
        clientResponderContext.response({
            "content-length": content.length,
            "content-type": "application/x-ns-proxy-autoconfig",
        }, content);
    }

    private async getContent(): Promise<string> {
        let autoResponderEntries = await this.autoResponderService.fetchAll();
        let codeSttrings = autoResponderEntries.map((autoResponderEntity) => {
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
