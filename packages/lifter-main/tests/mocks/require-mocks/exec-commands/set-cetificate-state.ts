import { CertificateStatus } from "@lifter/lifter-common";
import * as sinon from "sinon";
import { CERTIFICATE_NAME } from "../../../../src/settings";
import { MockStateEvent } from "../../mock-state-event";
import { ExecCommandsStub } from "./exec-commands";

export type MockCertificateStatus = CertificateStatus | "initialize";

export function setCetificateState(newState: MockCertificateStatus) {
    if (newState === "missing") {
        return setMissingState;
    }
    if (newState === "installed") {
        return setInstalledState;
    }
    if (newState === "initialize") {
        return setInitializedState;
    }
    console.error(`Invalid certificate state "${newState}".`);
}

let setMissingState = (stub: ExecCommandsStub) => {
    stub.findCertificate.rejects(
        new Error(`\nsecurity: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.\n`),
    );

    stub.deleteCertificate.rejects(new Error(`\nUnable to delete certificate matching "${CERTIFICATE_NAME}"\n`));

    stub.importCert.callsFake(() => {
        MockStateEvent.emit("updateCertificateState", "installed");
        return Promise.resolve(`\n1 certificate imported.\n`);
    });

    stub.addTrustedCert.rejects(new Error(`\nError reading file /missing\n`));
};

let setInstalledState = (stub: ExecCommandsStub) => {
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
        MockStateEvent.emit("updateCertificateState", "missing");
        return Promise.resolve(``);
    });

    stub.importCert.rejects(
        new Error(`\nsecurity: SecKeychainItemImport: The specified item already exists in the keychain.\n`),
    );

    stub.addTrustedCert.resolves(``);
};

let setInitializedState = (stub: ExecCommandsStub) => {
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

    setMissingState(stub);
};
