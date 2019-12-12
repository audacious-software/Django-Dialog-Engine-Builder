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
        material: "/static/builder-js/vendor/material-components-web.min",
        jquery: "/static/builder-js/vendor/jquery-3.4.0.min",
        cookie: "/static/builder-js/vendor/js.cookie"
    }
});

requirejs(["material", "app/dialog", "cookie", "cards/node", "jquery"], function(mdc, dialog, Cookies, Node) {
    var csrftoken = Cookies.get('csrftoken');

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

    // const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

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

        $("#action_edit_sequence").off("click");

        $("#action_edit_sequence").click(function(eventObj) {
            eventObj.preventDefault();
            
            $("#edit-sequence-name-value").val(selectedDialog.getName());

			window.dialogBuilder.editDialogModal.unlisten('MDCDialog:closed', editListener);

            editListener = {
                handleEvent: function (event) {
                    if (event.detail.action == "update_sequence") {
						var name = $("#edit-sequence-name-value").val();
					
						selectedDialog.name = name;
						$(".mdc-top-app-bar__title").html(name);

						window.dialogBuilder.reloadDialog();

						$("#action_save").show();
				
						window.dialogBuilder.editDialogModal.unlisten('MDCDialog:closed', this);
                   }
                }
            };
            
            window.dialogBuilder.editDialogModal.listen('MDCDialog:closed', editListener);
           
            window.dialogBuilder.editDialogModal.open()
        });
        
        selectedDialog.selectInitialNode(initialId);
    };
    
    $("#action_save").hide();
    
    window.dialogBuilder.reloadDialog = function() {
        $(".go_home").off("click");
        $(".go_home").click(function(eventObj) {
        	location.href = '/builder/';
        });
        
        var allCardSelectContent =  '<li class="mdc-list-item mdc-list-item--selected">';
		allCardSelectContent +=     '  <span class="mdc-list-item__text">Please Select a Card&#8230;</span>';
		allCardSelectContent +=     '</li>';

		var groups = {};
		var groupNames = [];
		
		for (var i = 0; i < window.dialogBuilder.dialog.length; i++) {
			var item = window.dialogBuilder.dialog[i];
			
			var itemHtml = "";
			
			var groupName = item["builder_group"];
			
			if (groupName == undefined) {
				groupName = "<em>Ungrouped Cards</em>"
			}

			itemHtml += '     <li class="mdc-list-item builder-destination-item" role="menuitem" id="all_cards_destination_item_' + item['id'] + '" data-node-id="' + item['id'] + '" data-category="' + groupName + '">';
			
			if (item["name"] != undefined) {
				itemHtml += '       <span class="mdc-list-item__text">' + item["name"] + '</span>';
			} else {
				itemHtml += '       <span class="mdc-list-item__text">' + item["id"] + '</span>';
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

			allCardSelectContent += '      <li class="mdc-list-item prevent-menu-close" role="menuitem" id="all_cards_destination_group_' + i + '" data-category-name="' + groupName + '">';
			allCardSelectContent += '        <span class="mdc-list-item__text"><strong>' + groupName + '</strong></span>';
			allCardSelectContent += '        <span class="mdc-list-item__meta material-icons destination_disclosure_icon">arrow_right</span>';
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
						} else {
							$(event.currentTarget).find(".destination_disclosure_icon").html("arrow_drop_down");
							
							console.log("CATEGORY: " + categoryName);

	                        $('[data-category="' + categoryName + '"]').show();
						}
                    } else {
						var nodeId = $(event.currentTarget).attr("data-node-id");

						console.log(nodeId);
				
						if (nodeId != undefined && nodeId != null) {
							var id = event.currentTarget.id;

							id = id.replace("all_cards_destination_item_", '');
				
							window.dialogBuilder.loadNodeById(id);
						}
					}
				});
			}

			$(".builder-destination-item").hide();

			window.dialogBuilder.allCardsSelect.selectedIndex = 0;
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

				var current = $("#builder_current_node");

				var html = node.editHtml();

				current.html(html);

				node.initialize();    

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
            
            if (key != 'begin' && key != 'end') {
	            $("#add-card-select-widget").append('<li class="mdc-list-item" data-value="' + key + '">' + name + '</li>');
	        }
        }
        
        window.dialogBuilder.reloadDialog();

        window.dialogBuilder.allCardsSelect = mdc.select.MDCSelect.attachTo(document.getElementById('select-all-cards'));

        window.dialogBuilder.addCardDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('add-card-dialog'));
        mdc.textField.MDCTextField.attachTo(document.getElementById('add-card-name'));
        
        window.dialogBuilder.newCardSelect = mdc.select.MDCSelect.attachTo(document.getElementById('add-card-type'));

        window.dialogBuilder.editDialogModal = mdc.dialog.MDCDialog.attachTo(document.getElementById('edit-sequence-dialog'));
        mdc.textField.MDCTextField.attachTo(document.getElementById('edit-sequence-name'));

        window.dialogBuilder.loadDialog(window.dialogBuilder.dialog, null);
    });
});