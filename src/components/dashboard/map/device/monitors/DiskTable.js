import React from 'react'

class DiskTable extends React.Component {
  renderContent () {
    const {monitorDisk} = this.props
    const color = monitorDisk ? null : 'lightgray'
    const disks = monitorDisk ? monitorDisk.dataobj : [{Drives: [{DeviceId: 1, Name: 'C:', TotalSpace: 128, FreeSpace: 30}]}]
    return disks.map(d =>
      d.Drives.map(p =>
        <div key={`${d.DeviceID}-${p.Name}`} className="inline-block padding-sm">
          <div style={{position: 'relative', marginBottom: '2px'}} className="inline-block">
            <img src="/resources/images/dashboard/map/device/monitors/drive.png" width="70" alt=""/>
            <div className="centered text-white" style={{marginTop: '-4px', color}}>
              {monitorDisk && <span>{Math.ceil((p.TotalSpace - p.FreeSpace) * 100 / p.TotalSpace)}%</span>}
            </div>
          </div>
          <div style={{fontSize: '11px', color}}>
            {
              monitorDisk
                ? <span>{p.Name} {p.FreeSpace}GB / {p.TotalSpace}GB</span>
                : <div style={{height: '12px', position: 'relative', background: '#EAEAEA', marginTop: '3px'}}/>
            }

          </div>
        </div>
      )
    )
  }
  render () {
    return (
      <div className="inline-block valign-top">
        {this.renderContent()}
      </div>
    )
  }
}

export default DiskTable
