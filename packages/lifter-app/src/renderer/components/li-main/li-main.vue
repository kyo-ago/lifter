<template>
    <div>
        <connection v-if="selectedTabIndex === 0" />
        <auto-responder v-if="selectedTabIndex === 1" />
        <rewrite-rule v-if="selectedTabIndex === 2" />
        <proxy-bypass-domain v-if="selectedTabIndex === 3" />
    </div>
</template>

<script lang="ts">
    import { mapState } from 'vuex';
    import AutoResponder from "./auto-responder.vue";
    import Connection from "./connection.vue";
    import ProxyBypassDomain from "./proxy-bypass-domain.vue";
    import RewriteRule from "./rewrite-rule.vue";

    export default {
        name: "LiMain",
        computed: {
            ...mapState([
                'selectedTabIndex',
            ]),
        },
        components: {
            Connection,
            AutoResponder,
            RewriteRule,
            ProxyBypassDomain,
        }
    }
</script>

<style scoped lang="scss">
</style>