import React from 'react'
import {Field, Form} from 'redux-form'

import {
  FormInput, SubmitBlock, FormSelect, Modal, CardPanel
} from 'components/modal/parts'

const actions = [
  {label: 'Allow', value: 'allow'},
  {label: 'Block', value: 'block'}
]
const protocols = [
  {label: 'TCP', value: 'tcp'},
  {label: 'UDP', value: 'udp'},
  {label: 'ICMPv4', value: 'icmpv4'},
  {label: 'ICMPv6', value: 'icmpv6'}
]
export default class FwRuleModalView extends React.Component {
  render () {
    const {onSubmit, onHide} = this.props
    return (
      <Modal title="Rule" onRequestClose={onHide} contentStyle={{width: 600}}>
        <Form onSubmit={onSubmit}>
          <CardPanel>
            <div>
              <Field name="rule" component={FormInput} floatingLabel="Rule Name"/>&nbsp;
              <Field name="localip" component={FormInput} floatingLabel="Source"/>&nbsp;
            </div>
            <div>
              <Field name="remoteip" component={FormInput} floatingLabel="Destination"/>&nbsp;
              <Field name="remoteport" component={FormInput} floatingLabel="Destination Port"/>

            </div>
            <div>
              <Field name="protocol" component={FormSelect} floatingLabel="Protocol" options={protocols} className="valign-top"/>
              <Field name="action" component={FormSelect} floatingLabel="Action" options={actions} className="valign-top"/>&nbsp;
            </div>
          </CardPanel>
          <SubmitBlock name="OK" onClick={onHide} className="margin-md-top"/>
        </Form>
      </Modal>
    )
  }
}
