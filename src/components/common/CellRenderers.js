import React from 'react'
import moment from 'moment'
import {assign, concat, isArray, keys} from 'lodash'

export function renderEntity (entity, options) {
  const data = assign({}, entity)
  if (data.id) delete data.id
  if (data._links) delete data._links
  return renderData(data, false, '', options)
}

function renderValue (val, path, options) {
  let startChar, endChar
  let children = []
  if (typeof val === 'object' && val !== null) {
    startChar = isArray(val) ? '[' : '{'
    endChar = isArray(val) ? ']' : '}'

    if (isArray(val)) {
      val.forEach((item, index) => {
        children.push(renderValue(item, `${path}[${index}]`, options))
        if (index < val.length - 1) children.push(<div className="field-separator" key={`${path}-sep-${index}`}/>)
      })
    } else {
      children = renderData(val, true, path, options)
    }

    return concat([],
      <span className="field-key" key={`${path}-char-1`}>{startChar}&nbsp;</span>,
      children,
      <span className="field-key" key={`${path}-char-2`}>&nbsp;{endChar}</span>
    )
  }

  let valStr = val
  const attrs = {}
  if (options.timeField && path === `.${options.timeField}`) {
    valStr = moment(val).fromNow()
    attrs['data-tip'] = moment(val).format('YYYY-MM-DD HH:mm:ss')
  }
  return (
    <span {...attrs} key={`${path}-val`} className="field-value" dangerouslySetInnerHTML={{__html: `${valStr}`}}/> // eslint-disable-line
  )
}

function renderData (entity, isChildren, path, options) {  // eslint-disable-line
  let children = []
  const allKeys = keys(entity)
  allKeys.forEach((key, index) => {
    if (entity[key] === null && options && options['notNull']) return
    children.push(<span className="field-key" key={`${path}-key-${key}`}>{key} = </span>)
    children = concat(children, renderValue(entity[key], `${path}.${key}`, options))
    if (index < allKeys.length - 1) children.push(<div className="field-separator" key={`${path}-sep-${index}`}/>)
  })
  if (isChildren) return children
  return <div className="inline-block">{children}</div>
}
