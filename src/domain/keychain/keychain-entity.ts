import {Entity} from "typescript-dddbase";
import {KeychainIdentity} from "./keychain-identity";
import {KeychainName} from "./keychain-name";

export class KeychainEntity extends Entity<KeychainIdentity> {
    constructor(
        identity: KeychainIdentity,
        private _name: KeychainName,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get name() {
        return this._name.value;
    }

}