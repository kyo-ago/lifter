<i18n>
{
    "en-US": {
        "CurrentLifterProxyCertificationIsInstalled": "Lifter proxy ssl certification is installed.",
        "CurrentLifterProxyCertificationIsMissing": "Lifter proxy ssl certification is not installed.",
        "NetworkProxyCommandIsGranted": "Network proxy command is granted.",
        "NetworkProxyCommandIsNotGranted": "Network proxy command is not granted.",
        "EnableProxyOnStartup": "Enable Proxy on startup.",
        "DisableProxyOnStartup": "Disable Proxy on startup.",
        "EnableProxyViaPac": "Enable Proxy via Pac.",
        "DisableProxyViaPac": "Disable Proxy via Pac."
    },
    "ja": {
        "CurrentLifterProxyCertificationIsInstalled": "Lifter proxyのssl証明書がインストール済みです",
        "CurrentLifterProxyCertificationIsMissing": "Lifter proxyのssl証明書がインストールされていません",
        "NetworkProxyCommandIsGranted": "Network proxy commandに権限付与済みです",
        "NetworkProxyCommandIsNotGranted": "Network proxy commandに権限が付与されていません",
        "EnableProxyOnStartup": "起動時にOSのProxy設定をonにします",
        "DisableProxyOnStartup": "起動時にOSのProxy設定を変更しません",
        "EnableProxyViaPac": "PACファイルを使ったProxy制御が有効です",
        "DisableProxyViaPac": "PACファイルを使ったProxy制御を行いません"
    }
}
</i18n>

<template>
    <el-dialog
        title="Settings"
        :visible="isShowing"
        v-bind:fullscreen="true"
        v-bind:modal="false"
        width="95%"
        @close="hideSettingDialog"
    >
        <div>
            <div>
                <el-switch
                    v-model="currentcertificateStatus"
                    @change="changecertificateStatus"
                ></el-switch>
                {{
                    currentcertificateStatus
                        ? $t("CurrentLifterProxyCertificationIsInstalled")
                        : $t("CurrentLifterProxyCertificationIsMissing")
                }}
            </div>
            <div>
                <el-switch
                    v-model="currentProxyCommandGrantStatus"
                    @change="changeProxyCommandGrantStatus"
                ></el-switch>
                {{
                    currentProxyCommandGrantStatus
                        ? $t("NetworkProxyCommandIsGranted")
                        : $t("NetworkProxyCommandIsNotGranted")
                }}
            </div>
            <div>
                <el-switch
                    v-model="currentNoAutoEnableProxySetting"
                    @change="changeNoAutoEnableProxySetting"
                ></el-switch>
                {{
                    currentNoAutoEnableProxySetting
                        ? $t("EnableProxyOnStartup")
                        : $t("DisableProxyOnStartup")
                }}
            </div>
            <div>
                <el-switch
                    v-model="currentNoPacFileProxySetting"
                    @change="changeNoPacFileProxySetting"
                ></el-switch>
                {{
                    currentNoPacFileProxySetting
                        ? $t("EnableProxyViaPac")
                        : $t("DisableProxyViaPac")
                }}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { VueComponent } from "../index";

export default {
    name: "setting-dialog",
    data() {
        return {
            currentcertificateStatus: this.$store.state.proxySettings.certificateState === "installed",
            currentProxyCommandGrantStatus: this.$store.state.proxySettings.proxyCommandGrantStatus === "On",
            currentNoAutoEnableProxySetting: !this.$store.state.proxySettings.noAutoEnableProxySetting,
            currentNoPacFileProxySetting: !this.$store.state.proxySettings.noPacFileProxySetting,
        };
    },
    computed: {
        certificateStatus() {
            return this.$store.state.proxySettings.certificateState;
        },
        proxyCommandGrantStatus() {
            return this.$store.state.proxySettings.proxyCommandGrantStatus;
        },
        noAutoEnableProxySetting() {
            return this.$store.state.proxySettings.noAutoEnableProxySetting;
        },
        noPacFileProxySetting() {
            return this.$store.state.proxySettings.noPacFileProxySetting;
        },
        isShowing() {
            return this.$store.state.settingDialog.isShowing;
        },
    },
    methods: {
        hideSettingDialog() {
            this.$store.commit("settingDialog/hide");
        },
        async changecertificateStatus() {
            await this.$store.dispatch("proxySettings/changeCertificateStatus");
            this.$data.currentcertificateStatus = this.$store.state.proxySettings.certificateState === "installed";
        },
        async changeProxyCommandGrantStatus() {
            await this.$store.dispatch("proxySettings/changeProxyCommandGrantStatus");
            this.$data.currentProxyCommandGrantStatus =
                this.$store.state.proxySettings.proxyCommandGrantStatus === "On";
        },
        async changeNoAutoEnableProxySetting() {
            await this.$store.dispatch("proxySettings/changeNoAutoEnableProxySetting");
            this.$data.currentNoAutoEnableProxySetting = !this.$store.state.proxySettings.noAutoEnableProxySetting;
        },
        async changeNoPacFileProxySetting() {
            await this.$store.dispatch("proxySettings/changeNoPacFileProxySetting");
            this.$data.currentNoPacFileProxySetting = !this.$store.state.proxySettings.noPacFileProxySetting;
        },
    },
} as VueComponent;
</script>

<style scoped lang="scss">
</style>
