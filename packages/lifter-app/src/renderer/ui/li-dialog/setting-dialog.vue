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
                Current lifter proxy certification is {{certificateState}}
            </div>
            <div>
                <el-switch
                    v-model="currentNetworkProxyCommandGranted"
                    @change="changeNetworkProxyCommandGranted"
                ></el-switch>
                Network proxy command grant is {{isNetworkProxyCommandGranted}}
            </div>
            <div>
                <el-switch
                    v-model="currentNoAutoEnableProxySetting"
                    @change="changeNoAutoEnableProxySetting"
                ></el-switch>
                Current auto enable proxy setting is {{!noAutoEnableProxySetting}}
            </div>
            <div>
                <el-switch
                    v-model="currentNoPacFileProxySetting"
                    @change="changeNoPacFileProxySetting"
                ></el-switch>
                Current pac file proxy setting is {{!noPacFileProxySetting}}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import {mapMutations, mapState} from 'vuex';
    import {VueComponent} from "../index";

    export default {
        name: "setting-dialog",
        data() {
            return {
                currentCertificateState: this.$store.state.certificateState === "installed",
                currentNetworkProxyCommandGranted: this.$store.state.isNetworkProxyCommandGranted,
                currentNoAutoEnableProxySetting: !this.$store.state.noAutoEnableProxySetting,
                currentNoPacFileProxySetting: !this.$store.state.noPacFileProxySetting,
            };
        },
        computed: {
            isNetworkProxyCommandGranted () {
                return this.$store.state.isNetworkProxyCommandGranted;
            },
            noPacFileProxySetting () {
                return this.$store.state.noPacFileProxySetting;
            },
            ...mapState([
                'viewSettingModalPageState',
                'certificateState',
                'noAutoEnableProxySetting',
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
            async changeNetworkProxyCommandGranted() {
                await this.$store.dispatch('changeNetworkProxyCommandGranted');
                this.$data.currentNetworkProxyCommandGranted = this.$store.state.isNetworkProxyCommandGranted;
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
