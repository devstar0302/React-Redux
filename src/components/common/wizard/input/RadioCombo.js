import React from 'react'
import {util} from '../WizardUtil'
import {SelectField} from 'material-ui'

export default class RadioCombo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 0
    }

    let config = this.props.config
    let values = this.props.values

    let defaultValue = config.value
    if (config.name && values[config.name] !== undefined) {
      defaultValue = values[config.name]
    }

    if (defaultValue) {
      props.config.items.forEach((item, i) => {
        if (item.value === defaultValue) {
          this.setState({ selected: i })
          return false
        }
      })
    } else {
      props.config.items.forEach((item, i) => {
        if (item.checked) {
          this.setState({ selected: i })
          return false
        }
      })
    }
  }

  buildContent () {
    let config = this.props.config
    let optionItems = config.items || []
    let selected = this.state.selected

    let optionItem = optionItems[selected]
    if (!optionItem) return null

    let items = optionItem.items || []
    if (!items.length) return null

    let content = []
    items.forEach((item, i) => {
      let inputs = this.props.buildInput(item, this.props.values)
      content = content.concat(inputs)
    })

    return content
  }

  onSelectChange (e) {
    let index = e.nativeEvent.target.selectedIndex
    this.setState({
      selected: index
    })
  }

  render () {
    let config = this.props.config

    let label, input, content

    let width = util.calcWidth(config.width)

    if (config.label !== null) {
      label = this.props.buildLabel(config.label)
      width = util.calcWidth(config.width) - util.calcWidth(config.label.width)
    }

    let options = config.items.map(item => {
      return {
        text: item.label,
        value: item.value
      }
    })

    let defaultValue = options[this.state.selected].value

    input = (
      <div className={`col-md-${util.calcWidth(width)}`}
        style={util.convertStyle(config.style)}>

        <SelectField className={`form-control ${config.cls || ''}`}
          name={config.name}
          validation={config.required ? 'required' : null}
          defaultValue={defaultValue}
          options={options}
          onChange={this.onSelectChange.bind(this)}
          ref="select"
        />
      </div>
    )

    content = this.buildContent()

    return (
      <div className="">
        {util.wrapInputs(label, input, false)}
        {content}
      </div>
    )
  }
}

RadioCombo.defaultProps = {
  config: {},
  values: {},
  buildLabel: null,
  buildInput: null
}
