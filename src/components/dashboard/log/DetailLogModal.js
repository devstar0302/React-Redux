import React from 'react'
import { keys, reverse } from 'lodash'
import axios from 'axios'

import DetailLogModalView from './DetailLogModalView'
import { encodeUrlParams } from 'shared/Global'
import { ROOT_URL } from 'actions/config'

export default class DetailLogModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  getData (res) {
    const embedded = res._embedded
    const data = embedded[keys(embedded)[0]]
    return data
  }

  componentWillMount () {
    const {detailLogViewParam} = this.props
    axios.all([
      axios.get(`${ROOT_URL}/search/all?${encodeUrlParams({
        ...detailLogViewParam,
        sortDir: 'desc'
      })}`),
      axios.get(`${ROOT_URL}/search/all?${encodeUrlParams({
        ...detailLogViewParam,
        dateFromEpoch: detailLogViewParam.dateToEpoch + 1,
        dateToEpoch: 0,
        sortDir: 'asc'
      })}`)
    ]).then(res => {
      const data1 = reverse(this.getData(res[0].data))
      const data2 = this.getData(res[1].data)

      this.setState({data: [...data1, ...data2]})
    })
  }

  onHide () {
    this.props.showDetailLogModal(false)
  }

  render () {
    return (
      <DetailLogModalView
        onHide={this.onHide.bind(this)}
        rowId={this.props.detailLogViewParam.rowId}
        items={this.state.data}
      />
    )
  }
}
