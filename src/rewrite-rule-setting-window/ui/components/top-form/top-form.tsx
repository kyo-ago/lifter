import * as React from "react";
import {GlobalProps} from "../index";

export class TopForm extends React.Component<GlobalProps, any> {
    render() {
        return <div className="top-form">
            <form className="form-table">
                <select className="form-control form-table-cell">
                    <option>Add</option>
                    <option>Modify</option>
                    <option>Delete</option>
                </select>
                <label className="form-table-cell">
                    Header<input type="text" className="form-control" placeholder="Content-Type"/>
                </label>
                <label className="form-table-cell">
                    Value<input type="text" className="form-control" placeholder="text/html; charset=utf-8"/>
                </label>
                <button class="btn btn-primary pull-right">
                    Save
                </button>
            </form>
        </div>;
    }
}