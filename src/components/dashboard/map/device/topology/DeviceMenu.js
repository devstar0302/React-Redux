import React from 'react'
import DeviceImg from './DeviceImg'

export default class DeviceMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

      keyword: '',
      deviceTypes: [],
      activePanel: 1
    }
  }

  onChangeDeviceSearch (e) {
    let keyword = e.target.value
    this.setState({keyword})
  }

  onClickItem (item, e) {
    const {onClickItem} = this.props
    onClickItem && onClickItem(item, {
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  handleSelect (activePanel) {
    this.setState({ activePanel })
  }

  render () {
    let devicePanels = []

    let deviceTypes = []

    const categories = []
    this.props.deviceTemplates.forEach(p => {
      if (categories.indexOf(p.devicetemplategroup) < 0) categories.push(p.devicetemplategroup)
    })
    categories.sort()

    categories.forEach(deviceCategory => {
      if (deviceCategory.name === 'GROUPS') return
      const items = this.props.deviceTemplates.filter(i => i.devicetemplategroup === deviceCategory).map(u => {
        return {
          title: u.name,
          img: u.image || 'windows.png',
          template: u
        }
      })
      if (items.length === 0) return

      deviceTypes.push({
        title: deviceCategory,
        items
      })
    })

    let hasActive = false
    let firstPanelIndex = -1

    deviceTypes.forEach((section, sectionIndex) => {
      let items = false

      section.items.forEach((item, typeIndex) => {
        if ((item.title || '').toLowerCase().indexOf(this.state.keyword.toLowerCase()) < 0) return
        items = true
      })

      if (!items) return

      if (firstPanelIndex < 0) firstPanelIndex = sectionIndex
      if (sectionIndex === this.state.activePanel) hasActive = true
    })
    const activeKey = !hasActive && firstPanelIndex >= 0 ? firstPanelIndex : this.state.activePanel

    deviceTypes.forEach((section, sectionIndex) => {
      let deviceItems = []

      section.items.forEach((item, typeIndex) => {
        const selected = this.props.selectedItem.title === item.title

        if (item.title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) < 0) return
        deviceItems.push(
          <li key={typeIndex} className={selected ? 'active' : ''} onClick={this.onClickItem.bind(this, item)}>
            <DeviceImg {...item}/>
          </li>
        )
      })

      if (!deviceItems.length) return

      devicePanels.push(
        <div className="panel panel-default" key={sectionIndex} onClick={this.handleSelect.bind(this, sectionIndex)}>
          <div className="panel-heading">
            <div className="link">{section.title}</div>
          </div>
          <ul className={activeKey === sectionIndex ? '' : 'hidden'} style={{background: 'black'}}>
            {deviceItems}
          </ul>
        </div>
      )
    })

    return (
      <div className="panel-group devicediv" id="device-menu" style={{top: '32px'}}>
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="navbar-search" style={{paddingLeft: '5px'}}>
              <input type="text" placeholder="Search …" className="form-control" onChange={this.onChangeDeviceSearch.bind(this)}/>
            </div>
          </div>
        </div>

        <div>
          {devicePanels}
        </div>
      </div>
    )
  }
}
DeviceMenu.defaultProps = {
  selectedItem: {},
  onClickItem: null
}
