import React from 'react'
import {Chip} from 'material-ui'

import {chipStyles} from 'style/common/materialStyles'

export default class Workflows extends React.Component {
  render () {
    const {workflows, showWfSelectModal, onClickDeleteWf} = this.props
    return (
      <div>
        <div style={chipStyles.wrapper}>
          {showWfSelectModal && <Chip style={chipStyles.chip} onTouchTap={() => showWfSelectModal(true)}><b>+</b></Chip>}
          {workflows.map((k, i) =>
            <Chip
              key={i}
              style={chipStyles.chip}
              onRequestDelete={onClickDeleteWf ? () => onClickDeleteWf(k) : null}>
              {k.name}
            </Chip>
          )}
        </div>
      </div>
    )
  }
}
