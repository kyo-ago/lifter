import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

let stub = sandbox.stub().callsFake((callback: (err: any, configs: Ifconfig) => void) => {
    callback(undefined, {
        lo0: {
            flags: "9999<XXX,XXX,XXX,XXX,XXX> mtu 1500",
            inet: "127.0.0.1 netmask 0xff000000",
            inet6: "fe80::1%lo0 prefixlen 64 scopeid 0x1",
            nd6: "options=999<XXX,XXX>",
        },
        en0: {
            flags: "9999<XXX,XXX,XXX,XXX,XXX> mtu 1500",
            ether: "xx:xx:xx:xx:xx:xx",
            nd6: "options=999<XXX,XXX>",
            media: "autoselect (<unknown type>)",
            status: "active",
        },
    });
});
mockRequire("ifconfig", stub);

afterEach(() => {
    sandbox.resetHistory();
});
