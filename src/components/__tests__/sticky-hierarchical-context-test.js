jest.dontMock('../sticky-hierarchical-context');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

const StickyHierarchicalContext = require('../sticky-hierarchical-context').default;

describe('StickyHierarchicalContext', () => {
  let stickyHierarchicalContext;

  beforeEach(() => {
    window.addEventListener = jest.genMockFunction();
    window.removeEventListener = jest.genMockFunction();
    window.pageYOffset = 0;

    stickyHierarchicalContext = TestUtils.renderIntoDocument(
      <StickyHierarchicalContext />
    );
  });

  it('adds the event listener', () => {
    expect(window.addEventListener).toBeCalled();
  });

  it('removes the event listener', () => {
    stickyHierarchicalContext.componentWillUnmount();

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
    const registration = stickyHierarchicalContext._register(component, level);

    expect(stickyHierarchicalContext.components.length).toBe(1);
    expect(stickyHierarchicalContext.components[level][registration.registrationId].registrationId).toBe(1);
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
    const registration = stickyHierarchicalContext._register(component, level);
    window.pageYOffset = 0;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId].position).toEqual(
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
    const registration = stickyHierarchicalContext._register(component, level);
    window.pageYOffset = 11;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId]).toEqual({
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
    const registration01 = stickyHierarchicalContext._register(component01, level01);

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
    const registration02 = stickyHierarchicalContext._register(component02, level02);

    window.pageYOffset = 25;
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level01][registration01.registrationId]).toEqual({
      position: 'fixed',
      top: 0,
      width: 'calc(100% - 0px)',
      zIndex: 13,
    });

    expect(stickyHierarchicalContext.styles[level02][registration02.registrationId]).toEqual({
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
    const registration = stickyHierarchicalContext._register(component, level);
    stickyHierarchicalContext._calculateStyles();

    expect(stickyHierarchicalContext.styles[level][registration.registrationId]).toEqual({
      position: 'relative',
      zIndex: 10,
    });
  });
});
