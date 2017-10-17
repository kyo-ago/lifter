import * as React from 'react';
import {GlobalProps} from './index';

export class Form extends React.Component<GlobalProps, {}> {
    onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.updateEntities(event.target.value);
    }

    render() {
        let proxyBypassDomains = this.props.proxyBypassDomains.map((entity) => entity.name).join(', ');
        return <form>
            <div className="form-group">
                <label>Proxy bypass domain pattern</label>
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="*.example.com, www.example.net"
                    defaultValue={proxyBypassDomains}
                    onChange={this.onChange.bind(this)}
                ></textarea>
            </div>
        </form>;
    }
}