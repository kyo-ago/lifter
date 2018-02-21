import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ipc,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { UserSettingStorage } from "../../domains/libs/user-setting-storage";
import { AutoResponderEntryIdentity } from "../../domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import { AutoResponderEntryFactory } from "../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import { AutoResponderEntryRepository } from "../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import { CertificateService } from "../../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxySettingService } from "../../domains/settings/proxy-setting/proxy-setting-service";

export class UIEventService {
    constructor(
        private autoResponderEntryFactory: AutoResponderEntryFactory,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private certificateService: CertificateService,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
        private proxySettingService: ProxySettingService,
    ) {}

    subscribe() {
        ipc.subscribe("addAutoResponderEntryEntities", async (event: any, filePaths: string[]): Promise<
            AutoResponderEntryEntityJSON[]
        > => {
            let filePromises = filePaths.map(path =>
                this.autoResponderEntryFactory.createFromPath(path),
            );
            let autoResponderEntryEntities = await Promise.all(filePromises);
            await this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities.map(autoResponderEntryEntity => autoResponderEntryEntity.json);
        });

        ipc.subscribe("fetchAutoResponderEntryEntities", async (): Promise<AutoResponderEntryEntityJSON[]> => {
            let autoResponderEntryEntities = await this.autoResponderEntryRepository.resolveAll();
            return autoResponderEntryEntities.map(autoResponderEntryEntity => autoResponderEntryEntity.json);
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

        ipc.subscribe("deleteAutoResponderEntryEntities", async (event: any, ids: number[]) => {
            await Promise.all(
                ids
                    .map(id => new AutoResponderEntryIdentity(id))
                    .map(autoResponderEntryIdentity =>
                        this.autoResponderEntryRepository.deleteByIdentity(
                            autoResponderEntryIdentity,
                        ),
                    ),
            );
            return;
        });
    }
}
