<template>
    <div>
        <connection v-if="selectedTabIndex === 0" />
        <auto-responder v-if="selectedTabIndex === 1" />
        <rewrite-rule v-if="selectedTabIndex === 2" />
    </div>
</template>

<script lang="ts">
import AutoResponder from "./auto-responder.vue";
import Connection from "./connection.vue";
import RewriteRule from "./rewrite-rule.vue";

export default {
    name: "LiMain",
    computed: {
        selectedTabIndex() {
            return this.$store.state.headerTab.index;
        },
    },
    components: {
        Connection,
        AutoResponder,
        RewriteRule,
    },
};
</script>

<style scoped lang="scss">
</style>
