import * as windowManager from "@kyo-ago/electron-window-manager";
import {app} from "electron";
import {ProxySettingFactory} from "./contexts/settings/proxy-setting/lifecycle/proxy-setting-factory";
import {ProxySettingRepository} from "./contexts/settings/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingDeviceFactory} from "./contexts/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-factory";
import {ProxySettingDeviceRepository} from "./contexts/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-repository";
import {APPLICATION_NAME, WindowManagerInit} from "./settings";

windowManager.init(WindowManagerInit);

let createWindow = () => {
    windowManager.open('mainWindow', APPLICATION_NAME, '/index.html', 'default', {
        file: 'main-window-state.json',
    });
};

app.on('ready', createWindow);
app.on('window-all-closed', async () => {
    let proxySettingRepository = new ProxySettingRepository(
        new ProxySettingFactory(),
        new ProxySettingDeviceRepository(new ProxySettingDeviceFactory()),
    );
    await proxySettingRepository.loadEntities();
    let proxySettingEntity = proxySettingRepository.getProxySetting();
    await proxySettingEntity.clearProxyState();
    app.quit();
});
app.on('activate', () => windowManager.get('mainWindow') || createWindow());
