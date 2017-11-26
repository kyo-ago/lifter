import { OnMemoryRepository } from "typescript-dddbase";
import { NetworkInterfaceEntity } from "../network-interface-entity";
import { NetworkInterfaceIdentity } from "../network-interface-identity";
import { NetworkInterfaceFactory } from "./network-interface-factory";
export declare class NetworkInterfaceRepository extends OnMemoryRepository<
    NetworkInterfaceIdentity,
    NetworkInterfaceEntity
> {
    private networkInterfaceFactory;
    constructor(networkInterfaceFactory: NetworkInterfaceFactory);
    resolveAllInterface(): Promise<NetworkInterfaceEntity[]>;
}
