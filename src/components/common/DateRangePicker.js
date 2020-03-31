import React from 'react'
import 'bootstrap-daterangepicker/daterangepicker.css'
import ReactDateRangePicker from 'react-bootstrap-datetimerangepicker'
import moment from 'moment'
import {keys, assign, isString, isNumber} from 'lodash'
import {dateFormat} from 'shared/Global'

const locale = {
  format: dateFormat,
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: moment.localeData().firstDayOfWeek()
}

export const getRanges = () => {
  return {
    'Ever': [
      moment('2000-01-01'),
      moment().endOf('year')
    ],
    [moment().add('-1', 'years').format('YYYY')]: [
      moment().add('-1', 'years').startOf('year'),
      moment().add('-1', 'years').endOf('year')
    ],
    [moment().startOf('years').format('YYYY')]: [
      moment().startOf('year'),
      moment().endOf('year')
    ],
    [moment().add('-1', 'months').format('MMMM')]: [
      moment().add(-1, 'months').startOf('month'),
      moment().add(-1, 'months').endOf('month')
    ],
    [moment().startOf('month').format('MMMM')]: [
      moment().startOf('month'),
      moment().endOf('month')
    ],
    'Last 30 Days': [
      moment().add(-30, 'days').startOf('day'),
      moment().endOf('day')
    ],
    'Last 7 Days': [
      moment().add(-6, 'days').startOf('day'),
      moment().endOf('day')
    ],
    'Last 3 Months' : [
      moment().add(-3, 'months').startOf('day'),
      moment().endOf('day')
    ],
    'Last 6 Months' : [
      moment().add(-6, 'months').startOf('day'),
      moment().endOf('day')
    ],
    'Last 1 Year' : [
      moment().add(-12, 'months').startOf('day'),
      moment().endOf('day')
    ],
    'Since Yesterday': [
      moment().add(-1, 'days').startOf('day'),
      moment().endOf('day')
    ],
    'Yesterday': [
      moment().add(-1, 'days').startOf('day'),
      moment().add(-1, 'days').endOf('day')
    ],
    'Today': [
      moment().startOf('day'),
      moment().endOf('day')
    ],
    'Last Hour': [
      moment().add(-1, 'hours').startOf('minute'),
      moment().endOf('minute')
    ]
  }
}

export const getRangeLabel = (rangeConfig, startDate, endDate, allowEmpty) => {
  const momentStartDate = isString(startDate) ? moment(startDate, dateFormat) : (isNumber(startDate) ? moment(startDate) : startDate)
  const momentEndDate = isString(endDate) ? moment(endDate, dateFormat) : (isNumber(endDate) ? moment(endDate) : endDate)

  const startDateStr = momentStartDate.format(dateFormat)
  const endDateStr = momentEndDate.format(dateFormat)

  let label = ''

  keys(rangeConfig).forEach(key => {
    if (rangeConfig[key][0].format(dateFormat) === startDateStr &&
      rangeConfig[key][1].format(dateFormat) === endDateStr) {
      label = key
    }
  })

  if (!label && !allowEmpty) label = `${startDateStr} - ${endDateStr}`
  return {label, momentStartDate, momentEndDate}
}

export default class DateRangePicker extends React.Component {
  constructor (props) {
    super(props)

    const rangeConfig = getRanges()
    this.state = {
      rangeConfig
    }
  }

  onApply (e, dp) {
    this.props.onApply && this.props.onApply(dp)
  }

  render () {
    const {rangeConfig} = this.state
    let { className, startDate, endDate, children, renderer, style } = this.props

    const {label, momentStartDate, momentEndDate} = getRangeLabel(rangeConfig, startDate, endDate)


    return (
      <ReactDateRangePicker
        timePicker
        timePicker24Hour
        showDropdowns
        timePickerSeconds
        linkedCalendars={false}
        locale={locale}
        alwaysShowCalendars

        ranges={rangeConfig}

        startDate={momentStartDate}
        endDate={momentEndDate}

        style={assign({}, style, {display: 'inline-block'})}
        className={className}

        onApply={this.onApply.bind(this)}
      >
        {renderer ? null : <div className={renderer ? 'hidden' : 'link'}>{label}</div>}
        {renderer ? <div className="nowrap">{renderer(label)}</div> : null}
        {children}
      </ReactDateRangePicker>
    )
  }
}
