import { LocalFileResponderEntity } from "../local-file-responder-entity";
export interface LocalFileResponderParam {
    path: string;
    type: string;
    size: number;
}
export declare class LocalFileResponderFactory {
    private identity;
    create(param: LocalFileResponderParam): LocalFileResponderEntity;
}
