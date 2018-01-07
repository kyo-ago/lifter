<template>
    <div class="header">
        <left-toolbar />
        <tab-contents />
        <right-toolbar />
    </div>
</template>

<script lang="ts">
    import LeftToolbar from "./left-toolbar.vue";
    import RightToolbar from "./right-toolbar.vue";
    import TabContents from "./tab-contents.vue";

    export default {
        name: "LiHeader",
        components: {
            LeftToolbar,
            RightToolbar,
            TabContents,
        },
    };
</script>

<style scoped lang="scss">
    .header {
        display: flex;
        border-bottom: 1px solid #ccc;
        width: 100%;
        background-color: #f3f3f3;
        justify-content: space-between;
        align-items: flex-end;
    }
</style>