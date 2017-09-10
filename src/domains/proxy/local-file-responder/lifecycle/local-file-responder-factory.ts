import {LocalFileResponderIdentity} from "../local-file-responder-identity";
import {LocalFileResponderEntity} from "../local-file-responder-entity";
import {LocalFileResponderSize} from "../value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "../value-objects/local-file-responder-path";
import {LocalFileResponderType} from "../value-objects/local-file-responder-type";

export interface LocalFileResponderParam {
    path: string,
    type: string,
    size: number,
}

export class LocalFileResponderFactory {
    private identity = 0;

    create(
        param: LocalFileResponderParam,
    ): LocalFileResponderEntity {
        return new LocalFileResponderEntity(
            new LocalFileResponderIdentity(this.identity++),
            new LocalFileResponderPath(param.path),
            new LocalFileResponderType(param.type),
            new LocalFileResponderSize(param.size),
        );
    }
}