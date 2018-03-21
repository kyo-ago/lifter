<template>
    <div>
        <div class="inputContainer">
            <el-autocomplete
                    v-model="currentHeader"
                    :fetch-suggestions="getHeaderExamples"
                    placeholder="Target HTTP Header"
            />
            <el-button type="primary" icon="el-icon-edit" @click="addHeader"></el-button>
        </div>
        <el-table
                ref="table"
                :data="deleteModifiers"
                :row-class-name="getTableStyle"
                border
                @row-click="selectRow"
        >
            <el-table-column
                    prop="header"
                    label=Header"
                    resizable
            />
            <el-table-column
                    label="Operations"
                    width="50"
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
    import { makeTableHandlerMixin } from "../../mixins/table-handler-mixin";

    export default {
        name: "delete-modifiers-table",
        data() {
            return {
                currentHeader: "",
            };
        },
        methods: {
            getHeaderExamples(_, cb) {
                cb([
                    {
                        value: "*.js"
                    },
                    {
                        value: "*.{js,css}"
                    },
                ])
            },
            addHeader() {
                this.$store.dispatch("rewriteRule/addRule", this.$data.currentHeader);
            },
        },
        computed: {
            deleteModifiers() {
                return [];
            },
        },
        mixins: [
            makeTableHandlerMixin("rewriteRule/deletes"),
        ],
    };
</script>

<style scoped lang="scss">

</style>
