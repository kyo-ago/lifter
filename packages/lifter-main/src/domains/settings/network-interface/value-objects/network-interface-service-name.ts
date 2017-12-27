/**
 * This is the return value of the "networksetup - listNetworkserviceorder" command.
 *
 * ex. Wi-Fi
 */
import {BaseValueObject} from "../../../base/value-objects/base-value-object";

export class NetworkInterfaceServiceName extends BaseValueObject<string> {}
