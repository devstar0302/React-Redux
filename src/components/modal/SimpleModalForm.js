import React from 'react'
import { Field } from 'redux-form'
import { FormInput, FormSelect, FormImg, FileUpload, FormCheckbox,
  SubmitBlock, Modal, CardPanel } from 'components/modal/parts'

const SimpleModalForm = ({show, onHide, onSubmit, header, subheader, buttonText,
  content, imageUpload, fileUpload}) => (
  <Modal title={header} onRequestClose={onHide}>
    <form onSubmit={onSubmit}>
      <CardPanel title={subheader || header}className="margin-md-bottom">
        {(imageUpload) ? (<Field name="image" component={FormImg}/>) : null}
        {(fileUpload) ? (<Field name="file" component={FileUpload}/>) : null}
        <div className="form-column">
          {content.map(elem => {
            switch (elem.type) {
              case 'select':
                return (<Field
                  key={elem.name.replace(/\s+/g, '')}
                  name={elem.key || elem.name.toLowerCase().replace(/\s+/g, '')}
                  component={FormSelect}
                  label={elem.name}
                  options={elem.options}/>)
              case 'checkbox':
                return (<Field
                  key={elem.name.replace(/\s+/g, '')}
                  name={elem.key || elem.name.toLowerCase().replace(/\s+/g, '')}
                  component={FormCheckbox}
                  label={elem.name}/>)
              case 'password':
                return (<Field
                  key={elem.name.replace(/\s+/g, '')}
                  name={elem.key || elem.name.toLowerCase().replace(/\s+/g, '')}
                  type="password"
                  component={FormInput}
                  label={elem.name}/>)
              default:
                return (<Field
                  key={elem.name.replace(/\s+/g, '')}
                  name={elem.key || elem.name.toLowerCase().replace(/\s+/g, '')}
                  component={FormInput}
                  label={elem.name}/>)
            }
          })}
        </div>
      </CardPanel>
      <SubmitBlock name={buttonText} onClick={onHide}/>
    </form>
  </Modal>
)

export default SimpleModalForm
