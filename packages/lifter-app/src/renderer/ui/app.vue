<template>
    <el-container>
        <el-header
            height="26px"
        >
            <li-header />
        </el-header>
        <el-main>
            <li-main />
            <li-dialog />
        </el-main>
    </el-container>
</template>

<script lang="ts">
    import LiHeader from "./li-header/li-header.vue";
    import LiMain from "./li-main/li-main.vue";
    import LiDialog from "./li-dialog/li-dialog.vue";
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
