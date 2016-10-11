import {OnMemoryRepository} from "typescript-dddbase";
import {KeychainIdentity} from "./keychain-identity";
import {KeychainEntity} from "./keychain-entity";
import {KeychainFactory} from "./keychain-factory";
import {execCommand, IOResult} from "../../libs/execCommand";

export class KeychainRepository extends OnMemoryRepository<KeychainIdentity, KeychainEntity> {
    getKeychain() {
        return execCommand([`list-keychains`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                return Promise.reject(stderr);
            }
            return Promise.resolve(stdout.split(/\r?\n/g).shift());
        }).then((name) => KeychainFactory.create(name));
    }
}
