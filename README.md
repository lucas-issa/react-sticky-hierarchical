
React Sticky Hierarchical
=========================

A Sticky Hierarchical component for [React.js](http://facebook.github.io/react/)

It is clone of [react-sticky-stack](https://github.com/YPlan/react-sticky-stack) with changes to became hierarchical. 

Installation
------------

```sh
$ yarn add react-sticky-hierarchical
```
or
```sh
$ npm install react-sticky-hierarchical --save
```

Demo
----

[https://react-sticky-stack.herokuapp.com/](https://react-sticky-stack.herokuapp.com/)

Usage
-----

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {StickyStackContext, StickyStackItem} from 'react-sticky-hierarchical';

const App = React.createClass({
  render() {
    return (
      <StickyStackContext>
        <p>
          Lorem Ipsum
        </p>
        <StickyStackItem position={0}>
          <h1>
            Live
          </h1>
        </StickyStackItem>
        <p>
          Lorem Ipsum
        </p>
        <StickyStackItem position={1}>
          <h2>
            Your
          </h2>
        </StickyStackItem>
        <p>
          Lorem Ipsum
        </p>
        <StickyStackItem position={2}>
          <h3>
            City
          </h3>
        </StickyStackItem>
        <p>
          Lorem Ipsum
        </p>
      </StickyStackContext>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
```
