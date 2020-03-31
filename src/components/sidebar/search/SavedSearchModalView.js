import React from 'react'
import { assign, concat } from 'lodash'
import {IconButton, TextField} from 'material-ui'
import Share from 'material-ui/svg-icons/social/share'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import EditIcon from 'material-ui/svg-icons/content/create'

import { TwoButtonsBlockCustom, Modal, CardPanel } from 'components/modal/parts'

class SavedSearchModalView extends React.Component {
  render () {
    const {
      onClickOK, onClickClose,
      userOptions,
      sysSearchOptions,
      onClickRow,
      selectedSearch,
      loadingSearchOptions,
      onClickShare,
      savedSearchKeyword,
      onChangeKeyword,
      onClickDelete,
      onClickAdd,
      onClickEdit,
      panelMode
    } = this.props

    const keyword = savedSearchKeyword.toLowerCase();
    const options = concat([], userOptions.map(p => {
      return assign({}, p, {
        type: 'User'
      })
    }), sysSearchOptions.map(p => {
      return assign({}, p, {
        type: 'System'
      })
    })).filter(p => (p.name || '').toLowerCase().indexOf(keyword) >= 0
      || (p.description || '').toLowerCase().indexOf(keyword) >= 0)

    if (panelMode) return this.renderContent()
    return (
      <Modal title="Saved Search" onRequestClose={onClickClose}>
        <CardPanel
          title="Saved Search"
          className="margin-md-bottom"
          contentStyle={{paddingTop: 0}}
          tools={<IconButton onTouchTap={onClickAdd}><AddCircleIcon size={32}/></IconButton>}>

          <TextField value={savedSearchKeyword} floatingLabelText="Search" onChange={onChangeKeyword}/>

          <div style={{maxHeight: '350px', overflow: 'auto', width: '100%'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Origin</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {options.map(p =>
                <tr key={p.id} onClick={() => onClickRow(p)} className={`${selectedSearch && selectedSearch.id === p.id ? 'selected' : ''}`}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.type}</td>
                  <td className="p-none nowrap">
                    {p.type === 'User' ? <IconButton onTouchTap={() => onClickShare(p)}><Share/></IconButton> : null}
                    {p.type === 'User' ? <IconButton onTouchTap={() => onClickEdit(p)}><EditIcon/></IconButton> : null}
                    {p.type === 'User' ? <IconButton onTouchTap={() => onClickDelete(p)}><DeleteIcon/></IconButton> : null}
                  </td>
                </tr>
              )}
              {
                loadingSearchOptions && !options.length ? <tr><td colSpan="3" className="text-center">Loading...</td></tr> : null
              }
              </tbody>
            </table>
          </div>
        </CardPanel>
        <TwoButtonsBlockCustom name1="Search" name2="Close" action1={onClickOK} action2={onClickClose}/>
      </Modal>
    )
  }
}

export default SavedSearchModalView
