import React from 'react'
import MemoryProcessModal from './MemoryProcessModal'

class MemoryTable extends React.Component {
  onClickMem () {
    this.props.showDeviceMemoryProcessModal(true)
  }
  renderContent () {
    const {monitorMemory} = this.props
    const color = monitorMemory ? 'black' : 'lightgray'
    const p = monitorMemory ? monitorMemory.dataobj : {UsedSize: 2000, TotalSize: 4096}
    return (
      <div className="inline-block padding-sm">
        <div style={{position: 'relative', marginBottom: '2px'}} className="inline-block">
          <img alt="" src="/resources/images/dashboard/map/device/monitors/ram.png" width="70" className="padding-sm"/>
          <div className="centered" style={{marginTop: '-4px', color}}>
            {monitorMemory && <span>{Math.ceil(p.UsedSize * 100 / p.TotalSize)}%</span>}
          </div>
        </div>
        {
          monitorMemory
            ? <div style={{fontSize: '11px', color}}>
              {(p.UsedSize / 1024).toFixed(1)}GB / {(p.TotalSize / 1024).toFixed(1)}GB
            </div>
            : <div style={{height: '12px', position: 'relative', background: '#EAEAEA', marginTop: '3px'}}/>
        }

      </div>
    )
  }
  renderMemProcessModal () {
    if (!this.props.memProcessModalOpen) return null
    return (
      <MemoryProcessModal {...this.props}/>
    )
  }
  render () {
    return (
      <div className="inline-block valign-top" onClick={this.onClickMem.bind(this)}>
        {this.renderContent()}
        {this.renderMemProcessModal()}
      </div>
    )
  }
}

export default MemoryTable
