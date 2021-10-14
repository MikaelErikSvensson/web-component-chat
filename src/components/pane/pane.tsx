import { Component, h, Element, Event, EventEmitter, Prop, Method } from '@stencil/core';

@Component({
  tag: 'chat-pane-old',
  styleUrl: 'pane.css',
  shadow: true,
})
export class Pane {
  render() {
    return (
      <div class="wrapper">
        <div class="pane">
          <chat-header class="header"></chat-header>
          <chat-conversation class="conversation"></chat-conversation>
          <chat-footer class="footer"></chat-footer>
        </div>
      </div>
    );
  }
}
