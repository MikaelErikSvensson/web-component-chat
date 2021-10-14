import { Component, h, Element, Event, EventEmitter, Prop, Method } from '@stencil/core';
import square from '../../assets/fontawesome/svgs/regular/square.svg';

@Component({
  tag: 'chat-header',
  styleUrls: ['header.css', '../../assets/fontawesome/css/all.css'],
  shadow: true,
})
export class Header {
  render() {
    return (
      <div>
        <div>Vaulter</div>
      </div>
    );
  }
}
