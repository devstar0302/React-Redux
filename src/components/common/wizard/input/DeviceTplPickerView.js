import React from 'react'

import { Modal } from 'components/modal/parts'
import AppletCard from 'components/common/AppletCard'
import { extImageBaseUrl, appletColors as colors } from 'shared/Global'

export default class DeviceTplPickerView extends React.Component {
  renderTpl (tpl, i) {
    return (
      <AppletCard
        key={tpl.id}
        color={colors[i % colors.length]}
        name={tpl.devicetemplategroup}
        desc={tpl.name}
        img={`${extImageBaseUrl}${tpl.image}`}
      />
    )
  }

  render () {
    const {onHide} = this.props
    return (
      <Modal title="Devices" onRequestClose={onHide} contentStyle={{width: 1058, maxWidth: 'initial'}}>
        <ul className="web-applet-cards" style={{marginTop: 40}}>
          {this.props.deviceTemplates.map(this.renderTpl.bind(this))}
        </ul>
      </Modal>
    )
  }
}
