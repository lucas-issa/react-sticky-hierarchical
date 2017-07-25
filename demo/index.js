import React from 'react';
import ReactDOM from 'react-dom';
import {StickyStackContext, StickyStackItem} from '../dist';

const App = React.createClass({
  render() {
    return (
      <div>
        <div className="content" style={{
          position: 'fixed',
          top: 0,
          width: '100%',
        }}
        >
          <div className="block block--doc">
            <p><a className="initial" href="https://github.com/lucas-issa/react-sticky-hierarchical">Documentation</a></p>
          </div>
        </div>

        <StickyStackContext>

          <div className="divider divider--short" />

          <div className="divider" />
          <StickyStackItem position={0}>
            <div className="content">
              <div className="logo">
              <span style={{
                display: 'inline-block',
                transform: 'scale(1.4, 2)',
                paddingTop: 6,
              }}
              >
                StickyHierarchical
              </span>
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={1}>
            <div className="content">
              <div className="block block--tall">
                1
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={2}>
            <div className="content">
              <div className="block" >
                1.1
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.1
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.2
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.3
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={2}>
            <div className="content">
              <div className="block" >
                1.2
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={1}>
            <div className="content">
              <div className="block" >
                2
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />
          <StickyStackItem position={1}>
            <div className="content">
              <div className="block" >
                3
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={2}>
            <div className="content">
              <div className="block" >
                3.1
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={3}>
            <div className="content">
              <div className="block block--short" >
                3.1.1
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={3}>
            <div className="content">
              <div className="block block--short" >
                3.1.2
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

          <StickyStackItem position={4}>
            <div className="content">
              <div className="block block--content">
                <a className="link" href="https://github.com/lucas-issa/react-sticky-hierarchical">Fork me on Github</a>
              </div>
            </div>
          </StickyStackItem>

          <div className="divider divider--short" />

          <StickyStackItem position={5}>
            <div className="content">
              <div className="block block--doc">
                <p><a href="https://github.com/lucas-issa/react-sticky-hierarchical">Documentation</a></p>
              </div>
            </div>
          </StickyStackItem>

          <div className="divider" />

        </StickyStackContext>
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
