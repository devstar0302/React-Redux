import React from 'react'
import CpuProcessModal from './CpuProcessModal'
class CpuTable extends React.Component {
  onClickCPU () {
    this.props.showDeviceCpuProcessModal(true)
  }
  buildProgress (val) {
    let color = 'red'
    if (val < 70) color = 'green'
    else if (val < 90) color = '#fec835'

    return (
      <div className="progress" style={{height: '12px', position: 'relative'}}>
        <div className="progress-label" style={{fontSize: '9px', top: '1px', textAlign: 'center', position: 'absolute', width: '100%', color: 'black'}}>{val}%</div>
        <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style={{width: `${val}%`, backgroundColor: color}}/>
      </div>
    )
  }
  renderCpuProcessModal () {
    if (!this.props.cpuProcessModalOpen) return null
    return (
      <CpuProcessModal {...this.props}/>
    )
  }
  renderContent () {
    const {monitorCpu} = this.props
    const cpus = monitorCpu ? monitorCpu.dataobj : [{Usage: 0}]
    return (cpus.length ? cpus : [cpus]).map((d, i) =>
      <div key={i} className="inline-block padding-sm">
        <img src="/resources/images/dashboard/map/device/monitors/cpu.gif" width="70" style={{marginBottom: '5px', padding: '2px'}} alt=""/>
        <div className="inline" style={{marginTop: '5px'}}>
          {
            monitorCpu ? this.buildProgress(d.Usage) : <div style={{height: '12px', position: 'relative', background: '#EAEAEA'}}/>
          }
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className="inline-block valign-top" onClick={this.onClickCPU.bind(this)}>
        {this.renderContent()}
        {this.renderCpuProcessModal()}
      </div>
    )
  }
}

export default CpuTable
