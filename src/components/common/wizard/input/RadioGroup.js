import React from 'react'
import { showAlert } from 'components/common/Alert'

export default class RadioGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let config = this.props.config

    $.each(config.items || [], function (i, radioItem) {
      let radio, content
      radio = this.props.buildRadio(radioItem, config.name)
      content = this.props.buildRadioContent(radioItem.items)
      text.push(radio)

      // Event
      radio.find('input').first().change(function () {
        let previous = text[(config.label ? 1 : 0) + config.items.length - 1]
        let parent = previous.parent()

        if (contents.length) {
          $.each(contents, function (j, div) {
            div.detach()
          })
        }

        if (content.length) {
          $.each(content, function (j, div) {
            div.insertAfter(previous)
            previous = div
          })
          $.each(content, function (j, div) {
            reset(div)
          })
        }

        if (radioItem.form) {
          let mainDiv = $('#stepadvanced')
          let body = mainDiv.find('.panel-body')
          body.children().remove()
          let items = radioItem.form[0].items
          for (let i = 0; i < items.length; i++) {
            let rows = buildInput(items[i])
            if (!rows) continue
            body.append(rows)
          }

          // Dialog Show
          let dlg = mainDiv.dialog({
            modal: true,
            width: 520,
            title: '',
            resizable: false
          })
          refineDialog(dlg)

          // Dialog Close
          $('#stepadvanced > .panel > .panel-heading [data-rel=close]').off('click').click(function (e) {
            dlg.dialog('destroy')
          })

          mainDiv.find('.btn-cancel').off('click').on('click', function (e) {
            dlg.dialog('destroy')
          })

          mainDiv.find('.btn-save').off('click').on('click', function (e) {
            let params = {}
            $.each(dlg.find('input, select'), function () {
              let input = $(this)
              let key = input.attr('name')
              if (!key) return
              params[key] = input.val() || ''
            })

            $.ajax({
              dataType: 'json',
              url: radioItem.form[0].server.url,
              data: params,
              async: false
            }).fail(function (jqxhr, res) {
              showAlert('Add User Failed')

              dlg.dialog('destroy')
            }).done(function (data) {
                            // Add Value To List
              let select = steps.find(`[name=${radioItem.form[0].result}]`)
              if (select.length) {
                let val = data[radioItem.form[0].server.value]
                if (val) {
                  let opt = $('<option/>')
                  opt.attr('value', val)
                  opt.text(data[radioItem.form[0].server.label])
                  select.append(opt)
                  select.val(val)
                }
              }

              dlg.dialog('destroy')
            })
          })
        }
      })
      contents = contents.concat(content)

      if (radioItem.checked) curcontent = content
    })
    text = text.concat(curcontent)

    // Init
    text[config.label ? 1 : 0].find('input').first().change()

    col.addClass(template['col-xs'] + calcWidth(config.width))

    return text
  }
}

RadioGroup.defaultProps = {
  config: {},
  values: {},
  buildRadio: null,
  buildRadioContent: null
}
