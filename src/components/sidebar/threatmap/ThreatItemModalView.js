import React from 'react'
import { CloseButton, CardPanel } from 'components/modal/parts'
import {renderEntity} from 'components/common/CellRenderers'

import {Modal} from 'components/modal/parts'

export default class ThreatItemModalView extends React.Component {
  render () {
    const {entity, onHide} = this.props
    return (
      <Modal title="Details" onRequestClose={onHide}>
        <CardPanel className="margin-md-bottom">
          <div>
            {renderEntity(entity)}
          </div>
        </CardPanel>
        <CloseButton onClose={onHide} />
      </Modal>
    )
  }
}
