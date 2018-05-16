/**
 * This is the return value of the "ifconfig -l" command.
 *
 * ex. en0, en1, lpss-serial2
 */
import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export class NetworkInterfaceName extends BaseValueObject<string> {}
