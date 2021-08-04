requirejs.config({
    shim: {
        jquery: {
            exports: "$"
        },
        cookie: {
            exports: "Cookies"
        },
        bootstrap: {
            deps: ["jquery"]
        },
    },
    baseUrl: "/static/builder-js/js/app",
    paths: {
        app: '/static/builder-js/js/app',
        material: "/static/builder-js/vendor/material-components-web-11.0.0",
        jquery: "/static/builder-js/vendor/jquery-3.4.0.min",
        cookie: "/static/builder-js/vendor/js.cookie"
    }
});

requirejs(["material", "app/dialog", "cookie", "cards/node", "jquery"], function(mdc, dialog, Cookies, Node) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));

    var selectedDialog = null;

    topAppBar.setScrollTarget(document.getElementById('main-content'));

    topAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.open = !drawer.open;
    });

    function onDialogChanged(changedId) {
        $("#action_save").show();
    }

    function slugify(text){
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    var editListener = undefined;

    var removeListener = undefined;

    function onDialogChanged(changedId) {
        window.dialogBuilder.reloadDialog();

        $("#action_save").show();
    }

    window.dialogBuilder.loadDialog = function(definition, initialId) {
        if (selectedDialog != null) {
            selectedDialog.removeChangeListener(onDialogChanged);
        }

        selectedDialog = dialog.loadDialog(definition);
        selectedDialog.name = window.dialogBuilder.name;

        $(".mdc-top-app-bar__title").html(selectedDialog.getName());

        selectedDialog.addChangeListener(onDialogChanged);

        selectedDialog.selectInitialNode(initialId);
    };

    $("#action_save").hide();

    window.dialogBuilder.reloadDialog = function() {
        $(".go_home").off("click");
        $(".go_home").click(function(eventObj) {
            location.href = '/builder/';
        });

        var allCardSelectContent =  '';

        var groups = {};
        var groupNames = [];

        for (var i = 0; i < window.dialogBuilder.dialog.length; i++) {
            var item = window.dialogBuilder.dialog[i];

            var itemHtml = "";

            var groupName = item["builder_group"];

            if (groupName == undefined) {
                groupName = "<em>Ungrouped Cards</em>"
            }

            itemHtml += '     <li class="mdc-list-item mdc-list-item--with-one-line builder-destination-item" role="menuitem" id="all_cards_destination_item_' + item['id'] + '" data-node-id="' + item['id'] + '" data-category="' + groupName + '">';

            if (item["name"] != undefined) {
                itemHtml += '       <span class="mdc-list-item__text mdc-list-item__start">' + item["name"] + '</span>';
            } else {
                itemHtml += '       <span class="mdc-list-item__text mdc-list-item__start">' + item["id"] + '</span>';
            }

            itemHtml += '     </li>';

            var groupHtmls = groups[groupName];

            if (groupHtmls == undefined) {
                groupHtmls = [];

                groups[groupName] = groupHtmls;

                groupNames.push(groupName);
            }

            groupHtmls.push(itemHtml);
        }

        groupNames.sort();

        for (var i = 0; i < groupNames.length; i++) {
            var groupName = groupNames[i];

            var htmls = groups[groupName];

            allCardSelectContent += '      <li class="mdc-list-divider" role="separator"></li>';

            allCardSelectContent += '      <li class="mdc-list-item  mdc-list-item--with-one-line prevent-menu-close" role="menuitem" id="all_cards_destination_group_' + i + '" data-category-name="' + groupName + '">';
            allCardSelectContent += '        <span class="mdc-list-item__text mdc-list-item__start"><strong>' + groupName + '</strong></span>';
            allCardSelectContent += '        <span class="mdc-layout-grid--align-right mdc-list-item__end material-icons destination_disclosure_icon">arrow_right</span>';
            allCardSelectContent += '      </li>';

            for (var j = 0; j < htmls.length; j++) {
                allCardSelectContent += htmls[j];
            }
        }

        $("#select-all-cards-items").html(allCardSelectContent);

        window.setTimeout(function() {
            $("#select-all-cards .mdc-list-item").off("click");

            const options = document.querySelectorAll('#select-all-cards-items .mdc-list-item');

            for (let option of options) {
                option.addEventListener('click', (event) => {
                    let prevent = event.currentTarget.classList.contains('prevent-menu-close');

                    if (prevent) {
                        event.stopPropagation();

                        var categoryName = $(event.currentTarget).attr("data-category-name");

                        var icon = $(event.currentTarget).find(".destination_disclosure_icon").html();

                        var expanded = (icon == 'arrow_drop_down');

                        $(".builder-destination-item").hide();

                        $(".destination_disclosure_icon").html("arrow_right");

                        if (expanded) {
                            $(event.currentTarget).find(".destination_disclosure_icon").html("arrow_right");

                            $('[data-category="' + categoryName + '"]').hide();
                        } else {
                            $(event.currentTarget).find(".destination_disclosure_icon").html("arrow_drop_down");

                            $('[data-category="' + categoryName + '"]').show();
                        }
                    } else {
                        $(".all-cards-select-item").hide();
                        $(".destination_disclosure_icon").text("arrow_right");

                        window.dialogBuilder.selectCardsDialog.close();

                        var nodeId = $(event.currentTarget).attr("data-node-id");

                        var id = event.currentTarget.id;

                        id = id.replace("all_cards_destination_item_", '');

                        window.dialogBuilder.loadNodeById(id);
                    }
                });
            }
        }, 500);
    }

    window.dialogBuilder.loadNodeById = function(cardId) {
        var me = this;

        var dialog = window.dialogBuilder.dialog;

        for (var j = 0; j < dialog.length; j++) {
            var item = dialog[j];

            if (item["id"] == cardId) {
                window.dialogBuilder.loadDialog(dialog, item['id']);

                var node = Node.createCard(item, dialog);

                window.setTimeout(function() {
                    var current = $("#builder_current_node");

                    var html = node.editHtml();

                    current.html(html);

                    node.initialize();
                },  100);

                return;
            }
        }
    };

    $.getJSON(window.dialogBuilder.source, function(data) {
        window.dialogBuilder.dialog = data;

        $("#action_save").off("click");

        $("#action_save").click(function(eventObj) {
            eventObj.preventDefault();
            if (window.dialogBuilder.update != undefined) {
                window.dialogBuilder.update(selectedDialog.name, data, function() {
                    $("#action_save").hide();
                }, function(error) {
                    console.log(error);
                });
            }
        });

        var keys = Object.keys(window.dialogBuilder.cardMapping);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            var nodeClass = window.dialogBuilder.cardMapping[key];

            var name = nodeClass.cardName();

            if (name == Node.cardName()) {
                name = key;
            }

            if (key != 'begin' && key != 'end' && key != 'interrupt') {
                var radio = '';

                radio += '<div class="mdc-form-field mdc-layout-grid__cell--span-6">';
                radio += '  <div class="mdc-radio">';
                radio += '    <input class="mdc-radio__native-control" type="radio" value="' + key + '" name="add_card_radio" checked />';
                radio += '    <div class="mdc-radio__background">';
                radio += '      <div class="mdc-radio__outer-circle"></div>';
                radio += '      <div class="mdc-radio__inner-circle"></div>';
                radio += '    </div>';
                radio += '    <div class="mdc-radio__ripple"></div>';
                radio += '  </div>';
                radio += '  <label for="radio-1">' + name + '</label>';
                radio += '</div>';

                $("#add_card_radio_options").append(radio);
            }
        }

        try {
            window.dialogBuilder.reloadDialog();
        } catch (err) {
            console.log("Err");
            console.log(err);
        }

        window.dialogBuilder.selectCardsDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('builder-select-card-dialog'));

        $("#action_select_card").off("click");

        $("#action_select_card").click(function(eventObj) {
            eventObj.preventDefault();

            try {
                window.dialogBuilder.selectCardsDialog.open();
            } catch (err) {

            }
        });

        window.dialogBuilder.addCardDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add-card-dialog'));
        mdc.textField.MDCTextField.attachTo(document.getElementById('add-card-name'));

        // window.dialogBuilder.newCardSelect = mdc.select.MDCSelect.attachTo(document.getElementById('add-card-type'));

        window.dialogBuilder.editDialogModal = mdc.dialog.MDCDialog.attachTo(document.getElementById('builder-dialog-setting-dialog'));
        window.dialogBuilder.editDialogModalTitle = mdc.textField.MDCTextField.attachTo(document.getElementById('builder-dialog-setting-dialog-name'));
        window.dialogBuilder.editDialogModalIdentifier = mdc.textField.MDCTextField.attachTo(document.getElementById('builder-dialog-setting-dialog-identifier'));

        window.dialogBuilder.loadDialog(window.dialogBuilder.dialog, null);

        $("#action_edit_dialog").off("click");

        $("#action_edit_dialog").click(function(eventObj) {
            eventObj.preventDefault();

            window.dialogBuilder.editDialogModalTitle.value = $("#dialog-name").text();
            window.dialogBuilder.editDialogModalIdentifier.value = $("#dialog-identifier").text();

            window.dialogBuilder.editDialogModal.open();
        });

        var renameListener = {
            handleEvent: function (event) {
                if (event.detail.action == "close") {
                    var originalValue = $(".mdc-top-app-bar__title").text();

                    var newValue = window.dialogBuilder.editDialogModalTitle.value;

                    if (newValue != originalValue) {
                        $(".mdc-top-app-bar__title").text(newValue);
                    }

					$("#dialog-identifier").text(window.dialogBuilder.editDialogModalIdentifier.value);
					
                    $("#action_save").show();

                    window.dialogBuilder.editDialogModal.unlisten('MDCDialog:closed', this);
               }
            }
        };

        window.dialogBuilder.editDialogModal.listen('MDCDialog:closed', renameListener);
        
        window.dialogBuilder.addInterruptDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add-interrupt-dialog'));
        const interruptName = mdc.textField.MDCTextField.attachTo(document.getElementById('add-interrupt-name'));

        $("#action_add_interrupt").click(function(eventObj) {
            eventObj.preventDefault();

            window.dialogBuilder.addInterruptDialog.open();
        });

        var addInterruptListener = {
            handleEvent: function (event) {
                if (event.detail.action == "add_interrupt") {
					var cardClass = window.dialogBuilder.cardMapping['interrupt'];

					var cardDef = cardClass.createCard(interruptName.value);
					
					console.log("DIALOG");
					console.log(window.dialogBuilder.dialog);

					if (window.dialogBuilder.dialog.includes(cardDef) == false) {
						window.dialogBuilder.dialog.push(cardDef);
					}

                    window.dialogBuilder.addInterruptDialog.unlisten('MDCDialog:closed', this);
                    
                    window.dialogBuilder.loadNodeById(cardDef['id']);
               }
            }
        };

        window.dialogBuilder.addInterruptDialog.listen('MDCDialog:closed', addInterruptListener);

    });

    var viewportHeight = $(window).height();

    var sourceTop = $("#builder_source_nodes").offset().top;

    var sourceHeight = $("#builder_source_nodes").height();

    var columnHeight = viewportHeight - sourceTop - sourceHeight - 24;

    $("#builder_source_nodes").height(columnHeight);
    $("#builder_current_node").height(columnHeight);
    $("#builder_next_nodes").height(columnHeight);
});