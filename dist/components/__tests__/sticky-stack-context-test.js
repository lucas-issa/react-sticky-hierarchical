'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.dontMock('../sticky-hierarchical-context');

var StickyStackContext = require('../sticky-hierarchical-context').default;

describe('StickyStackContext', function () {
  var stickyStackContext = void 0;

  beforeEach(function () {
    window.addEventListener = jest.genMockFunction();
    window.removeEventListener = jest.genMockFunction();
    window.pageYOffset = 0;

    stickyStackContext = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(StickyStackContext, null));
  });

  it('adds the event listener', function () {
    expect(window.addEventListener).toBeCalled();
  });

  it('removes the event listener', function () {
    stickyStackContext.componentWillUnmount();

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
    var registration = stickyStackContext._register(component, level);

    expect(stickyStackContext.components.length).toBe(1);
    expect(stickyStackContext.components[level][registration.registrationId].registrationId).toBe(1);
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
    var registration = stickyStackContext._register(component, level);
    window.pageYOffset = 0;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId].position).toEqual('relative');
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
    var registration = stickyStackContext._register(component, level);
    window.pageYOffset = 11;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId]).toEqual({
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
    var registration01 = stickyStackContext._register(component01, level01);

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
    var registration02 = stickyStackContext._register(component02, level02);

    window.pageYOffset = 25;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level01][registration01.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 13
    });

    expect(stickyStackContext.styles[level02][registration02.registrationId]).toEqual({
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
    var registration = stickyStackContext._register(component, level);
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId]).toEqual({
      position: 'relative',
      zIndex: 10
    });
  });
});