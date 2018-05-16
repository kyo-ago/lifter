import { injectable } from "inversify";
import { NetworkInterfaceEntity } from "../network-interface-entity";
import { NetworkInterfaceIdentity } from "../network-interface-identity";
import { NetworkInterfaceName } from "../value-objects/network-interface-name";
import { NetworkInterfaceServiceName } from "../value-objects/network-interface-service-name";

export interface NetworkDeviceParam {
    name: string;
    serviceName: string;
    enable: boolean;
}

@injectable()
export class NetworkInterfaceFactory {
    private identity = 0;

    create(param: NetworkDeviceParam): NetworkInterfaceEntity {
        return new NetworkInterfaceEntity(
            new NetworkInterfaceIdentity(this.identity++),
            new NetworkInterfaceName(param.name),
            new NetworkInterfaceServiceName(param.serviceName),
            param.enable,
        );
    }
}
