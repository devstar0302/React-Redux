import React from 'react'
import {RaisedButton} from 'material-ui'

export default class DoneButton extends React.Component {
  render () {
    return (
      <div className="text-right" style={{position: 'absolute', bottom: 16, right: 16}}>
        <RaisedButton label="Done" onTouchTap={this.props.onClick}/>
      </div>
    )
  }
}
