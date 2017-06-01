import {CertificateRepository} from "./certificate-repository";
import {KeychainRepository} from "./keychain/keychain-repository";
import {KeychainEntity} from "./keychain/keychain-entity";
import {eventEmitter} from "../../libs/event-emitter";
import {ipcRendererHandler} from "../../libs/ipc-renderer-handler";

export type CertificateStatus = "missing" | "installed";

export class CertificateService {
    private certificateRepository: CertificateRepository;
    private keychainRepository = new KeychainRepository();

    constructor(
        userDataPath: string,
    ) {
        this.certificateRepository = new CertificateRepository(userDataPath);
    }

    bind(
        updater: () => void,
    ) {
        eventEmitter.addListener("clickCertificateStatus", () => {
            this.getNewStatus().then((status: CertificateStatus) => {
                ipcRendererHandler.send("clickCertificateStatus", status);
                updater();
            });
        });
        ipcRendererHandler.on("clickCertificateStatus", () => {
            eventEmitter.emit("clickCertificateStatus");
        });
    }

    getCurrentStatus() {
        return new Promise<CertificateStatus>((resolve, reject) => {
            this.hasCertificate().then((result) => {
                resolve(result ? "installed" : "missing");
            });
        });
    }

    private getNewStatus() {
        return new Promise<CertificateStatus>((resolve, reject) => {
            this.hasCertificate().then((result) => {
                if (result) {
                    this.deleteCertificate().then(() => {
                        resolve("missing");
                    });
                } else {
                    this.installCertificate().then(() => {
                        resolve("installed");
                    });
                }
            });
        });
    }

    private hasCertificate() {
        return this.certificateRepository.findCertificate().then((result: string) => !!result);
    }

    private installCertificate() {
        return this.keychainRepository.getKeychain().then((keychainEntity: KeychainEntity) => {
            return this.certificateRepository.registerCertificate(keychainEntity);
        }).then((result: string) => !!result);
    }

    private deleteCertificate() {
        return this.certificateRepository.deleteCertificate().then(() => true);
    }
}