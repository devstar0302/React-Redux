import React, { Component } from 'react'
import {Chip} from 'material-ui'
import { Field } from 'redux-form'
import { SubmitBlock, FormInput, ImageUploader, FormCheckbox, Modal, CardPanel } from 'components/modal/parts'

import { chipStyles } from 'style/common/materialStyles'

const contentStyle = {
  width: 620
}

export default class MonitorTplModalView extends Component {
  render () {
    const {
      header, imgUrl, onSubmit, onHide, onChange,
      tagModal, tags, onClickAddTag, onClickDeleteTag,
      credTypeModal, monitorTplCredTypes, onClickAddCredType, onClickDeleteCredType
    } = this.props
    return (
      <Modal title={header} onRequestClose={onHide} contentStyle={contentStyle}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Detail">
            <Field name="name" component={FormInput} label="Name"/>&nbsp;
            <Field name="description" component={FormInput} label="Description"/>&nbsp;
            <Field name="monitortype" component={FormInput} label="Monitor type"/>&nbsp;

            <div className="pull-right">
              <ImageUploader imgUrl={imgUrl} onChange={onChange}/>
            </div>

            <Field name="enabled" component={FormCheckbox} label="Enabled" labelPosition="right"/>
          </CardPanel>

          <CardPanel title="Tag" className="margin-md-top">
            <div style={chipStyles.wrapper}>
              {tags.map((t, i) =>
                <Chip key={i} style={chipStyles.chip} onRequestDelete={() => onClickDeleteTag(i)}>{t}</Chip>
              )}
              <Chip style={chipStyles.chip} onTouchTap={onClickAddTag}><b>+</b></Chip>
            </div>
          </CardPanel>

          <CardPanel title="Credential Type" className="margin-md-top">
            <div style={chipStyles.wrapper}>
              {monitorTplCredTypes.map((t, i) =>
                <Chip key={i} style={chipStyles.chip} onRequestDelete={() => onClickDeleteCredType(i)}>{t}</Chip>
              )}
              <Chip style={chipStyles.chip} onTouchTap={onClickAddCredType}><b>+</b></Chip>
            </div>
          </CardPanel>
          <br/>
          {tagModal}
          {credTypeModal}
          <SubmitBlock name="Save"/>
        </form>
      </Modal>
    )
  }
}
