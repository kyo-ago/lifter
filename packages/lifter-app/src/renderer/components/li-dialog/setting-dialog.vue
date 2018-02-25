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
        :visible="viewSettingModalPageState"
        v-bind:fullscreen="true"
        v-bind:modal="false"
        width="95%"
        @close="hideSettingModalPage"
    >
        <div>
            <div>
                <el-switch
                    v-model="currentCertificateState"
                    @change="changeCertificateState"
                ></el-switch>
                {{
                    currentCertificateState
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
    import { mapMutations, mapState } from 'vuex';
    import { VueComponent } from "../index";

    export default {
        name: "setting-dialog",
        data() {
            return {
                currentCertificateState: this.$store.state.certificateState === "installed",
                currentProxyCommandGrantStatus: this.$store.state.proxyCommandGrantStatus === "On",
                currentNoAutoEnableProxySetting: !this.$store.state.noAutoEnableProxySetting,
                currentNoPacFileProxySetting: !this.$store.state.noPacFileProxySetting,
            };
        },
        computed: {
            ...mapState([
                'viewSettingModalPageState',
                'certificateState',
                'proxyCommandGrantStatus',
                'noAutoEnableProxySetting',
                'noPacFileProxySetting',
            ]),
        },
        methods: {
            ...mapMutations([
                'hideSettingModalPage',
            ]),
            async changeCertificateState() {
                await this.$store.dispatch('changeCertificateState');
                this.$data.currentCertificateState = this.$store.state.certificateState === "installed";
            },
            async changeProxyCommandGrantStatus() {
                await this.$store.dispatch('changeProxyCommandGrantStatus');
                this.$data.currentProxyCommandGrantStatus = this.$store.state.proxyCommandGrantStatus === "On";
            },
            async changeNoAutoEnableProxySetting() {
                await this.$store.dispatch('changeNoAutoEnableProxySetting');
                this.$data.currentNoAutoEnableProxySetting = !this.$store.state.noAutoEnableProxySetting;
            },
            async changeNoPacFileProxySetting() {
                await this.$store.dispatch('changeNoPacFileProxySetting');
                this.$data.currentNoPacFileProxySetting = !this.$store.state.noPacFileProxySetting;
            },
        },
    } as VueComponent;
</script>

<style scoped lang="scss">
</style>
