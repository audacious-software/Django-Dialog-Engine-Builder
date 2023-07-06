define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ExternalChoiceNode extends Node {
    editBody () {
      const destinationNodes = this.destinationNodes(this)

      let body = ''

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_identifier" style="width: 100%">'
      body += '    <input class="mdc-text-field__input" type="text" id="' + this.cardId + '_identifier_value">'
      body += '    <div class="mdc-notched-outline">'
      body += '      <div class="mdc-notched-outline__leading"></div>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_identifier_value" class="mdc-floating-label">Variable Name</label>'
      body += '      </div>'
      body += '      <div class="mdc-notched-outline__trailing"></div>'
      body += '    </div>'
      body += '  </div>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">'
      body += '  <div class="mdc-typography--subtitle2">Timeout Parameters</div>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_timeout_count"  style="width: 40%">'
      body += '    <input type="number" min="0" class="mdc-text-field__input" id="' + this.cardId + '_timeout_count_value">'
      body += '    <div class="mdc-notched-outline">'
      body += '      <div class="mdc-notched-outline__leading"></div>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_timeout_count_value" class="mdc-floating-label">Qty.</label>'
      body += '      </div>'
      body += '      <div class="mdc-notched-outline__trailing"></div>'
      body += '    </div>'
      body += '  </div>'

      body += '  <div class="mdc-select mdc-select--outlined"  id="' + this.cardId + '_timeout_unit"  style="width: 55%; float: right;">'
      body += '    <div class="mdc-select__anchor" aria-labelledby="timeout-unit-select-label" style="width: 100%">'
      body += '      <span class="mdc-notched-outline">'
      body += '        <span class="mdc-notched-outline__leading"></span>'
      body += '        <span class="mdc-notched-outline__notch">'
      body += '          <span id="timeout-unit-select-label" class="mdc-floating-label">Unit</span>'
      body += '        </span>'
      body += '        <span class="mdc-notched-outline__trailing"></span>'
      body += '      </span>'
      body += '      <span class="mdc-select__selected-text-container">'
      body += '        <span id="timeout-unit-selected-text" class="mdc-select__selected-text"></span>'
      body += '      </span>'
      body += '      <span class="mdc-select__dropdown-icon">'
      body += '        <svg class="mdc-select__dropdown-icon-graphic"viewBox="7 10 10 5" focusable="false">'
      body += '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>'
      body += '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>'
      body += '        </svg>'
      body += '      </span>'
      body += '    </div>'
      body += '    <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
      body += '      <ul class="mdc-list" role="listbox">'
      body += '        <li class="mdc-list-item" data-value="second" aria-selected="true"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Seconds</span></li>'
      body += '        <li class="mdc-list-item" data-value="minute" aria-selected="true"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Minutes</span></li>'
      body += '        <li class="mdc-list-item" data-value="hour" aria-selected="true"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Hours</span></li>'
      body += '        <li class="mdc-list-item" data-value="day" aria-selected="true"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Days</span></li>'
      body += '      </ul>'
      body += '    </div>'
      body += '  </div>'
      body += '  <a class="mdc-typography--caption" href="#" id="' + this.cardId + '_clear_timeout" style="display: inline-block; padding-left: 4px;">Clear Timeout</a>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_timeout_edit">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'

      let found = false

      for (let j = 0; j < destinationNodes.length; j++) {
        const destinationNode = destinationNodes[j]

        if (this.definition.timeout !== undefined) {
          if (destinationNode.id === this.definition.timeout.action) {
            found = true
          }
        }
      }

      if (found === false && this.definition.timeout !== undefined) {
        const node = this.dialog.resolveNode(this.definition.timeout.action)

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

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">'
      body += '  <div class="mdc-typography--subtitle2">Available Choices</div>'
      body += '</div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_label_' + i + '"  style="width: 100%">'
        body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_label_' + i + '_value">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_label_' + i + '_value" class="mdc-floating-label">Name</label>'
        body += '      </div>'
        body += '      <div class="mdc-notched-outline__trailing"></div>'
        body += '    </div>'
        body += '  </div>'
        body += '</div>'

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_identifier_' + i + '"  style="width: 100%">'
        body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_identifier_' + i + '_value">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_label_' + i + '_value" class="mdc-floating-label">Identifier</label>'
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

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"><hr></div>'
      }

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right; padding-bottom: 20px;">'
      body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_action">'
      body += '  <span class="mdc-button__label">Add Action</span>'
      body += '</button>'
      body += '</div>'

      body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">'
      body += '  <div class="mdc-dialog__container">'
      body += '    <div class="mdc-dialog__surface">'
      body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>'
      body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content" style="padding: 0px;">'
      body += this.dialog.chooseDestinationMenu(this.cardId)
      body += '      </div>'
      //            body += '      <footer class="mdc-dialog__actions">';
      //            body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
      //            body += '          <span class="mdc-button__label">Save</span>';
      //            body += '        </button>';
      //            body += '      </footer>';
      body += '    </div>'
      body += '  </div>'
      body += '  <div class="mdc-dialog__scrim"></div>'
      body += '</div>'

      return body
    }

    viewBody () {
      let summary = '<div class="mdc-typography--body1" style="margin: 16px;">Choice</em></div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const label = action.label

        const actionNode = this.dialog.resolveNode(action.action)

        if (actionNode !== null) {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + label + ': go to <em>' + actionNode.cardName() + '</em>.</div>'
        } else {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + label + ': go to <em>None Selected</em>.</div>'
        }
      }

      return summary
    }

    initialize () {
      super.initialize()

      const me = this

      const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      const identifierField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_identifier'))
      identifierField.value = this.definition.id

      $('#' + this.cardId + '_identifier_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_identifier_value').val()

        const oldId = me.definition.id

        me.definition.id = value
        me.id = value

        me.dialog.updateReferences(oldId, value)

        me.dialog.markChanged(me.id)
      })

      this.dialog.initializeDestinationMenu(me.cardId, function (selected) {
        if (me.targetAction === 'timeout') {
          if (me.definition.timeout === undefined) {
            me.definition.timeout = {}
          }

          me.definition.timeout.action = selected
        } else if (me.targetAction !== null) {
          me.targetAction.action = selected
        }

        me.dialog.markChanged(me.id)
        me.dialog.loadNode(me.definition)
      })

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const actionIndex = i

        const identifier = this.cardId + '_identifier_' + i
        const identifierField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier))

        identifierField.value = action.identifier

        $('#' + identifier).on('change keyup paste', function () {
          me.definition.actions[actionIndex].identifier = identifierField.value
        })

        const label = this.cardId + '_label_' + i
        const labelField = mdc.textField.MDCTextField.attachTo(document.getElementById(label))

        labelField.value = action.label

        $('#' + label).on('change keyup paste', function () {
          me.definition.actions[actionIndex].label = labelField.value
        })

        $('#' + this.cardId + '_next_edit_' + i).on('click', function () {
          me.targetAction = action

          nextDialog.open()
        })

        $('#' + this.cardId + '_next_goto_' + i).on('click', function () {
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

      $('#' + this.cardId + '_add_action').on('click', function () {
        me.definition.actions.push({
          identifier: Node.uuidv4(),
          label: 'New Action',
          action: me.id
        })

        me.dialog.loadNode(me.definition)
        me.dialog.markChanged(me.id)
      })

      $('#' + this.cardId + '_clear_timeout').on('click', function (eventObj) {
        eventObj.preventDefault()

        if (window.confirm('Reset timeout options?')) {
          delete me.definition.timeout

          me.dialog.loadNode(me.definition)

          me.dialog.markChanged(me.id)
        }
      })

      const timeoutCountField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_timeout_count'))
      const timeoutUnitField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_timeout_unit'))

      if (this.definition.timeout !== undefined) {
        if (this.definition.timeout.duration !== undefined) {
          timeoutCountField.value = this.definition.timeout.duration
        }

        if (this.definition.timeout.units !== undefined) {
          timeoutUnitField.value = this.definition.timeout.units
        }
      }

      $('#' + this.cardId + '_timeout_count_value').change(function (eventObj) {
        const value = $('#' + me.cardId + '_timeout_count_value').val()

        if (me.definition.timeout === undefined) {
          me.definition.timeout = {}
        }

        me.definition.timeout.duration = value

        me.dialog.markChanged(me.id)
      })

      timeoutUnitField.listen('MDCSelect:change', () => {
        console.log('Selected option at index ' + timeoutUnitField.selectedIndex + ' with value "' + timeoutUnitField.value + '"')

        if (me.definition.timeout === undefined) {
          me.definition.timeout = {}
        }

        me.definition.timeout.units = timeoutUnitField.value

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

          if (me.definition.timeout.action === destinationNode.id) {
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

          if (me.definition.timeout.action === sourceNode.id) {
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

      if (this.definition.timeout !== undefined) {
        if (this.definition.timeout.action !== undefined) {
          if (includedIds.indexOf(this.definition.timeout.action) === -1) {
            for (let i = 0; i < dialog.definition.length; i++) {
              const item = dialog.definition[i]

              if (item.id === this.definition.timeout.action) {
                nodes.push(Node.createCard(item, dialog))
              }
            }

            includedIds.push(this.definition.timeout.action)
          }
        }
      }

      return nodes
    }

    updateReferences (oldId, newId) {
      // TODO: Update!
      if (this.definition.next_id === oldId) {
        this.definition.next_id = newId
      }
    }

    cardType () {
      return 'External Choice'
    }

    static cardName () {
      return 'External Choice'
    }

    static createCard (cardName) {
      const id = Node.uuidv4()

      const card = {
        name: cardName,
        actions: [{
          identifier: 'default',
          label: '(New Action)',
          action: id
        }],
        type: 'external-choice',
        id
      }

      return card
    }
  }

  Node.registerCard('external-choice', ExternalChoiceNode)

  return ExternalChoiceNode
})
