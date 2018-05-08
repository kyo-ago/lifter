import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
import { async } from "rxjs/scheduler/async";
import { PROXY_SERVER_NAME } from "../../../settings";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { ClientResponderContext } from "../client-request/lib/client-responder-context";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleService } from "../rewrite-rule/rewrite-rule-service";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "./lifecycle/auto-responder-repositoty";
import { FindMatchEntry } from "./specs/find-match-entry";

export interface getAutoResponder {
    add: (paths: string[]) => Promise<AutoResponderEntityJSON[]>;
    fetchAll: () => Promise<AutoResponderEntityJSON[]>;
    deletes: (ids: number[]) => Promise<void>;
}

@injectable()
export class AutoResponderService {
    private observable: Rx.Subject<void> = new Rx.Subject();

    constructor(
        private autoResponderFactory: AutoResponderFactory,
        private autoResponderRepository: AutoResponderRepository,
        private findMatchEntry: FindMatchEntry,
        private rewriteRuleService: RewriteRuleService,
    ) {}

    getAutoResponder(): getAutoResponder {
        return {
            add: (paths: string[]): Promise<AutoResponderEntityJSON[]> => {
                return this.store(paths);
            },
            fetchAll: (): Promise<AutoResponderEntityJSON[]> => {
                return this.fetchAllJSONs();
            },
            deletes: (ids: number[]): Promise<void> => {
                return this.deletes(ids);
            },
        };
    }

    async store(paths: string[]): Promise<AutoResponderEntityJSON[]> {
        let filePromises = paths.map(path =>
            this.autoResponderFactory.createFromPath(path),
        );
        let autoResponderEntities = await Promise.all(filePromises);
        await this.autoResponderRepository.storeList(autoResponderEntities);
        this.observable.next();
        return autoResponderEntities.map(
            autoResponderEntity => autoResponderEntity.json,
        );
    }

    async response(
        clientResponderContext: ClientResponderContext,
        clientRequestEntity: ClientRequestEntity,
    ): Promise<void> {
        let localFileResponseEntity = await this.find(clientRequestEntity);

        if (!localFileResponseEntity) {
            return clientResponderContext.pass();
        }

        let body = await localFileResponseEntity.getBody();
        let header = await this.rewriteRuleService.getHeader(
            localFileResponseEntity,
            clientRequestEntity,
        );
        clientResponderContext.response(header, body);
    }

    async fetchMatchCodes(): Promise<string> {
        let entities = await this.autoResponderRepository.resolveAll();
        return entities
            .map(autoResponderEntity => {
                return autoResponderEntity.pattern.getMatchCodeString(
                    `PROXY ${PROXY_SERVER_NAME}`,
                );
            })
            .join("\n");
    }

    private async fetchAllJSONs(): Promise<AutoResponderEntityJSON[]> {
        let autoResponderEntities = await this.autoResponderRepository.resolveAll();
        return autoResponderEntities.map(
            autoResponderEntity => autoResponderEntity.json,
        );
    }

    async find(
        clientRequestEntity: ClientRequestEntity,
    ): Promise<LocalFileResponseEntity | null> {
        let entries = await this.autoResponderRepository.resolveAll();
        return entries.reduce((promise, entity) => {
            return this.findMatchEntry.getLocalFileResponse(
                promise,
                clientRequestEntity,
                entity,
            );
        }, Promise.resolve(<LocalFileResponseEntity | null>null));
    }

    bind(callback: () => void): () => void {
        return this.observable
            .throttleTime(300, async, {
                leading: true,
                trailing: true,
            })
            .subscribe(callback).unsubscribe;
    }

    private async deletes(ids: number[]): Promise<void> {
        await Promise.all(
            ids
                .map(id => new AutoResponderIdentity(id))
                .map(autoResponderIdentity => {
                    return this.autoResponderRepository.deleteByIdentity(
                        autoResponderIdentity,
                    );
                }),
        );
        this.observable.next();
    }
}
