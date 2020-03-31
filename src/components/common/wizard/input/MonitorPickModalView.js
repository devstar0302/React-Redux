import React from 'react'

import { Modal } from 'components/modal/parts'
import AppletCard from 'components/common/AppletCard'
import { extImageBaseUrl, appletColors as colors } from 'shared/Global'

export default class MonitorPickModalView extends React.Component {
  renderTpl (tpl, i) {
    const {onClick} = this.props
    return (
      <AppletCard
        key={tpl.id}
        color={colors[i % colors.length]}
        name={tpl.name}
        desc={tpl.description}
        img={`${extImageBaseUrl}${tpl.image}`}
        onClick={() => onClick(tpl)}
      />
    )
  }

  render () {
    const {onHide} = this.props
    return (
      <Modal title="Monitors" onRequestClose={onHide} contentStyle={{width: 1058, maxWidth: 'initial'}}>
        <ul className="web-applet-cards" style={{marginTop: 40}}>
          {this.props.templates.map(this.renderTpl.bind(this))}
        </ul>
      </Modal>
    )
  }
}
