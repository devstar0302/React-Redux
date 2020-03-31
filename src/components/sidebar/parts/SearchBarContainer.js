import React, { Component } from 'react'
import SearchBar from './SearchBar'

export default class SearchBarContainer extends Component {
  componentDidMount () {
    this.props.updateSidebarSearchActive(false)
  }
  onBackgroundChange () {
    this.props.updateSidebarSearchActive(!this.props.sidebarSearchActive)
  }

  onEnter (e) {
    if (e.charCode === 13) {
      let value = e.currentTarget.value
      let input = document.getElementById('searchInput')
      input.value = ''
      input.blur()
      this.props.onSearch(value)
    }
  }

  render () {
    return (
      <SearchBar
        defaultKeyword={this.props.defaultKeyword}
        onSearch={this.onEnter.bind(this)}
        active={this.props.sidebarSearchActive}
        onBackgroundChange={this.onBackgroundChange.bind(this)}
      />
    )
  }
}
