import React from 'react'
import { Field } from 'redux-form'
import axios from 'axios'

import {FormSelect} from 'components/modal/parts'

import {ROOT_URL} from 'actions/config'

export default class Combo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: []
    }
  }

  componentWillMount () {
    const {config} = this.props

    if (config.remote === true) {
      const {url, root, display, value} = config.server
      axios.get(`${ROOT_URL}${url}`).then(res => {
        let {data} = res
        if (root) {
          root.forEach(p => {
            data = data[p]
          })
        }

        const options = (data || []).map(p => ({
          label: p[display] || '',
          value: p[value] || ''
        }))
        this.setState({options})
      })
    } else {
      const options = (config.items || []).map(p => ({
        label: p.display || '',
        value: p.value || ''
      }))
      this.setState({options})
    }
  }
  // render1 () {
  //   let config = this.props.config
  //   let values = this.props.values
  //
  //   let label, input
  //   let width = util.calcWidth(config.width)
  //
  //   if (config.label !== null) {
  //     if (config.label.type === 'place') {
  //
  //     } else {
  //       label = this.props.buildLabel(config.label)
  //       width = util.calcWidth(config.width) - util.calcWidth(config.label.width)
  //     }
  //   }
  //
  //   let defaultValue = config.value
  //
  //   let options = this.state.options.map(item => {
  //     if (item.selected && !defaultValue) defaultValue = item.value
  //     return {
  //       text: item.label,
  //       value: item.value
  //     }
  //   })
  //
  //   if (config.name && values[config.name] !== undefined) {
  //     defaultValue = values[config.name]
  //   }
  //
  //   if (!defaultValue && options.length) {
  //     defaultValue = options[0].value
  //   }
  //
  //   input = (
  //     <div className={`col-md-${width}`}
  //       style={util.convertStyle(config.style)}>
  //       <SelectField className={`form-control ${config.cls || ''}`}
  //         name={config.name}
  //         validation={config.required ? 'required' : null}
  //         defaultValue={defaultValue}
  //         options={options}
  //       />
  //       {this.renderSidebar()}
  //     </div>
  //   )
  //
  //   return util.wrapInputs(label, input, config['useColumn'])
  // }
  render () {
    const {config} = this.props
    const {options} = this.state
    return (
      <Field
        name={config.name}
        label={config.label ? config.label.text : ''}
        component={FormSelect}
        style={config.style}
        className={`valign-top mr-dialog ${config.cls}`}
        disabled={config.disabled}
        options={options}
        defaultValue={options.length ? options[0].value : null}
      />
    )
  }
}

Combo.defaultProps = {
  config: {},
  values: {},
  buildLabel: null
}
