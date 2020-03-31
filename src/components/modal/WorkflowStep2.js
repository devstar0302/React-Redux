import React, { Component } from 'react'
import InlineEdit from 'react-edit-inline'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {Chip, IconButton} from 'material-ui'

import { CardPanel } from 'components/modal/parts'
import { chipStyles } from 'style/common/materialStyles'

export default class WorkflowStep2 extends Component {
  renderTools () {
    const {onRemoveRule} = this.props
    return (
      <div>
        <IconButton onTouchTap={onRemoveRule}>
          <DeleteIcon color="#545454" className="link"/>
        </IconButton>
      </div>
    )
  }
  render () {
    const {
      rules, onRuleChange, onRuleClick, ruleModal, selected,
      onClickKeyChip, onClickValueChip
    } = this.props
    return (
      <CardPanel title="Rules" tools={this.renderTools()}>
        <div>
          <div className="pull-left">
            <Chip style={chipStyles.chip} onTouchTap={() => onClickKeyChip('KEY_RAW_DATA')}>
              KEY_RAW_DATA
            </Chip>
          </div>
          <div className="pull-right">
            <Chip style={chipStyles.chip} onTouchTap={() => onClickValueChip('.*')}>
              .*
            </Chip>
          </div>
        </div>
        <div className="margin-md-bottom">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
            {rules.map((r, index) =>
              <tr key={index}
                className={selected === index ? 'selected' : ''}
                onClick={onRuleClick.bind(this, index)}>
                <td width="50%">
                  <InlineEdit
                    activeClassName="editing"
                    text={r.key || '\u00a0'}
                    paramName="key"
                    change={onRuleChange.bind(this, index)}
                    style={{
                      width: '100%',
                      display: 'block'
                    }}
                  />
                </td>
                <td width="50%">
                  <InlineEdit
                    activeClassName="editing"
                    text={r.value || '\u00a0'}
                    paramName="value"
                    change={onRuleChange.bind(this, index)}
                    style={{
                      width: '100%',
                      display: 'block'
                    }}
                  />
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {ruleModal}
      </CardPanel>
    )
  }
}
