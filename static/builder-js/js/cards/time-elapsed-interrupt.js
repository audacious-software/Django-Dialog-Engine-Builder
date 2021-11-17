define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class TimeElapsedInterruptNode extends Node {
    editBody () {
      let body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_hours_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_iterations_value" class="mdc-floating-label">Elapsed Hours:</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <input type="number" min="0" step="1" id="' + this.cardId + '_hours_value" class="mdc-text-field__input">'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">'
      body += '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_minutes_field" style="width: 100%">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <div class="mdc-notched-outline__notch">'
      body += '        <label for="' + this.cardId + '_iterations_value" class="mdc-floating-label">Minutes:</label>'
      body += '      </div>'
      body += '      <span class="mdc-notched-outline__trailing"></span>'
      body += '    </span>'
      body += '    <span class="mdc-text-field__resizer">'
      body += '      <input type="number" min="0" step="1" id="' + this.cardId + '_minutes_value" class="mdc-text-field__input">'
      body += '    </span>'
      body += '  </label>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--body1" style="padding-top: 24px;">'
      body += '  Continue:'
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
      return '<div class="mdc-typography--body1" style="margin: 16px;">Continues after: <em>' + this.definition.hours_elapsed + '</em> hours and <em>' + this.definition.minutes_elapsed + '</em> minutes have elapsed since the beginning of the dialog.</div>'
    }

    initialize () {
      super.initialize()

      const me = this

      const hoursField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_hours_field'))
      hoursField.value = '' + this.definition.hours_elapsed

      $('#' + this.cardId + '_hours_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_hours_value').val()

        me.definition.hours_elapsed = parseInt(value)

        me.dialog.markChanged(me.id)
      })

      const minutesField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_minutes_field'))
      minutesField.value = '' + this.definition.minutes_elapsed

      $('#' + this.cardId + '_minutes_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_minutes_value').val()

        me.definition.minutes_elapsed = parseInt(value)

        me.dialog.markChanged(me.id)
      })

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

    issues () {
      const issues = super.issues()

      if (this.definition.next_id === undefined) {
        issues.push([this.definition.id, 'Next node does not point to another node.', this.definition.name])
      } else if (this.definition.next_id === this.definition.id) {
        issues.push([this.definition.id, 'Next node points to self.'], this.definition.name)
      } else if (this.isValidDestination(this.definition.next_id) === false) {
        issues.push([this.definition.id, 'Next node points to a non-existent node.'], this.definition.name)
      }

      return issues
    }

    cardType () {
      return 'Time Elapsed Interrupt'
    }

    static cardName () {
      return 'Time Elapsed Interrupt'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        builder_group: 'Interrupts',
        context: '(Context goes here...)',
        type: 'time-elapsed-interrupt',
        id: Node.uuidv4(),
        next_id: null,
        hours_elapsed: 1,
        minutes_elapsed: 30
      }

      return card
    }
  }

  Node.registerCard('time-elapsed-interrupt', TimeElapsedInterruptNode)

  return TimeElapsedInterruptNode
})
