var modules = ["material", 'jquery'];

define(modules, function (mdc) {
    class Node {
        constructor(definition, dialog) {
            this.definition = definition;
            this.dialog = dialog;
            this.id = definition['id'];
            this.cardId = Node.uuidv4();
        }

        cardName() {
            if (this.definition['name'] != undefined) {
                return this.definition['name'];
            }

            return this.definition['id'];
        }

        cardType() {
            return this.definition['type'];
        }

        editHtml() {
            var htmlString  = '<div class="mdc-card" id="' + this.cardId + '" style="' + this.style() + '" data-node-id="' + this.id + '">';
                htmlString += '  <div class="mdc-layout-grid" style="margin: 0; padding-left: 16px; padding-right: 16px; padding-bottom: 16px;">';
                htmlString += '    <div class="mdc-layout-grid__inner">';
                htmlString += '      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
                htmlString += '        <div class="mdc-typography--headline6" style="margin-bottom: 16px;">';
                htmlString += '          ' + this.cardType();
                htmlString += '          <span class="mdc-menu-surface--anchor" style="float: right;">';
                htmlString += '            <i class="material-icons mdc-icon-button__icon" aria-hidden="true" id="' + this.cardId + '_menu_open">more_vert</i>';
                htmlString += '            <div class="mdc-menu mdc-menu-surface" id="' + this.cardId + '_menu">';
                htmlString += '              <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">';
                htmlString += '                <li class="mdc-list-item mdc-list-item mdc-list-item--with-one-line" role="menuitem">';
                htmlString += '                  <span class="mdc-list-item__ripple"></span>';
                htmlString += '                  <span class="mdc-list-item__text mdc-list-item__start">Delete&#8230;</span>';
                htmlString += '                </li>';
                htmlString += '              </ul>';
                htmlString += '            </div>';
                htmlString += '          </span>';
                htmlString += '        </div>';
                htmlString += '      </div>';
                htmlString += '      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
                htmlString += '        <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_name" style="width: 100%">';
                htmlString += '          <input class="mdc-text-field__input" type="text" id="' + this.cardId + '_name_value">';
                htmlString += '          <div class="mdc-notched-outline">';
                htmlString += '            <div class="mdc-notched-outline__leading"></div>';
                htmlString += '            <div class="mdc-notched-outline__notch">';
                htmlString += '              <label for="' + this.cardId + '_name_value" class="mdc-floating-label">Name</label>';
                htmlString += '            </div>';
                htmlString += '            <div class="mdc-notched-outline__trailing"></div>';
                htmlString += '          </div>';
                htmlString += '        </div>';
                htmlString += '      </div>';
                htmlString += '      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
                htmlString += '        <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_group" style="width: 100%">';
                htmlString += '          <input class="mdc-text-field__input" type="text" id="' + this.cardId + '_group_value">';
                htmlString += '          <div class="mdc-notched-outline">';
                htmlString += '            <div class="mdc-notched-outline__leading"></div>';
                htmlString += '            <div class="mdc-notched-outline__notch">';
                htmlString += '              <label for="' + this.cardId + '_group_value" class="mdc-floating-label">Card Group</label>';
                htmlString += '            </div>';
                htmlString += '            <div class="mdc-notched-outline__trailing"></div>';
                htmlString += '          </div>';
                htmlString += '        </div>';
                htmlString += '      </div>';
                htmlString += this.editBody();
                htmlString += '    </div>';
                htmlString += '  </div>';
                htmlString += '</div>';

            return htmlString;
        }

        initialize() {
            const me = this;

            const nameField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_name'));
            nameField.value = this.cardName();

            $('#' + this.cardId + '_name_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_name_value').val();

                me.definition['name'] = value;

                me.dialog.markChanged(me.id);
            });

            const groupField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_group'));

            if (me.definition["builder_group"] != undefined) {
                groupField.value = me.definition["builder_group"];
                
                window.lastCardGroup = me.definition["builder_group"];
            }

            $('#' + this.cardId + '_group_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_group_value').val();

                me.definition['builder_group'] = value;

                me.dialog.markChanged(me.id);
            });

            const menu = mdc.menu.MDCMenu.attachTo(document.getElementById(this.cardId + '_menu'));
            menu.setFixedPosition(true);

            menu.listen("MDCMenu:selected", function (event) {
                console.log(event.detail);

                me.dialog.deleteCard(me.id);
            })

            $("#" + this.cardId + "_menu_open").click(function(eventObj) {
                eventObj.preventDefault();

                menu.open = (menu.open == false);
            });
        }

        updateReferences(oldId, newId) {
            console.log('TODO: Implement "updateReferences" in ' + this.cardName());
        }

        editBody() {
            var htmlString  = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
                htmlString += this.viewBody();
                htmlString += '</div>';

            return htmlString
        }

        viewHtml() {
            var htmlString  = '<div class="mdc-card" id="' + this.cardId + '" style="' + this.style() + '"  data-node-id="' + this.id + '">';
                htmlString += '  <h6 class="mdc-typography--headline6" style="margin: 16px; margin-bottom: 0;">' + this.cardName() + '</h6>';
                htmlString += '  <h6 class="mdc-typography--subtitle1" style="margin: 16px; margin-bottom: 0; margin-top: 0;">' + this.cardType() + '</h6>';
                htmlString += this.viewBody();
                htmlString += '</div>';

            return htmlString;
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;"><pre>' + JSON.stringify(this.definition, null, 2) + '</pre></div>';
        }


        style() {
            return "background-color: #ffffff; margin-bottom: 10px;";
        }

        destinationNodes(dialog) {
            return [];
        }

        sourceNodes(dialog) {
            var sources = [];
            var includedIds = [];

            var dialogDef = window.dialogBuilder.dialog;

            for (var j = 0; j < dialogDef.length; j++) {
                var item = dialogDef[j];

                var node = this.dialog.resolveNode(item["id"]);

                if (node != null) {
                    var destinations = node.destinationNodes(dialog);

                    var isSource = false;

                    for (var k = 0; k < destinations.length && isSource == false; k++) {
                        var destination = destinations[k];

                        if (this.id == destination.id) {
                            isSource = true;
                        }
                    }

                    if (isSource && includedIds.indexOf(node.id) == -1) {
                        sources.push(node);
                        includedIds.push(node.id);
                    }
                }
            }

            return sources;
        }

        onClick(callback) {
            $('#' + this.cardId).click(function(eventObj) {
                callback();
            });
        }

        static createCard(definition, dialog) {
            if (window.dialogBuilder.cardMapping != undefined) {
                var classObj = window.dialogBuilder.cardMapping[definition['type']];

                if (classObj != undefined) {
                    return new classObj(definition, dialog);
                }
            }

            return new Node(definition, dialog);
        }

        static canCreateCard(definition, dialog) {
            if (window.dialogBuilder.cardMapping != undefined) {
                var classObj = window.dialogBuilder.cardMapping[definition['type']];

                return (classObj != undefined);
            }

            return false;
        }

        static registerCard(name, classObj) {
            if (window.dialogBuilder.cardMapping == undefined) {
                window.dialogBuilder.cardMapping = {};
            }

            window.dialogBuilder.cardMapping[name] = classObj;
        }

        static uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        static cardName() {
            return 'Node';
        }

        static humanizePattern(pattern) {
            if (pattern.startsWith("^[") && pattern.endsWith("]")) {
                var matches = [];

                for (var i = 2; i < pattern.length - 1; i++) {
                    matches.push("" + pattern[i]);
                }

                var humanized = "";

                for (var i = 0; i < matches.length; i++) {
                    if (humanized.length > 0) {
                        if (i < matches.length - 1) {
                            humanized += ", ";
                        } else if (matches.length > 2){
                            humanized += ", or ";
                        } else {
                            humanized += " or ";
                        }
                    }

                    humanized += "\"" + matches[i] + "\"";
                }

                return "If response starts with " + humanized + ", continue.";
            } else if (pattern== ".*") {
                return "If response is anything, continue.";
            }

            return "If responses matches \"" + pattern + "\", continue.";
        }
    }

    return Node;
});