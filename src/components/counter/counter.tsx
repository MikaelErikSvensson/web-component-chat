import { Component, h, Element, Event, EventEmitter, Prop, Method } from '@stencil/core';
import { withHooks, useState } from '@saasquatch/stencil-hooks';

@Component({
  tag: 'my-counter',
})
export class Counter {
  constructor() {
    withHooks(this);
  }

  render() {
    const [count, setCount] = useState(0);
    return (
      <div>
        {count} <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
    );
  }

  disconnectedCallback() {
    // required for `useEffect` cleanups to run
  }
}
