var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class PromptNode extends Node {
        constructor(definition, dialog) {
            super(definition, dialog);
        }

        editBody() {
            var destinationNodes = this.destinationNodes(this);
            
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea" id="' + this.cardId + '_message_field" style="width: 100%">' +
                       '    <span class="mdc-notched-outline">' +
                       '      <span class="mdc-notched-outline__leading"></span>' +
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_message_value" class="mdc-floating-label">Message</label>' + 
                       '      </div>' + 
                       '      <span class="mdc-notched-outline__trailing"></span>' +
                       '    </span>' +
                       '    <span class="mdc-text-field__resizer">' +
                       '      <textarea class="mdc-text-field__input" rows="4" style="width: 100%" id="' + this.cardId + '_message_value"></textarea>' +
                       '    </span>' +
                       '  </label>' +
                       '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_identifier" style="width: 100%">';
            body += '    <input class="mdc-text-field__input" type="text" id="' + this.cardId + '_identifier_value">';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label for="' + this.cardId + '_identifier_value" class="mdc-floating-label">Variable Name</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">';
            body += '  <div class="mdc-typography--subtitle2">Timeout Parameters</div>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">';
            body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_timeout_seconds"  style="width: 100%">';
            body += '    <input type="number" min="0" step="1" class="mdc-text-field__input" id="' + this.cardId + '_timeout_seconds_value">';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label for="' + this.cardId + '_timeout_seconds_value" class="mdc-floating-label">Seconds</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">';
            body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_timeout_times"  style="width: 100%">';
            body += '    <input type="number" step="1" class="mdc-text-field__input" id="' + this.cardId + '_timeout_times_value">';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label for="' + this.cardId + '_timeout_times_value" class="mdc-floating-label">Times</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '</div>';


            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4" style="text-align: right;">';

			body += '  <button class="mdc-icon-button" id="' + this.cardId + '_timeout_edit">';
			body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>';
			body += '  </button>';

            var found = false;
            var foundNode = undefined;
            
            for (var j = 0; j < destinationNodes.length; j++) {
                const destinationNode = destinationNodes[j];
                
                if (this.definition["timeout_node_id"] != undefined) {
					if (destinationNode["id"] == this.definition["timeout_node_id"]) {
						found = true;
						foundNode = destinationNode;
					}
                }
            }

			if (found == false && this.definition["timeout_node_id"] != undefined) {
				var node = this.dialog.resolveNode(this.definition["timeout_node_id"]);
				
				if (node != null) {
					found = true;
					foundNode = node;
				}
			}
            
            if (found) {
                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_timeout_click">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>';
                body += '  </button>';
            }

            body += '</div>';

            for (var i = 0; i < this.definition['actions'].length; i++) {
            	var action = this.definition['actions'][i];

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="border-top: thin solid #AAABAA; padding-top: 20px;">';

                body += '  <div class="mdc-select mdc-select--outlined"  id="' + this.cardId + '_pattern_operation_' + i + '"  style="width: 100%">';
                body += '    <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">';
                body += '      <span class="mdc-notched-outline">';
                body += '        <span class="mdc-notched-outline__leading"></span>';
                body += '        <span class="mdc-notched-outline__notch">';
                body += '          <span id="outlined-select-label" class="mdc-floating-label">Variable&#8230;</span>';
                body += '        </span>';
                body += '        <span class="mdc-notched-outline__trailing"></span>';
                body += '      </span>';
                body += '      <span class="mdc-select__selected-text-container">';
                body += '        <span id="demo-selected-text" class="mdc-select__selected-text"></span>';
                body += '      </span>';
                body += '      <span class="mdc-select__dropdown-icon">';
                body += '        <svg class="mdc-select__dropdown-icon-graphic"viewBox="7 10 10 5" focusable="false">';
                body += '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>';
                body += '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>';
                body += '        </svg>';
                body += '      </span>';
                body += '    </div>';
                body += '    <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">';
                body += '      <ul class="mdc-list" role="listbox">';
                body += '        <li class="mdc-list-item" data-value="begins_with"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Begins with&#8230;</span></li>';
                body += '        <li class="mdc-list-item" data-value="ends_with"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Ends with&#8230;</span></li>';
                body += '        <li class="mdc-list-item" data-value="equals"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Equals&#8230;</span></li>';
                body += '        <li class="mdc-list-item" data-value="not_equals"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Does not equal&#8230;</span></li>';
                body += '        <li class="mdc-list-item" data-value="contains"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Contains&#8230;</span></li>';
                body += '        <li class="mdc-list-item" data-value="not_contains"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">Does not contain&#8230;</span></li>';
                body += '      </ul>';
                body += '    </div>';
                body += '  </div>';
                body += '</div>';
            	
                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
                body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pattern_value_' + i + '"  style="width: 100%">';
                body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_pattern_value_' + i + '_value">';
                body += '    <div class="mdc-notched-outline">';
                body += '      <div class="mdc-notched-outline__leading"></div>';
                body += '      <div class="mdc-notched-outline__notch">';
                body += '        <label for="' + this.cardId + '_pattern_value_' + i + '_value" class="mdc-floating-label">Pattern</label>';
                body += '      </div>';
                body += '      <div class="mdc-notched-outline__trailing"></div>';
                body += '    </div>';
                body += '  </div>';
                body += '</div>';

				body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">';
				body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit_' + i + '">';
				body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>';
				body += '  </button>';
				body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto_' + i + '">';
				body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>';
				body += '  </button>';
				body += '</div>';
            }

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right; border-bottom: thin solid #AAABAA; padding-bottom: 20px;">';
            body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_pattern">';
            body += '  <span class="mdc-button__label">Add Pattern</span>';
            body += '</button>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
            body += '  <p class="mdc-typography--body1">No Pattern Matched: </p>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">';

            body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_not_found">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>';
            body += '  </button>';
            
            if (this.definition["no_match"] != undefined) {
                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_not_found">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>';
                body += '  </button>';
            }

            body += '</div>';

            body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">';
            body += '  <div class="mdc-dialog__container">';
            body += '    <div class="mdc-dialog__surface">';
            body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';
            body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content" style="padding: 0px;">';
            body += this.dialog.chooseDestinationMenu(this.cardId);
            body += '      </div>';
//            body += '      <footer class="mdc-dialog__actions">';
//            body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
//            body += '          <span class="mdc-button__label">Save</span>';
//            body += '        </button>';
//            body += '      </footer>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-dialog__scrim"></div>';
            body += '</div>';
            
            return body;
        }

        viewBody() {
            var summary = '<div class="mdc-typography--body1" style="margin: 16px;">Prompt: <em>' + this.definition['prompt'] + '</em></div>';
            
            for (var i = 0; i < this.definition['actions'].length; i++) {
                var action = this.definition['actions'][i];
                
                var humanized = Node.humanizePattern(action["pattern"]);
                
                var actionNode = this.dialog.resolveNode(action['action']);
                
                if (actionNode != null) {
	                summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + humanized + ': go to <em>' + actionNode.cardName() + '</em>.</div>';
	            } else {
	                summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + humanized + ': go to <em>None Selected</em>.</div>';
	            }
	            
            }
            
            if (this.definition['no_match'] != undefined && this.definition['no_match'] != '') {
                var node = this.dialog.resolveNode(this.definition['no_match']);

                summary += '<div class="mdc-typography--body1" style="margin: 16px;">';

                if (node != null) {
	                summary += "If responses doesn't match a pattern, go to <em>" + node.cardName() + '</em>.';
	            } else {
	                summary += "If responses doesn't match a pattern, go to <em>None Selected</em>.";
				}
					            
                summary += '</div>';
            }
            
            return summary;
        }

        initialize() {
            super.initialize();
            
            const me = this;

            const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            const messageField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_message_field'));
            messageField.value = this.definition['prompt'];

            $('#' + this.cardId + '_message_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_message_value').val();
                
                me.definition['prompt'] = value;
                
                me.dialog.markChanged(me.id);
            });

            const identifierField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_identifier'));
            identifierField.value = this.definition["id"];

            $('#' + this.cardId + '_identifier_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_identifier_value').val();
                
                var oldId = me.definition['id'];

                me.definition['id'] = value;
                me.id = value;

                me.dialog.updateReferences(oldId, value);
                
                me.dialog.markChanged(me.id);
            });

            this.dialog.initializeDestinationMenu(me.cardId, function(selected) {
                if (me.targetAction == "timeout") {
                    me.definition['timeout_node_id'] = selected;
                
                } else if (me.targetAction != null) {
                	me.targetAction['action'] = selected;
                } else {
                    me.definition['no_match'] = selected;
                }

                me.dialog.markChanged(me.id);
                me.dialog.loadNode(me.definition);
            });

            var updatePattern = function(action, operation, pattern) {
                me.dialog.markChanged(me.id);
                
                if (pattern.value == "") {
                    action["pattern"] = "";
                } else if (operation == "begins_with") {
                    action["pattern"] = "^" + pattern;
                } else if (operation == "ends_with") {
                    action["pattern"] = pattern + "$";
                } else if (operation == "equals") {
                    action["pattern"] = "^" + pattern + "$";
                } else if (operation == "not_contains") {
                    action["pattern"] = "(?!" + pattern + ")";
                } else if (operation == "not_equals") {
                    action["pattern"] = "^(?!" + pattern + ")$";
                } else {
                    action["pattern"] = pattern;
                }
            }

            var updateViews = function(pattern, operationField, patternField) {
            	var patternValue = "";
            	var operationValue = "";
            	
            	if (pattern == "") {
            		operationField.value = "contains";
            		patternField.value = "";
            	} else if (pattern.startsWith("^(?!") && pattern.endsWith(")$")) {
            		operationField.value = "not_equals";
            		patternField.value = pattern.replace("^(?!", "").replace(")$", "");
            	} else if (pattern.startsWith("(?!") && pattern.endsWith(")")) {
            		operationField.value = "not_contains";
            		patternField.value = pattern.replace("(?!", "").replace(")", "");
            	} else if (pattern.startsWith("(?!") && pattern.endsWith(")")) {
            		operationField.value = "not_contains";
            		patternField.value = pattern.replace("(?!", "").replace(")", "");
            	} else if (pattern.startsWith("^") && pattern.endsWith("$")) {
            		operationField.value = "equals";
            		patternField.value = pattern.replace("^", "").replace("$", "");
            	} else if (pattern.startsWith("^")) {
            		operationField.value = "begins_with";
            		patternField.value = pattern.replace("^", "");
            	} else if (pattern.endsWith("$")) {
            		operationField.value = "ends_with";
            		patternField.value = pattern.replace("$", "");
            	} else {
            		operationField.value = "contains";
            		patternField.value = pattern;
            	}
            };

            for (var i = 0; i < this.definition['actions'].length; i++) {
            	const action = this.definition['actions'][i];
            	
                const identifier = this.cardId + '_pattern_value_' + i;
                const patternField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier));

                const operationId = this.cardId + '_pattern_operation_' + i;
                const operationSelect = mdc.select.MDCSelect.attachTo(document.getElementById(operationId));
                
                const patternIndex = i;
                
                updateViews(action['pattern'], operationSelect, patternField);

                $("#" + identifier).on("change keyup paste", function() {
                    var value = $('#' + identifier + '_value').val();
                
                    if (me.definition['actions'][patternIndex]['pattern'] == "" && value == "") {
                        me.definition['actions'].splice(patternIndex, 1);
                        me.dialog.loadNode(me.definition);
                    } else {
                    	window.setTimeout(function() {
	                        updatePattern(me.definition['actions'][patternIndex], operationSelect.value, patternField.value);
	                    }, 250);
                    }
                });

                operationSelect.listen('MDCSelect:change', () => {
					window.setTimeout(function() {
						updatePattern(me.definition['actions'][patternIndex], operationSelect.value, patternField.value);
					}, 250);
                });
                
				$('#' + this.cardId + '_next_edit_' + i).on("click", function() {
					me.targetAction = action;
				
					nextDialog.open();
				});

				$('#' + this.cardId + '_next_goto_' + i).on("click", function() {
					console.log("click");
					console.log(action);
					
					var destinationNodes = me.destinationNodes(me.dialog);
				
					for (var i = 0; i < destinationNodes.length; i++) {
						const destinationNode = destinationNodes[i];

						if (action['action'] == destinationNode["id"]) {
							$("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
						} else {
							$("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
						}
					}

					var sourceNodes = me.sourceNodes(me.dialog);
				
					for (var i = 0; i < sourceNodes.length; i++) {
						const sourceNode = sourceNodes[i];

						if (action['action'] == sourceNode["id"]) {
							$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#ffffff");
						} else {
							$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#e0e0e0");
						}
					}
				});
            }

            $('#' + this.cardId + '_add_pattern').on("click", function() {
                me.definition['actions'].push({
                	"pattern": ".*",
                	"action": me.id
                });

                me.dialog.loadNode(me.definition);    
                me.dialog.markChanged(me.id);
            });

            $('#' + this.cardId + '_pattern_edit_not_found').on("click", function() {
            	me.targetAction = null;
                
                nextDialog.open();
            });


            $('#' + this.cardId + '_pattern_click_not_found').on("click", function() {
                var destinationNodes = me.destinationNodes(me.dialog);
                
                var found = false;
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];

                    if (me.definition["no_match"] == destinationNode["id"]) {
                        $("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }

                var sourceNodes = me.sourceNodes(me.dialog);

				for (var i = 0; i < sourceNodes.length; i++) {
					const sourceNode = sourceNodes[i];

					if (me.definition["no_match"]  == sourceNode["id"]) {
						$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#ffffff");
					} else {
						$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#e0e0e0");
					}
				}
            });
            
            const timeoutSecondsField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_timeout_seconds'));

            if (this.definition["timeout"] != undefined) {
	            timeoutSecondsField.value = this.definition["timeout"];
            }
            
			$('#' + this.cardId + '_timeout_seconds_value').change(function(eventObj) {
				var value = $('#' + me.cardId + '_timeout_seconds_value').val();
				
				if (value == "") {
					delete me.definition["timeout"];
					delete me.definition["timeout_node_id"];
				} else {
					me.definition["timeout"] = parseInt(value);
				}

                me.dialog.markChanged(me.id);
			});

            const timeoutCountField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_timeout_times'));

            if (this.definition["timeout_iterations"] != undefined) {
	            timeoutCountField.value = this.definition["timeout_iterations"];
            }
            
			$('#' + this.cardId + '_timeout_times_value').change(function(eventObj) {
				var value = $('#' + me.cardId + '_timeout_times_value').val();
				
				if (value == "") {
					delete me.definition["timeout_iterations"];
				} else {
					me.definition["timeout_iterations"] = parseInt(value);
				}

                me.dialog.markChanged(me.id);
			});

			$('#' + this.cardId + '_timeout_edit').on("click", function() {
				me.targetAction = "timeout";

				nextDialog.open();
			});

            $('#' + this.cardId + '_timeout_click').on("click", function() {
                var destinationNodes = me.destinationNodes(me.dialog);
                
                var found = false;
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];

                    if (me.definition["timeout_node_id"] == destinationNode["id"]) {
                        $("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                        $("#builder_source_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("#builder_next_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                        $("#builder_source_nodes [data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }

                var sourceNodes = me.sourceNodes(me.dialog);

				for (var i = 0; i < sourceNodes.length; i++) {
					const sourceNode = sourceNodes[i];

					if (me.definition["timeout_node_id"] == sourceNode["id"]) {
						$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#ffffff");
					} else {
						$("#builder_source_nodes [data-node-id='" + sourceNode["id"] + "']").css("background-color", "#e0e0e0");
					}
				}
            });
        }

        destinationNodes(dialog) {
            var nodes = super.destinationNodes(dialog);
            
            var includedIds = [];

            if (this.definition['timeout'] != undefined) {
                if (this.definition['timeout_node_id'] != undefined) {
					if (includedIds.indexOf(this.definition['timeout_node_id']) == -1) {
						for (var i = 0; i < dialog.definition.length; i++) {
							var item = dialog.definition[i];
				
							if (item['id'] == this.definition['timeout_node_id']) {
								nodes.push(Node.createCard(item, dialog));
							}
						}
						
						includedIds.push(this.definition['timeout_node_id']);
					}
                }
            }
            
            for (var j = 0; j < this.definition["actions"].length; j++) {
				var id = this.definition["actions"][j]["action"];
				
				if (includedIds.indexOf(id) == -1) {
					for (var i = 0; i < dialog.definition.length; i++) {
						var item = dialog.definition[i];
				
						if (item['id'] == id) {
							nodes.push(Node.createCard(item, dialog));
						}
					}
					
					includedIds.push(id);
				}
			}

            id = this.definition['no_match'];
		
			if (includedIds.indexOf(id) == -1) {
				for (var i = 0; i < dialog.definition.length; i++) {
					var item = dialog.definition[i];
				
					if (item['id'] == id) {
						nodes.push(Node.createCard(item, dialog));
					}
				}
			}
			
            return nodes;
        }

        updateReferences(oldId, newId) {
        	$.each(this['actions'], function(index, value) {
        		if (value['action'] == oldId) {
        			value['action'] = newId;
        		}
        	});
        }

        cardType() {
            return 'Branching Prompt';
        }
        
        static cardName() {
            return 'Branching Prompt';
        }

        static createCard(cardName) {
        	var id = Node.uuidv4();
        	
            var card = {
            	"name": cardName,
                "prompt": "(Your prompt here)",
                "actions": [{
                	"pattern": ".*",
                	"action": id
                }],
                "no_match": id,
                "type": "branch-prompt",
                "id": id
            }; 
            
            return card;
        }
    }

    Node.registerCard('branch-prompt', PromptNode);
    
    return PromptNode;
});