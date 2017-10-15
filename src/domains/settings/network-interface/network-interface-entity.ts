import {BaseEntity} from '../../share/base/base-entity';
import {NetworkInterfaceIdentity} from './network-interface-identity';
import {NetworkInterfaceName} from './value-objects/network-interface-name';
import {NetworkInterfaceServiceName} from "./value-objects/network-interface-service-name";

export class NetworkInterfaceEntity extends BaseEntity<NetworkInterfaceIdentity> {
    constructor(
        identity: NetworkInterfaceIdentity,
        private _name: NetworkInterfaceName,
        private _serviceName: NetworkInterfaceServiceName,
        public enabled: boolean,
    ) {
        super(identity);
    }

    get name() {
        return this._name.value;
    }

    get serviceName() {
        return this._serviceName.value;
    }
}
