import { AutoResponderEntityJSON, AutoResponderType } from "@lifter/lifter-common";
import * as mime from "mime";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponderParam } from "../local-file-responder/lifecycle/local-file-responder-factory";
import { ProjectIdentity } from "../project/project-identity";
import { AutoResponderFilePath } from "./auto-responder-file/value-objects/auto-responder-file-path";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderPath } from "./value-objects/auto-responder-path";
import { AutoResponderPattern } from "./value-objects/auto-responder-pattern";

export type AbstractAutoResponderEntity = AutoResponderEntity<
    AutoResponderPattern,
    AutoResponderPath
>;

export abstract class AutoResponderEntity<
    Pattern extends AutoResponderPattern,
    Path extends AutoResponderPath
> extends BaseEntity<AutoResponderIdentity> {
    constructor(
        identity: AutoResponderIdentity,
        public type: AutoResponderType,
        public pattern: Pattern,
        public path: Path,
        public projectIdentity: ProjectIdentity,
    ) {
        super(identity);
    }

    abstract getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null>;

    get json(): AutoResponderEntityJSON {
        return {
            id: this.id,
            type: this.type,
            pattern: this.pattern.value,
            path: this.path.value,
            projectId: this.projectIdentity.getValue(),
        };
    }

    protected async filePathToLocalFileResponderParam(
        filePath: AutoResponderFilePath,
    ): Promise<LocalFileResponderParam | null> {
        let stats;
        try {
            stats = await filePath.getState();
        } catch (e) {
            // missing file
            return null;
        }
        return {
            path: filePath.value,
            type: mime.getType(filePath.value),
            size: stats.size,
        };
    }
}
