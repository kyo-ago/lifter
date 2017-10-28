import {OutgoingHttpHeaders} from 'http';
import {ShareRewriteRuleEntity} from '../../share/share-rewrite-rule/share-rewrite-rule-entity';
import {ClientRequestEntity} from '../client-request/client-request-entity';

export class RewriteRuleEntity extends ShareRewriteRuleEntity {
    isMatchClientRequest(clientRequestEntity: ClientRequestEntity): boolean {
        return this.isMatchUrl(clientRequestEntity.href);
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        if (this.action === "ADD") {
            header[this.header] = header[this.header] ? [].concat(header[this.header], this.value): this.value;
        } else if (this.action === "MODIFY") {
            header[this.header] = this.value;
        } else if (this.action === "DELETE") {
            delete header[this.header];
        }
        return header;
    }
}
