<template>
    <div>
        Update modifiers
        <div class="inputContainer">
            <el-autocomplete
                    v-model="currentHeader"
                    :fetch-suggestions="getHeaderExamples"
                    placeholder="Target HTTP Header"
            />
            <el-input v-model="currentValue" placeholder="Replace value"></el-input>
            <el-button type="primary" icon="el-icon-edit" @click="addModifier"></el-button>
        </div>
        <el-table
                ref="table"
                :data="modifiers"
                :row-class-name="getTableStyle"
                border
                @row-click="selectRow"
        >
            <el-table-column
                    prop="header"
                    label="Header"
                    resizable
            />
            <el-table-column
                    prop="value"
                    label="Value"
                    resizable
            />
            <el-table-column
                    label="Operations"
                    width="100"
            >
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="onClickDeleteButton(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { makeRewriteRuleModifiersMixin } from "../../mixins/rewrite-rule-modifiers-mixin";
import { makeTableHandlerMixin } from "../../mixins/table-handler-mixin";

export default {
    name: "update-modifiers-table",
    data() {
        return {
            currentHeader: "",
            currentValue: "",
        };
    },
    methods: {
        addModifier() {
            this.$store.dispatch("rewriteRule/updateModifierAdd", {
                rewriteRuleId: this.rewriteRoleId,
                target: {
                    header: this.$data.currentHeader,
                    value: this.$data.currentValue,
                },
            });
        },
    },
    mixins: [
        makeRewriteRuleModifiersMixin("UPDATE"),
        makeTableHandlerMixin(function (store, entities) {
                return store.dispatch("rewriteRule/updateModifierDeletes", {
                    rewriteRuleId: this.rewriteRoleId,
                    targets: entities,
                })
            },
        ),
    ],
};
</script>

<style scoped lang="scss">
</style>
