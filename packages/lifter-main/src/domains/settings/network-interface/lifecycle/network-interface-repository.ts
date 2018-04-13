import { OnMemoryRepository } from "typescript-dddbase";
import { getListnetworkserviceorder } from "../../../../libs/exec-commands";
import { fetchIfconfig } from "../../../libs/fetch-ifconfig";
import { NetworkInterfaceEntity } from "../network-interface-entity";
import { NetworkInterfaceIdentity } from "../network-interface-identity";
import { ParseNetworkDevices } from "../specs/parse-network-devices";
import { NetworkDeviceParam, NetworkInterfaceFactory } from "./network-interface-factory";

export class NetworkInterfaceRepository extends OnMemoryRepository<NetworkInterfaceIdentity, NetworkInterfaceEntity> {
    constructor(private networkInterfaceFactory: NetworkInterfaceFactory) {
        super();
    }

    async resolveAllInterface(): Promise<NetworkInterfaceEntity[]> {
        let [serviceorder, ifconfigResult] = await Promise.all([getListnetworkserviceorder(), fetchIfconfig()]);
        return ParseNetworkDevices(serviceorder, ifconfigResult).map((param: NetworkDeviceParam) =>
            this.networkInterfaceFactory.create(param),
        );
    }
}
