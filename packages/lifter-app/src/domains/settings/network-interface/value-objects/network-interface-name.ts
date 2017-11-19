import { BaseValueObject } from "../../../share/base/value-objects/base-value-object";

/**
 * This is the return value of the "ifconfig -l" command.
 *
 * ex. en0, en1, lpss-serial2
 */
export class NetworkInterfaceName extends BaseValueObject<string> {}
