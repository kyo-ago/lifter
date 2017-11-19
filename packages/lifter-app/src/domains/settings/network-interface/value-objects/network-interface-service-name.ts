import { BaseValueObject } from "../../../share/base/value-objects/base-value-object";

/**
 * This is the return value of the "networksetup - listNetworkserviceorder" command.
 *
 * ex. Wi-Fi
 */
export class NetworkInterfaceServiceName extends BaseValueObject<string> {}
