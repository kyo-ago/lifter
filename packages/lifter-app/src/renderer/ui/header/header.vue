<template>
    <div class="tabbed-pane-header">
        <div class="tabbed-pane-left-toolbar toolbar">
            <left-toolbar />
        </div>
        <div class="tabbed-pane-header-contents">
            <tab-contents />
        </div>
        <div class="tabbed-pane-right-toolbar toolbar">
            <right-toolbar />
        </div>
    </div>
</template>

<script>
    import LeftToolbar from "./left-toolbar.vue";
    import RightToolbar from "./right-toolbar.vue";
    import TabContents from "./tab-contents.vue";
    export default {
        name: "Header",
        components: {
            LeftToolbar,
            RightToolbar,
            TabContents,
        },
    }
</script>

<style scoped lang="scss">
    .tabbed-pane-header {
        display: flex;
        flex: 0 0 27px;
        border-bottom: 1px solid #ccc;
        overflow: visible;
        width: 100%;
        background-color: #f3f3f3;
    }

    .tabbed-pane-header-contents {
        flex: auto;
        pointer-events: none;
        margin-left: 0;
        position: relative;
    }

    .toolbar {
        flex: none;
        padding: 0 2px;
    }

    .tabbed-pane-left-toolbar {
        margin-right: 0;
    }
    .tabbed-pane-right-toolbar {
        margin-left: -4px;
    }
</style>