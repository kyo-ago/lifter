<template>
    <div>
        <li-header />
        <setting-dialog />
    </div>
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
</style>
