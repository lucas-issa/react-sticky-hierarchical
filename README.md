[![Build Status](https://travis-ci.org/lucas-issa/react-sticky-hierarchical.svg?branch=master)](https://travis-ci.org/lucas-issa/react-sticky-hierarchical)

React Sticky Hierarchical
=========================

A Sticky Hierarchical component for [React.js](http://facebook.github.io/react/)

It is clone of [react-sticky-stack](https://github.com/YPlan/react-sticky-stack) with changes to became hierarchical. 

Demo
----

[https://lucas-issa.github.io/react-sticky-hierarchical/](https://lucas-issa.github.io/react-sticky-hierarchical/)

Installation
------------

```sh
$ yarn add react-sticky-hierarchical
```
or
```sh
$ npm install react-sticky-hierarchical --save
```

Usage
-----

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {StickyHierarchicalContext, StickyHierarchicalItem} from 'react-sticky-hierarchical';

const App = React.createClass({
  render() {
    return (
      <StickyHierarchicalContext>
        <p>
          Lorem Ipsum
        </p>
        <StickyHierarchicalItem hierarchicalLevel={0}>
          <h1>
            Live
          </h1>
        </StickyHierarchicalItem>
        <p>
          Lorem Ipsum
        </p>
        <StickyHierarchicalItem hierarchicalLevel={1}>
          <h2>
            Your
          </h2>
        </StickyHierarchicalItem>
        <p>
          Lorem Ipsum
        </p>
        <StickyHierarchicalItem hierarchicalLevel={2}>
          <h3>
            City
          </h3>
        </StickyHierarchicalItem>
        <p>
          Lorem Ipsum
        </p>
      </StickyHierarchicalContext>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
```

Test
----

```sh
$ yarn run test
```
or
```sh
$ npm test
```
