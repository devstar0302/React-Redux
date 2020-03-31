import React from 'react'

import { MAX_WIDTH } from './WizardConfig'

export const util = {

  calcWidth (width) {
    width = width || MAX_WIDTH
    if (width > MAX_WIDTH) width = MAX_WIDTH
    if (width < 1) width = 1
    return width
  },

  convertStyle (style) {
    let newStyle = {}
    style && $.each(style, (k, v) => { // eslint-disable-line no-undef
      let name = k.replace(/(-)(\w)/g, (match, m1, m2) => {
        return m2.toUpperCase()
      })

      newStyle[name] = v
    })

    return newStyle
  },

  wrapInputs (input, useColumn) {
    if (useColumn) return input
    return (
      <div>
          {input}
      </div>
    )
  }
}
