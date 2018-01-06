<template>
    <div class="toolbar">
        <el-button
            icon="el-icon-view"
            size="mini"
            v-bind:type="buttonType"
            @click="changeProxyState"
        />
        <divider />
    </div>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import Divider from "./divider.vue";
    export default {
        name: "left-toolbar",
        computed: {
            buttonType() {
                if (this.$store.state.proxyState === "NoPermission") {
                    return "info";
                }
                if (this.$store.state.proxyState === "On") {
                    return "danger";
                }
                if (this.$store.state.proxyState === "Off") {
                    return "primary";
                }
                return "";
            },
        },
        methods: {
            ...mapActions([
                'changeProxyState',
            ]),
        },
        components: {
            Divider,
        },
    };
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
