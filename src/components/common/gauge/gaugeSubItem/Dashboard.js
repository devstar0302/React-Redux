import React from 'react';
import AppletCard from '../../AppletCard';
import { extImageBaseUrl, appletColors as colors } from '../../../../shared/Global';

export default class Dashboard extends React.Component {
    renderTpl (tpl, i) {
        const {onClickMenuItem} = this.props
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
        return (
            <ul className="web-applet-cards">
                {this.props.gauges.map(this.renderTpl.bind(this))}
            </ul>
        );
    }
}