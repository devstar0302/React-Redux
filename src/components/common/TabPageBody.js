import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'

const clearStyle = {
  background: 'transparent'
}

export default class TabPageBody extends Component {
  constructor (props) {
    super(props)
    this.navigate = this.navigate.bind(this)
    this.checkPath = this.checkPath.bind(this)
  }

  checkPath (url, number) {
    let urlArray = url.split('/')
    let path = urlArray[urlArray.length - 1]
    const pageUrl = this.props.location.pathname
    let pageArray = pageUrl.split('/')
    let page = pageArray[pageArray.length - 1]
    if (path === page) return true
    let rootPath = urlArray[urlArray.length - 2]
    if ((rootPath === page) && (number === 0)) return true

    return false
  }

  navigate (index) {
    const {tabs, history, onClickTab} = this.props
    onClickTab && onClickTab(index)
    history && history.push(tabs[index].path)
  }

  render () {
    const {tabs, tclass, tab, transparent} = this.props
    let tableclass = tclass || ''

    let active = 0
    if (tab !== undefined) {
      active = tab
    } else {
      tabs.forEach((p, i) => {
        if (this.checkPath(p.path, i)) active = i
      })
    }

    return (
      <div className="tabs-custom flex-vertical flex-1">
        <Tabs
          value={active}
          onChange={this.navigate.bind(this)}
          tabItemContainerStyle={{backgroundColor: 'transparent'}}
          inkBarStyle={{backgroundColor: '#78a8ca'}}>
          {tabs.map((item, i) =>
            <Tab key={i} label={item.title} value={i} buttonStyle={{textTransform: 'none', color: '#46484a'}}/>
          )}
        </Tabs>

        <div className={`tab-content ${tableclass}`} style={transparent ? clearStyle : null}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

TabPageBody.defaultProps = {
  tabs: []
}
