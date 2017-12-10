import { BaseValueObject } from "@kyo-ago/lifter-common";

/**
 * This is the return value of the "ifconfig -l" command.
 *
 * ex. en0, en1, lpss-serial2
 */
export class NetworkInterfaceName extends BaseValueObject<string> {}
