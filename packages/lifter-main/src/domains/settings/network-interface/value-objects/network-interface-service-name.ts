import { BaseValueObject } from "@kyo-ago/lifter-common";

/**
 * This is the return value of the "networksetup - listNetworkserviceorder" command.
 *
 * ex. Wi-Fi
 */
export class NetworkInterfaceServiceName extends BaseValueObject<string> {}
