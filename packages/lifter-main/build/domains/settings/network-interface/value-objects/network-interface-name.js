"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_value_object_1 = require("../../../base/value-objects/base-value-object");
/**
 * This is the return value of the "ifconfig -l" command.
 *
 * ex. en0, en1, lpss-serial2
 */
class NetworkInterfaceName extends base_value_object_1.BaseValueObject {}
exports.NetworkInterfaceName = NetworkInterfaceName;
