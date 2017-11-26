import * as windowManager from "@kyo-ago/electron-window-manager";
import { ipc } from "../../../../lifter-app/src/libs/ipc";
import { AutoResponderEntryRepository } from "../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import { ClientRequestRepository } from "../../domains/proxy/client-request/lifecycle/client-request-repository";
import { RewriteRuleRepository } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { ProxyBypassDomainService } from "../../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { CertificateService } from "../certificate/certificate-service";
import { ProxySettingService } from "../../domains/settings/proxy-setting/proxy-setting-service";
import { WindowManagerInit } from "../../../../lifter-app/src/settings";
import { RewriteRuleEntityJSON } from "../../domains/proxy/rewrite-rule/rewrite-rule-entity";
import { ProxyBypassDomainEntityJSON } from "../../domains/settings/proxy-bypass-domain/proxy-bypass-domain-entity";
import { RewriteRuleFactory } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { ProxyBypassDomainFactory } from "../../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";

export class WindowManagerService {
    constructor(
        private autoResponderEntryRepository: AutoResponderEntryRepository,
        private clientRequestRepository: ClientRequestRepository,
        private rewriteRuleRepository: RewriteRuleRepository,
        private proxyBypassDomainService: ProxyBypassDomainService,
        private certificateService: CertificateService,
        private proxySettingService: ProxySettingService
    ) {}

    async load() {
        windowManager.init(WindowManagerInit);

        windowManager.bridge.on("overwriteRewriteRules", async (allJsons: RewriteRuleEntityJSON[]) => {
            let entities = allJsons.map(json => RewriteRuleFactory.fromJSON(json));
            await this.rewriteRuleRepository.overwriteAll(entities);
        });
        windowManager.bridge.on("overwriteProxyBypassDomains", async (allJsons: ProxyBypassDomainEntityJSON[]) => {
            let entities = allJsons.map(json => ProxyBypassDomainFactory.fromJSON(json));
            await this.proxyBypassDomainService.overwriteAll(entities);
        });
    }

    async createMainWindow() {
        let name = "mainWindow";
        if (windowManager.get(name)) {
            return;
        }

        const isDevelopment = process.env.NODE_ENV !== "production";
        const url = isDevelopment
            ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
            : `file://${__dirname}/index.html`;

        let autoResponderEntries = await this.autoResponderEntryRepository.resolveAll();
        let clientRequestEntries = this.clientRequestRepository.resolveAll();
        let certificateState = await this.certificateService.getCurrentStatus();
        let proxySettingStatus = await this.proxySettingService.getCurrentStatus();
        windowManager.sharedData.set("mainApps", {
            autoResponderEntries: autoResponderEntries.map((entity: AbstractAutoResponderEntryEntity) => entity.json),
            clientRequestEntries: clientRequestEntries.map((entity: ClientRequestEntity) => entity.json),
            certificateState: certificateState,
            proxySettingStatus: proxySettingStatus
        });
        windowManager.open(name, APPLICATION_NAME, url, "default", {
            file: `${WINDOW_STATE_DIR}main-window-state.json`
        });
        if (isDevelopment) {
            windowManager
                .get(name)
                .content()
                .openDevTools();
        }
        this.registerWindow(name);
    }

    async openProxyBypassDomainSettingWindow() {
        let allEntities = await this.proxyBypassDomainService.resolveAll();
        let allJsons = allEntities.map((entity: ProxyBypassDomainEntity) => entity.json);

        windowManager.sharedData.set("mainProxyBypassDomains", allJsons);
        let name = "proxyBypassDomainSettingWindow";
        windowManager.open(name, "Proxy bypass domain setting", "/proxy-bypass-domain-setting-window.html", "default", {
            file: `${WINDOW_STATE_DIR}proxy-bypass-domain-setting-window-state.json`,
            parent: windowManager.get("mainWindow")
        });
        this.registerWindow(name);
    }

    async openRewriteRuleSettingWindow() {
        let allEntities = await this.rewriteRuleRepository.resolveAll();
        let allJsons = allEntities.map((entity: RewriteRuleEntity) => entity.json);

        windowManager.sharedData.set("mainRewriteRules", allJsons);
        let name = "rewriteRuleSettingWindow";
        windowManager.open(name, "Rewrite rule setting", "/rewrite-rule-setting-window.html", "default", {
            file: `${WINDOW_STATE_DIR}rewrite-rule-setting-window-state.json`,
            parent: windowManager.get("mainWindow")
        });
        this.registerWindow(name);
    }

    private registerWindow(name: string) {
        let window = windowManager.get(name);
        ipc.addWindow(window.object);
        window.object.on("closed", () => ipc.removeWindow(window));
    }
}
