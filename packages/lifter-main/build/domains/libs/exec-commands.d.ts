import { NetworkInterfaceEntity } from "../settings/network-interface/network-interface-entity";
export declare function getListnetworkserviceorder(): Promise<string>;
export declare function getWebproxy(device: NetworkInterfaceEntity): Promise<string>;
export declare function getSecureWebproxy(device: NetworkInterfaceEntity): Promise<string>;
export declare function getProxyByPassDomains(device: NetworkInterfaceEntity): Promise<string>;
export declare function findCertificate(certificateName: string): Promise<string>;
export declare function deleteCertificate(certificateName: string): Promise<string>;
export declare function importCert(certificatePath: string): Promise<string>;
export declare function addTrustedCert(certificatePath: string): Promise<string>;
