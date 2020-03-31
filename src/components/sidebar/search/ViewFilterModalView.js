import React from 'react'
import {Checkbox} from 'material-ui'
import {keys} from 'lodash'

import {TwoButtonsBlockCustom, Modal, CardPanel} from 'components/modal/parts'

import {Tabs, Tab} from 'material-ui/Tabs'
import {viewFilters} from 'shared/Global'

export default class ViewFilterModalView extends React.Component {
  render () {
    const {onClickOK, onClickClose, selectViewFilter, selectedViewFilter, cols, viewCols} = this.props
    return (
      <Modal title="View Filter" onRequestClose={onClickClose}>
        <CardPanel title="View Filter">
          <Tabs>
            <Tab label="Predefined">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {keys(viewFilters).map(k =>
                    <tr
                      key={k}
                      onClick={() => selectViewFilter(viewFilters[k].name)}
                      className={selectedViewFilter === viewFilters[k].name ? 'selected' : ''}>
                      <td>{viewFilters[k].name}</td>
                      <td>{viewFilters[k].desc}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Tab>
            <Tab label="Specific">
              <div style={{maxHeight: 300, overflow: 'auto'}}>
                <table className="table table-hover">
                  <tbody>
                  {cols.map(k =>
                    <tr key={k}>
                      <td><Checkbox label={k} checked={viewCols.indexOf(k) >= 0} onCheck={() => this.props.toggleViewCol(k)}/></td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Tab>
          </Tabs>
        </CardPanel>
        <TwoButtonsBlockCustom name2="OK" action2={onClickOK}/>
      </Modal>
    )
  }
}
