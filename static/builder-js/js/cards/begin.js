var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class StartDialogNode extends Node {
        constructor(definition, dialog) {
            super(definition, dialog);

            this.messageId = Node.uuidv4();
            this.nextButtonId = Node.uuidv4();
        }

        editBody() {
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body +=    '  <div class="mdc-dialog__scrim"></div>';
            body +=    '</div>';


            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px; text-align: right;">';
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
//          body += '      <footer class="mdc-dialog__actions">';
//          body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
//          body += '          <span class="mdc-button__label">Save</span>';
//          body += '        </button>';
//          body += '      </footer>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-dialog__scrim"></div>';
            body += '</div>';


            return body;
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;"><em>Marks the start of the interactive dialog.</em></div>';
        }

        fetchMenuItems() {
            let items = [];

            return items;
        }

        initialize() {
            super.initialize();

            var me = this;

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
                var destinationNodes = me.destinationNodes(me.sequence);

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

        issues() {
            var issues = super.issues();

            if (this.definition['next_id'] == undefined) {
                issues.push([this.definition['id'], 'Next node does not point to another node.', this.definition['name']]);
            } else if (this.definition['next_id'] == this.definition['id']) {
                issues.push([this.definition['id'], 'Next node points to self.', this.definition['name']]);
            } else if (this.isValidDestination(this.definition['next_id']) == false) {
                issues.push([this.definition['id'], 'Next node points to a non-existent node.', this.definition['name']]);
            }

            return issues;
        }

        cardType() {
            return 'Start Dialog';
        }

        static cardName() {
            return 'Start Dialog';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName,
                "type": "start-dialog",
                "id": Node.uuidv4()
            };

            return card;
        }
    }

    Node.registerCard('begin', StartDialogNode);
});
