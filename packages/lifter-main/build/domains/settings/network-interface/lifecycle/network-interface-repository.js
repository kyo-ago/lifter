"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ifconfig = require("ifconfig");
const typescript_dddbase_1 = require("typescript-dddbase");
const exec_commands_1 = require("../../../libs/exec-commands");
const parse_network_devices_1 = require("../specs/parse-network-devices");
function promisedIfconfig() {
    return new Promise((resolve, reject) => ifconfig((err, configs) => (err ? reject(err) : resolve(configs))));
}
class NetworkInterfaceRepository extends typescript_dddbase_1.OnMemoryRepository {
    constructor(networkInterfaceFactory) {
        super();
        this.networkInterfaceFactory = networkInterfaceFactory;
    }
    async resolveAllInterface() {
        let [serviceorder, ifconfig] = await Promise.all([
            exec_commands_1.getListnetworkserviceorder(),
            promisedIfconfig()
        ]);
        return parse_network_devices_1
            .ParseNetworkDevices(serviceorder, ifconfig)
            .map(param => this.networkInterfaceFactory.create(param));
    }
}
exports.NetworkInterfaceRepository = NetworkInterfaceRepository;
