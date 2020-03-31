import React from 'react';
import { SelectField, MenuItem } from 'material-ui'

import AppletCard from '../../AppletCard';
import { extImageBaseUrl, appletColors as colors } from '../../../../shared/Global';

export default class Monitor extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedItem: null,
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(event, key, payload) {
        this.setState({selectedItem: payload});
    }   
    renderTpl (tpl, i) {
        const {onClickMenuItem} = this.props
        console.log(tpl, this.state.selectedItem);
        return (
          <AppletCard
            key={tpl.id}
            color={colors[i % colors.length]}
            name={''}
            desc={tpl.name}
            img={`${extImageBaseUrl}${tpl.image}`}
            onClick={() => onClickMenuItem(tpl)}
          />
        )
      }
    render() {
        const { devices } = this.props        
        const { selectedItem } = this.state;  
        
        return (
         <div className="tabs-custom flex-vertical flex-1">
            <div className="padding-lg-left">
                <SelectField
                    floatingLabelText="Devices" 
                    value={selectedItem} 
                    className="valign-top"
                    onChange={this.onChange}
                >
                    {(devices || []).map(p =>
                    <MenuItem key={p.id} value={p} primaryText={p.name}/>
                    )}
                </SelectField>          
            </div>
            <div>
                <ul className="web-applet-cards">
                    { selectedItem && selectedItem.monitors && selectedItem.monitors.map(this.renderTpl.bind(this)) }
                </ul>
            </div>
         </div>
        );
    }
}