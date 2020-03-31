import React from 'react'
import {Chip} from 'material-ui'
import {keys} from 'lodash'
import {Field} from 'redux-form'

import {FormInput, CardPanel} from 'components/modal/parts'

const styles = {
  chip: {
    margin: 4
  },
  chipLabel: {
    fontSize: '12px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '300px',
    overflow: 'auto'
  }
}
class ParamList extends React.Component {
  onClickAdd () {
    this.props.openParamEditModal()
  }

  onClickSave () {
    let params = {}
    this.props.editParams.forEach(p => {
      params[p.key] = p.value
    })
    this.props.updateMonitorParams(params)
  }

  onClickEdit (p) {
    this.props.openParamEditModal(p)
  }

  onClickRemove (p) {
    this.props.removeParam(p)
  }

  renderInputs () {
    const {monitorConfig} = this.props
    return (
      <div>
        {keys(monitorConfig.params || {}).map(k =>
          <Field
            key={k}
            name={k}
            label={k}
            component={FormInput}
            className="margin-sm-left margin-sm-right"
          />
        )}
      </div>
    )
  }
  render () {
    const {monitorConfig} = this.props
    const paramKeys = keys(monitorConfig.params || {})
    const params = this.props.editParams.filter(p => paramKeys.indexOf(p.key) < 0)
    return (
      <div>
        <CardPanel title="Params">
          <div style={styles.wrapper}>
            {params.map(p =>
              <Chip
                key={p.key}
                style={styles.chip}
                labelStyle={styles.chipLabel}
                onTouchTap={this.onClickEdit.bind(this, p)}
                onRequestDelete={this.onClickRemove.bind(this, p)}
              >
                <b>{p.key}</b>: {p.value}
              </Chip>
            )}
            <Chip style={styles.chip} onTouchTap={this.onClickAdd.bind(this)}><b>&nbsp;&nbsp;+&nbsp;&nbsp;</b></Chip>
          </div>
        </CardPanel>
      </div>
    )
  }
}

export default ParamList
