import { fetchIfconfig } from "../../../application/libs/fetch-ifconfig";
import { getListnetworkserviceorder } from "../../../libs/exec-commands";
import { NetworkDeviceParam, NetworkInterfaceFactory } from "./lifecycle/network-interface-factory";
import { NetworkInterfaceEntity } from "./network-interface-entity";
import { ParseNetworkDevices } from "./specs/parse-network-devices";

export class NetworkInterfaceService {
    constructor(private networkInterfaceFactory: NetworkInterfaceFactory) {
    }

    async fetchAllInterface(): Promise<NetworkInterfaceEntity[]> {
        let [serviceorder, ifconfigResult] = await Promise.all([getListnetworkserviceorder(), fetchIfconfig()]);
        return ParseNetworkDevices(serviceorder, ifconfigResult).map((param: NetworkDeviceParam) =>
            this.networkInterfaceFactory.create(param),
        );
    }
}
