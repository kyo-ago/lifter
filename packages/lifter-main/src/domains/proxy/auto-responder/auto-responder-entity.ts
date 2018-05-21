import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import * as mime from "mime";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseParam } from "../local-file-response/lifecycle/local-file-response-factory";
import { ProjectIdentity } from "../project/project-identity";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderAnyPath } from "./value-objects/auto-responder-any-path";
import { AutoResponderFilePath } from "./value-objects/auto-responder-file-path";
import { AutoResponderPattern } from "./value-objects/auto-responder-pattern";

export class AutoResponderEntity extends BaseEntity<AutoResponderIdentity> {
    constructor(
        identity: AutoResponderIdentity,
        public pattern: AutoResponderPattern,
        public path: AutoResponderAnyPath,
        public projectIdentity: ProjectIdentity,
    ) {
        super(identity);
    }

    async getMatchResponder(
        clientRequestEntity: ClientRequestEntity,
    ): Promise<LocalFileResponseParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        let filePath = await this.path.getAutoResponderFilePath(
            clientRequestEntity,
        );

        return filePath
            ? this.filePathToLocalFileResponseParam(filePath)
            : null;
    }

    get json(): AutoResponderEntityJSON {
        return {
            id: this.id,
            pattern: this.pattern.value,
            path: this.path.value,
            projectId: this.projectIdentity.getValue(),
        };
    }

    protected async filePathToLocalFileResponseParam(
        filePath: AutoResponderFilePath,
    ): Promise<LocalFileResponseParam | null> {
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
