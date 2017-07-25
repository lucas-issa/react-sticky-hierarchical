jest.dontMock('../sticky-hierarchical-context');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

const StickyStackContext = require('../sticky-hierarchical-context').default;

describe('StickyStackContext', () => {
  let stickyStackContext;

  beforeEach(() => {
    window.addEventListener = jest.genMockFunction();
    window.removeEventListener = jest.genMockFunction();
    window.pageYOffset = 0;

    stickyStackContext = TestUtils.renderIntoDocument(
      <StickyStackContext />
    );
  });

  it('adds the event listener', () => {
    expect(window.addEventListener).toBeCalled();
  });

  it('removes the event listener', () => {
    stickyStackContext.componentWillUnmount();

    expect(window.removeEventListener).toBeCalled();
  });

  it('registers an item', () => {
    let component = {
      domRef2: {
        offsetTop: 0,
        offsetHeight: 15,
        style: {
          position: 'relative',
        },
      },
    };
    const level = 0;
    const registration = stickyStackContext._register(component, level);

    expect(stickyStackContext.components.length).toBe(1);
    expect(stickyStackContext.components[level][registration.registrationId].registrationId).toBe(1);
  });

  it('calculates the styles (relative)', () => {
    let component = {
      domRef2: {
        offsetTop: 1,
        offsetHeight: 15,
        style: {
          position: 'relative',
        },
      },
      forceUpdate: () => {},
    };
    const level = 0;
    const registration = stickyStackContext._register(component, level);
    window.pageYOffset = 0;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId].position).toEqual(
      'relative');
  });

  it('calculates the styles (fixed)', () => {
    let component = {
      domRef2: {
        offsetTop: 5,
        offsetHeight: 15,
        style: {
          position: 'static',
        },
      },
      forceUpdate: () => {},
    };
    const level = 0;
    const registration = stickyStackContext._register(component, level);
    window.pageYOffset = 11;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 11,
    });
  });

  it('calculates the styles (stacked)', () => {
    let component01 = {
      domRef2: {
        offsetTop: 0,
        offsetHeight: 10,
        style: {
          position: 'relative',
        },
      },
      forceUpdate: () => {},
    };
    const level01 = 0;
    const registration01 = stickyStackContext._register(component01, level01);

    let component02 = {
      domRef2: {
        offsetTop: 20,
        offsetHeight: 15,
        style: {
          position: 'relative',
        },
      },
      forceUpdate: () => {},
    };
    const level02 = 1;
    const registration02 = stickyStackContext._register(component02, level02);

    window.pageYOffset = 25;
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level01][registration01.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 13,
    });

    expect(stickyStackContext.styles[level02][registration02.registrationId]).toEqual({
      position: 'fixed',
      top: 10,
      width: 'calc(100% - 0px)',
      zIndex: 12,
    });
  });

  it('returns the style', () => {
    let component = {
      domRef2: {
        offsetTop: 10,
        offsetHeight: 15,
        style: {
          position: 'static',
        },
      },
      forceUpdate: () => {},
    };
    const level = 0;
    const registration = stickyStackContext._register(component, level);
    stickyStackContext._calculateStyles();

    expect(stickyStackContext.styles[level][registration.registrationId]).toEqual({
      position: 'relative',
      zIndex: 10,
    });
  });
});
