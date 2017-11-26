/// <reference types="node" />
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../base/base-entity";
import { LocalFileResponderIdentity } from "./local-file-responder-identity";
import { LocalFileResponderPath } from "./value-objects/local-file-responder-path";
import { LocalFileResponderSize } from "./value-objects/local-file-responder-size";
import { LocalFileResponderType } from "./value-objects/local-file-responder-type";
export declare class LocalFileResponderEntity extends BaseEntity<LocalFileResponderIdentity> {
    private path;
    private type;
    private size;
    constructor(
        identity: LocalFileResponderIdentity,
        path: LocalFileResponderPath,
        type: LocalFileResponderType,
        size: LocalFileResponderSize
    );
    getBody(): Promise<Buffer>;
    getHeader(): OutgoingHttpHeaders;
    private getContentType();
    private getContentLength();
}
