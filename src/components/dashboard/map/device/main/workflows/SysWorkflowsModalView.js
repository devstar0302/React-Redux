import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { findIndex } from 'lodash'

import { TwoButtonsBlockCustom, Modal, CardPanel } from 'components/modal/parts'
import { errorStyle, underlineFocusStyle, inputStyle,
  selectedItemStyle } from 'style/common/materialStyles'

export default class SysWorkflowsModalView extends React.Component {
  render () {
    const {header, onChangeCategory, onChangeCheck,
      onClickClose, onClickAdd,
      sysWorkflows,
      selectedSysWorkflowCategory, workflowCategories,
      selectedSysWorkflows} = this.props
    return (
      <Modal title={header} onRequestClose={onClickClose}>
        <CardPanel title={header}>
          <div className="padding-md-left">
            <SelectField
              errorStyle={errorStyle}
              underlineStyle={underlineFocusStyle}
              selectedMenuItemStyle={selectedItemStyle}
              menuItemStyle={inputStyle}
              labelStyle={inputStyle}
              value={selectedSysWorkflowCategory || ''}
              onChange={onChangeCategory}
            >
              <MenuItem key="0" value="" primaryText="[All]" />
              {workflowCategories.map(c =>
                <MenuItem key={c.id} value={c.name} primaryText={c.name} />
              )}
            </SelectField>
          </div>
          <div style={{maxHeight: '400px', overflow: 'scroll'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Category</th>
                <th>Severity</th>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
              </thead>
              <tbody>
              {
                sysWorkflows.map(w =>
                  <tr key={w.id}>
                    <td>
                      <Checkbox
                        label={w.category}
                        checked={findIndex(selectedSysWorkflows, {id: w.id}) >= 0}
                        onCheck={(e, c) => onChangeCheck(w, e, c)}
                      />
                    </td>
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
        <TwoButtonsBlockCustom name2="Add" action2={onClickAdd}/>
      </Modal>
    )
  }
}
