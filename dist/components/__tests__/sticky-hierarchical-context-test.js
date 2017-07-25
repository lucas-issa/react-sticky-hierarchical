'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.dontMock('../sticky-hierarchical-context');

var StickyHierarchicalContext = require('../sticky-hierarchical-context').default;

describe('StickyHierarchicalContext', function () {
  var stickyHierarchicalContext = void 0;

  beforeEach(function () {
    window.addEventListener = jest.genMockFunction();
    window.removeEventListener = jest.genMockFunction();
    window.pageYOffset = 0;

    stickyHierarchicalContext = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(StickyHierarchicalContext, null));
  });

  it('adds the event listener', function () {
    expect(window.addEventListener).toBeCalled();
  });

  it('removes the event listener', function () {
    stickyHierarchicalContext.componentWillUnmount();

    expect(window.removeEventListener).toBeCalled();
  });

  it('registers an item', function () {
    var component = {
      domRef2: {
        offsetTop: 0,
        offsetHeight: 15,
        style: {
          position: 'relative'
        }
      }
    };
    var level = 0;
    var registration = stickyHierarchicalContext._register(component, level);

    expect(stickyHierarchicalContext.components.length).toBe(1);
    expect(stickyHierarchicalContext.components[level][registration.registrationId].registrationId).toBe(1);
  });

  it('calculates the styles (relative)', function () {
    var component = {
      domRef2: {
        offsetTop: 1,
        offsetHeight: 15,
        style: {
          position: 'relative'
        }
      },
      forceUpdate: function forceUpdate() {}
    };
    var level = 0;
    var registration = stickyHierarchicalContext._register(component, level);
    window.pageYOffset = 0;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId].position).toEqual('relative');
  });

  it('calculates the styles (fixed)', function () {
    var component = {
      domRef2: {
        offsetTop: 5,
        offsetHeight: 15,
        style: {
          position: 'static'
        }
      },
      forceUpdate: function forceUpdate() {}
    };
    var level = 0;
    var registration = stickyHierarchicalContext._register(component, level);
    window.pageYOffset = 11;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 11
    });
  });

  it('calculates the styles (stacked)', function () {
    var component01 = {
      domRef2: {
        offsetTop: 0,
        offsetHeight: 10,
        style: {
          position: 'relative'
        }
      },
      forceUpdate: function forceUpdate() {}
    };
    var level01 = 0;
    var registration01 = stickyHierarchicalContext._register(component01, level01);

    var component02 = {
      domRef2: {
        offsetTop: 20,
        offsetHeight: 15,
        style: {
          position: 'relative'
        }
      },
      forceUpdate: function forceUpdate() {}
    };
    var level02 = 1;
    var registration02 = stickyHierarchicalContext._register(component02, level02);

    window.pageYOffset = 25;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level01][registration01.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 13
    });

    expect(stickyHierarchicalContext.styles[level02][registration02.registrationId]).toEqual({
      position: 'fixed',
      top: 10,
      width: 'calc(100% - 0px)',
      zIndex: 12
    });
  });

  it('returns the style', function () {
    var component = {
      domRef2: {
        offsetTop: 10,
        offsetHeight: 15,
        style: {
          position: 'static'
        }
      },
      forceUpdate: function forceUpdate() {}
    };
    var level = 0;
    var registration = stickyHierarchicalContext._register(component, level);
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId]).toEqual({
      position: 'relative',
      zIndex: 10
    });
  });
});