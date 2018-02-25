<template>
    <el-container>
        <el-header>
            <li-header />
        </el-header>
        <el-main>
            <li-main />
            <li-dialog />
        </el-main>
    </el-container>
</template>

<script lang="ts">
    import LiDialog from "./li-dialog/li-dialog.vue";
    import LiHeader from "./li-header/li-header.vue";
    import LiMain from "./li-main/li-main.vue";

    export default {
        name: "App",
        components: {
            LiHeader,
            LiMain,
            LiDialog,
        },
    };
</script>

<style scoped lang="scss">
    .el-header {
        padding: 0;
    }

    .el-main {
        padding: 0;
    }
</style>
