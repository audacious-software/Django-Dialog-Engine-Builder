/* global requirejs */

requirejs.config({
  shim: {
    jquery: {
      exports: '$'
    },
    cookie: {
      exports: 'Cookies'
    },
    bootstrap: {
      deps: ['jquery']
    }
  },
  baseUrl: '/static/builder-js/js/app',
  paths: {
    app: '/static/builder-js/js/app',
    material: '/static/builder-js/vendor/material-components-web-11.0.0',
    jquery: '/static/builder-js/vendor/jquery-3.4.0.min',
    cookie: '/static/builder-js/vendor/js.cookie'
  }
})

requirejs(['material', 'app/dialog', 'cookie', 'cards/node', 'jquery'], function (mdc, dialog, Cookies, Node) {
  const csrftoken = $('[name=csrfmiddlewaretoken]').val()

  function csrfSafeMethod (method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method))
  }

  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', csrftoken)
      }
    }
  })

  const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'))

  let selectedDialog = null
  let dialogIsDirty = false

  topAppBar.setScrollTarget(document.getElementById('main-content'))

  function onDialogChanged (changedId) {
    window.dialogBuilder.reloadDialog()

    $('#action_save').show()

    dialogIsDirty = true

    const issues = selectedDialog.issues()

    if (issues.length > 0) {
      $('#action_save').html('warning')
    } else {
      $('#action_save').html('save')
    }
  }

  window.dialogBuilder.loadDialog = function (definition, initialId) {
    if (selectedDialog !== null) {
      selectedDialog.removeChangeListener(onDialogChanged)
    }

    selectedDialog = dialog.loadDialog(definition)
    selectedDialog.name = window.dialogBuilder.name

    $('.mdc-top-app-bar__title').html(selectedDialog.getName())

    selectedDialog.selectInitialNode(initialId)

    selectedDialog.addChangeListener(onDialogChanged)

    const issues = selectedDialog.issues()

    if (issues.length > 0) {
      $('#action_save').html('warning')
    } else {
      $('#action_save').html('save')
    }
  }

  window.dialogBuilder.reloadDialog = function () {
    $('.go_home').off('click')
    $('.go_home').click(function (eventObj) {
      window.location.href = '/builder/'
    })

    let allCardSelectContent = ''

    const groups = {}
    const groupNames = []

    for (let i = 0; i < window.dialogBuilder.dialog.length; i++) {
      const item = window.dialogBuilder.dialog[i]

      let itemHtml = ''

      let groupName = item.builder_group

      if (groupName === undefined) {
        groupName = '<em>Ungrouped Cards</em>'
      }

      itemHtml += '     <li class="mdc-list-item mdc-list-item--with-one-line builder-destination-item" role="menuitem" id="all_cards_destination_item_' + item.id + '" data-node-id="' + item.id + '" data-category="' + groupName + '">'

      let sortName = item.id

      if (item.name !== undefined) {
        itemHtml += '       <span class="mdc-list-item__text mdc-list-item__start">' + item.name + '</span>'
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

      allCardSelectContent += '      <li class="mdc-list-divider" role="separator"></li>'
      allCardSelectContent += '      <li class="mdc-list-item  mdc-list-item--with-one-line prevent-menu-close" role="menuitem" id="all_cards_destination_group_' + i + '" data-category-name="' + groupName + '">'
      allCardSelectContent += '        <span class="mdc-list-item__text mdc-list-item__start"><strong>' + groupName + '</strong></span>'
      allCardSelectContent += '        <span class="mdc-layout-grid--align-right mdc-list-item__end material-icons destination_disclosure_icon">arrow_right</span>'
      allCardSelectContent += '      </li>'

      const htmls = groups[groupName]

      htmls.sort(function (a, b) {
        if (a.sort === b.sort) {
          return 0
        }

        return (a.sort > b.sort ? 1 : -1)
      })

      for (let j = 0; j < htmls.length; j++) {
        allCardSelectContent += htmls[j].html
      }
    }

    $('#select-all-cards-items').html(allCardSelectContent)

    window.setTimeout(function () {
      $('#select-all-cards .mdc-list-item').off('click')

      const options = document.querySelectorAll('#select-all-cards-items .mdc-list-item')

      for (const option of options) {
        option.addEventListener('click', (event) => {
          const prevent = event.currentTarget.classList.contains('prevent-menu-close')

          if (prevent) {
            event.stopPropagation()

            const categoryName = $(event.currentTarget).attr('data-category-name')

            const icon = $(event.currentTarget).find('.destination_disclosure_icon').html()

            const expanded = (icon === 'arrow_drop_down')

            $('.builder-destination-item').hide()

            $('.destination_disclosure_icon').html('arrow_right')

            if (expanded) {
              $(event.currentTarget).find('.destination_disclosure_icon').html('arrow_right')

              $('[data-category="' + categoryName + '"]').hide()
            } else {
              $(event.currentTarget).find('.destination_disclosure_icon').html('arrow_drop_down')

              $('[data-category="' + categoryName + '"]').show()
            }
          } else {
            $('.all-cards-select-item').hide()
            $('.destination_disclosure_icon').text('arrow_right')

            window.dialogBuilder.selectCardsDialog.close()

            const id = event.currentTarget.id.replace('all_cards_destination_item_', '')

            window.dialogBuilder.loadNodeById(id)
          }
        })
      }
    }, 500)
  }

  window.dialogBuilder.loadNodeById = function (cardId) {
    const dialog = window.dialogBuilder.dialog

    for (let j = 0; j < dialog.length; j++) {
      const item = dialog[j]

      if (item.id === cardId) {
        window.dialogBuilder.loadDialog(dialog, item.id)

        /*
                var node = Node.createCard(item, selectedDialog);

                window.setTimeout(function() {
                    var current = $("#builder_current_node");

                    var html = node.editHtml();

                    current.html(html);

                    node.initialize();

                    window.lastCardGroup = item['builder_group'];
                },  100);
*/
        return
      }
    }
  }

  window.dialogBuilder.outstandingIssuesDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('outstanding-issues-dialog'))

  $.getJSON(window.dialogBuilder.source, function (data) {
    window.dialogBuilder.dialog = data

    $('#action_save').off('click')

    $('#action_save').click(function (eventObj) {
      eventObj.preventDefault()

      const issues = selectedDialog.issues()

      if (issues.length === 0) {
        if (window.dialogBuilder.update !== undefined) {
          window.dialogBuilder.update(selectedDialog.name, data, function () {
            dialogIsDirty = false
          }, function (error) {
            console.log(error)
          })
        }
      } else {
        $('#outstanding-issues-items').empty()

        $.each(issues, function (index, issue) {
          let itemHtml = '     <li class="mdc-list-item outstanding-issue-item" role="menuitem" id="outstanding-issue-item-' + index + '" data-node-id="' + issue[0] + '" style="height: 48px;">'
          itemHtml += '       <span class="mdc-list-item__ripple"></span>'
          itemHtml += '       <span class="mdc-list-item__text">'
          itemHtml += '         <span class="mdc-list-item__primary-text">' + issue[1] + '</span>'
          itemHtml += '         <span class="mdc-list-item__secondary-text" style="margin-top: -10px;">' + issue[2] + '</span>'
          itemHtml += '       </span>'
          itemHtml += '     </li>'

          $('#outstanding-issues-items').append(itemHtml)
        })

        let itemHtml = '     <li class="mdc-list-item mdc-list-item--with-one-line outstanding-issue-item" role="menuitem" id="outstanding-issue-item-save" data-node-id="action-save">'
        itemHtml += '       <span class="mdc-list-item__ripple"></span>'
        itemHtml += '       <span class="mdc-list-item__text">'
        itemHtml += '         <span class="mdc-list-item__primary-text">Save with issues</span>'
        itemHtml += '         <span class="mdc-list-item__secondary-text" style="margin-top: -10px;">May exhibit unexpected behavior!</span>'
        itemHtml += '       </span>'
        itemHtml += '       <span class="mdc-list-item__end" style="margin-left: auto; padding-top: 12px;"><i class="material-icons">save</i></span>'
        itemHtml += '     </li>'

        $('#outstanding-issues-items').append(itemHtml)

        $('.outstanding-issue-item').click(function (eventObj) {
          let clicked = $(eventObj.target)

          let nodeId = clicked.data('node-id')

          while (nodeId === undefined) {
            clicked = clicked.parent()

            nodeId = clicked.data('node-id')
          }

          if (nodeId === 'action-save') {
            if (window.dialogBuilder.update !== undefined) {
              window.dialogBuilder.update(selectedDialog.name, data, function () {
                dialogIsDirty = false
              }, function (error) {
                console.log(error)
              })
            }
          } else {
            window.dialogBuilder.loadNodeById(nodeId)
          }

          window.dialogBuilder.outstandingIssuesDialog.close()
        })

        window.dialogBuilder.outstandingIssuesDialog.open()
      }
    })

    const keys = Object.keys(window.dialogBuilder.cardMapping)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      const nodeClass = window.dialogBuilder.cardMapping[key]

      let name = nodeClass.cardName()

      if (name === Node.cardName()) {
        name = key
      }

      if (key !== 'begin' && key !== 'end' && key !== 'interrupt') {
        let radio = ''

        radio += '<div class="mdc-form-field mdc-layout-grid__cell--span-6">'
        radio += '  <div class="mdc-radio">'
        radio += '    <input class="mdc-radio__native-control" type="radio" value="' + key + '" name="add_card_radio" checked />'
        radio += '    <div class="mdc-radio__background">'
        radio += '      <div class="mdc-radio__outer-circle"></div>'
        radio += '      <div class="mdc-radio__inner-circle"></div>'
        radio += '    </div>'
        radio += '    <div class="mdc-radio__ripple"></div>'
        radio += '  </div>'
        radio += '  <label for="radio-1">' + name + '</label>'
        radio += '</div>'

        $('#add_card_radio_options').append(radio)

        let changeTypeRadio = ''

        changeTypeRadio += '<div class="mdc-form-field mdc-layout-grid__cell--span-6">'
        changeTypeRadio += '  <div class="mdc-radio">'
        changeTypeRadio += '    <input class="mdc-radio__native-control" type="radio" value="' + key + '" name="change_card_type_radio" checked />'
        changeTypeRadio += '    <div class="mdc-radio__background">'
        changeTypeRadio += '      <div class="mdc-radio__outer-circle"></div>'
        changeTypeRadio += '      <div class="mdc-radio__inner-circle"></div>'
        changeTypeRadio += '    </div>'
        changeTypeRadio += '    <div class="mdc-radio__ripple"></div>'
        changeTypeRadio += '  </div>'
        changeTypeRadio += '  <label for="radio-1">' + name + '</label>'
        changeTypeRadio += '</div>'

        $('#change_card_type_options').append(changeTypeRadio)
      }
    }

    try {
      window.dialogBuilder.reloadDialog()
    } catch (err) {
      console.log('Err')
      console.log(err)
    }

    window.dialogBuilder.selectCardsDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('builder-select-card-dialog'))

    $('#action_select_card').off('click')

    $('#action_select_card').click(function (eventObj) {
      eventObj.preventDefault()

      try {
        window.dialogBuilder.selectCardsDialog.open()
      } catch (err) {

      }
    })

    window.dialogBuilder.addCardDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add-card-dialog'))
    window.dialogBuilder.changeCardTypeDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('change-card-type-dialog'))
    mdc.textField.MDCTextField.attachTo(document.getElementById('add-card-name'))

    // window.dialogBuilder.newCardSelect = mdc.select.MDCSelect.attachTo(document.getElementById('add-card-type'));

    window.dialogBuilder.editDialogModal = mdc.dialog.MDCDialog.attachTo(document.getElementById('builder-dialog-setting-dialog'))
    window.dialogBuilder.editDialogModalTitle = mdc.textField.MDCTextField.attachTo(document.getElementById('builder-dialog-setting-dialog-name'))
    window.dialogBuilder.editDialogModalIdentifier = mdc.textField.MDCTextField.attachTo(document.getElementById('builder-dialog-setting-dialog-identifier'))

    window.dialogBuilder.loadDialog(window.dialogBuilder.dialog, null)

    $('#action_edit_dialog').off('click')

    $('#action_edit_dialog').click(function (eventObj) {
      eventObj.preventDefault()

      window.dialogBuilder.editDialogModalTitle.value = $('#dialog-name').text()
      window.dialogBuilder.editDialogModalIdentifier.value = $('#dialog-identifier').text()

      window.dialogBuilder.editDialogModal.open()
    })

    const renameListener = {
      handleEvent: function (event) {
        if (event.detail.action === 'close') {
          const originalValue = $('.mdc-top-app-bar__title').text()

          const newValue = window.dialogBuilder.editDialogModalTitle.value

          if (newValue !== originalValue) {
            $('.mdc-top-app-bar__title').text(newValue)
          }

          $('#dialog-identifier').text(window.dialogBuilder.editDialogModalIdentifier.value)

          $('#action_save').show()

          dialogIsDirty = true

          window.dialogBuilder.editDialogModal.unlisten('MDCDialog:closed', this)
        }
      }
    }

    window.dialogBuilder.editDialogModal.listen('MDCDialog:closed', renameListener)

    window.dialogBuilder.addInterruptDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add-interrupt-dialog'))

    const interruptName = mdc.textField.MDCTextField.attachTo(document.getElementById('add-interrupt-name'))

    $('#action_add_interrupt').click(function (eventObj) {
      eventObj.preventDefault()

      interruptName.value = 'New Interrupt'

      $("input[name='add-interrupt-type']").first().prop('checked', true)

      window.dialogBuilder.addInterruptDialog.open()
    })

    const addInterruptListener = {
      handleEvent: function (event) {
        if (event.detail.action === 'add_interrupt') {
          const cardType = $('input[type="radio"][name="add-interrupt-type"]:checked').val()

          const cardClass = window.dialogBuilder.cardMapping[cardType]

          const cardDef = cardClass.createCard(interruptName.value)

          if (window.dialogBuilder.dialog.includes(cardDef) === false) {
            window.dialogBuilder.dialog.push(cardDef)
          }

          selectedDialog.markChanged(cardDef.id)

          window.dialogBuilder.loadNodeById(cardDef.id)
        }
      }
    }

    window.dialogBuilder.addInterruptDialog.listen('MDCDialog:closed', addInterruptListener)

    window.dialogBuilder.viewStructureDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('preview-dialog'))

    $('#action_view_structure').click(function (eventObj) {
      eventObj.preventDefault()

      $('#preview-dialog-canvas').height(parseInt($(window).height() * 0.9))
      $('#preview-dialog-canvas').width(parseInt($(window).width() * 0.9))

      $('#preview-dialog-content').height($('#preview-dialog-canvas').height())
      $('#preview-dialog-content').css('overflow', 'hidden')

      window.dialogBuilder.viewStructureDialog.open()

      window.setTimeout(function () {
        $('#preview-dialog-canvas').attr('src', window.dialogBuilder.visualization)
      }, 100)
    })
  })

  const viewportHeight = $(window).height()

  const sourceTop = $('#builder_source_nodes').offset().top

  const sourceHeight = $('#builder_source_nodes').height()

  const columnHeight = viewportHeight - sourceTop - sourceHeight - 24

  $('#builder_source_nodes').height(columnHeight)
  $('#builder_current_node').height(columnHeight)
  $('#builder_next_nodes').height(columnHeight)

  mdc.tooltip.MDCTooltip.attachTo(document.getElementById('action_view_structure_tip'))
  mdc.tooltip.MDCTooltip.attachTo(document.getElementById('action_select_card_tip'))
  mdc.tooltip.MDCTooltip.attachTo(document.getElementById('action_edit_dialog_tip'))
  mdc.tooltip.MDCTooltip.attachTo(document.getElementById('action_add_interrupt_tip'))
  mdc.tooltip.MDCTooltip.attachTo(document.getElementById('action_save_tip'))

  window.addEventListener('beforeunload', function (e) {
    e = e || window.event

    if (dialogIsDirty) {
      e.preventDefault()

      if (e) {
        e.returnValue = 'You have unsaved changes. Are you sure you want to exit now?'
      }

      return e.returnValue
    }

    delete e.returnValue
  })
})
