import { injectable } from "inversify";
import { LocalFileResponseEntity } from "../local-file-response-entity";
import { LocalFilResponseIdentity } from "../local-file-response-identity";
import { LocalFileResponsePath } from "../value-objects/local-file-response-path";
import { LocalFileResponseSize } from "../value-objects/local-file-response-size";
import { LocalFileResponseType } from "../value-objects/local-file-response-type";

export interface LocalFileResponseParam {
    path: string;
    type: string;
    size: number;
}

@injectable()
export class LocalFileResponseFactory {
    private identity = 0;

    create(param: LocalFileResponseParam): LocalFileResponseEntity {
        return new LocalFileResponseEntity(
            new LocalFilResponseIdentity(this.identity++),
            new LocalFileResponsePath(param.path),
            new LocalFileResponseType(param.type),
            new LocalFileResponseSize(param.size),
        );
    }
}
