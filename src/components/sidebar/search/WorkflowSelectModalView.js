import React from 'react'
import {MenuItem, SelectField, TextField} from 'material-ui'

import { TwoButtonsBlockCustom, Modal, CardPanel } from 'components/modal/parts'
import { errorStyle, underlineFocusStyle, inputStyle,
  selectedItemStyle, underlineStyle } from 'style/common/materialStyles'

export default class WorkflowSelectModalView extends React.Component {
  render () {
    const {
      onChangeCategory,
      onClickClose, onClickOK,
      workflows,
      selectedRowWf, onClickRow,
      selectedCategory, workflowCategories,
      workflowFilter, onChangeWorkflowFilter
    } = this.props
    return (
      <Modal title="Workflow" onRequestClose={onClickClose}>
        <CardPanel title="Workflow">
          <div className="padding-md-left">
            <SelectField
              errorStyle={errorStyle}
              underlineStyle={underlineFocusStyle}
              selectedMenuItemStyle={selectedItemStyle}
              menuItemStyle={inputStyle}
              labelStyle={inputStyle}
              value={selectedCategory || ''}
              onChange={onChangeCategory}
            >
              <MenuItem key="0" value="" primaryText="[All]" />
              {workflowCategories.map(c =>
                <MenuItem key={c.id} value={c.name} primaryText={c.name} />
              )}
            </SelectField>
            <TextField
              hintText="Search"
              errorStyle={errorStyle}
              inputStyle={inputStyle}
              underlineFocusStyle={underlineStyle}
              style={{marginLeft: '20px', verticalAlign: 'top'}}
              value={workflowFilter}
              onChange={onChangeWorkflowFilter}
            />
          </div>
          <div style={{maxHeight: '250px', overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Severity</th>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
              </thead>
              <tbody>
              {
                workflows.map(w =>
                  <tr
                    key={w.id}
                    className={selectedRowWf.id === w.id ? 'selected' : ''}
                    onClick={() => onClickRow(w)}
                  >
                    <td>{w.severity}</td>
                    <td>{w.name}</td>
                    <td>{w.desc}</td>
                    <td>{w.version}</td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
        </CardPanel>
        <TwoButtonsBlockCustom name2="OK" action2={onClickOK}/>
      </Modal>
    )
  }
}
