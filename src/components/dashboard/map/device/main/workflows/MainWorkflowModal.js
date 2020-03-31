import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {assign, concat, forOwn} from 'lodash'
import { connect } from 'react-redux'
import WorkflowModalInner from './WorkflowModalInner'

import {WorkflowActionTypes} from 'shared/Global'

class MainWorkflowModal extends Component {
  constructor (props) {
    super(props)
    let rules = []
    if (props.editWorkflow) {
      forOwn(props.editWorkflow.rules || {}, (value, key) => {
        rules.push({key, value})
      })
    }
    rules.push({key: '', value: ''})
    this.state = {
      current: 1,
      steps: 3,
      rules,
      selectedRuleIndex: -1,
      actions: props.editWorkflow ? (props.editWorkflow.actions || [])
        : WorkflowActionTypes.map(p => ({name: p.label, actionType: p.value})),
      selectedActionIndex: -1,
      diagram: props.editWorkflow ? props.editWorkflow.flowchart : ''
    }
  }

  handleFormSubmit (values) {
    const {editWorkflow, workflowCategories, editWorkflowTags} = this.props
    const { rules, actions, diagram } = this.state
    let props = assign({}, editWorkflow, values, {
      isglobal: false,
      rules: {},
      actions: actions,
      flowchart: diagram,
      tags: editWorkflowTags
    })
    if (workflowCategories && workflowCategories.length) {
      props.category = props.category || workflowCategories[0].name
    }
    rules.forEach(r => {
      if (r.key) props.rules[r.key] = r.value
    })
    if (!props.name) return window.alert('Please type name.')
    if (editWorkflow) {
      this.props.updateDeviceWorkflow(props)
    } else {
      this.props.addDeviceWorkflow(props, this.props.device)
    }
  }

  onClickClose () {
    this.props.closeDeviceWorkflowModal()
  }

  onClickPrev () {
    let { current } = this.state
    current -= 1
    this.setState({ current })
  }

  onClickNext () {
    let { current } = this.state
    current += 1
    this.setState({ current })
  }

  onClickAddRule () {
    this.props.openDeviceRuleModal()
  }

  onClickEditRule () {
    const { selectedRuleIndex, rules } = this.state
    if (selectedRuleIndex < 0) return window.alert('Please select rule.')
    this.props.openDeviceRuleModal(rules[selectedRuleIndex])
  }

  onClickRemoveRule () {
    const { selectedRuleIndex, rules } = this.state
    if (selectedRuleIndex < 0) return window.alert('Please select rule.')
    this.setState({rules: rules.filter((r, index) => index !== selectedRuleIndex), selectedRuleIndex: -1})
  }

  onCloseRuleModal (data, isEdit) {
    if (!data) return
    const { rules, selectedRuleIndex } = this.state
    if (isEdit) {
      this.setState({rules: rules.map((r, index) => index === selectedRuleIndex ? data : r)})
    } else {
      this.setState({rules: concat(rules, data)})
    }
  }

  onClickAddCategory () {
    this.props.openWfCategoryModal()
  }

  onRuleChange (index, value) {
    console.log(value)
    let { rules } = this.state
    rules = rules.map((r, i) => i === index ? assign({}, r, value) : r)
    if (index === rules.length - 1) rules.push({key: '', value: ''})
    this.setState({ rules })
  }

  onClickAddAction () {
    this.props.openWfActionModal()
  }

  onClickEditAction () {
    const { selectedActionIndex, actions } = this.state
    if (selectedActionIndex < 0) return window.alert('Please select action.')
    this.props.openWfActionModal(actions[selectedActionIndex])
  }

  onClickRemoveAction () {
    const { selectedActionIndex, actions } = this.state
    if (selectedActionIndex < 0) return window.alert('Please select action.')
    this.setState({actions: actions.filter((r, index) => index !== selectedActionIndex), selectedActionIndex: -1})
  }

  onCloseActionModal (data, isEdit) {
    if (!data) return
    const { actions, selectedActionIndex } = this.state
    if (isEdit) {
      this.setState({actions: actions.map((r, index) => index === selectedActionIndex ? data : r)})
    } else {
      this.setState({actions: concat(actions, data)})
    }
  }

  onClickDiagram () {
    this.props.openDeviceWfDiagramModal(this.state.diagram)
  }

  onDiagramModalClose (data) {
    if (!data) return
    this.setState({
      diagram: data
    })
  }

  onRuleClick (index) {
    let rules = this.state.rules
    if (index !== rules.length - 1) {
      this.setState({
        selectedRuleIndex: index
      })
    }
  }

  onActionClick (index) {
    this.setState({
      selectedActionIndex: index
    })
  }

  onClickRawData () {
    this.props.change('display_incident_desc', 'SHOW_RAW_DATA')
  }
  onClickKeyChip (key) {
    const { rules } = this.state
    this.setState({rules: concat([{key, value: ''}], rules)})
  }
  onClickValueChip (value) {
    const { rules, selectedRuleIndex } = this.state
    if (selectedRuleIndex < 0 || rules.length <= selectedRuleIndex) return null
    rules[selectedRuleIndex].value = `${value}${rules[selectedRuleIndex].value}${value}`
    this.setState({rules})
  }

  render () {
    const {handleSubmit} = this.props
    let isDiagramButton = true
    return (
      <WorkflowModalInner
        current={this.state.current}
        isDiagramButton={isDiagramButton}
        step={this.state.step}
        steps={this.state.steps}
        rules={this.state.rules}
        actions={this.state.actions}
        diagram={this.state.diagram}
        selectedRuleIndex={this.state.selectedRuleIndex}
        selectedActionIndex={this.state.selectedActionIndex}
        onClickClose={this.onClickClose.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        onClickNext={this.onClickNext.bind(this)}
        onClickPrev={this.onClickPrev.bind(this)}
        onClickAddRule={this.onClickAddRule.bind(this)}
        onClickEditRule={this.onClickEditRule.bind(this)}
        onClickRemoveRule={this.onClickRemoveRule.bind(this)}
        onCloseRuleModal={this.onCloseRuleModal.bind(this)}
        onClickAddCategory={this.onClickAddCategory.bind(this)}
        onRuleChange={this.onRuleChange.bind(this)}
        onRuleClick={this.onRuleClick.bind(this)}
        onActionClick={this.onActionClick.bind(this)}
        onClickAddAction={this.onClickAddAction.bind(this)}
        onClickEditAction={this.onClickEditAction.bind(this)}
        onClickRemoveAction={this.onClickRemoveAction.bind(this)}
        onCloseActionModal={this.onCloseActionModal.bind(this)}
        onClickDiagram={this.onClickDiagram.bind(this)}
        onDiagramModalClose={this.onDiagramModalClose.bind(this)}
        onClickRawData={this.onClickRawData.bind(this)}
        onClickKeyChip={this.onClickKeyChip.bind(this)}
        onClickValueChip={this.onClickValueChip.bind(this)}
        {...this.props}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: assign({
      enable: true,
      severity: 'HIGH'
    }, state.devices.editWorkflow)
  })
)(reduxForm({form: 'workflowForm'})(MainWorkflowModal))
