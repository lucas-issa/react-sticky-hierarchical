import React from 'react';
import ReactDOM from 'react-dom';
import {StickyHierarchicalContext, StickyHierarchicalItem} from '../dist';

const App = React.createClass({
  render() {
    return (
      <div>
        <div className="content" style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
        }}
        >
          <div className="block block--doc">
            <p><a className="initial" href="https://github.com/lucas-issa/react-sticky-hierarchical">Documentation</a></p>
          </div>
        </div>

        <StickyHierarchicalContext>

          <div className="divider divider--short" />

          <div className="divider" />
          <StickyHierarchicalItem hierarchicalLevel={0}>
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
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={1}>
            <div className="content">
              <div className="block block--tall">
                1
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={2}>
            <div className="content">
              <div className="block" >
                1.1
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.1
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.2
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={3}>
            <div className="content">
              <div className="block block--short" >
                1.1.3
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={2}>
            <div className="content">
              <div className="block" >
                1.2
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={1}>
            <div className="content">
              <div className="block" >
                2
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />
          <StickyHierarchicalItem hierarchicalLevel={1}>
            <div className="content">
              <div className="block" >
                3
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={2}>
            <div className="content">
              <div className="block" >
                3.1
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={3}>
            <div className="content">
              <div className="block block--short" >
                3.1.1
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={3}>
            <div className="content">
              <div className="block block--short" >
                3.1.2
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

          <StickyHierarchicalItem hierarchicalLevel={4}>
            <div className="content">
              <div className="block block--content">
                <a className="link" href="https://github.com/lucas-issa/react-sticky-hierarchical">Fork me on Github</a>
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider divider--short" />

          <StickyHierarchicalItem hierarchicalLevel={5}>
            <div className="content">
              <div className="block block--doc">
                <p><a href="https://github.com/lucas-issa/react-sticky-hierarchical">Documentation</a></p>
              </div>
            </div>
          </StickyHierarchicalItem>

          <div className="divider" />

        </StickyHierarchicalContext>
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
