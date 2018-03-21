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
            <delete-modifiers-table v-bind:rewriteRoleId="rewriteRole.id" v-bind:modifiers="rewriteRole.modifier['DELETE']" />
            <update-modifiers-table v-bind:rewriteRoleId="rewriteRole.id" v-bind:modifiers="rewriteRole.modifier['UPDATE']" />
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import DeleteModifiersTable from "./delete-modifiers-table";
    import UpdateModifiersTable from "./update-modifiers-table";

    export default {
        name: "rewrite-rule-modifiers-dialog",
        components: {
            DeleteModifiersTable,
            UpdateModifiersTable,
        },
        computed: {
            rewriteRole() {
                return this.$store.state.rewriteRuleModifiersDialog.rewriteRole;
            },
            isShowing() {
                return this.$store.state.rewriteRuleModifiersDialog.isShowing;
            },
        },
        methods: {
            hide() {
                this.$store.commit('rewriteRuleModifiersDialog/hide');
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
