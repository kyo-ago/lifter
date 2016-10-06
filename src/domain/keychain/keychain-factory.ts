import {KeychainEntity} from "./keychain-entity";
import {KeychainIdentity} from "./keychain-identity";
import {KeychainName} from "./keychain-name";

export class KeychainFactory {
    private static identity = 0;

    static create(name: string): KeychainEntity {
        return new KeychainEntity(
            new KeychainIdentity(this.identity++),
            new KeychainName(name),
        );
    }
}