"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function findCertificate(certificateName) {
    return {
        "missing certificate": () => {
            throw new Error(
                "security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.\n"
            );
        },
        "": () => `keychain: "/Users/hoge/Library/Keychains/login.keychain-db"
version: 512
class: 0x80001000 
attributes:
    "alis"<blob>="NodeMITMProxyCA"
    "cenc"<uint32>=0x00000003 
    "ctyp"<uint32>=0x00000001 
    "hpky"<blob>=0xA51A5B6C1149CCDCDF5DAB8B863686903B1B406B  "\\245\\032[l\\021I\\314\\334\\337]\\253\\213\\2066\\206\\220;\\033@k"
    "issu"<blob>=0x307D311830160603550403130F4E4F44454D49544D50524F585943413111300F06035504061308494E5445524E45543111300F06035504081308494E5445524E45543111300F06035504071308494E5445524E4554311B3019060355040A13124E4F4445204D49544D2050524F5859204341310B3009060355040B13024341  "0}1\\0300\\026\\006\\003U\\004\\003\\023\\017NODEMITMPROXYCA1\\0210\\017\\006\\003U\\004\\006\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\010\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\007\\023\\010INTERNET1\\0330\\031\\006\\003U\\004\\012\\023\\022NODE MITM PROXY CA1\\0130\\011\\006\\003U\\004\\013\\023\\002CA"
    "labl"<blob>="NodeMITMProxyCA"
    "skid"<blob>=0xA51A5B6C1149CCDCDF5DAB8B863686903B1B406B  "\\245\\032[l\\021I\\314\\334\\337]\\253\\213\\2066\\206\\220;\\033@k"
    "snbr"<blob>=0x9420F68CE4E7BF4D87A1D38DE1720176  "\\224 \\366\\214\\344\\347\\277M\\207\\241\\323\\215\\341r\\001v"
    "subj"<blob>=0x307D311830160603550403130F4E4F44454D49544D50524F585943413111300F06035504061308494E5445524E45543111300F06035504081308494E5445524E45543111300F06035504071308494E5445524E4554311B3019060355040A13124E4F4445204D49544D2050524F5859204341310B3009060355040B13024341  "0}1\\0300\\026\\006\\003U\\004\\003\\023\\017NODEMITMPROXYCA1\\0210\\017\\006\\003U\\004\\006\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\010\\023\\010INTERNET1\\0210\\017\\006\\003U\\004\\007\\023\\010INTERNET1\\0330\\031\\006\\003U\\004\\012\\023\\022NODE MITM PROXY CA1\\0130\\011\\006\\003U\\004\\013\\023\\002CA"
`
    }[findCertificate.current || ""]();
}
exports.findCertificate = findCertificate;
function deleteCertificate(certificateName) {
    return {
        "missing certificate": () => {
            throw new Error('Unable to delete certificate matching "NodeMITMProxyCA"\n');
        },
        "": () => ""
    }[deleteCertificate.current || ""]();
}
exports.deleteCertificate = deleteCertificate;
function importCert(certificatePath) {
    return {
        "invalid file": () => {
            throw new Error("security: SecKeychainItemImport: Unknown format in import.\n");
        },
        directory: () => {
            throw new Error("readFile: short read\nsecurity: Error reading infile /dir: Is a directory\n");
        },
        "no such file or directory": () => {
            throw new Error("security: Error reading infile /unknown: No such file or directory\n");
        },
        "already exists": () => {
            throw new Error("security: SecKeychainItemImport: The specified item already exists in the keychain.\n");
        },
        "import .key file": () => "1 key imported.\n",
        "": () => "1 certificate imported.\n"
    }[importCert.current || ""]();
}
exports.importCert = importCert;
function addTrustedCert(certificatePath) {
    return {
        "cancel authentication": () => {
            throw new Error("SecTrustSettingsSetTrustSettings: The authorization was cancelled by the user.\n");
        },
        "no such file or directory": () => {
            throw new Error("Error reading file /missing");
        },
        "": () => ""
    }[addTrustedCert.current || ""]();
}
exports.addTrustedCert = addTrustedCert;
