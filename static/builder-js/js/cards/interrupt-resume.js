var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class InterruptResumeNode extends Node {
        constructor(definition, dialog) {
            super(definition, dialog);
        }

        editBody() {
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-form-field">' + 
                       '    <div class="mdc-touch-target-wrapper">' +
                       '      <div class="mdc-checkbox mdc-checkbox--touch" id="' + this.cardId + '_force_top">' +
                       '        <input type="checkbox" class="mdc-checkbox__native-control" />' +
                       '        <div class="mdc-checkbox__background">' +
                       '          <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">' +
                       '            <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>' +
                       '          </svg>' +
                       '          <div class="mdc-checkbox__mixedmark"></div>' +
                       '        </div>' +
                       '        <div class="mdc-checkbox__ripple"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <label for="' + this.cardId + '_force_top">Clear Pending Interrupts</label>' +
                       '  </div>' +
			           '</div>';
			
			return body;
        }

        viewBody() {
        	if (this.definition['force_top']) {
				return '<div class="mdc-typography--body1" style="margin: 16px;">Resumes dialog after interruption (clears all interruptions).</div>';
        	}
			
			return '<div class="mdc-typography--body1" style="margin: 16px;">Resumes dialog after interruption (retains interruptions).</div>';
        }

        initialize() {
			super.initialize();
			
			const me = this;

			const forceTop = mdc.checkbox.MDCCheckbox.attachTo(document.getElementById(this.cardId + '_force_top'));
			forceTop.checked = this.definition['force_top'];

			$('#' + this.cardId + '_force_top input').on("click", function() {
				me.definition['force_top'] = forceTop.checked;
				
				me.dialog.markChanged(me.id);
			});
        }

        destinationNodes(dialog) {
            return [];
        }

		updateReferences(oldId, newId) {

		}

		cardType() {
			return 'Resume From Interrupt';
		}
		
		static cardName() {
			return 'Resume From Interrupt';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"context": "(Context goes here...)", 
				"type": "interrupt-resume",
				"force_top": false,
				"id": Node.uuidv4(),
				"next_id": null
			}; 
			
			return card;
		}
    }

    Node.registerCard('interrupt-resume', InterruptResumeNode);
    
    return InterruptResumeNode;
});