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
                    v-model="certificateStatus"
                    @change="changeCertificateStatus"
                ></el-switch>
                <span>
                    {{
                        certificateStatus
                            ? $t("CurrentLifterProxyCertificationIsInstalled")
                            : $t("CurrentLifterProxyCertificationIsMissing")
                    }}
                </span>
                <textarea @focus="$event.target.select()" wrap="off" readonly>{{certificateCommands}}</textarea>
            </div>
            <div>
                <el-switch
                    v-model="proxyCommandGrantStatus"
                    @change="changeProxyCommandGrantStatus"
                ></el-switch>
                <span>
                    {{
                        proxyCommandGrantStatus
                            ? $t("NetworkProxyCommandIsGranted")
                            : $t("NetworkProxyCommandIsNotGranted")
                    }}
                </span>
                <textarea @focus="$event.target.select()" wrap="off" readonly>{{proxyCommandGrantCommands}}</textarea>
            </div>
            <div>
                <el-switch
                    v-model="autoEnableProxySetting"
                    @change="changeAutoEnableProxySetting"
                ></el-switch>
                {{
                    autoEnableProxySetting
                        ? $t("EnableProxyOnStartup")
                        : $t("DisableProxyOnStartup")
                }}
            </div>
            <div>
                <el-switch
                    v-model="pacFileProxySetting"
                    @change="changePacFileProxySetting"
                ></el-switch>
                {{
                    pacFileProxySetting
                        ? $t("EnableProxyViaPac")
                        : $t("DisableProxyViaPac")
                }}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: "setting-dialog",
    computed: {
        certificateStatus() {
            return this.$store.getters["proxySettings/certificateInstalled"];
        },
        certificateCommands() {
            return this.$store.getters["proxySettings/certificateCommand"];
        },
        proxyCommandGrantStatus() {
            return this.$store.getters["proxySettings/proxyCommandIsGranted"];
        },
        proxyCommandGrantCommands() {
            return this.$store.getters[
                "proxySettings/proxyCommandGrantCommand"
            ];
        },
        autoEnableProxySetting() {
            return this.$store.getters["proxySettings/autoEnableProxySetting"];
        },
        pacFileProxySetting() {
            return this.$store.getters["proxySettings/pacFileProxySetting"];
        },
        isShowing() {
            return this.$store.state.settingDialog.isShowing;
        },
    },
    methods: {
        hideSettingDialog() {
            this.$store.commit("settingDialog/hide");
        },
        async changeCertificateStatus() {
            await this.$store.dispatch("proxySettings/changeCertificateStatus");
        },
        async changeProxyCommandGrantStatus() {
            await this.$store.dispatch(
                "proxySettings/changeProxyCommandGrantStatus",
            );
        },
        async changeAutoEnableProxySetting() {
            await this.$store.dispatch(
                "proxySettings/changeAutoEnableProxySetting",
            );
        },
        async changePacFileProxySetting() {
            await this.$store.dispatch(
                "proxySettings/changePacFileProxySetting",
            );
        },
    },
};
</script>

<style scoped lang="scss">
textarea {
    width: 100%;
    border: none;
    resize: none;
    background-color: lightgrey;
    margin: 5px;
}
</style>
