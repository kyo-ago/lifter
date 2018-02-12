import { CertificateStatus, ProxySettingStatus } from "@lifter/lifter-common";
import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import { SinonStubbedInstance } from "sinon";
import * as ExecCommands from "../../../src/libs/exec-commands";
import { CERTIFICATE_NAME, NETWORK_HOST_NAME, PROXY_PORT } from "../../../src/settings";
import { NetworkMockStateEvent } from "../network-mock-state-event";

export const MockNetworksetupResult = `\nAn asterisk (*) denotes that a network service is disabled.
(1) iPhone USB
(Hardware Port: iPhone USB, Device: en2)

(2) Wi Fi
(Hardware Port: Wi-Fi, Device: en0)

(3) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en1)\n\n`;

export const getMockWebproxyState = (param = {}) => {
    let command = {
        Enabled: "Yes",
        Server: NETWORK_HOST_NAME,
        Port: PROXY_PORT,
        ...param,
    };
    return `\nEnabled: ${command.Enabled}
Server: ${command.Server}
Port: ${command.Port}
Authenticated Proxy Enabled: 0\n`
};

let sandbox = sinon.createSandbox();
let stub = sandbox.stub(ExecCommands);
stub.getListnetworkserviceorder.resolves(MockNetworksetupResult);
stub.getProxyByPassDomains.resolves(`\n*.local\n169.254/16\n`);

NetworkMockStateEvent.on("updateCertificateState", (newState: CertificateStatus) => {
    if (newState === "missing") {
        setMissingCetificateState(stub);
    }
    if (newState === "installed") {
        setInstalledCetificateState(stub);
    }
    setInvalidCall(stub);
});

NetworkMockStateEvent.on("updateProxyingState", (newState: ProxySettingStatus) => {
    if (newState === "Unknown") {
        setNoWebProxyState(stub);
    }
    if (newState === "On") {
        setWebProxyingState(stub);
    }
    if (newState === "Off") {
        setNoWebProxyState(stub);
    }
    setInvalidCall(stub);
});

mockRequire("../../src/libs/exec-commands", stub);

let setNoWebProxyState = (stub: SinonStubbedInstance<typeof ExecCommands>) => {
    let command = { Enabled: 'No' };
    stub.getWebproxy.resolves(getMockWebproxyState(command));
    stub.getSecureWebproxy.resolves(getMockWebproxyState(command));
};

let setWebProxyingState = (stub: SinonStubbedInstance<typeof ExecCommands>) => {
    stub.getWebproxy.resolves(getMockWebproxyState());
    stub.getSecureWebproxy.resolves(getMockWebproxyState());
};

let setMissingCetificateState = (stub: SinonStubbedInstance<typeof ExecCommands>) => {
    stub.findCertificate.rejects(new Error(`\nsecurity: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.\n`));

    stub.deleteCertificate.rejects(new Error(`\nUnable to delete certificate matching "${CERTIFICATE_NAME}"\n`));

    stub.importCert.callsFake(() => {
        NetworkMockStateEvent.emit("updateCertificateState", "installed");
    }).resolves(`\n1 certificate imported.\n`);

    stub.addTrustedCert.rejects(new Error(`\nError reading file /missing\n`));
};

let setInstalledCetificateState = (stub: SinonStubbedInstance<typeof ExecCommands>) => {
    stub.findCertificate.resolves(`\nkeychain: "/Users/hoge/Library/Keychains/login.keychain-db"
version: 512
class: 0x80001000 
attributes:
    "alis"<blob>="${CERTIFICATE_NAME}"
    "cenc"<uint32>=0x00000003 
    "ctyp"<uint32>=0x00000001 
    "hpky"<blob>=0xA51A5B6C1149CCDCDF5DAB8B863686903B1B406B  "\\245\\032[l\\021I\\314\\334\\337]\\253\\213\\2066\\206\\220;\\033@k"
    "issu"<blob>=0x307D311830160603550403130F4E4F44454D49544D50524F585943413111300F06035504061308494E5445524E45543111300F06035504081308494E5445524E45543111300F06035504071308494E5445524E4554311B3019060355040A13124E4F4445204D49544D2050524F5859204341310B3009060355040B13024341  "0}1\\0300\\026\\006\\003U\\004\\003\\023\\017NODEMITMPROXYCA1\\0210\\017\\006\\003U\\004\\006\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\010\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\007\\023\\010INTERNET1\\0330\\031\\006\\003U\\004\\012\\023\\022NODE MITM PROXY CA1\\0130\\011\\006\\003U\\004\\013\\023\\002CA"
    "labl"<blob>="NodeMITMProxyCA"
    "skid"<blob>=0xA51A5B6C1149CCDCDF5DAB8B863686903B1B406B  "\\245\\032[l\\021I\\314\\334\\337]\\253\\213\\2066\\206\\220;\\033@k"
    "snbr"<blob>=0x9420F68CE4E7BF4D87A1D38DE1720176  "\\224 \\366\\214\\344\\347\\277M\\207\\241\\323\\215\\341r\\001v"
    "subj"<blob>=0x307D311830160603550403130F4E4F44454D49544D50524F585943413111300F06035504061308494E5445524E45543111300F06035504081308494E5445524E45543111300F06035504071308494E5445524E4554311B3019060355040A13124E4F4445204D49544D2050524F5859204341310B3009060355040B13024341  "0}1\\0300\\026\\006\\003U\\004\\003\\023\\017NODEMITMPROXYCA1\\0210\\017\\006\\003U\\004\\006\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\010\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\007\\023\\010INTERNET1\\0330\\031\\006\\003U\\004\\012\\023\\022NODE MITM PROXY CA1\\0130\\011\\006\\003U\\004\\013\\023\\002CA"\n`);

    stub.deleteCertificate.callsFake(() => {
        NetworkMockStateEvent.emit("updateCertificateState", "missing");
    }).resolves(``);

    stub.importCert.rejects(new Error(`\nsecurity: SecKeychainItemImport: The specified item already exists in the keychain.\n`));

    stub.addTrustedCert.resolves(``);
};

let setInvalidCall = (stub: SinonStubbedInstance<typeof ExecCommands>) => {
    [
        [`/invalid`, `security: SecKeychainItemImport: Unknown format in import.`],
        [`/dir`, `readFile: short read\nsecurity: Error reading infile /dir: Is a directory`],
        [`/unknown`, `security: Error reading infile /unknown: No such file or directory`],
        [`/ca.key`, `1 key imported.`],
    ].forEach((match, resolve) => {
        stub.importCert.withArgs(sinon.match(match)).rejects(new Error(`\n${resolve}\n`));
    });

    [
        [`/userAuthenticationCancel`, `SecTrustSettingsSetTrustSettings: The authorization was cancelled by the user.`],
        [`/unknown`, `Error reading file /missing`],
    ].forEach((match, resolve) => {
        stub.addTrustedCert.withArgs(sinon.match(match)).rejects(new Error(`\n${resolve}\n`));
    });
};

afterEach(async () => {
    sandbox.verifyAndRestore();
});
