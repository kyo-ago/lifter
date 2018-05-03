import { NetworkDeviceParam } from "../lifecycle/network-interface-factory";

interface Device {
    ServiceName: string;
    Device: string;
}

export function ParseNetworkDevices(
    serviceorder: string,
    ifconfig: Ifconfig,
): NetworkDeviceParam[] {
    // drop first line
    let services = serviceorder
        .trim()
        .split("\n")
        .splice(1)
        .join("\n");
    let deviceOrder: Device[] = services
        .trim()
        .split(/\n\n/)
        .map((line: string) => {
            let [serviceName, device] = line.split(/\n/);
            return <Device>{
                ServiceName: serviceName.replace(/^\(\d+\)/, "").trim(),
                Device: (device.match(/,\s*Device:\s*(.+?)\)/i) || [""]).pop(),
            };
        });

    return deviceOrder
        .filter((device: Device) => ifconfig[device["Device"]])
        .map((device: Device) => {
            let conf = ifconfig[device["Device"]];
            return {
                name: device["Device"],
                serviceName: device["ServiceName"],
                enable: conf.status === "active",
            };
        });
}
