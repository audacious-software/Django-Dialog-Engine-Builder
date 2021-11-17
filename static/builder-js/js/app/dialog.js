const modules = ['material', 'cards/node', 'jquery']

if (window.dialogBuilder.cards !== undefined) {
  const cards = window.dialogBuilder.cards

  for (let i = 0; i < cards.length; i++) {
    modules.push(cards[i])
  }
}

define(modules, function (mdc, Node) {
  class Dialog {
    constructor (definition, name) {
      this.definition = definition
      this.name = name
      this.changeListeners = []
      this.lastLoadedNode = null
    }

    allActions () {
      const actions = []

      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        const action = { id: item.id }

        if (item.name !== undefined) {
          action.name = item.name
        } else {
          action.name = item.id
        }

        actions.push(action)
      }

      return actions
    }

    getName () {
      return this.name
    }

    selectInitialNode (nodeId) {
      if (typeof nodeId === 'undefined') {
        throw new Error('Undefined Node Id')
      }

      $('#dialog_breadcrumbs').html(this.getName())

      if (nodeId === null || nodeId === undefined) {
        this.loadNode(this.definition[0])
      } else {
        let loaded = false

        for (let i = 0; loaded === false && i < this.definition.length; i++) {
          const item = this.definition[i]

          if ((nodeId === item.id || nodeId.endsWith('#' + item.id)) && this.lastLoadedNode !== item.id) {
            this.lastLoadedNode = item.id

            this.loadNode(item)

            loaded = true
          }
        }

        if (loaded === false) {
          this.loadNode(this.definition[0])
        }
      }
    }

    loadNode (definition) {
      const me = this

      if (definition !== undefined) {
        const node = Node.createCard(definition, this)

        const current = $('#builder_current_node')

        const html = node.editHtml()

        current.html(html)

        node.initialize()

        if ($('#dialog_breadcrumbs').children('#breadcrumb-' + node.id).length > 0) {
          const match = $('#dialog_breadcrumbs').children('#breadcrumb-' + node.id)
          let last = $('#dialog_breadcrumbs').children().last()

          while (match.attr('id') !== last.attr('id')) {
            last.remove()

            last = $('#dialog_breadcrumbs').children().last()
          }
        } else {
          const chevron = '<i class="material-icons" style="font-size: 0.75rem;">chevron_right</i>'
          const breadcrumb = '<a id="breadcrumb-' + node.id + '" href="#">' + node.cardName() + '</a>'

          $('#dialog_breadcrumbs').append(chevron + breadcrumb)

          $('#breadcrumb-' + node.id).click(function (eventObj) {
            eventObj.preventDefault()

            me.loadNode(definition)

            return false
          })
        }

        const destinations = $('#builder_next_nodes')

        const destinationNodes = node.destinationNodes(this)

        let destinationHtml = ''

        for (let i = 0; i < destinationNodes.length; i++) {
          destinationHtml += destinationNodes[i].viewHtml()
        }

        destinations.html(destinationHtml)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          $('#' + destinationNode.cardId).css('background-color', '#E0E0E0')

          destinationNode.onClick(function () {
            me.loadNode(destinationNode.definition)
          })
        }

        const sources = $('#builder_source_nodes')

        const sourceNodes = node.sourceNodes(this)

        let sourceHtml = ''

        for (let i = 0; i < sourceNodes.length; i++) {
          sourceHtml += sourceNodes[i].viewHtml()
        }

        sources.html(sourceHtml)

        for (let i = 0; i < sourceNodes.length; i++) {
          const sourceNode = sourceNodes[i]

          $('#' + sourceNode.cardId).css('background-color', '#E0E0E0')

          sourceNode.onClick(function () {
            me.loadNode(sourceNode.definition)
          })
        }
      } else {
        me.addCard(function (cardId) {
          for (let j = 0; j < me.definition.items.length; j++) {
            const item = me.definition.items[j]

            if (item.id === cardId) {
              me.loadNode(item)

              return
            }
          }
        })
      }
    }

    checkCorrectness () {
      console.log('Checking correctness...')

      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        if (Node.canCreateCard(item, this) === false) {
          console.log('Cannot create node for item:')
          console.log(item)
        }
      }

      console.log('Check complete.')
    }

    addChangeListener (changeFunction) {
      this.changeListeners.push(changeFunction)
    }

    removeChangeListener (changeFunction) {
      const index = this.changeListeners.indexOf(changeFunction)

      if (index >= 0) {
        this.changeListeners.splice(index, 1)
      }
    }

    markChanged (changedId) {
      for (let i = 0; i < this.changeListeners.length; i++) {
        this.changeListeners[i](changedId)
      }
    }

    chooseDestinationMenu (cardId) {
      let body = ''

      body += '    <div>'

      body += '    <ul class="mdc-list mdc-dialog__content dialog_card_selection_menu" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1" style="padding: 0px;">'
      body += '      <li class="mdc-list-divider" role="separator"></li>'

      const groups = {}
      const groupNames = []

      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        let groupName = item.builder_group

        if (groupName === undefined) {
          groupName = '(Ungrouped Cards)'
        }

        let itemHtml = ''

        itemHtml += '     <li class="mdc-list-item mdc-list-item--with-one-line builder-destination-item" role="menuitem" data-sort-name="' + item.name + '" id="' + cardId + '_destination_item_' + item.id + '" data-node-id="' + item.id + '" data-category="' + groupName + '">'
        itemHtml += '       <span class="mdc-list-item__ripple"></span>'

        let sortName = item.id

        if (item.name !== undefined) {
          itemHtml += '       <span class="mdc-list-item__text mdc-list-item__start">' + item.name + ' </span>'

          sortName = item.name
        } else {
          itemHtml += '       <span class="mdc-list-item__text mdc-list-item__start">' + item.id + '</span>'
        }

        itemHtml += '     </li>'

        let groupHtmls = groups[groupName]

        if (groupHtmls === undefined) {
          groupHtmls = []

          groups[groupName] = groupHtmls

          groupNames.push(groupName)
        }

        groupHtmls.push({
          sort: sortName,
          html: itemHtml
        })
      }

      groupNames.sort()

      for (let i = 0; i < groupNames.length; i++) {
        const groupName = groupNames[i]

        body += '      <li class="mdc-list-item mdc-list-item--with-one-line prevent-menu-close" role="menuitem" id="' + cardId + '_destination_group_' + i + '" data-category-name="' + groupName + '">'
        body += '        <span class="mdc-list-item__ripple"></span>'
        body += '        <span class="mdc-list-item__text mdc-list-item__start"><strong>' + groupName + '</strong></span>'
        body += '        <span class="mdc-layout-grid--align-right material-icons destination_disclosure_icon mdc-list-item__end">arrow_right</span>'
        body += '      </li>'

        const htmls = groups[groupName]

        htmls.sort(function (a, b) {
          if (a.sort === b.sort) {
            return 0
          }

          return (a.sort > b.sort ? 1 : -1)
        })

        for (let j = 0; j < htmls.length; j++) {
          body += htmls[j].html
        }

        body += '      <li class="mdc-list-divider" role="separator"></li>'
      }

      body += '      <li class="mdc-list-item mdc-list-item--with-one-line" role="menuitem" id="' + cardId + '_destination_item_add_card">'
      body += '        <span class="mdc-list-item__ripple"></span>'
      body += '        <span class="mdc-list-item__text mdc-list-item__start">Add&#8230;</span>'
      body += '        <span class="mdc-layout-grid--align-right mdc-list-item__end material-icons">add</span>'
      body += '      </li>'

      body += '    </ul>'

      body += '    </div>'

      return body
    }

    initializeDestinationMenu (cardId, onSelect) {
      const me = this

      window.setTimeout(function () {
        $('.dialog_card_selection_menu .mdc-list-item').off('click')

        const options = document.querySelectorAll('.dialog_card_selection_menu .mdc-list-item')

        for (const option of options) {
          option.addEventListener('click', (event) => {
            const prevent = event.currentTarget.classList.contains('prevent-menu-close')

            if (prevent) {
              event.stopPropagation()

              const categoryName = $(event.currentTarget).attr('data-category-name')

              const icon = $(event.currentTarget).find('.destination_disclosure_icon').html()

              const expanded = (icon === 'arrow_drop_down')

              $('.dialog_card_selection_menu .builder-destination-item').hide()

              $('.dialog_card_selection_menu .destination_disclosure_icon').html('arrow_right')

              if (expanded === false) {
                $(event.currentTarget).find('.destination_disclosure_icon').html('arrow_drop_down')

                $('.dialog_card_selection_menu [data-category="' + categoryName + '"]').show()
              }
            } else {
              const nodeId = $(event.currentTarget).attr('data-node-id')

              let id = event.currentTarget.id

              id = id.replace(cardId + '_destination_item_', '')

              if (id === 'add_card') {
                me.addCard(onSelect)
              } else {
                onSelect(nodeId)
              }
            }
          })
        }

        $('.builder-destination-item').hide()
      }, 500)
    }

    addCard (callback) {
      $('#add-card-name-value').val('')

      $('input[name=add_card_radio]').prop('checked', false)

      const me = this

      const listener = {
        handleEvent: function (event) {
          if (event.detail.action === 'add_card') {
            const cardName = $('#add-card-name-value').val()

            const cardType = $('input[name=add_card_radio]:checked').val()

            const cardClass = window.dialogBuilder.cardMapping[cardType]

            const cardDef = cardClass.createCard(cardName)

            if (window.lastCardGroup !== undefined && window.lastCardGroup !== '') {
              cardDef.builder_group = window.lastCardGroup
            }

            if (me.definition.includes(cardDef) === false) {
              me.definition.push(cardDef)
            }

            callback(cardDef.id)

            window.dialogBuilder.addCardDialog.unlisten('MDCDialog:closed', this)
          }
        }
      }

      window.dialogBuilder.addCardDialog.listen('MDCDialog:closed', listener)

      window.dialogBuilder.addCardDialog.open()
    }

    deleteCard (cardId) {
      if (window.confirm('Are you sure you want to delete this card?')) {
        const indices = []

        for (let i = 0; i < this.definition.length; i++) {
          const item = this.definition[i]

          if (cardId === item.id) {
            indices.push(i)
          }
        }

        indices.sort()
        indices.reverse()

        for (let i = 0; i < indices.length; i++) {
          const index = indices[i]

          this.definition.splice(index, 1)
        }

        this.loadNode(this.definition[0])

        window.dialogBuilder.reloadDialog()
      }
    }

    resolveNode (nodeId) {
      if (nodeId === null) {
        return null
      }

      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        if (nodeId === item.id) {
          return Node.createCard(item, this)
        }
      }

      return null
    }

    issues () {
      let issues = []

      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        const card = Node.createCard(item, this)

        const cardIssues = card.issues()

        issues = issues.concat(cardIssues)
      }

      return issues
    }

    loadDialog (definition) {
      const dialog = new Dialog(definition)

      dialog.checkCorrectness()

      return dialog
    }

    updateReferences (oldId, newId) {
      for (let i = 0; i < this.definition.length; i++) {
        const item = this.definition[i]

        const node = Node.createCard(item, this)

        node.updateReferences(oldId, newId)
      }
    }
  }

  const dialog = {}

  dialog.loadDialog = function (definition) {
    const dialog = new Dialog(definition)

    dialog.checkCorrectness()

    return dialog
  }

  return dialog
})
