import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { LionButton } from '@lion/button';

import '../lion-button-switch.js';

describe('lion-button-switch', () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`
      <lion-button-switch></lion-button-switch>
    `);
  });

  it('should behave like a button', () => {
    expect(el instanceof LionButton).to.be.true;
  });

  it('should be focusable', () => {
    expect(el.tabIndex).to.equal(0);
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('should have type="button"', () => {
    expect(el.type).to.equal('button');
    expect(el.getAttribute('type')).to.equal('button');
  });

  it('should have checked=false by default', () => {
    expect(el.checked).to.equal(false);
    expect(el.hasAttribute('checked')).to.be.false;
  });

  it('should toggle the value of "checked" on click', async () => {
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
  });

  it('could be disabled', async () => {
    el.disabled = true;
    expect(el.checked).to.be.false;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
    el.disabled = true;
    el.checked = true;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('should dispatch "checked-changed" event when toggled', () => {
    const handlerSpy = sinon.spy();
    el.addEventListener('checked-changed', handlerSpy);
    el.click();
    el.click();
    expect(handlerSpy.callCount).to.equal(2);
    const checkCall = (call, checked) => {
      expect(call.args).to.have.a.lengthOf(1);
      const e = call.args[0];
      expect(e).to.be.an.instanceof(CustomEvent);
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
      expect(e.detail).to.equal(checked);
    };
    checkCall(handlerSpy.getCall(0), true);
    checkCall(handlerSpy.getCall(1), false);
  });

  it('should not dispatch "checked-changed" event if disabled', () => {
    const handlerSpy = sinon.spy();
    el.disabled = true;
    el.addEventListener('checked-changed', handlerSpy);
    el.click();
    expect(handlerSpy.called).to.be.false;
  });

  describe('a11y', () => {
    describe('aria-pressed', () => {
      it('should have initial state', () => {
        expect(el.hasAttribute('aria-pressed')).to.be.true;
        expect(el.getAttribute('aria-pressed')).to.equal('false');
      });

      it('should change on click', async () => {
        el.click();
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('true');
        el.click();
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('false');
      });

      it('should change on "checked" property updates', async () => {
        el.checked = true;
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('true');
        el.checked = false;
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('false');
      });

      it('should change on "checked" attribute updates', async () => {
        el.setAttribute('checked', true);
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('true');
        el.removeAttribute('checked');
        await el.updateComplete;
        expect(el.getAttribute('aria-pressed')).to.equal('false');
      });
    });
  });
});
