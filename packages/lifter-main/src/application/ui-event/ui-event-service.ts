import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ipc,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { UserSettingStorage } from "../../domains/libs/user-setting-storage";
import { AutoResponderService } from "../../domains/proxy/auto-responder/auto-responder-service";
import { CertificateService } from "../../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxySettingService } from "../../domains/settings/proxy-setting/proxy-setting-service";

export class UIEventService {
    constructor(
        private autoResponderService: AutoResponderService,
        private certificateService: CertificateService,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
        private proxySettingService: ProxySettingService,
    ) {}

    subscribe() {
        ipc.subscribe("addAutoResponderEntities", async (event: any, paths: string[]): Promise<
            AutoResponderEntityJSON[]
        > => {
            return this.autoResponderService.store(paths);
        });

        ipc.subscribe("fetchAutoResponderEntities", async (): Promise<AutoResponderEntityJSON[]> => {
            return this.autoResponderService.fetchAllJSONs();
        });

        ipc.subscribe("deleteAutoResponderEntities", async (event: any, ids: number[]): Promise<void> => {
            return this.autoResponderService.delete(ids);
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
