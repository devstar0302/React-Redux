import React from 'react'
import {Card, CardText} from 'material-ui'
import CardLegend from './CardLegend'
export default class CardPanel extends React.Component {
  render () {
    const {contentStyle} = this.props
    return (
      <div className={this.props.className} style={this.props.style}>
        <CardLegend>
          {this.props.title}
          {this.props.tools ? (
            <div className="pull-right" style={{marginTop: -13}}>
              {this.props.tools}
            </div>
          ) : null}
        </CardLegend>
        <Card>
          <CardText style={contentStyle}>
            {this.props.children}
          </CardText>
        </Card>
      </div>
    )
  }
}
