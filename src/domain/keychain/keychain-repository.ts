import {OnMemoryRepository} from "typescript-dddbase";
import {KeychainIdentity, KeychainIdentity} from "./keychain-identity";
import {KeychainEntity} from "./keychain-entity";
import {KeychainFactory} from "./keychain-factory";
import {execCommand} from "../../libs/execCommand";

export class KeychainRepository extends OnMemoryRepository<KeychainIdentity, KeychainEntity> {
    getKeychain() {
        return execCommand(`list-keychains`, (resolve, reject, { error, stdout, stderr }) => {
            if (error !== null || stderr) {
                reject(`${error}, ${stderr}`);
            }
            resolve(stdout.split(/\r?\n/g).shift());
        }).then((name) => KeychainFactory.create(name));
    }
}
