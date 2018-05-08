import {
    CertificateStatus,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";
import {
    addRewriteRuleModifierParam,
    deleteRewriteRuleModifierParam,
    ipc,
} from "../lib/ipc";

export function ApplicationSubscriber(application: Application) {
    ipc.subscribe("addAutoResponderEntities", (_, paths: string[]) => {
        return application.getAutoResponder().add(paths);
    });

    ipc.subscribe("fetchAutoResponderEntities", () => {
        return application.getAutoResponder().fetchAll();
    });

    ipc.subscribe("deleteAutoResponderEntities", (_, ids: number[]) => {
        return application.getAutoResponder().deletes(ids);
    });

    application.getClientRequestService().subscribe(clientRequestEntityJSON => {
        return ipc.publish("addClientRequestEntity", clientRequestEntityJSON);
    });

    ipc.subscribe("changeCertificateStatus", async () => {
        let status = await application
            .getCertificateService()
            .changeCertificateStatus();
        let command = await application
            .getCertificateService()
            .fetchCurrentCommands();
        return { status, command };
    });
    application
        .getCertificateService()
        .onChangeCertificateStatus(
            async (certificateStatus: CertificateStatus) => {
                let command = await application
                    .getCertificateService()
                    .fetchCurrentCommands();
                return await ipc.publish("onChangeCertificateStatus", {
                    status: certificateStatus,
                    command: command,
                });
            },
        );

    ipc.subscribe("changeProxySettingStatus", () => {
        return application.getProxySettingService().change();
    });
    application
        .getProxySettingService()
        .onChange((proxySettingStatus: ProxySettingStatus) => {
            return ipc.publish(
                "onChangeProxySettingService",
                proxySettingStatus,
            );
        });

    ipc.subscribe("changeProxyCommandGrantStatus", async () => {
        let status = await application
            .getProxyCommandGrantService()
            .changeStatus();
        let command = await application
            .getProxyCommandGrantService()
            .fetchCommands();
        return { status, command };
    });
    application
        .getProxyCommandGrantService()
        .onChange(async (proxyCommandGrantStatus: ProxyCommandGrantStatus) => {
            let command = await application
                .getProxyCommandGrantService()
                .fetchCommands();
            return await ipc.publish("onChangeProxyCommandGrantStatus", {
                status: proxyCommandGrantStatus,
                command: command,
            });
        });

    ipc.subscribe("changeNoAutoEnableProxySetting", () => {
        return application.getUserSetting().changeNoAutoEnableProxy();
    });

    ipc.subscribe("changeNoPacFileProxySetting", () => {
        return application.getUserSetting().changeNoPacFileProxy();
    });

    ipc.subscribe("getRewriteRules", () => {
        return application.getRewriteRules().fetchAll();
    });

    ipc.subscribe("addRewriteRule", (_, url: string) => {
        return application.getRewriteRules().addRule(url);
    });

    ipc.subscribe("changeRewriteRule", (_, rule: RewriteRuleEntityJSON) => {
        return application.getRewriteRules().changeRule(rule);
    });

    ipc.subscribe("deleteRewriteRules", (_, ids: number[]) => {
        return application.getRewriteRules().deleteRules(ids);
    });

    ipc.subscribe(
        "addRewriteRuleModifier",
        (_, { action, entityId, param }: addRewriteRuleModifierParam) => {
            return application
                .getRewriteRules()
                .addModifier(action, entityId, param);
        },
    );

    ipc.subscribe(
        "deleteRewriteRuleModifiers",
        (
            _,
            { action, entityId, modifiers }: deleteRewriteRuleModifierParam,
        ) => {
            return application
                .getRewriteRules()
                .deleteModifiers(action, entityId, modifiers);
        },
    );
}
