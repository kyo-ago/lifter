<i18n>
{
    "en-US": {
        "NoTargetInterfaces": "Network disabled",
        "Off": "Disable proxy",
        "On": "Enable proxy"
    },
    "ja": {
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
            if (
                this.$store.state.proxySettings.proxySettingStatus ===
                "NoTargetInterfaces"
            ) {
                return "info";
            }
            if (this.$store.state.proxySettings.proxySettingStatus === "On") {
                return "danger";
            }
            if (this.$store.state.proxySettings.proxySettingStatus === "Off") {
                return "";
            }
            console.error(
                `invalid proxySettingStatus "${
                    this.$store.state.proxySettings.proxySettingStatus
                }"`,
            );
            return "";
        },
        buttonTitle() {
            return this.$t(this.$store.state.proxySettings.proxySettingStatus);
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
