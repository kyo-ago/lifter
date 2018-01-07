<template>
    <div>
        <auto-responder-file-drop-dialog />
        <setting-dialog />
    </div>
</template>

<script lang="ts">
    import AutoResponderFileDropDialog from "./auto-responder-file-drop-dialog.vue";
    import SettingDialog from "./setting-dialog.vue";

    export default {
        name: "LiDialog",
        components: {
            AutoResponderFileDropDialog,
            SettingDialog,
        },
    }
</script>

<style scoped lang="scss">

</style>