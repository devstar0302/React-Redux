import React, { Component } from 'react'
import { Field } from 'redux-form'
import { FormInput, SubHeader } from 'components/modal/parts'
import ActionList from 'material-ui/svg-icons/action/list'
import ActionTrendingUp from 'material-ui/svg-icons/action/trending-up'
import {FlatButton} from 'material-ui'
import { selectedItemStyle } from 'style/common/materialStyles'

export default class WorkflowStep0 extends Component {
  render () {
    const {workflowEditType, updateWorkflowEditType} = this.props
    return (
      <div>
        <div className="form-column">
          <Field name="name" component={FormInput} label="Name"/>
        </div>
        <div className="wizard-diagram-choice">
          <SubHeader name="Add by"/>
          <div className="col-md-9">
            <FlatButton
              icon={<ActionList color={workflowEditType === 'wizard' ? 'white' : null}/>}
              style={selectedItemStyle}
              onTouchTap={updateWorkflowEditType.bind(null, 'wizard')}

              backgroundColor={workflowEditType === 'wizard' ? '#2383F3' : null}/>
            <FlatButton
              icon={<ActionTrendingUp color={workflowEditType === 'diagram' ? 'white' : null}/>}
              style={selectedItemStyle}
              onTouchTap={updateWorkflowEditType.bind(null, 'diagram')}
              backgroundColor={workflowEditType === 'diagram' ? '#2383F3' : null}/>
          </div>
        </div>
      </div>
    )
  }
}
