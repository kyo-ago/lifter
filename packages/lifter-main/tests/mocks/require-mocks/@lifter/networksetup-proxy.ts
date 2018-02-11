import { ProxySettingStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import { SinonStub, SinonStubbedInstance } from "sinon";
import { NetworkMockStateEvent } from "../../network-mock-state-event";

let grantSuccessResult = { stdout: undefined, stderr: undefined };
let commandSuccessResult = { stdout: ``, stderr: `` };
let setProxyState = (newState: ProxySettingStatus) => {
    return () => {
        NetworkMockStateEvent.emit("updateProxyingState", newState);
    };
};

let sandbox = sinon.createSandbox();
let stub = sandbox.stub(new NetworksetupProxy);

mockRequire("@lifter/networksetup-proxy", {
    NetworksetupProxy: function () {
        return stub;
    },
});

NetworkMockStateEvent.on("updateProxyingState", (newState) => {
    if (newState === "CancelGrant") {
        stub.grant.rejects(new Error("User did not grant permission."));
        setNoPermissionState(stub);
    }
    if (newState === "NoPermission") {
        stub.grant.callsFake(setProxyState("Off")).resolves(grantSuccessResult);
        setNoPermissionState(stub);
    }
    if (newState === "On") {
        setPermittedState(stub);
    }
    if (newState === "Off") {
        setPermittedState(stub);
    }
});

let setNoPermissionState = (stub: SinonStubbedInstance<NetworksetupProxy>) => {
    stub.hasGrant.resolves(false);
    [
        [stub.setwebproxy, `-setwebproxy "Wi-Fi" 8888`],
        [stub.setsecurewebproxy, `-setsecurewebproxy "Wi-Fi" 8888`],
        [stub.setwebproxystate, `-setwebproxystate "Wi-Fi" on`],
        [stub.setsecurewebproxystate, `-setsecurewebproxystate "Wi-Fi" on`],
        [stub.setproxybypassdomains, `-setproxybypassdomains "Wi-Fi" "localhost"`],
        [stub.setautoproxyurl, `-setautoproxyurl "Wi-Fi" 8888`],
        [stub.setautoproxystate, `-setautoproxystate "Wi-Fi" on`],
    ].forEach(([stub, cmd]: [SinonStub, string]) => {
        stub.rejects(new Error(`\nCommand failed: /networksetup-proxy/rust/proxy-setting ${cmd}
thread 'main' panicked at 'Failed to execute: Operation not permitted (os error 1)', ./rust/proxy-setting.rs:99:99
note: Run with \`RUST_BACKTRACE=1\` for a backtrace.\n`));
    });
};

let setPermittedState = (stub: SinonStubbedInstance<NetworksetupProxy>) => {
    stub.hasGrant.resolves(true);
    stub.grant.resolves(grantSuccessResult);
    stub.setwebproxy.callsFake(setProxyState("On")).resolves(commandSuccessResult);
    stub.setsecurewebproxy.callsFake(setProxyState("On")).resolves(commandSuccessResult);
    [stub.setwebproxystate, stub.setsecurewebproxystate].forEach((stub) => {
        stub.resolves(commandSuccessResult);
        stub.withArgs(sinon.match.string, "off").callsFake(setProxyState("Off")).resolves(commandSuccessResult);
        stub.withArgs(sinon.match.string, "on").callsFake(setProxyState("On")).resolves(commandSuccessResult);
    });
    stub.setproxybypassdomains.resolves(commandSuccessResult);
    stub.setautoproxyurl.resolves(commandSuccessResult);
    stub.setautoproxystate.resolves(commandSuccessResult);
};

afterEach(async () => {
    sandbox.verifyAndRestore();
});
