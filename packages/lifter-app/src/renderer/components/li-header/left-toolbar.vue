<i18n>
{
    "en-US": {
        "NoProxyCommandGrant": "Require granted for the proxy command",
        "NoTargetInterfaces": "Network disabled",
        "Off": "Disable proxy",
        "On": "Enable proxy"
    },
    "ja": {
        "NoProxyCommandGrant": "Proxy commandに権限が付与されていません",
        "NoTargetInterfaces": "有効なネットワークインターフェイスが見つかりません",
        "Off": "Proxyが無効です",
        "On": "Proxyが有効です"
    }
}
</i18n>

<template>
    <div class="toolbar">
        <el-button
            icon="el-icon-view"
            size="mini"
            data-test="changeProxySettingStatus"
            :type="buttonType"
            :data-test-type="buttonType"
            :plain="buttonType==='info'"
            :title="buttonTitle"
            :disabled="disabled"
            @click="changeProxySettingStatus"
        />
        <divider />
    </div>
</template>

<script lang="ts">
import Divider from "./divider.vue";

export default {
    name: "left-toolbar",
    computed: {
        buttonType() {
            return this.$store.getters['proxySettings/matchState']({
                NotGranted: () => "info",
                NoTargetInterfaces: () => "info",
                On: () => "danger",
                Off: () => "",
            });
        },
        buttonTitle() {
            return this.$store.getters['proxySettings/matchState']({
                NotGranted: () => "NoProxyCommandGrant",
                NoTargetInterfaces: () => "NoTargetInterfaces",
                On: () => "On",
                Off: () => "Off",
            });
        },
        disabled() {
            return this.$store.getters['proxySettings/proxyCommandIsNotGranted'];
        },
    },
    methods: {
        changeProxySettingStatus() {
            this.$store.dispatch("proxySettings/changeProxySettingStatus");
        },
    },
    components: {
        Divider,
    },
};
</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    align-self: flex-end;
}

.el-button--mini {
    padding: 7px 8px;
    border: none;
}
</style>
