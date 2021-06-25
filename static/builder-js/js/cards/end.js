var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
	class EndDialogNode extends Node {
		constructor(definition, dialog) {
			super(definition, dialog);
		}

		editBody() {
			var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body +=    '  <div class="mdc-dialog__scrim"></div>';
            body +=    '</div>';
            
            return body;
		}

		viewBody() {
			return '<div class="mdc-typography--body1" style="margin: 16px;"><em>Marks the end of the interactive dialog.</em></div>';
		}

		initialize() {
			super.initialize();
		}

        destinationNodes(dialog) {
            var nodes = super.destinationNodes(dialog);

            return nodes;
        }

		updateReferences(oldId, newId) {

		}
		
		cardType() {
			return 'End Dialog';
		}
		
		static cardName() {
			return 'End Dialog';
		}

		static createCard(cardName) {
			var card = {
				"name": "End Dialog",
				"type": "end",
				"id": Node.uuidv4()
			}; 
			
			return card;
		}
	}
	
	Node.registerCard('end', EndDialogNode);
});
