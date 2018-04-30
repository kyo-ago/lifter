/**
 * This is the return value of the "networksetup - listNetworkserviceorder" command.
 *
 * ex. Wi-Fi
 */
import { BaseValueObject } from "../../../../domains/base/value-objects/base-value-object";

export class NetworkInterfaceServiceName extends BaseValueObject<string> {}
