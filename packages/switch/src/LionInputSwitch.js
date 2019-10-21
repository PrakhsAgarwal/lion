import { html, css } from '@lion/core';
import { LionField } from '@lion/field';
import { ChoiceInputMixin } from '@lion/choice-input';

import '../lion-button-switch.js';

export class LionInputSwitch extends ChoiceInputMixin(LionField) {
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host([disabled]) {
          color: #adadad;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      input: () => document.createElement('lion-button-switch'),
    };
  }

  render() {
    return html`
      <div class="input-switch__container">
        <slot name="label"></slot>
        <slot name="help-text"></slot>
        <slot name="feedback"></slot>
      </div>
      <slot name="input"></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._buttonSwitchNode.addEventListener(
      'checked-changed',
      this.__handleButtonSwitchCheckedChanged.bind(this),
    );
    this._syncButtonSwitch();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._syncButtonSwitch();
  }

  // TODO: should be replaced by "_inputNode" after the next breaking change
  // https://github.com/ing-bank/lion/blob/master/packages/field/src/FormControlMixin.js#L78
  get _buttonSwitchNode() {
    return this.querySelector('[slot=input]');
  }

  __handleButtonSwitchCheckedChanged() {
    this.checked = this._buttonSwitchNode.checked;
  }

  _syncButtonSwitch() {
    this._buttonSwitchNode.checked = this.checked;
    this._buttonSwitchNode.disabled = this.disabled;
  }
}
