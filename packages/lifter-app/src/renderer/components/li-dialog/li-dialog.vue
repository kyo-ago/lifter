<template>
    <div>
        <file-drop-dialog />
        <rewrite-rule-modifiers-dialog />
        <setting-dialog />
    </div>
</template>

<script lang="ts">
    import FileDropDialog from "./file-drop-dialog";
    import RewriteRuleModifiersDialog from "./rewrite-rule-modifiers-dialog/rewrite-rule-modifiers-dialog";
    import SettingDialog from "./setting-dialog";

    export default {
        name: "LiDialog",
        components: {
            FileDropDialog,
            RewriteRuleModifiersDialog,
            SettingDialog,
        },
    }
</script>

<style scoped lang="scss">

</style>