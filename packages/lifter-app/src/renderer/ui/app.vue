<template>
    <el-container>
        <el-header
            height="26px"
        >
            <li-header />
        </el-header>
        <el-main>
            <setting-dialog />
        </el-main>
    </el-container>
</template>

<script lang="ts">
    import LiHeader from "./header/header.vue";
    import SettingDialog from "./dialog/setting-dialog.vue";
    export default {
        name: "App",
        components: {
            LiHeader,
            SettingDialog,
        },
    };
</script>

<style scoped lang="scss">
    .el-header {
        padding: 0;
    }
</style>
