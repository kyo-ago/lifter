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
            <el-switch
                v-model="currentCertificateState"
                @change="changeCertificateState"
            ></el-switch>
            Current lifter proxy certification is {{certificateState}}
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: "setting-dialog",
        data() {
            return {
                currentCertificateState: this.$store.state.certificateState === "installed",
            };
        },
        computed: {
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
        },
    };
</script>

<style scoped lang="scss">
</style>
