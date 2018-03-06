import { ProxySettingStatus } from "@lifter/lifter-common";
import { IOResult, NetworksetupProxy } from "@lifter/networksetup-proxy";
import "mocha";
import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import { MockStateEvent } from "../../mock-state-event";

let grantSuccessResult = { stdout: undefined, stderr: undefined };
let commandSuccessResult = { stdout: ``, stderr: `` };

let setProxyState = (newState: ProxySettingStatus, result: IOResult) => {
    return () => {
        MockStateEvent.emit("updateProxyCommandGrantStatus", newState);
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

export type MockProxyCommandGrantStatus = ProxySettingStatus | "initialize" | "CancelGrant";

MockStateEvent.on("updateProxyCommandGrantStatus", newState => {
    if (newState === "CancelGrant") {
        stub.grant.rejects(new Error("User did not grant permission."));
        return setUnknownState(stub);
    }
    if (newState === "initialize") {
        stub.grant.callsFake(setProxyState("Off", grantSuccessResult));
        return setUnknownState(stub);
    }
    if (newState === "On") {
        return setPermittedState(stub);
    }
    if (newState === "Off") {
        return setPermittedState(stub);
    }
    console.error(`Invalid networksetup proxy state "${newState}".`);
});

let setUnknownState = (stub: sinon.SinonStubbedInstance<NetworksetupProxy>) => {
    stub.hasGrant.resolves(false);
    [
        [stub.setwebproxy, `-setwebproxy "Wi-Fi" 8888`],
        [stub.setsecurewebproxy, `-setsecurewebproxy "Wi-Fi" 8888`],
        [stub.setwebproxystate, `-setwebproxystate "Wi-Fi" on`],
        [stub.setsecurewebproxystate, `-setsecurewebproxystate "Wi-Fi" on`],
        [stub.setproxybypassdomains, `-setproxybypassdomains "Wi-Fi" "localhost"`],
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

let setPermittedState = (stub: sinon.SinonStubbedInstance<NetworksetupProxy>) => {
    stub.hasGrant.resolves(true);
    stub.grant.resolves(grantSuccessResult);
    stub.setwebproxy.callsFake(setProxyState("On", commandSuccessResult));
    stub.setsecurewebproxy.callsFake(setProxyState("On", commandSuccessResult));
    [stub.setwebproxystate, stub.setsecurewebproxystate].forEach(stub => {
        stub.resolves(commandSuccessResult);
        stub.withArgs(sinon.match.string, "off").callsFake(setProxyState("Off", commandSuccessResult));
        stub.withArgs(sinon.match.string, "on").callsFake(setProxyState("On", commandSuccessResult));
    });
    stub.setproxybypassdomains.resolves(commandSuccessResult);
    stub.setautoproxyurl.resolves(commandSuccessResult);
    stub.setautoproxystate.resolves(commandSuccessResult);
};

afterEach(() => {
    sandbox.resetHistory();
});
