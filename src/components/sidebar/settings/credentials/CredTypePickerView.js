import React from 'react'

import {TwoButtonsBlockCustom, Modal, CardPanel} from 'components/modal/parts'

export default class CredTypePickerView extends React.Component {
  render () {
    const {credentialTypes, onHide, onClickOK, onSelect, selectedCredType} = this.props
    return (
      <Modal title="Credentials" onRequestClose={onHide}>
        <CardPanel>
          <div style={{height: 300, overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Type</th>
              </tr>
              </thead>
              <tbody>
              {credentialTypes.map((p, i) =>
                <tr
                  key={i}
                  onClick={() => onSelect(p)}
                  className={selectedCredType && selectedCredType.id === p.id ? 'selected' : ''}
                >
                  <td>{p.name}</td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </CardPanel>
        <TwoButtonsBlockCustom name1="OK" name2="Cancel" action1={onClickOK} action2={onHide}/>
      </Modal>
    )
  }
}
