import QueryParser from 'lucene'
import {assign} from 'lodash'

const implicit = '<implicit>'

export function findField (parsed, field) {
  if (parsed.field) {
    return parsed.field === field ? { field: parsed, parent: [] } : null
  }

  if (parsed.left) {
    const res = findField(parsed.left, field)
    if (res) {
      res.parent.push({
        field: parsed,
        type: 'left'
      })
      return res
    }
  }

  if (parsed.right) {
    const res = findField(parsed.right, field)
    if (res) {
      res.parent.push({
        field: parsed,
        type: 'right'
      })
      return res
    }
  }

  return null
}

function prefixCharWithBackslashes(char) {
  return '\\' + char;
}

function escapeQuotedTerm(s) {
  return s.replace(/"/g, prefixCharWithBackslashes);
}

export function queryToString(ast) {
  if (!ast) {
    return '';
  }

  var result = '';

  if (ast.start != null) {
    result += ast.start + ' ';
  }

  if (ast.field && ast.field !== implicit) {
    result += ast.field + ':';
  }

  if (ast.left) {
    if (ast.parenthesized) {
      result += '(';
    }
    result += queryToString(ast.left);
  }

  if (ast.operator) {
    if (ast.left) {
      result += ' ';
    }

    if (ast.operator !== implicit) {
      result += ast.operator;
    }
  }

  if (ast.right) {
    if (ast.operator && ast.operator !== implicit) {
      result += ' ';
    }
    result += queryToString(ast.right);
  }

  if (ast.parenthesized && ast.left) {
    result += ')';
  }

  if (ast.term) {
    if (ast.prefix) {
      result += ast.prefix;
    }
    if (ast.quoted) {
      result += '"';
      result += escapeQuotedTerm(ast.term);
      result += '"';
    } else {
      result += ast.term;
    }

    if (ast.proximity != null) {
      result += '~' + ast.proximity;
    }

    if (ast.boost != null) {
      result += '^' + ast.boost;
    }
  }

  if (ast.term_min) {
    if (ast.inclusive) {
      result += '[';
    } else {
      result += '{';
    }

    result += ast.term_min;
    result += ' TO ';
    result += ast.term_max;

    if (ast.inclusive) {
      result += ']';
    } else {
      result += '}';
    }
  }

  if (ast.similarity) {
    result += '~';

    if (ast.similarity !== 0.5) {
      result += ast.similarity;
    }
  }

  return result;
}


function clearObject(object) {
  for (const member in object) delete object[member]
}

export function removeField(found, startParent) {
  if (!found) return

  if (startParent) {
    return removeField({parent: found.parent.slice(1)})
  }

  let parentIndex = 0
  while (parentIndex < found.parent.length) {
    const item = found.parent[parentIndex]
    const itemfield = item.field
    if (item.type === 'left') {
      if (itemfield.right) {
        itemfield.left = itemfield.right
        delete itemfield.right
        delete itemfield.operator
        break
      } else {
        if (parentIndex === found.parent.length - 1) {
          clearObject(itemfield)
        }
      }
    } else {
      delete itemfield.right
      delete itemfield.operator
      break
    }
    parentIndex++
  }
}

export function modifyArrayValues (query, field, values, operator = 'OR') {
  let parsed
  try {
    parsed = QueryParser.parse(query)
    if (!parsed) return null
  } catch (e) {
    return null
  }

  let newQuery = query
  const found = findField(parsed, field)
  const el = values && values.length ? `(${field}:${values.join(` ${operator} `)})` : ''
  if (found) {
    const parent = found.parent[0].field

    if (el) {
      clearObject(parent)
      assign(parent, QueryParser.parse(el).left)

      let parentIndex = 1
      while (parentIndex < found.parent.length) {
        if (found.parent[parentIndex].field.right) break
        clearObject(found.parent[parentIndex].field)
        assign(found.parent[parentIndex].field, parent)
        parentIndex++
      }
    } else {
      removeField(found)
    }

    newQuery = queryToString(parsed)
  } else {
    if (newQuery && el) newQuery = `${newQuery} AND `
    newQuery = `${newQuery}${el}`
  }

  return newQuery
}

export function modifyFieldValue (query, field, value, quote) {
  let parsed
  try {
    parsed = QueryParser.parse(query)
    if (!parsed) return null
  } catch (e) {
    return null
  }

  let newQuery = query
  const found = findField(parsed, field)
  if (found) {
    if (value){
      found.field.term = value
      found.field.quoted = !!quote
    } else
      removeField(found)
    newQuery = queryToString(parsed)
  } else if (value !== null) {
    const el = `(${field}:${quote ? '"' : ''}${value}${quote ? '"' : ''})`
    if (newQuery && el) newQuery = `${newQuery} AND `
    newQuery = `${newQuery}${el}`
  }

  return newQuery
}

export function getArrayValues (parsed, field, def) {
  const values = []
  if (!parsed) return def ? def : values
  let found = findField(parsed, field)
  if (found) {
    found = found.parent[0].field
    while(found) {
      if (found.left) values.push(found.left.term)
      else if (found.term) values.push(found.term)
      found = found.right
    }
  }

  return values.length || !def ? values : def
}

export function getFieldValue (parsed, field) {
  if (!parsed) return null
  let found = findField(parsed, field)
  if (found) {
    return found.field.term
  }
  return null
}
