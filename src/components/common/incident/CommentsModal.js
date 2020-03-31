import React, { Component } from 'react'
import moment from 'moment'
import { assign, concat } from 'lodash'

import {Modal, CardPanel} from 'components/modal/parts'

export default class CommentsModal extends Component {
  onHide () {
    this.onClickClose()
  }

  onClickClose () {
    this.props.onClose &&
        this.props.onClose(this)
  }

  onClickAdd () {
    const text = this.refs.comment.value
    if (!text) return showAlert('Please input comment.') // eslint-disable-line no-undef

    const params = {
      text,
      dateCreated: new Date().getTime(),
      user: ''
    }

    let incident = assign({}, this.props.incident)
    incident.comments = concat(incident.comments || [], params)

    this.props.updateDeviceIncident(incident)
  }

  render () {
    let {comments} = this.props.incident

    return (
      <Modal title="Comment" onRequestClose={this.onClickClose.bind(this)}>
        <CardPanel>
          <div className="row margin-md-bottom hidden">
            <label className="control-label col-md-2 padding-xs-top">Reason</label>

            <div className="col-md-8">
              <textarea className="form-control" ref="comment" />
            </div>

            <div className="col-md-2">
              <button className="btn btn-primary btn-sm"
                onClick={this.onClickAdd.bind(this)}>Add</button>
            </div>
          </div>

          <div style={{overflow: 'auto', maxHeight: '300px'}}>
            <table className="table">
              <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Reason</th>
              </tr>
              </thead>
              <tbody>

              {(comments || []).map((item, index) =>
                <tr key={index}>
                  <td>{moment(item.dateCreated).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td>{item.user}</td>
                  <td>{item.text}</td>
                </tr>
              )}

              </tbody>
            </table>
          </div>
        </CardPanel>
      </Modal>
    )
  }
}
