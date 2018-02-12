<template>
    <div class="toolbar">
        <el-button
            icon="el-icon-view"
            size="mini"
            v-bind:type="buttonType"
            @click="changeProxySettingStatus"
        />
        <divider />
    </div>
</template>

<script lang="ts">
    import {mapActions} from 'vuex';
    import {VueComponent} from "../index";
    import Divider from "./divider.vue";

    export default {
        name: "left-toolbar",
        computed: {
            buttonType() {
                if (this.$store.state.proxySettingStatus === "On") {
                    return "primary";
                }
                if (this.$store.state.proxySettingStatus === "Off") {
                    return "info";
                }
                console.error(`invalid proxySettingStatus "${this.$store.state.proxySettingStatus}"`);
            },
        },
        methods: {
            ...mapActions([
                'changeProxySettingStatus',
            ]),
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
