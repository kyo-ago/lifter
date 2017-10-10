import * as ifconfig from 'ifconfig';
import {OnMemoryRepository} from 'typescript-dddbase';
import {getListnetworkserviceorder} from '../../../../libs/exec-commands';
import {ParseNetworkDevices} from '../../proxy-setting/specs/parse-network-devices';
import {NetworkInterfaceEntity} from '../network-interface-entity';
import {NetworkInterfaceIdentity} from '../network-interface-identity';
import {NetworkInterfaceFactory} from './network-interface-factory';

function promisedIfconfig(): Promise<Ifconfig> {
    return new Promise((resolve, reject) => ifconfig((err: any, configs: Ifconfig) => err ? reject(err) : resolve(configs)));
}

export class NetworkInterfaceRepository extends OnMemoryRepository<NetworkInterfaceIdentity, NetworkInterfaceEntity> {
    constructor(
        private networkInterfaceFactory: NetworkInterfaceFactory,
    ) {
        super();
    }

    async load() {
        let [serviceorder, ifconfig] = await Promise.all([
            getListnetworkserviceorder(),
            promisedIfconfig(),
        ]);
        return ParseNetworkDevices(serviceorder, ifconfig)
            .map((param: NetworkDeviceParam) => this.networkInterfaceFactory.create(param))
            .filter((entity) => entity.enabled)
        ;
    }

    async resolveAllEnableInterface(): Promise<NetworkInterfaceEntity[]> {
        let [serviceorder, ifconfig] = await Promise.all([
            getListnetworkserviceorder(),
            promisedIfconfig(),
        ]);
        return ParseNetworkDevices(serviceorder, ifconfig)
            .map((param: NetworkDeviceParam) => this.networkInterfaceFactory.create(param))
            .filter((entity) => entity.enabled)
        ;
    }
}
