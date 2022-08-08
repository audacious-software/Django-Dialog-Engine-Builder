define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class HttpResponseNode extends Node {
    editBody () {
      const destinationNodes = this.destinationNodes(this)

      let body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_url_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_url_value" class="mdc-floating-label">HTTP URL</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <input type="text" class="mdc-text-field__input" style="width: 100%" id="' + this.cardId + '_url_value">'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_http_method" style="width: 100%">'
      body += '  <div class="mdc-select__anchor">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <span class="mdc-notched-outline__notch">'
      body += '        <span id="outlined-select-label" class="mdc-floating-label">HTTP Method</span>'
      body += '      </span>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-select__selected-text-container">'
      body += '      <span class="mdc-select__selected-text"></span>'
      body += '    </span>'
      body += '    <span class="mdc-select__dropdown-icon">'
      body += '      <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
      body += '        <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>'
      body += '        <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>'
      body += '      </svg>'
      body += '    </span>'
      body += '  </div>'
      body += '  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
      body += '    <ul class="mdc-list" role="listbox" aria-label="HTTP Method">'
      body += '      <li class="mdc-list-item" aria-selected="false" data-value="GET" role="option">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text">GET</span>'
      body += '      </li>'
      body += '      <li class="mdc-list-item" aria-selected="false" data-value="POST" role="option">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text">POST</span>'
      body += '      </li>'
      body += '    </ul>'
      body += '  </div>'
      body += '</div>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" id="' + this.cardId + '_headers_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_headers_value" class="mdc-floating-label">HTTP Headers</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <textarea class="mdc-text-field__input" rows="4" style="width: 100%" id="' + this.cardId + '_headers_value"></textarea>'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" id="' + this.cardId + '_parameters_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_parameters_value" class="mdc-floating-label">HTTP Parameters</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <textarea class="mdc-text-field__input" rows="4" style="width: 100%" id="' + this.cardId + '_parameters_value"></textarea>'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">'
      body += '  <div class="mdc-typography--subtitle2">Timeout Parameters</div>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">'
      body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_timeout_seconds"  style="width: 100%">'
      body += '    <input type="number" min="0" step="1" class="mdc-text-field__input" id="' + this.cardId + '_timeout_seconds_value">'
      body += '    <div class="mdc-notched-outline">'
      body += '      <div class="mdc-notched-outline__leading"></div>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_timeout_seconds_value" class="mdc-floating-label">Seconds</label>'
      body += '      </div>'
      body += '      <div class="mdc-notched-outline__trailing"></div>'
      body += '    </div>'
      body += '  </div>'
      body += '  <a class="mdc-typography--caption" href="#" id="' + this.cardId + '_clear_timeout" style="display: inline-block; padding-left: 4px;">Clear Timeout</a>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">'
      body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_timeout_times" style="width: 100%">'
      body += '    <input type="number" step="1" class="mdc-text-field__input" id="' + this.cardId + '_timeout_times_value">'
      body += '    <div class="mdc-notched-outline">'
      body += '      <div class="mdc-notched-outline__leading"></div>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_timeout_times_value" class="mdc-floating-label">Times</label>'
      body += '      </div>'
      body += '      <div class="mdc-notched-outline__trailing"></div>'
      body += '    </div>'
      body += '  </div>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4" style="text-align: right;">'

      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_timeout_edit">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'

      let found = false

      for (let j = 0; j < destinationNodes.length; j++) {
        const destinationNode = destinationNodes[j]

        if (this.definition.timeout_node_id !== undefined) {
          if (destinationNode.id === this.definition.timeout_node_id) {
            found = true
          }
        }
      }

      if (found === false && this.definition.timeout_node_id !== undefined) {
        const node = this.dialog.resolveNode(this.definition.timeout_node_id)

        if (node !== null) {
          found = true
        }
      }

      if (found) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_timeout_click">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
        body += '  </button>'
      }

      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 20px; border-top: thin solid #AAABAA;">'
      body += '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_pattern_matcher" style="width: 100%">'
      body += '  <div class="mdc-select__anchor">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <span class="mdc-notched-outline__notch">'
      body += '        <span id="outlined-select-label" class="mdc-floating-label">Pattern Matcher</span>'
      body += '      </span>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-select__selected-text-container">'
      body += '      <span class="mdc-select__selected-text"></span>'
      body += '    </span>'
      body += '    <span class="mdc-select__dropdown-icon">'
      body += '      <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
      body += '        <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>'
      body += '        <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>'
      body += '      </svg>'
      body += '    </span>'
      body += '  </div>'
      body += '  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
      body += '    <ul class="mdc-list" role="listbox" aria-label="Pattern Matcher">'
      body += '      <li class="mdc-list-item" aria-selected="false" data-value="re" role="option">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text">Regular Expression (Python)</span>'
      body += '      </li>'
      body += '      <li class="mdc-list-item" aria-selected="false" data-value="jsonpath" role="option">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text">JSONPath (JSON)</span>'
      body += '      </li>'
      body += '      <li class="mdc-list-item" aria-selected="false" data-value="xpath" role="option">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text">XPath (XML)</span>'
      body += '      </li>'
      body += '    </ul>'
      body += '  </div>'
      body += '</div>'
      body += '</div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pattern_value_' + i + '"  style="width: 100%">'
        body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_pattern_value_' + i + '_value">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_pattern_value_' + i + '_value" class="mdc-floating-label">Pattern</label>'
        body += '      </div>'
        body += '      <div class="mdc-notched-outline__trailing"></div>'
        body += '    </div>'
        body += '  </div>'
        body += '</div>'

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">'
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit_' + i + '">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
        body += '  </button>'
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto_' + i + '">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
        body += '  </button>'
        body += '</div>'
      }

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right; border-bottom: thin solid #AAABAA; padding-bottom: 20px;">'
      body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_pattern">'
      body += '  <span class="mdc-button__label">Add Pattern</span>'
      body += '</button>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '  <p class="mdc-typography--body1">No Pattern Matched: </p>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_not_found">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'

      if (this.definition.no_match !== undefined) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_not_found">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
        body += '  </button>'
      }

      body += '</div>'

      body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">'
      body += '  <div class="mdc-dialog__container">'
      body += '    <div class="mdc-dialog__surface">'
      body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>'
      body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content" style="padding: 0px;">'
      body += this.dialog.chooseDestinationMenu(this.cardId)
      body += '      </div>'
      body += '    </div>'
      body += '  </div>'
      body += '  <div class="mdc-dialog__scrim"></div>'
      body += '</div>'

      return body
    }

    viewBody () {
      let summary = '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.method + ': ' + this.definition.url + '</em></div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const actionNode = this.dialog.resolveNode(this.definition.actions[i].action)

        if (actionNode !== null) {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + action.pattern + ': go to <em>' + actionNode.cardName() + '</em>.</div>'
        } else {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + action.pattern + ': go to <em>None Selected</em>.</div>'
        }
      }

      if (this.definition.no_match !== undefined && this.definition.no_match !== '') {
        const node = this.dialog.resolveNode(this.definition.no_match)

        summary += '<div class="mdc-typography--body1" style="margin: 16px;">'

        if (node !== null) {
          summary += "If responses doesn't match a pattern, go to <em>" + node.cardName() + '</em>.'
        } else {
          summary += "If responses doesn't match a pattern, go to <em>None Selected</em>."
        }

        summary += '</div>'
      }

      return summary
    }

    initialize () {
      super.initialize()

      const me = this

      const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      const urlField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_url_field'))
      urlField.value = this.definition.url

      $('#' + this.cardId + '_url_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_url_value').val()

        me.definition.url = value

        me.dialog.markChanged(me.id)
      })

      const methodSelect = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_http_method'))
      methodSelect.value = this.definition.method

      methodSelect.listen('MDCSelect:change', () => {
        window.setTimeout(function () {
          me.definition.method = methodSelect.value

          me.dialog.markChanged(me.id)
        }, 250)
      })

      const matcherSelect = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_pattern_matcher'))
      matcherSelect.value = this.definition.pattern_matcher

      matcherSelect.listen('MDCSelect:change', () => {
        window.setTimeout(function () {
          me.definition.pattern_matcher = matcherSelect.value

          me.dialog.markChanged(me.id)
        }, 250)
      })

      const headersField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_headers_field'))
      headersField.value = this.definition.headers.join('\n')

      $('#' + this.cardId + '_headers_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_headers_value').val()

        me.definition.headers = value.split('\n')

        me.dialog.markChanged(me.id)
      })

      const parametersField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_parameters_field'))
      parametersField.value = this.definition.parameters.join('\n')

      $('#' + this.cardId + '_parameters_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_parameters_value').val()

        me.definition.parameters = value.split('\n')

        me.dialog.markChanged(me.id)
      })

      this.dialog.initializeDestinationMenu(me.cardId, function (selected) {
        if (me.targetAction === 'timeout') {
          me.definition.timeout_node_id = selected
        } else if (me.targetAction !== null) {
          me.targetAction.action = selected
        } else {
          me.definition.no_match = selected
        }

        me.dialog.markChanged(me.id)
        me.dialog.loadNode(me.definition)
      })

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const identifier = this.cardId + '_pattern_value_' + i
        const patternField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier))
        patternField.value = action.pattern

        const patternIndex = i

        $('#' + identifier + '_value').on('change keyup paste', function () {
          const value = $('#' + identifier + '_value').val()

          if (me.definition.actions[patternIndex].pattern === '' && value === '') {
            me.definition.actions.splice(patternIndex, 1)
          } else {
            me.definition.actions[patternIndex].pattern = value
          }

          me.dialog.markChanged(me.id)
        })

        $('#' + this.cardId + '_next_edit_' + i).on('click', function () {
          me.targetAction = action

          nextDialog.open()
        })

        $('#' + this.cardId + '_next_goto_' + i).on('click', function () {
          console.log('click')
          console.log(action)

          const destinationNodes = me.destinationNodes(me.dialog)

          for (let i = 0; i < destinationNodes.length; i++) {
            const destinationNode = destinationNodes[i]

            if (action.action === destinationNode.id) {
              $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
            } else {
              $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
            }
          }

          const sourceNodes = me.sourceNodes(me.dialog)

          for (let i = 0; i < sourceNodes.length; i++) {
            const sourceNode = sourceNodes[i]

            if (action.action === sourceNode.id) {
              $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#ffffff')
            } else {
              $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#e0e0e0')
            }
          }
        })
      }

      $('#' + this.cardId + '_add_pattern').on('click', function () {
        me.definition.actions.push({
          pattern: '.*',
          action: me.id
        })

        me.dialog.loadNode(me.definition)
        me.dialog.markChanged(me.id)
      })

      $('#' + this.cardId + '_pattern_edit_not_found').on('click', function () {
        me.targetAction = null

        nextDialog.open()
      })

      $('#' + this.cardId + '_pattern_click_not_found').on('click', function () {
        const destinationNodes = me.destinationNodes(me.dialog)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.no_match === destinationNode.id) {
            $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
          }
        }

        const sourceNodes = me.sourceNodes(me.dialog)

        for (let i = 0; i < sourceNodes.length; i++) {
          const sourceNode = sourceNodes[i]

          if (me.definition.no_match === sourceNode.id) {
            $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#e0e0e0')
          }
        }
      })

      const timeoutSecondsField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_timeout_seconds'))

      if (this.definition.timeout !== undefined) {
        timeoutSecondsField.value = this.definition.timeout
      }

      $('#' + this.cardId + '_clear_timeout').on('click', function (eventObj) {
        eventObj.preventDefault()

        if (window.confirm('Reset timeout options?')) {
          delete me.definition.timeout
          delete me.definition.timeout_node_id
          delete me.definition.timeout_iterations

          me.dialog.loadNode(me.definition)

          me.dialog.markChanged(me.id)
        }
      })

      $('#' + this.cardId + '_timeout_seconds_value').change(function (eventObj) {
        const value = $('#' + me.cardId + '_timeout_seconds_value').val()

        if (value === '') {
          delete me.definition.timeout
          delete me.definition.timeout_node_id
          delete me.definition.timeout_iterations
        } else {
          me.definition.timeout = parseInt(value)
        }

        me.dialog.markChanged(me.id)
      })

      const timeoutCountField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_timeout_times'))

      if (this.definition.timeout_iterations !== undefined) {
        timeoutCountField.value = this.definition.timeout_iterations
      }

      $('#' + this.cardId + '_timeout_times_value').change(function (eventObj) {
        const value = $('#' + me.cardId + '_timeout_times_value').val()

        if (value === '') {
          delete me.definition.timeout_iterations
        } else {
          me.definition.timeout_iterations = parseInt(value)
        }

        me.dialog.markChanged(me.id)
      })

      $('#' + this.cardId + '_timeout_edit').on('click', function () {
        me.targetAction = 'timeout'

        nextDialog.open()
      })

      $('#' + this.cardId + '_timeout_click').on('click', function () {
        const destinationNodes = me.destinationNodes(me.dialog)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.timeout_node_id === destinationNode.id) {
            $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
            $("#builder_source_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("#builder_next_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
            $("#builder_source_nodes [data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
          }
        }

        const sourceNodes = me.sourceNodes(me.dialog)

        for (let i = 0; i < sourceNodes.length; i++) {
          const sourceNode = sourceNodes[i]

          if (me.definition.timeout_node_id === sourceNode.id) {
            $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("#builder_source_nodes [data-node-id='" + sourceNode.id + "']").css('background-color', '#e0e0e0')
          }
        }
      })
    }

    destinationNodes (dialog) {
      const nodes = super.destinationNodes(dialog)

      const includedIds = []

      if (this.definition.timeout !== undefined) {
        if (this.definition.timeout_node_id !== undefined) {
          if (includedIds.indexOf(this.definition.timeout_node_id) === -1) {
            for (let i = 0; i < dialog.definition.length; i++) {
              const item = dialog.definition[i]

              if (item.id === this.definition.timeout_node_id) {
                nodes.push(Node.createCard(item, dialog))
              }
            }

            includedIds.push(this.definition.timeout_node_id)
          }
        }
      }

      for (let j = 0; j < this.definition.actions.length; j++) {
        const id = this.definition.actions[j].action

        if (includedIds.indexOf(id) === -1) {
          for (let i = 0; i < dialog.definition.length; i++) {
            const item = dialog.definition[i]

            if (item.id === id) {
              nodes.push(Node.createCard(item, dialog))
            }
          }

          includedIds.push(id)
        }
      }

      const noMatchId = this.definition.no_match

      if (includedIds.indexOf(noMatchId) === -1) {
        for (let i = 0; i < dialog.definition.length; i++) {
          const item = dialog.definition[i]

          if (item.id === noMatchId) {
            nodes.push(Node.createCard(item, dialog))
          }
        }
      }

      return nodes
    }

    updateReferences (oldId, newId) {
      $.each(this.actions, function (index, value) {
        if (value.action === oldId) {
          value.action = newId
        }
      })
    }

    issues () {
      const issues = super.issues()

      const me = this

      $.each(this.actions, function (index, value) {
        if (value.action === undefined) {
          issues.push([me.definition.id, '"' + value.pattern + '" does not point to another node.', me.definition.name])
        } else if (value.action === me.definition.id) {
          issues.push([me.definition.id, '"' + value.pattern + '" points to self.', me.definition.name])
        } else if (this.isValidDestination(value.action) === false) {
          issues.push([me.definition.id, '"' + value.pattern + '" points to a non-existent node.', me.definition.name])
        }
      })

      if (this.definition.timeout_node_id === undefined) {
        issues.push([this.definition.id, 'Timeout node does not point to another node.', this.definition.name])
      } else if (this.definition.timeout_node_id === this.definition.id) {
        issues.push([this.definition.id, 'Timeout node points to self.', this.definition.name])
      } else if (this.isValidDestination(this.definition.timeout_node_id) === false) {
        issues.push([this.definition.id, 'Timeout node points to a non-existent node.', this.definition.name])
      }

      if (this.definition.no_match === undefined) {
        issues.push([this.definition.id, 'No-match node does not point to another node.', this.definition.name])
      } else if (this.definition.no_match === this.definition.id) {
        issues.push([this.definition.id, 'No-match node points to self.'])
      } else if (this.isValidDestination(this.definition.no_match) === false) {
        issues.push([this.definition.id, 'No-match node points to a non-existent node.', this.definition.name])
      }

      return issues
    }

    cardType () {
      return 'Branching HTTP Response'
    }

    static cardName () {
      return 'Branching HTTP Response'
    }

    static createCard (cardName) {
      const id = Node.uuidv4()

      const card = {
        name: cardName,
        url: 'https://www.example.com/my-api.json',
        method: 'POST',
        headers: ['X-Example-Header=hello world'],
        parameters: ['foo=bar'],
        pattern_matcher: 're',
        actions: [{
          pattern: '.*',
          action: id
        }],
        no_match: id,
        type: 'http-response',
        id: id
      }

      return card
    }
  }

  Node.registerCard('http-response', HttpResponseNode)

  return HttpResponseNode
})
