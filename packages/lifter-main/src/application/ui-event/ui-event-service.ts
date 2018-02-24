import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ipc,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { UserSettingStorage } from "../../domains/libs/user-setting-storage";
import { AutoResponderIdentity } from "../../domains/proxy/auto-responder/auto-responder-identity";
import { AutoResponderFactory } from "../../domains/proxy/auto-responder/lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "../../domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { CertificateService } from "../../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxySettingService } from "../../domains/settings/proxy-setting/proxy-setting-service";

export class UIEventService {
    constructor(
        private autoResponderFactory: AutoResponderFactory,
        private autoResponderRepository: AutoResponderRepository,
        private certificateService: CertificateService,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
        private proxySettingService: ProxySettingService,
    ) {}

    subscribe() {
        ipc.subscribe("addAutoResponderEntities", async (event: any, filePaths: string[]): Promise<
            AutoResponderEntityJSON[]
        > => {
            let filePromises = filePaths.map(path =>
                this.autoResponderFactory.createFromPath(path),
            );
            let autoResponderEntities = await Promise.all(filePromises);
            await this.autoResponderRepository.storeList(autoResponderEntities);
            return autoResponderEntities.map(autoResponderEntity => autoResponderEntity.json);
        });

        ipc.subscribe("fetchAutoResponderEntities", async (): Promise<AutoResponderEntityJSON[]> => {
            let autoResponderEntities = await this.autoResponderRepository.resolveAll();
            return autoResponderEntities.map(autoResponderEntity => autoResponderEntity.json);
        });

        ipc.subscribe("deleteAutoResponderEntities", async (event: any, ids: number[]): Promise<void> => {
            await Promise.all(
                ids
                    .map(id => new AutoResponderIdentity(id))
                    .map(autoResponderIdentity =>
                        this.autoResponderRepository.deleteByIdentity(
                            autoResponderIdentity,
                        ),
                    ),
            );
            return;
        });

        ipc.subscribe("changeCertificateStatus", (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });

        ipc.subscribe("changeProxyCommandGrantStatus", (): Promise<ProxyCommandGrantStatus> => {
            return this.networksetupProxyService.toggleGrantProxyCommand();
        });

        ipc.subscribe("changeNoAutoEnableProxySetting", (): Promise<boolean> => {
            return this.userSettingStorage.toggle("noAutoEnableProxy");
        });

        ipc.subscribe("changeNoPacFileProxySetting", (): Promise<boolean> => {
            return this.userSettingStorage.toggle("noPacFileProxy");
        });

        ipc.subscribe("changeProxySettingStatus", (): Promise<ProxySettingStatus> => {
            return this.proxySettingService.getNewStatus();
        });
    }
}
