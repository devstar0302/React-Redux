import React, { Component } from 'react'

export default class Signout extends Component {

  componentWillMount () {
    this.props.signOut()
  }

  render () {
    return (
      <div>
          See you nex time...
      </div>
    )
  }
}
