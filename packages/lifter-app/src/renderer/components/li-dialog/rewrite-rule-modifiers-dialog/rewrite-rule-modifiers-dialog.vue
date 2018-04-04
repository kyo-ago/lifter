<template>
    <el-dialog
            title="Rewrite Rule Modifiers"
            :visible="isShowing"
            v-bind:fullscreen="true"
            v-bind:modal="false"
            width="95%"
            @close="hide"
    >
        <div>
            <delete-modifiers-table v-bind:rewriteRoleId="rewriteRoleId" />
            <update-modifiers-table v-bind:rewriteRoleId="rewriteRoleId" />
        </div>
    </el-dialog>
</template>

<script lang="ts">
import DeleteModifiersTable from "./delete-modifiers-table.vue";
import UpdateModifiersTable from "./update-modifiers-table.vue";

export default {
    name: "rewrite-rule-modifiers-dialog",
    components: {
        DeleteModifiersTable,
        UpdateModifiersTable,
    },
    computed: {
        rewriteRoleId() {
            return this.$store.state.rewriteRuleModifiersDialog.rewriteRoleId;
        },
        isShowing() {
            return this.$store.state.rewriteRuleModifiersDialog.isShowing;
        },
    },
    methods: {
        hide() {
            this.$store.commit("rewriteRuleModifiersDialog/hide");
        },
    },
};
</script>

<style scoped lang="scss">
</style>
