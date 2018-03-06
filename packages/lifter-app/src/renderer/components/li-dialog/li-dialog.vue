<template>
    <div>
        <file-drop-dialog />
        <setting-dialog />
    </div>
</template>

<script lang="ts">
    import FileDropDialog from "./file-drop-dialog.vue";
    import SettingDialog from "./setting-dialog.vue";

    export default {
        name: "LiDialog",
        components: {
            FileDropDialog,
            SettingDialog,
        },
    }
</script>

<style scoped lang="scss">

</style>