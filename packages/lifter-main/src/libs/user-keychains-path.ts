import * as Path from "path";
import { BaseValueObject } from "../domains/base/value-objects/base-value-object";

export class UserKeychainsPath extends BaseValueObject<string> {
    getPath() {
        return Path.join(this.value, "/Library/Keychains/login.keychain-db");
    }
}
