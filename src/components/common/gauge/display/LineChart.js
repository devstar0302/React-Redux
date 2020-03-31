import React from 'react'
import Dimen from 'react-dimensions'
import {Line} from 'react-chartjs-2'

class LineChart extends React.Component {
  render () {
    const {chartData, chartOptions} = this.props
    return (
      <Line data={chartData} options={chartOptions} width={this.props.containerWidth} height={this.props.containerHeight} />
    )
  }
}

export default Dimen()(LineChart)
