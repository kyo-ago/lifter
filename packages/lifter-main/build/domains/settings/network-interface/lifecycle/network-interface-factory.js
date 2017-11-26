"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_interface_entity_1 = require("../network-interface-entity");
const network_interface_identity_1 = require("../network-interface-identity");
const network_interface_name_1 = require("../value-objects/network-interface-name");
const network_interface_service_name_1 = require("../value-objects/network-interface-service-name");
class NetworkInterfaceFactory {
    constructor() {
        this.identity = 0;
    }
    create(param) {
        return new network_interface_entity_1.NetworkInterfaceEntity(
            new network_interface_identity_1.NetworkInterfaceIdentity(this.identity++),
            new network_interface_name_1.NetworkInterfaceName(param.name),
            new network_interface_service_name_1.NetworkInterfaceServiceName(param.serviceName),
            param.enable
        );
    }
}
exports.NetworkInterfaceFactory = NetworkInterfaceFactory;
