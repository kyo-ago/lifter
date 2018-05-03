import { Application } from "@lifter/lifter-main";
import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { addRewriteRuleModifierParam, deleteRewriteRuleModifierParam, ipc } from "../lib/ipc";

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

    application
        .getClientRequestService()
        .subscribe(clientRequestEntityJSON => {
            return ipc.publish(
                "addClientRequestEntity",
                clientRequestEntityJSON,
            );
        });

    ipc.subscribe("changeCertificateStatus", () => {
        return application
            .getCertificateService()
            .changeCertificateStatus();
    });

    ipc.subscribe("changeProxySettingStatus", () => {
        return application.getProxySettingService().change();
    });

    ipc.subscribe("changeProxyCommandGrantStatus", () => {
        return application
            .getProxyCommandGrantService()
            .changeStatus();
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
