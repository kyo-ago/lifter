import { ProxySettingStatus } from "@lifter/lifter-common";
import { IOResult, NetworksetupProxy } from "@lifter/networksetup-proxy";
import "mocha";
import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import { ProxyCommandGrantStatus } from "../../../../../lifter-common/src";
import { MockStateEvent } from "../../mock-state-event";

let grantSuccessResult = { stdout: undefined, stderr: undefined };
let commandSuccessResult = { stdout: ``, stderr: `` };

let setProxyCommandGrantStatus = (
    newStatus: ProxyCommandGrantStatus,
    result: IOResult,
) => {
    return () => {
        MockStateEvent.emit("updateProxyCommandGrantStatus", newStatus);
        return Promise.resolve(result);
    };
};

let setProxySettingStatus = (
    newStatus: ProxySettingStatus,
    result: IOResult,
) => {
    return () => {
        MockStateEvent.emit("updateProxySettingState", newStatus);
        return Promise.resolve(result);
    };
};

let sandbox = sinon.createSandbox();
let stub = sandbox.stub(new NetworksetupProxy());

/**
 * This is constructor mock.
 * require Function object(not allow function)
 */
mockRequire("@lifter/networksetup-proxy", {
    NetworksetupProxy: function() {
        return stub;
    },
});

export type MockProxyCommandGrantStatus =
    | ProxyCommandGrantStatus
    | "initialize"
    | "CancelGrant";

MockStateEvent.on("updateProxyCommandGrantStatus", newStatus => {
    if (newStatus === "CancelGrant") {
        stub.grant.rejects(new Error("User did not grant permission."));
        return setUnknownState(stub);
    }
    if (newStatus === "initialize") {
        stub.grant.callsFake(
            setProxyCommandGrantStatus("Off", grantSuccessResult),
        );
        return setUnknownState(stub);
    }
    if (newStatus === "On") {
        stub.hasGrant.resolves(true);
        return setPermittedState(stub);
    }
    if (newStatus === "Off") {
        stub.hasGrant.resolves(false);
        return setPermittedState(stub);
    }
    console.error(`Invalid networksetup proxy state "${newStatus}".`);
});

let setUnknownState = (stub: sinon.SinonStubbedInstance<NetworksetupProxy>) => {
    stub.hasGrant.resolves(false);
    [
        [stub.setwebproxy, `-setwebproxy "Wi-Fi" 8888`],
        [stub.setsecurewebproxy, `-setsecurewebproxy "Wi-Fi" 8888`],
        [stub.setwebproxystate, `-setwebproxystate "Wi-Fi" on`],
        [stub.setsecurewebproxystate, `-setsecurewebproxystate "Wi-Fi" on`],
        [
            stub.setproxybypassdomains,
            `-setproxybypassdomains "Wi-Fi" "localhost"`,
        ],
        [stub.setautoproxyurl, `-setautoproxyurl "Wi-Fi" 8888`],
        [stub.setautoproxystate, `-setautoproxystate "Wi-Fi" on`],
    ].forEach(([stub, cmd]: [sinon.SinonStub, string]) => {
        stub.rejects(
            new Error(`\nCommand failed: /networksetup-proxy/rust/proxy-setting ${cmd}
thread 'main' panicked at 'Failed to execute: Operation not permitted (os error 1)', ./rust/proxy-setting.rs:99:99
note: Run with \`RUST_BACKTRACE=1\` for a backtrace.\n`),
        );
    });
};

let setPermittedState = (
    stub: sinon.SinonStubbedInstance<NetworksetupProxy>,
) => {
    stub.grant.callsFake(setProxyCommandGrantStatus("On", grantSuccessResult));
    stub.setwebproxy.callsFake(
        setProxySettingStatus("On", commandSuccessResult),
    );
    stub.setsecurewebproxy.callsFake(
        setProxySettingStatus("On", commandSuccessResult),
    );
    [stub.setwebproxystate, stub.setsecurewebproxystate].forEach(stub => {
        stub.resolves(commandSuccessResult);
        stub
            .withArgs(sinon.match.string, "off")
            .callsFake(setProxySettingStatus("Off", commandSuccessResult));
        stub
            .withArgs(sinon.match.string, "on")
            .callsFake(setProxySettingStatus("On", commandSuccessResult));
    });
    stub.setproxybypassdomains.resolves(commandSuccessResult);
    stub.setautoproxyurl.resolves(commandSuccessResult);
    stub.setautoproxystate.resolves(commandSuccessResult);
};

afterEach(() => {
    sandbox.resetHistory();
});
