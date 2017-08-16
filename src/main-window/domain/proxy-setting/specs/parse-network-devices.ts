import {Ifconfig} from "../proxy-setting-device/lifecycle/proxy-setting-device-repository";

interface Device {
    "Hardware Port": string;
    "Device": string;
}

export function ParseNetworkDevices(
    serviceorder: string,
    ifconfig: Ifconfig,
): {
    name: string;
    hardwarePort: string;
    enable: boolean;
}[] {
    let deviceOrder: Device[] = serviceorder.trim().match(/\(Hardware Port.+?\)/gi).map((line) => {
        return line.replace(/[\(\)]/g, '').split(/,/).reduce((base: any, cur: string) => {
            let [key, val] = cur.split(/:/);
            base[key.trim()] = val.trim();
            return base;
        }, <Device>{});
    });

    return deviceOrder
        .filter((device: Device) => ifconfig[device['Device']])
        .map((device: Device) => {
            return {
                name: device['Device'],
                hardwarePort: device['Hardware Port'],
                enable: ifconfig[device['Device']].status == 'active',
            };
        })
    ;
}
