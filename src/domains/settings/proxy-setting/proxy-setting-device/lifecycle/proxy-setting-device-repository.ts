import * as ifconfig from 'ifconfig';
import {OnMemoryRepository} from 'typescript-dddbase';
import {getListnetworkserviceorder} from '../../../../../libs/exec-commands';
import {ParseNetworkDevices} from '../../specs/parse-network-devices';
import {ProxySettingDeviceEntity} from '../proxy-setting-device-entity';
import {ProxySettingDeviceIdentity} from '../proxy-setting-device-identity';
import {ProxySettingDeviceFactory} from './proxy-setting-device-factory';

function promisedIfconfig(): Promise<Ifconfig> {
    return new Promise((resolve, reject) => ifconfig((err: any, configs: Ifconfig) => err ? reject(err) : resolve(configs)));
}

export class ProxySettingDeviceRepository extends OnMemoryRepository<ProxySettingDeviceIdentity, ProxySettingDeviceEntity> {
    constructor(
        private proxySettingDeviceFactory: ProxySettingDeviceFactory,
    ) {
        super();
    }

    async resolveAllEnableDevices(): Promise<ProxySettingDeviceEntity[]> {
        let [serviceorder, ifconfig] = await Promise.all([
            getListnetworkserviceorder(),
            promisedIfconfig(),
        ]);
        return ParseNetworkDevices(serviceorder, ifconfig)
            .map((param: NetworkDeviceParam) => this.proxySettingDeviceFactory.create(param))
            .filter((entity) => entity.enabled)
        ;
    }
}
