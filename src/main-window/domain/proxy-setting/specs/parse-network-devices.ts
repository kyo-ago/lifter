import {Ifconfig} from "../lifecycle/proxy-setting-repository";

interface Device {
    "Hardware Port": string;
    "Device": string;
}

export function ParseNetworkDevices(
    serviceorder: string,
    ifconfig: Ifconfig,
): Device[] {
    let deviceOrder: Device[] = serviceorder.trim().match(/\(Hardware Port.+?\)/gi).map((line) => {
        return line.replace(/[\(\)]/g, '').split(/,/).reduce((base: any, cur: string) => {
            let [key, val] = cur.split(/:/);
            base[key.trim()] = val.trim();
            return base;
        }, <Device>{});
    });
    return deviceOrder.filter((device) => {
        let conf = ifconfig[device.Device];
        return conf && conf.status == 'active' && 'ether' in conf;
    }).map(device => device['Hardware Port']);
}
