import { Component, h, Element, Event, EventEmitter, Prop, Method } from '@stencil/core';

@Component({
  tag: 'chat-footer',
  styleUrl: 'footer.css',
  shadow: true,
})
export class Footer {
  render() {
    return (
      <div class="footer-wrapper">
        <input class="input" type="text" />
        <button class="button">Click</button>
      </div>
    );
  }
}
