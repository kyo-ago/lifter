import { LOCAL_PAC_FILE_URL } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientRequestService } from "../client-request/client-request-service";
import { PacFileService } from "../pac-file/pac-file-service";
import { ClientResponderContext } from "./lib/client-responder-context";

export class ClientResponder {
    constructor(
        private autoResponderService: AutoResponderService,
        private pacFileService: PacFileService,
        private clientRequestService: ClientRequestService,
    ) {}

    async onRequest(clientResponderContext: ClientResponderContext): Promise<void> {
        let clientRequestEntity = this.clientRequestService.store(clientResponderContext.getUrl());

        if (clientRequestEntity.href === LOCAL_PAC_FILE_URL) {
            return await this.pacFileService.response(clientResponderContext);
        }

        return await this.autoResponderService.response(clientResponderContext, clientRequestEntity);
    }
}
