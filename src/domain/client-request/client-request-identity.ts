import {NumberIdentity} from "typescript-dddbase";

export class ClientRequestIdentity extends NumberIdentity {
    constructor(
        identity: number
    ) {
        super(identity);
    }
}