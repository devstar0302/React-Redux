import React from 'react'
import Dimen from 'react-dimensions'
import {Pie} from 'react-chartjs-2'

const chartOptions = {
  legend: {
    display: false
  },
  elements: {
    line: {
      tension: 0
    }
  }
}

class PieChart extends React.Component {
  render () {
    const {chartData} = this.props
    return (
      <Pie data={chartData} options={chartOptions} width={this.props.containerWidth} height={this.props.containerHeight} />
    )
  }
}

export default Dimen()(PieChart)
