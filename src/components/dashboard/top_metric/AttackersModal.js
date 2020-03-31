import React from 'react'
import { SmallModalTable } from 'components/modal'

export default class AttackersModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }

    // let { countries } = this.props

    this.cells = [{
      'displayName': 'Source IP',
      'columnName': 'ip',
      'cssClassName': 'width-100'
      // 'customComponent': (props) => {
      //   let row = props.rowData
      //   let val = props.data
      //   let index = findIndex(countries, {name: row.ipcountry})
      //   if (index < 0) return <span>{val}</span>
      //
      //   let isoCode = (countries[index].alpha2 || '').toLowerCase()
      //   let flag
      //   if (!isoCode) isoCode = '_European Union'
      //   if (isoCode) flag = <img src={`/images/flags/${isoCode}.png`} title={row.ipcountry}/>
      //
      //   return <span>{flag}&nbsp;{val}</span>
      // }
    }, {
      'displayName': '# Of Attacks',
      'columnName': 'count',
      'cssClassName': 'width-100'
    }, {
      'displayName': 'Attack Duration',
      'columnName': 'duration'
      // 'customComponent': (props) => {
      //   let row = props.rowData
      //   let val = props.data
      //   let from = this.dateFormatter(val)
      //   let to = this.dateFormatter(row.max)
      //   return <span>{`${from} - ${to}`}</span>
      // }
    }, {
      'displayName': 'Attack Risk',
      'columnName': 'severity',
      'cssClassName': 'text-center'
    }, {
      'displayName': 'Attacked Systems',
      'columnName': 'targets',
      'cssClassName': 'width-140'
    }]
  }

  componentWillMount () {
    this.props.fetchAttackers()
  }

  renderTable () {

  }

  onHide () {
    this.onClickClose()
  }

  closeModal () {
    this.props.onClose()
  }

  onClickClose () {
    this.closeModal()
  }

  render () {
    return (
      <SmallModalTable
        show
        onHide={this.onHide.bind(this)}
        onClose={this.onClickClose.bind(this)}
        cells={this.cells}
        header="Attackers Today"
        data={this.props.attackers}
        useExternal={false}
        row={{'key': 'ip'}}
        height={500}
      />
    )
  }
}
