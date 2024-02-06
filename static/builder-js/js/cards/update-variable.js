define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class UpdateVariableNode extends Node {
    editBody () {
      let body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'

      body += '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_key_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_message_value" class="mdc-floating-label">Variable Name</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <input type="text" class="mdc-text-field__input" style="width: 100%" id="' + this.cardId + '_key_value" />'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_operation_field" style="width: 100%">'
      body += '    <div class="mdc-select__anchor">'
      body += '      <span class="mdc-notched-outline">'
      body += '        <span class="mdc-notched-outline__leading"></span>'
      body += '        <span class="mdc-notched-outline__notch">'
      body += '          <span id="outlined-select-label" class="mdc-floating-label">Operation</span>'
      body += '        </span>'
      body += '        <span class="mdc-notched-outline__trailing"></span>'
      body += '      </span>'
      body += '      <span class="mdc-select__selected-text-container">'
      body += '        <span class="mdc-select__selected-text"></span>'
      body += '      </span>'
      body += '      <span class="mdc-select__dropdown-icon">'
      body += '        <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
      body += '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>'
      body += '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>'
      body += '        </svg>'
      body += '      </span>'
      body += '    </div>'
      body += '    <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
      body += '      <ul class="mdc-list" role="listbox" aria-label=Embedded Dialog" id="' + this.cardId + '_operation_list">'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="set" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Set</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="remove" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Remove</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="replace" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Replace</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="append-list" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Append to list</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="prepend-list" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Prepend to list</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="clear-list" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Clear or create list</span>'
      body += '        </li>'
      body += '        <li class="mdc-list-item" aria-selected="false" data-value="increment" role="option">'
      body += '          <span class="mdc-list-item__ripple"></span>'
      body += '          <span class="mdc-list-item__text">Increment (numeric values only)</span>'
      body += '        </li>'
      body += '      </ul>'
      body += '    </div>'
      body += '  </div>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" id="' + this.cardId + '_value_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_message_value" class="mdc-floating-label">Value</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <textarea class="mdc-text-field__input" rows="2" style="width: 100%" id="' + this.cardId + '_value_value"></textarea>'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" id="' + this.cardId + '_replacement_row">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" id="' + this.cardId + '_replacement_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_message_value" class="mdc-floating-label">Replacement</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <textarea class="mdc-text-field__input" rows="2" style="width: 100%" id="' + this.cardId + '_replacement_value"></textarea>'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
      body += '  </button>'
      body += '</div>'
      body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">'
      body += '  <div class="mdc-dialog__container">'
      body += '    <div class="mdc-dialog__surface">'
      body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>'
      body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content"  style="padding: 0px;">'

      body += this.dialog.chooseDestinationMenu(this.cardId)

      body += '      </div>'
      body += '    </div>'
      body += '  </div>'
      body += '  <div class="mdc-dialog__scrim"></div>'
      body += '</div>'

      return body
    }

    viewBody () {
      let suffix = `(${this.definition.operation}) ${this.definition.value}`

      if (this.definition.operation === 'set') {
        suffix = `&coloneq; ${this.definition.value}`
      } else if (this.definition.operation === 'remove') {
        suffix = `\\ ${this.definition.value}`
      } else if (this.definition.operation === 'replace') {
        suffix = `&coloneq; ${this.definition.value} &cularr; ${this.definition.replacement}`
      } else if (this.definition.operation === 'append-list') {
        suffix = `&rarrb; ${this.definition.value}`
      } else if (this.definition.operation === 'prepend-list') {
        suffix = `&larrb; ${this.definition.value}`
      } else if (this.definition.operation === 'clear-list') {
        suffix = '&coloneq; []'
      } else if (this.definition.operation === 'increment') {
        suffix = `+= ${this.definition.value}`
      }

      return `<div class="mdc-typography--body1" style="margin: 16px;">Updates variable: <em>${this.definition.key} ${suffix}</em></div>`
    }

    initialize () {
      super.initialize()

      const me = this

      const valueField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_value_field'))

      if (this.definition.value !== undefined) {
        valueField.value = this.definition.value
      }

      $('#' + this.cardId + '_value_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_value_value').val()

        me.definition.value = value

        me.dialog.markChanged(me.id)
      })

      const replacementField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_replacement_field'))

      if (this.definition.replacement !== undefined) {
        replacementField.value = this.definition.replacement
      }

      $('#' + this.cardId + '_replacement_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_replacement_value').val()

        me.definition.replacement = value

        me.dialog.markChanged(me.id)
      })

      const keyField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_key_field'))

      if (this.definition.key !== undefined) {
        keyField.value = this.definition.key
      }

      $('#' + this.cardId + '_key_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_key_value').val()

        me.definition.key = value

        me.dialog.markChanged(me.id)
      })

      const operationField = mdc.select.MDCSelect.attachTo(document.getElementById(me.cardId + '_operation_field'))

      operationField.listen('MDCSelect:change', () => {
        const originalOperation = me.definition.operation

        me.definition.operation = operationField.value

        if (me.definition.operation === 'replace') {
          $('#' + me.cardId + '_replacement_row').show()
        } else {
          $('#' + me.cardId + '_replacement_row').hide()
        }

        if (originalOperation !== me.definition.operation) {
          me.dialog.markChanged(me.id)
        }
      })

      $('#' + me.cardId + '_replacement_row').hide()

      if (this.definition.operation !== undefined && this.definition.operation !== null) {
        operationField.value = this.definition.operation
      } else {
        operationField.value = 'reset'
      }

      me.dialog.initializeDestinationMenu(me.cardId, function (selected) {
        me.definition.next_id = selected

        me.dialog.markChanged(me.id)
        me.dialog.loadNode(me.definition)
      })

      const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      $('#' + this.cardId + '_next_edit').on('click', function () {
        dialog.open()
      })

      $('#' + this.cardId + '_next_goto').on('click', function () {
        const destinationNodes = me.destinationNodes(me.dialog)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.next_id === destinationNode.id) {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
          }
        }

        const sourceNodes = me.sourceNodes(me.dialog)

        for (let i = 0; i < sourceNodes.length; i++) {
          const sourceNode = sourceNodes[i]

          if (me.definition.next_id === sourceNode.id) {
            $("[data-node-id='" + sourceNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("[data-node-id='" + sourceNode.id + "']").css('background-color', '#e0e0e0')
          }
        }
      })
    }

    destinationNodes (dialog) {
      const nodes = super.destinationNodes(dialog)

      const id = this.definition.next_id

      for (let i = 0; i < this.dialog.definition.length; i++) {
        const item = this.dialog.definition[i]

        if (item.id === id) {
          nodes.push(Node.createCard(item, dialog))
        }
      }

      if (nodes.length === 0) {
        const node = this.dialog.resolveNode(id)

        if (node !== null) {
          nodes.push(node)
        }
      }

      return nodes
    }

    updateReferences (oldId, newId) {
      if (this.definition.next_id === oldId) {
        this.definition.next_id = newId
      }
    }

    cardType () {
      return 'Update Variable'
    }

    static cardName () {
      return 'Update Variable'
    }

    issues () {
      const issues = super.issues()

      if (this.definition.next_id === undefined) {
        issues.push([this.definition.id, 'Next node does not point to another node.', this.definition.name])
      } else if (this.definition.next_id === this.definition.id) {
        issues.push([this.definition.id, 'Next node points to self.', this.definition.name])
      } else if (this.isValidDestination(this.definition.next_id) === false) {
        issues.push([this.definition.id, 'Next node points to a non-existent node.', this.definition.name])
      }

      if (this.definition.key === undefined || this.definition.key === undefined) {
        issues.push([this.definition.id, 'Variable key not defined.', this.definition.name])
      }

      if (this.definition.operation === undefined || this.definition.operation === undefined) {
        issues.push([this.definition.id, 'Update operation not defined.', this.definition.name])
      }

      return issues
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        context: '(Context goes here...)',
        key: 'variable_name',
        value: 'variable_value',
        operation: 'replace',
        type: 'update-variable',
        id: Node.uuidv4(),
        next: null
      }

      return card
    }
  }

  Node.registerCard('update-variable', UpdateVariableNode)

  return UpdateVariableNode
})
