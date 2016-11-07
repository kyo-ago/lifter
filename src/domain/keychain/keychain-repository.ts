import {OnMemoryRepository} from "typescript-dddbase";
import {KeychainIdentity} from "./keychain-identity";
import {KeychainEntity} from "./keychain-entity";
import {KeychainFactory} from "./keychain-factory";
import {execSecurityCommand, IOResult} from "../../libs/exec-command";

export class KeychainRepository extends OnMemoryRepository<KeychainIdentity, KeychainEntity> {
    getKeychain() {
        return execSecurityCommand([`list-keychains`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                return Promise.reject(stderr);
            }
            return Promise.resolve(stdout.split(/\r?\n/g).shift());
        }).then((name) => KeychainFactory.create(name));
    }
}
