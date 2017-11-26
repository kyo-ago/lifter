"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ParseNetworkDevices(serviceorder, ifconfig) {
    // drop first line
    let services = serviceorder
        .trim()
        .split("\n")
        .splice(1)
        .join("\n");
    let deviceOrder = services
        .trim()
        .split(/\n\n/)
        .map(line => {
            let [serviceName, device] = line.split(/\n/);
            return {
                ServiceName: serviceName.replace(/^\(\d+\)/, "").trim(),
                Device: device.match(/,\s*Device:\s*(.+?)\)/i).pop()
            };
        });
    return deviceOrder.filter(device => ifconfig[device["Device"]]).map(device => {
        let conf = ifconfig[device["Device"]];
        return {
            name: device["Device"],
            serviceName: device["ServiceName"],
            enable: conf.status === "active"
        };
    });
}
exports.ParseNetworkDevices = ParseNetworkDevices;
