<template>
    <el-dialog
        title="Settings"
        :visible="viewSettingModalPageState"
        v-bind:fullscreen="true"
        width="95%"
        @close="hideSettingModalPage"
    >
        <div>
            <el-switch
                v-model="currentCertificateStatus"
                @change="changeCertificateStatus"
            ></el-switch>
            Current lifter proxy certification is {{certificateStatus}}
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { mapActions, mapMutations, mapState } from 'vuex';
    let getCurrentCertificateStatus = () => {}
    export default {
        name: "setting-dialog",
        data() {
            return {
                currentCertificateStatus: this.$store.state.certificateStatus === "installed",
            };
        },
        computed: {
            ...mapState([
                'viewSettingModalPageState',
                'certificateStatus',
            ]),
        },
        methods: {
            ...mapMutations([
                'hideSettingModalPage',
            ]),
            async changeCertificateStatus(...args) {
                await this.$store.dispatch('changeCertificateStatus');
                this.$data.currentCertificateStatus = this.$store.state.certificateStatus === "installed";
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
