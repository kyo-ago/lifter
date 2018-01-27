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
                    v-model="currentNoAutoGrantRequestSetting"
                    @change="changeNoAutoGrantRequestSetting"
                ></el-switch>
                Current auto grant request setting is {{!noAutoGrantRequestSetting}}
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
                currentNoAutoGrantRequestSetting: !this.$store.state.noAutoGrantRequestSetting,
                currentNoAutoEnableProxySetting: !this.$store.state.noAutoEnableProxySetting,
                currentNoPacFileProxySetting: !this.$store.state.noPacFileProxySetting,
            };
        },
        computed: {
            ...mapState({
                noAutoGrantRequestSetting: state => state.noAutoGrantRequestSetting,
                noAutoEnableProxySetting: state => state.noAutoEnableProxySetting,
                noPacFileProxySetting: state => state.noPacFileProxySetting,
            }),
            ...mapState([
                'viewSettingModalPageState',
                'certificateState',
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
            async changeNoAutoGrantRequestSetting() {
                await this.$store.dispatch('changeNoAutoGrantRequestSetting');
                this.$data.currentNoAutoGrantRequestSetting = !this.$store.state.noAutoGrantRequestSetting;
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
