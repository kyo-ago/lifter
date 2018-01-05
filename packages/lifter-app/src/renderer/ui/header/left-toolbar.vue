<template>
    <div class="toolbar-shadow">
        <el-button icon="el-icon-view" size="mini"></el-button>
        <div class="toolbar-divider toolbar-item"></div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "left-toolbar",
    }
</script>

<style scoped lang="scss">
    .toolbar-shadow {
        position: relative;
        white-space: nowrap;
        height: 26px;
        overflow: hidden;
        z-index: 12;
        display: flex;
        flex: none;
        align-items: center;
    }

    .el-button--mini {
        padding: 7px 8px;
        background: transparent;
        border: none;
    }

    .toolbar-item {
        position: relative;
        display: flex;
        background-color: transparent;
        flex: none;
        align-items: center;
        justify-content: center;
        padding: 0;
        height: 26px;
        border: none;
        color: #5a5a5a;
    }

    .toolbar-divider {
        background-color: #ccc;
        width: 1px;
        margin: 5px 4px;
        height: 16px;
    }
</style>
