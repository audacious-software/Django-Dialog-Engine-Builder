define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  const isLiteralObject = function (a) {
    return (!!a) && (a.constructor === Object)
  }

  class RandomBranchNode extends Node {
    editBody () {
      let body = ''

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-form-field">'
      body += '  <div class="mdc-checkbox">'
      body += '    <input type="checkbox" class="mdc-checkbox__native-control" id="' + this.cardId + '_without_replacement"/>'
      body += '    <div class="mdc-checkbox__background">'
      body += '      <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">'
      body += '        <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>'
      body += '      </svg>'
      body += '      <div class="mdc-checkbox__mixedmark"></div>'
      body += '    </div>'
      body += '    <div class="mdc-checkbox__ripple"></div>'
      body += '    <div class="mdc-checkbox__focus-ring"></div>'
      body += '  </div>'
      body += '  <label for="checkbox-1">Sampling Without Replacement</label>'
      body += '</div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="border-top: thin solid #AAABAA; padding-top: 20px;"></div>'

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_weight_value_' + i + '"  style="width: 100%">'
        body += '    <input type="number" min="0" class="mdc-text-field__input" id="' + this.cardId + '_weight_value_' + i + '_value" style="width: 100%">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_weight_value_' + i + '_value" class="mdc-floating-label">Choice Weight</label>'
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

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right; padding-bottom: 20px;">'
      body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_choice">'
      body += '  <span class="mdc-button__label">Add Choice</span>'
      body += '</button>'
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
      let summary = '<div class="mdc-typography--body1" style="margin: 16px;">Randomly choose one of the following:</div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const actionNode = this.dialog.resolveNode(action.action)

        if (actionNode !== null) {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">Go to <em>' + actionNode.cardName() + '</em> (weight=' + action.weight + ').</div>'
        } else {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">Go to <em>None Selected</em>.</div>'
        }
      }

      return summary
    }

    initialize () {
      super.initialize()

      const me = this

      const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      this.dialog.initializeDestinationMenu(me.cardId, function (selected) {
        if (me.targetAction !== null) {
          me.targetAction.action = selected
        }

        me.dialog.markChanged(me.id)
        me.dialog.loadNode(me.definition)
      })

      if (me.definition.without_replacement) {
        $('#' + this.cardId + '_without_replacement').prop('checked', true)
      } else {
        $('#' + this.cardId + '_without_replacement').prop('checked', false)
      }

      $('#' + this.cardId + '_without_replacement').on('change', function () {
        me.definition.without_replacement = $(this).prop('checked')

        me.dialog.markChanged(me.id)
      })

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const identifier = this.cardId + '_weight_value_' + i
        const weightField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier))

        const choiceIndex = i
        let lastValue = 'delete-me'

        weightField.value = '' + action.weight

        $('#' + identifier).on('change keyup paste', function (event) {
          const value = $('#' + identifier + '_value').val()

          me.definition.actions[choiceIndex].weight = value
          me.dialog.markChanged(me.id)

          if (lastValue === '' && (event.keyCode === 46 || event.keyCode === 8)) {
            me.definition.actions.splice(choiceIndex, 1)
            me.dialog.loadNode(me.definition)
            me.dialog.markChanged(me.id)
          }

          lastValue = value
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

      $('#' + this.cardId + '_add_choice').on('click', function () {
        if (me.definition.actions === undefined) {
          me.definition.actions = []
        }

        if (isLiteralObject(me.definition.actions)) {
          const newActions = []

          for (const value of Object.values(me.definition.actions)) {
            newActions.push({
              weight: 1,
              action: value
            })
          }

          me.definition.actions = newActions
        } else {
          me.definition.actions.push({
            weight: 1,
            action: me.id
          })
        }

        me.dialog.loadNode(me.definition)
        me.dialog.markChanged(me.id)
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

      return nodes
    }

    updateReferences (oldId, newId) {
      $.each(this.definition.actions, function (index, value) {
        if (value.action === oldId) {
          value.action = newId
        }
      })
    }

    issues () {
      const issues = super.issues()

      const me = this

      $.each(this.definition.actions, function (index, value) {
        if (value.action === undefined) {
          issues.push([me.definition.id, 'Choice ' + (1 + index) + ' does not point to another node.', me.definition.name])
        } else if (value.action === me.definition.id) {
          issues.push([me.definition.id, 'Choice ' + (1 + index) + ' points to self.', me.definition.name])
        } else if (this.isValidDestination(value.action) === false) {
          issues.push([me.definition.id, 'Choice ' + (1 + index) + ' points to a non-existent node.', me.definition.name])
        }
      })

      return issues
    }

    cardType () {
      return 'Random Branch'
    }

    static cardName () {
      return 'Random Branch'
    }

    static createCard (cardName) {
      const id = Node.uuidv4()

      const card = {
        type: 'random-branch',
        name: cardName,
        actions: [{
          weight: 1,
          action: id
        }],
        id
      }

      return card
    }
  }

  Node.registerCard('random-branch', RandomBranchNode)

  return RandomBranchNode
})
