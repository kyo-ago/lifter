import {ProxySettingRepository} from "../../domain/proxy-setting/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";
import {eventEmitter} from "../../libs/event-emitter";
import {ipcRendererHandler} from "../../libs/ipc-renderer-handler";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    private proxySettingRepository = new ProxySettingRepository();

    bind(
        updater: () => void,
    ) {
        eventEmitter.addListener("clickProxySettingStatus", () => {
            this.getNewStatus().then((status: ProxySettingStatus) => {
                ipcRendererHandler.send("clickProxySettingStatus", status);
                updater();
            });
        });
        ipcRendererHandler.on("clickProxySettingStatus", () => {
            eventEmitter.emit("clickProxySettingStatus");
        });
    }

    getCurrentStatus() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getCurrentStatus();
        });
    }

    private getNewStatus() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getNewStatus();
        });
    }

}