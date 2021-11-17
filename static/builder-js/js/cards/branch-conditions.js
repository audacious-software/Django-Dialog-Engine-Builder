define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class BranchingConditionsNode extends Node {
    editBody () {
      let body = ''

      for (let i = 0; i < this.definition.actions.length; i++) {
        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_condition_value_' + i + '"  style="width: 100%">'
        body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_condition_value_' + i + '_value">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_condition_value_' + i + '_value" class="mdc-floating-label">Condition</label>'
        body += '      </div>'
        body += '      <div class="mdc-notched-outline__trailing"></div>'
        body += '    </div>'
        body += '  </div>'
        body += '</div>'

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
        body += '  <p class="mdc-typography--body1">Python Conditional Matches:</p>'
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
      body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_condition">'
      body += '  <span class="mdc-button__label">Add Condition</span>'
      body += '</button>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '  <p class="mdc-typography--body1">No Condition Matched: </p>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'

      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_condition_edit_not_found">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'

      if (this.definition.no_match !== undefined) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_condition_click_not_found">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
        body += '  </button>'
      }

      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '  <p class="mdc-typography--body1">Error Encountered: </p>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'

      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_condition_edit_error">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'

      if (this.definition.no_match !== undefined) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_condition_click_error">'
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
      let summary = '<div class="mdc-typography--body1" style="margin: 16px;">Conditions evaluated:</em></div>'

      for (let i = 0; i < this.definition.actions.length; i++) {
        const action = this.definition.actions[i]

        const actionNode = this.dialog.resolveNode(action.action)

        if (actionNode !== null) {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + action.condition + ': go to <em>' + actionNode.cardName() + '</em>.</div>'
        } else {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + action.condition + ': go to <em>None Selected</em>.</div>'
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

      if (this.definition.error !== undefined && this.definition.error !== '') {
        const node = this.dialog.resolveNode(this.definition.error)

        summary += '<div class="mdc-typography--body1" style="margin: 16px;">'

        if (node !== null) {
          summary += 'If an error is encountered, go to <em>' + node.cardName() + '</em>.'
        } else {
          summary += 'If an error is encountered, go to <em>None Selected</em>.'
        }

        summary += '</div>'
      }

      return summary
    }

    initialize () {
      super.initialize()

      const me = this

      const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      this.dialog.initializeDestinationMenu(me.cardId, function (selected) {
        if (me.targetAction === 'error') {
          me.definition.error = selected
        } else if (me.targetAction !== null) {
          me.targetAction.action = selected
        } else {
          me.definition.no_match = selected
        }

        me.dialog.markChanged(me.id)
        me.dialog.loadNode(me.definition)
      })

      for (let i = 0; i < this.definition.actions.length; i++) {
        const conditionIndex = i

        const action = this.definition.actions[i]

        const identifier = this.cardId + '_condition_value_' + i
        const conditionField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier))

        if (me.definition.actions[conditionIndex].condition !== undefined) {
          conditionField.value = me.definition.actions[conditionIndex].condition
        }

        $('#' + identifier + '_value').on('change keyup', function () {
          const value = $('#' + identifier + '_value').val()

          console.log('VALUE[' + conditionIndex + '] => ' + value + ' // ' + identifier)

          if (me.definition.actions[conditionIndex].condition === '' && value === '') {
            me.definition.actions.splice(conditionIndex, 1)
            me.dialog.loadNode(me.definition)
          } else {
            me.definition.actions[conditionIndex].condition = value
          }

          me.dialog.markChanged(me.id)
        })

        $('#' + identifier + '_value').on('paste', function () {
          window.setTimeout(function () {
            const value = $('#' + identifier + '_value').val()

            console.log('VALUE-P[' + conditionIndex + '] => ' + value + ' // ' + identifier)

            me.definition.actions[conditionIndex].condition = value

            me.dialog.markChanged(me.id)
          }, 5)
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

      $('#' + this.cardId + '_add_condition').on('click', function () {
        me.definition.actions.push({
          condition: '',
          action: me.id
        })

        me.dialog.loadNode(me.definition)
        me.dialog.markChanged(me.id)
      })

      $('#' + this.cardId + '_condition_edit_not_found').on('click', function () {
        me.targetAction = null

        nextDialog.open()
      })

      $('#' + this.cardId + '_condition_click_not_found').on('click', function () {
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

      $('#' + this.cardId + '_condition_edit_error').on('click', function () {
        me.targetAction = 'error'

        nextDialog.open()
      })

      $('#' + this.cardId + '_condition_click_error').on('click', function () {
        const destinationNodes = me.destinationNodes(me.dialog)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.error === destinationNode.id) {
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

          if (me.definition.error === sourceNode.id) {
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

      const errorId = this.definition.error

      if (includedIds.indexOf(errorId) === -1) {
        for (let i = 0; i < dialog.definition.length; i++) {
          const item = dialog.definition[i]

          if (item.id === errorId) {
            nodes.push(Node.createCard(item, dialog))

            includedIds.push(errorId)
          }
        }
      }

      const noMatchId = this.definition.no_match

      if (includedIds.indexOf(noMatchId) === -1) {
        for (let i = 0; i < dialog.definition.length; i++) {
          const item = dialog.definition[i]

          if (item.id === noMatchId) {
            nodes.push(Node.createCard(item, dialog))

            includedIds.push(noMatchId)
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
          issues.push([me.definition.id, 'Branch ' + (1 + index) + ' does not point to another node.', me.definition.name])
        } else if (value.action === me.definition.id) {
          issues.push([me.definition.id, 'Branch ' + (1 + index) + ' points to self.', me.definition.name])
        } else if (this.isValidDestination(value.action) === false) {
          issues.push([me.definition.id, 'Branch ' + (1 + index) + ' points to a non-existent node.', me.definition.name])
        }
      })

      if (this.definition.no_match === undefined) {
        issues.push([this.definition.id, 'No-match node does not point to another node.'], this.definition.name)
      } else if (this.definition.no_match === this.definition.id) {
        issues.push([this.definition.id, 'No-match node points to self.', this.definition.name])
      } else if (this.isValidDestination(this.definition.no_match) === false) {
        issues.push([this.definition.id, 'No-match node points to a non-existent node.', this.definition.name])
      }

      if (this.definition.error === undefined) {
        issues.push([this.definition.id, 'Error node does not point to another node.', this.definition.name])
      } else if (this.definition.error === this.definition.id) {
        issues.push([this.definition.id, 'Error node points to self.', this.definition.name])
      } else if (this.isValidDestination(this.definition.error) === false) {
        issues.push([this.definition.id, 'Error node points to a non-existent node.', this.definition.name])
      }

      return issues
    }

    cardType () {
      return 'Branching Conditions'
    }

    static cardName () {
      return 'Branching Conditions'
    }

    static createCard (cardName) {
      const id = Node.uuidv4()

      const card = {
        name: cardName,
        actions: [{
          condition: '2 > 3',
          action: id
        }],
        no_match: id,
        error: id,
        type: 'branch-conditions',
        id: id
      }

      return card
    }
  }

  Node.registerCard('branch-conditions', BranchingConditionsNode)

  return BranchingConditionsNode
})
