import React from 'react'
import { Field } from 'redux-form'
import { RadioButtonGroup, RadioButton } from 'material-ui'
import {FormSelect, FormInput} from 'components/modal/parts'

export default class CredPicker extends React.Component {
  render () {
    const {credentials, credentialTypes, onChangeCredential} = this.props
    const options = credentials.map(p => ({label: p.name, value: p.id}))
    const typeOptions = credentialTypes.map(p => ({label: p.name, value: p.name}))
    return (
      <div className="flex-horizontal">
        <div style={{paddingTop: 16}}>
          <RadioButtonGroup name="credentialSelect" defaultSelected="existing" onChange={(e, value) => onChangeCredential(value)}>
            <RadioButton value="existing" label="Existing"/>
            <RadioButton value="new" label="New" style={{marginTop: 30}} />
          </RadioButtonGroup>
        </div>
        <div className="flex-1" style={{paddingLeft: 16}}>
          <div>
            <Field name="credentialId" component={FormSelect} className="valign-top mr-dialog" options={options} floatingLabel="Credential" style={{marginTop: -20}}/>
          </div>
          <div style={{marginTop: -20}}>
            <Field name="credtype" component={FormSelect} className="valign-top" floatingLabel="Type" style={{width: 150, marginRight: 12}} options={typeOptions}/>
            <Field name="creduser" component={FormInput} className="valign-top mr-dialog" floatingLabel="User" style={{width: 150}}/>
            <Field name="credpassword" component={FormInput} className="valign-top" floatingLabel="Password" style={{width: 150}}/>
          </div>
        </div>
      </div>
    )
  }
}
