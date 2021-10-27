var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class TimeElapsedInterruptNode extends Node {
        constructor(definition, dialog) {
            super(definition, dialog);
        }

        editBody() {
            var body = '' +
            		   '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">' +
                       '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_hours_field" style="width: 100%">' +
                       '    <span class="mdc-notched-outline">' +
                       '      <span class="mdc-notched-outline__leading"></span>' +
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_iterations_value" class="mdc-floating-label">Elapsed Hours:</label>' + 
                       '      </div>' + 
                       '      <span class="mdc-notched-outline__trailing"></span>' +
                       '    </span>' +
                       '    <span class="mdc-text-field__resizer">' +
                       '      <input type="number" min="0" step="1" id="' + this.cardId + '_hours_value" class="mdc-text-field__input">' + 
                       '    </span>' +
                       '  </label>' +
                       '</div>' +
            		   '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">' +
                       '  <label class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_minutes_field" style="width: 100%">' +
                       '    <span class="mdc-notched-outline">' +
                       '      <span class="mdc-notched-outline__leading"></span>' +
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_iterations_value" class="mdc-floating-label">Minutes:</label>' + 
                       '      </div>' + 
                       '      <span class="mdc-notched-outline__trailing"></span>' +
                       '    </span>' +
                       '    <span class="mdc-text-field__resizer">' +
                       '      <input type="number" min="0" step="1" id="' + this.cardId + '_minutes_value" class="mdc-text-field__input">' + 
                       '    </span>' +
                       '  </label>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--body1" style="padding-top: 24px;">' +
                       '  Continue:' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>' +
                       '  </button>' + 
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>' +
                       '  </button>' +
                       '</div>' +
                       '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">' +
                       '  <div class="mdc-dialog__container">' +
                       '    <div class="mdc-dialog__surface">' +
                       '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>' +
                       '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content"  style="padding: 0px;">';

            body += this.dialog.chooseDestinationMenu(this.cardId);

            body += '      </div>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-dialog__scrim"></div>';
            body += '</div>';
            
            return body;
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;">Continues after: <em>' + this.definition['hours_elapsed'] + '</em> hours and <em>' + this.definition['minutes_elapsed'] + '</em> minutes have elapsed since the beginning of the dialog.</div>';
        }

        initialize() {
            super.initialize();
            
            const me = this;

            const hoursField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_hours_field'));
            hoursField.value = '' + this.definition['hours_elapsed'];

            $('#' + this.cardId + '_hours_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_hours_value').val();
                
                me.definition['hours_elapsed'] = parseInt(value);
                
                me.dialog.markChanged(me.id);
            });

            const minutesField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_minutes_field'));
            minutesField.value = '' + this.definition['minutes_elapsed'];

            $('#' + this.cardId + '_minutes_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_minutes_value').val();
                
                me.definition['minutes_elapsed'] = parseInt(value);
                
                me.dialog.markChanged(me.id);
            });

            me.dialog.initializeDestinationMenu(me.cardId, function(selected) {
                me.definition['next_id'] = selected;

                me.dialog.markChanged(me.id);
                me.dialog.loadNode(me.definition);
            });

            const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            $('#' + this.cardId + '_next_edit').on("click", function() {
                dialog.open();
            });

            $('#' + this.cardId + '_next_goto').on("click", function() {
                var destinationNodes = me.destinationNodes(me.dialog);
                
                var found = false;
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];

                    if (me.definition["next_id"] == destinationNode["id"]) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }

                var sourceNodes = me.sourceNodes(me.dialog);
            
                for (var i = 0; i < sourceNodes.length; i++) {
                    const sourceNode = sourceNodes[i];

                    if (me.definition['next_id'] == sourceNode["id"]) {
                        $("[data-node-id='" + sourceNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + sourceNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });
        }

        destinationNodes(dialog) {
            var nodes = super.destinationNodes(dialog);

            var id = this.definition['next_id'];

            for (var i = 0; i < this.dialog.definition.length; i++) {
                var item = this.dialog.definition[i];
                
                if (item['id'] == id) {
                    nodes.push(Node.createCard(item, dialog));
                }
            }
           
            if (nodes.length == 0) {
                var node = this.dialog.resolveNode(id);
                
                if (node != null) {
                    nodes.push(node);
                }
            } 

            return nodes;
        }

        updateReferences(oldId, newId) {
            if (this.definition['next_id'] == oldId) {
                this.definition['next_id'] = newId;
            }
        }

        cardType() {
            return 'Time Elapsed Interrupt';
        }
        
        static cardName() {
            return 'Time Elapsed Interrupt';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName, 
				"builder_group": "Interrupts",
                "context": "(Context goes here...)", 
                "type": "time-elapsed-interrupt", 
                "id": Node.uuidv4(),
                "next_id": null,
                "hours_elapsed": 1,
                "minutes_elapsed": 30,
            }; 
            
            return card;
        }
    }

    Node.registerCard('time-elapsed-interrupt', TimeElapsedInterruptNode);
    
    return TimeElapsedInterruptNode;
});