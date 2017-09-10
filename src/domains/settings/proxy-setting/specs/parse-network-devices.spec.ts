import {ParseNetworkDevices} from "./parse-network-devices";

describe('ParseNetworkDevices', () => {
    it('filtering enable devices', () => {
        let results = ParseNetworkDevices(`An asterisk (*) denotes that a network service is disabled.
(1) iPhone USB
(Hardware Port: iPhone USB, Device: en2)

(2) Wi-Fi
(Hardware Port: Wi-Fi, Device: en0)

(3) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en1)

`, {
            lo0: {
                inet: '127.0.0.1 netmask 0xff000000',
            },
            en0: {
                ether: 'ff:ff:ff:ff:ff:ff',
                inet: '192.168.0.1 netmask 0xffffff00 broadcast 192.168.0.255',
                status: 'active',
            },
        });
        expect(results).toEqual([{
            name: 'en0',
            hardwarePort: 'Wi-Fi',
            enable: true,
        }]);
    });

    it('filtering multi devices', () => {
        let results = ParseNetworkDevices(`An asterisk (*) denotes that a network service is disabled.
(1) iPhone USB
(Hardware Port: iPhone USB, Device: en2)

(2) Wi-Fi
(Hardware Port: Wi-Fi, Device: en0)

(3) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en1)

`, {
            lo0: {
                inet: '127.0.0.1 netmask 0xff000000',
            },
            en0: {
                ether: 'ff:ff:ff:ff:ff:ff',
                inet: '192.168.0.1 netmask 0xffffff00 broadcast 192.168.0.255',
                status: 'active',
            },
            en1: {
                ether: 'ff:ff:ff:ff:ff:ff',
                inet: '192.168.0.1 netmask 0xffffff00 broadcast 192.168.0.255',
                status: 'active',
            },
        });
        expect(results).toEqual([
            {
                name: 'en0',
                hardwarePort: 'Wi-Fi',
                enable: true,
            },
            {
                name: 'en1',
                hardwarePort: 'Bluetooth PAN',
                enable: true,
            },
        ]);
    });

    it('no active devices', () => {
        let results = ParseNetworkDevices(`An asterisk (*) denotes that a network service is disabled.
(1) iPhone USB
(Hardware Port: iPhone USB, Device: en2)

(2) Wi-Fi
(Hardware Port: Wi-Fi, Device: en0)

(3) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en1)

`, {
            lo0: {
                inet: '127.0.0.1 netmask 0xff000000',
            },
            en0: {
                ether: 'ff:ff:ff:ff:ff:ff',
                inet: '192.168.0.1 netmask 0xffffff00 broadcast 192.168.0.255',
                status: 'inactive',
            },
        });
        expect(results).toEqual([
            {
                name: 'en0',
                hardwarePort: 'Wi-Fi',
                enable: false,
            },
        ]);
    });
});
