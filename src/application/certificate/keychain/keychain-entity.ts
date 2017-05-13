import {BaseEntity} from "../../../domain/base/base-entity";
import {KeychainIdentity} from "./keychain-identity";
import {KeychainName} from "./value-objects/keychain-name";

export class KeychainEntity extends BaseEntity<KeychainIdentity> {
    constructor(
        identity: KeychainIdentity,
        private _name: KeychainName,
    ) {
        super(identity);
    }

    get name() {
        return this._name.value;
    }

}