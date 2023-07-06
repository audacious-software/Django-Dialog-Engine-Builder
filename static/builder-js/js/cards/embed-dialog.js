define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class EmbedDialogNode extends Node {
    editBody () {
      let body = ''

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">'
      body += '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_select_script" style="width: 100%">'
      body += '  <div class="mdc-select__anchor">'
      body += '    <span class="mdc-notched-outline">'
      body += '      <span class="mdc-notched-outline__leading"></span>'
      body += '      <span class="mdc-notched-outline__notch">'
      body += '        <span id="outlined-select-label" class="mdc-floating-label">Embedded Script</span>'
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
      body += '    <ul class="mdc-list" role="listbox" aria-label=Embedded Dialog" id="' + this.cardId + '_dialog_list">'
      body += '    </ul>'
      body += '  </div>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">'
      body += '  The message above will be sent to the user and the system will proceed to the next card.'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>'
      body += '  </button>'
      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>'
      body += '  </button>'
      body += '</div>'
      body += '</div>'

      body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">'
      body += '  <div class="mdc-dialog__container">'
      body += '    <div class="mdc-dialog__surface">'
      body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>'
      body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content"  style="padding: 0px;">'

      body += this.dialog.chooseDestinationMenu(this.cardId)
      body += '      </div>'
      //          body += '      <footer class="mdc-dialog__actions">';
      //          body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
      //          body += '          <span class="mdc-button__label">Save</span>';
      //          body += '        </button>';
      //          body += '      </footer>';
      body += '    </div>'
      body += '  </div>'
      body += '  <div class="mdc-dialog__scrim"></div>'
      body += '</div>'

      return body
    }

    viewBody () {
      let summary = '<div class="mdc-typography--body1" style="margin: 16px;">Embed an existing dialog:</div>'

      summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.script_id + '</div>'

      return summary
    }

    initialize () {
      super.initialize()

      const me = this

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

      $.get('/builder/embeddable-dialogs.json', function (data) {
        $.each(data, function (index, value) {
          let itemHtml = '<li class="mdc-list-item" aria-selected="false" data-value="' + value.id + '" role="option">'
          itemHtml += '  <span class="mdc-list-item__ripple"></span>'
          itemHtml += '  <span class="mdc-list-item__text">' + value.name + '</span>'
          itemHtml += '</li>'

          $('#' + me.cardId + '_dialog_list').append(itemHtml)
        })

        const scriptField = mdc.select.MDCSelect.attachTo(document.getElementById(me.cardId + '_select_script'))

        scriptField.listen('MDCSelect:change', () => {
          const originalId = me.definition.script_id

          me.definition.script_id = scriptField.value

          if (originalId !== me.definition.script_id) {
            me.dialog.markChanged(me.id)
          }
        })

        if (me.definition.script_id !== undefined) {
          scriptField.value = '' + me.definition.script_id
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

      if (this.definition.script_id === oldId) {
        this.definition.script_id = newId
      }
    }

    cardType () {
      return 'Embed Dialog'
    }

    static cardName () {
      return 'Embed Dialog'
    }

    static createCard (cardName) {
      const id = Node.uuidv4()

      const card = {
        type: 'embed-dialog',
        name: cardName,
        id
      }

      return card
    }
  }

  Node.registerCard('embed-dialog', EmbedDialogNode)

  return EmbedDialogNode
})
