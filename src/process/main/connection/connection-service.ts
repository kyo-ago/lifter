import {OutgoingHttpHeaders} from 'http';
import {AutoResponderEntryRepository} from '../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty';
import {ClientRequestEntity} from '../../../domains/proxy/client-request/client-request-entity';
import {ClientRequestRepository} from '../../../domains/proxy/client-request/lifecycle/client-request-repository';
import {LocalFileResponderEntity} from '../../../domains/proxy/local-file-responder/local-file-responder-entity';
import {RewriteRuleRepository} from '../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';

export class ConnectionService {
    constructor(
        private clientRequestRepository: ClientRequestRepository,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) { }

    async onRequest(
        clientRequestEntity: ClientRequestEntity,
        blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
        passCallback: (error: Error | undefined) => void,
    ) {
        this.clientRequestRepository.store(clientRequestEntity);

        let localFileResponderEntity: LocalFileResponderEntity | null = await this.autoResponderEntryRepository.findMatchEntry(clientRequestEntity);

        if (!localFileResponderEntity) {
            return passCallback(undefined);
        }

        let body = await localFileResponderEntity.getBody();
        let header = this.rewriteRuleRepository.findMatchRules(clientRequestEntity).reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(base);
        }, localFileResponderEntity.getHeader());
        blockCallback(header, body);
    }
}
