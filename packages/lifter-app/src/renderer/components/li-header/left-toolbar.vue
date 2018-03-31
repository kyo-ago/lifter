<template>
    <div class="toolbar">
        <el-button
            icon="el-icon-view"
            size="mini"
            :type="buttonType"
            @click="changeProxySettingStatus"
            :data-test-type="buttonType"
            data-test="changeProxySettingStatus"
        />
        <divider />
    </div>
</template>

<script lang="ts">
    import { VueComponent } from "../index";
    import Divider from "./divider.vue";

    export default {
        name: "left-toolbar",
        computed: {
            buttonType() {
                if (this.$store.state.proxySettings.proxySettingStatus === "On") {
                    return "primary";
                }
                if (this.$store.state.proxySettings.proxySettingStatus === "Off") {
                    return "info";
                }
                console.error(`invalid proxySettingStatus "${this.$store.state.proxySettings.proxySettingStatus}"`);
                return "";
            },
        },
        methods: {
            changeProxySettingStatus() {
                this.$store.dispatch('proxySettings/changeProxySettingStatus');
            },
        },
        components: {
            Divider,
        },
    } as VueComponent;
</script>

<style scoped lang="scss">
    .toolbar {
        display: flex;
        align-self: flex-end;
    }

    .el-button--mini {
        padding: 7px 8px;
        border: none;
    }
</style>
