import { LOCAL_PAC_FILE_URL } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientRequestService } from "../client-request/client-request-service";
import { LocalFileResponseParam } from "../local-file-response/lifecycle/local-file-response-factory";
import { PacFileService } from "../pac-file/pac-file-service";
import { RewriteRuleService } from "../rewrite-rule/rewrite-rule-service";
import { ClientResponderContext } from "./lib/client-responder-context";

export class ClientResponder {
    constructor(
        private autoResponderService: AutoResponderService,
        private pacFileService: PacFileService,
        private rewriteRuleService: RewriteRuleService,
        private clientRequestService: ClientRequestService,
    ) {}

    async onRequest(
        clientResponderContext: ClientResponderContext,
        passCallback: (error: Error | undefined) => void,
    ) {
        let clientRequestEntity = this.clientRequestService.add(clientResponderContext.getUrl());

        if (clientRequestEntity.href === LOCAL_PAC_FILE_URL) {
            return await this.pacFileService.response(clientResponderContext);
        }

        let localFileResponseEntity = await this.autoResponderService.find(clientRequestEntity);

        if (!localFileResponseEntity) {
            return passCallback(undefined);
        }

        let body = await localFileResponseEntity.getBody();
        let header = await this.rewriteRuleService.getHeader(localFileResponseEntity, clientRequestEntity);
        clientResponderContext.response(header, body);
    }
}