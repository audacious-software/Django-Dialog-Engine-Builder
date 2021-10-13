var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class PauseNode extends Node {
        constructor(definition, dialog) {
            super(definition, dialog);
        }

        editBody() {
            var destinationNodes = this.destinationNodes(this);

            var body = '';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">';
            body += '  <div class="mdc-typography--subtitle2">Duration</div>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
            body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_duration"  style="width: 100%">';
            body += '    <input type="number" min="0" step="1" class="mdc-text-field__input" id="' + this.cardId + '_duration_value">';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label for="' + this.cardId + '_duration_value" class="mdc-floating-label">Seconds</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">';
            body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">create</i>';
            body += '  </button>';
            body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">navigate_next</i>';
            body += '  </button>';
            body += '</div>';
            body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">';
            body += '  <div class="mdc-dialog__container">';
            body += '    <div class="mdc-dialog__surface">';
            body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';
            body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content"  style="padding: 0px;">';
            body += this.dialog.chooseDestinationMenu(this.cardId);
            body += '      </div>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-dialog__scrim"></div>';
            body += '</div>';

            return body;
        }

        viewBody() {
            var summary = '<div class="mdc-typography--body1" style="margin: 16px;">Pause: <em>' + this.definition['duration'] + ' seconds</em></div>';

            return summary;
        }

        initialize() {
            super.initialize();

            const me = this;

            const nextDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            const durationField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_duration'));
            durationField.value = "" + this.definition["duration"];

            $('#' + this.cardId + '_duration_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_duration_value').val();

                me.definition['duration'] = parseFloat(value);

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
            return 'Pause';
        }

        static cardName() {
            return 'Pause';
        }

        static createCard(cardName) {
            var id = Node.uuidv4();

            var card = {
                "name": cardName,
                "duration": 300,
                "id": Node.uuidv4(),
                "type": "pause"
            };

            return card;
        }
    }

    Node.registerCard('pause', PauseNode);

    return PauseNode;
});
