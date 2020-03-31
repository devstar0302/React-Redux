import React, { Component } from 'react'
import Autocomplete from 'react-autocomplete'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { CloseButton, Modal, CardPanel } from 'components/modal/parts'
import { buttonStyle, iconStyle } from 'style/common/materialStyles'

export default class DeviceSearchModalView extends Component {
  render () {
    const {onHide, value, selected, items, styles,
      onSelect, onChange, onRemove} = this.props
    return (
      <Modal title="Device Search" onRequestClose={onHide}>
        <CardPanel title="Device Search">
          <div className="search-modal-container">
            <div className="autocomplete-wrapper">
              <Autocomplete
                inputProps={{
                  name: 'Device',
                  id: 'device-autocomplete',
                  placeholder: 'Search...'
                }}
                className="form-control input-sm"
                menuStyle={{
                  borderRadius: '3px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 0',
                  fontSize: '90%',
                  position: 'absolute',
                  zIndex: '2',
                  overflow: 'auto',
                  maxHeight: '300px',
                  top: '100%',
                  left: 0
                }}
                ref="autocomplete"
                value={value}
                items={items}
                getItemValue={(item) => item.name}
                onSelect={onSelect}
                onChange={onChange}
                renderItem={(item, isHighlighted) => (
                    <div
                      style={isHighlighted ? styles.highlightedItem : styles.item}
                      key={item.id}
                      id={item.id}
                    >{item.name}</div>
                )}
              />
            </div>
          </div>
          <div className="margin-md-top" style={{height: '300px', overflow: 'auto'}}>
            <table className="table table-hover">
              <tbody>
              {
                selected.map(device =>
                  <tr className="p-none" key={device.id}>
                    <td className="table-label">{device.name}</td>
                    <td className="table-icon">
                      <div className="remove-button">
                        <IconButton
                          style={buttonStyle}
                          iconStyle={iconStyle}
                          onTouchTap={onRemove.bind(this, device)}>
                            <DeleteIcon color="#545454"/>
                        </IconButton>
                      </div>
                      {/* <a href="javascript:;" onClick={onRemove.bind(this, device)}>
                        <i className="fa fa-times" />
                      </a> */}
                    </td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
        </CardPanel>
        <CloseButton onClose={onHide}/>
      </Modal>
    )
  }
}
