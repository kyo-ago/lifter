<template>
    <div class="toolbar">
        <divider />
        <el-dropdown
            trigger="click"
            size="small"
            v-bind:show-timeout="0"
            v-bind:hide-timeout="0"
            @command="showSettingModalPage"
        >
            <span class="icon">&#xFE19;</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="settings">Settings...</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
    import Divider from "./divider.vue";
    export default {
        name: "right-toolbar",
        methods: {
            showSettingModalPage(command: string) {
                if (command === "settings") {
                    this.$store.commit('showSettingModalPage');
                }
            }
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

    .icon {
        display: inline-flex;
        width: 28px;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        cursor: default;
        height: 100%;
    }
</style>
