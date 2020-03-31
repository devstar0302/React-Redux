import React from 'react'
import Dimen from 'react-dimensions'

class AccelMeterView extends React.Component {
  render () {
    const {value, title} = this.props
    return (
      <div>
        {title}
        <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
          <div>
            <div className="ant-progress-outer">
              <div className="ant-progress-inner">
                <div className="ant-progress-bg" style={{width: `${value}%`, height: 16}}>
                </div>
              </div>
            </div>
            <span className="ant-progress-text">{value}%</span>
          </div>
        </div>
      </div>
    )
  }

  // render () {
  //   return (
  //     <div className="text-center svg-accel" style={{width: '100%', height: '100%', position: 'relative'}}>
  //       <AccelView
  //         value={this.props.value}
  //         width={Math.min(this.props.containerWidth, this.props.containerHeight * 2) * 0.9}
  //         height={this.props.containerHeight * 0.8}
  //         label=""
  //       />
  //     </div>
  //   )
  // }
}

export default Dimen()(AccelMeterView)
