import React from 'react'
import { Checkbox } from 'material-ui'

import { TwoButtonsBlockCustom, Modal, CardPanel } from 'components/modal/parts'

class SearchFieldsModalView extends React.Component {
  render () {
    const {onClickOK, onClickClose, fields, selectedSearchFields, onCheck} = this.props
    return (
      <Modal title="Fields" onRequestClose={onClickClose}>
        <CardPanel className="margin-md-bottom">
          <div className="row" style={{maxHeight: '500px', overflow: 'auto'}}>
            {fields.map(p =>
              <div key={p.path} className="col-md-4">
                <Checkbox
                  label={p.path.replace(/\.dataobj\./gi, '.').replace(/dataobj\./gi, '')}
                  checked={selectedSearchFields.indexOf(p.path) >= 0}
                  onCheck={(e, checked) => onCheck(checked, p.path)}/>
              </div>
            )}
          </div>
        </CardPanel>
        <TwoButtonsBlockCustom name1="OK" name2="Cancel" action1={onClickOK} action2={onClickClose}/>
      </Modal>
    )
  }
}

export default SearchFieldsModalView
