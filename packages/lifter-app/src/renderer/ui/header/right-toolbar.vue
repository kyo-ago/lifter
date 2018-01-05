<template>
    <div class="toolbar-shadow">
        <div class="toolbar-divider toolbar-item"></div>
        <el-dropdown
            trigger="click"
            size="small"
            v-bind:show-timeout="0"
            v-bind:hide-timeout="0"
        >
            <span class="icon">&#xFE19;</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Action 1</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
    export default {
        name: "right-toolbar",
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

    .icon {
        display: flex;
        width: 28px;
        height: 26px;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        cursor: default;
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
