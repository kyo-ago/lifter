import { injectable } from "inversify";
import { AutoResponderService } from "../../proxy/auto-responder/auto-responder-service";
import { ClientResponderContext } from "../../proxy/client-request/lib/client-responder-context";
import { NetworksetupProxyService } from "../networksetup-proxy/networksetup-proxy-service";

@injectable()
export class PacFileService {
    constructor(
        private autoResponderService: AutoResponderService,
        private networksetupProxyService: NetworksetupProxyService,
    ) {}
    private unsubscribe: (() => void) | null = null;

    async start() {
        await this.networksetupProxyService.setAutoProxyUrl();
        this.unsubscribe && this.unsubscribe();
        this.unsubscribe = this.autoResponderService.bind(() =>
            this.networksetupProxyService.reloadAutoProxyUrl(),
        );
    }

    async stop() {
        await this.networksetupProxyService.clearAutoProxyUrl();
        this.unsubscribe && this.unsubscribe();
        this.unsubscribe = null;
    }

    async response(clientResponderContext: ClientResponderContext) {
        let content = await this.getContent();
        clientResponderContext.response(
            {
                "content-length": content.length,
                "content-type": "application/x-ns-proxy-autoconfig",
            },
            content,
        );
    }

    private async getContent(): Promise<string> {
        let codeString = await this.autoResponderService.fetchMatchCodes();
        return `
            function FindProxyForURL(url, host) {
                ${codeString}
            	return "DIRECT";
            }
        `;
    }
}
