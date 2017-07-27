import React from 'react';
import debounce from 'lodash/debounce';

const staticStyle = {
  position: 'relative',
  // position: 'static',
};


class Item {
  // item;
  // parent;
  // level;
  // children;

  constructor(item = null, parent = null, level = -1) {
    this.item = item;
    this.parent = parent;
    this.level = level;
    if (this.parent) {
      this.parent.children.push(this);
    }
    this.children = [];
  }

  print(ident = '') {
    console.log(`${ident}${this.item && this.item.registrationId} (${this.level}) (${!!this.fixed}) (${this.fixedChildren && this.fixedChildren.item.registrationId})`);
    for (let child of this.children) {
      child.print(ident + '  ');
    }
  }
}


function detectFixeds(parent, fixedItens, top = window.pageYOffset + 0, lastFixedHeight = 0, context = {
  lastFixed: undefined,
}) {
  const parentOffsetHeight = parent.item ? parent.item.offsetHeight() : 0;
  const height = parentOffsetHeight + lastFixedHeight;

  for (let item of parent.children) {
    const itemOffsetTop = item.item.offsetTop();
    item.height = height;

    // let top1 = top - item.offsetHeight;
    // let top2 = top;
    // let top3 = top + item.offsetHeight;

    if (itemOffsetTop <= (top + height)) {
      item.fixed = true;
      fixedItens.push(item);
      context.lastFixed = item;
      parent.fixedChildren = item;

      detectFixeds(item, fixedItens, top, height, context);
      parent.heightWithChildren = item.heightWithChildren + parentOffsetHeight;
    } else {
      while (context.lastFixed && itemOffsetTop <= (top + context.lastFixed.height)) {
        context.lastFixed.fixed = false;
        context.lastFixed.parent.fixedChildren = undefined;
        context.lastFixed = fixedItens.pop();
      }
    }
  }
}

function createStyle(styles, item) {
  let level = item.level;
  let registrationId = item.item.registrationId;
  let style = item.style;

  if (!styles[level]) {
    styles[level] = [];
  }
  let changed = styles[level][registrationId] !== style;
  styles[level][registrationId] = style;
  return changed;
  // return true;
}

function initializeItemStyle(parent, createStylesConf, initialHeight = 0) {
  let height = parent.item ? (parent.item.offsetHeight() + initialHeight) : 0;

  for (let item of parent.children) {
    // let height = initialHeight + item.height;

    if (!item.styleStatic) {
      let newStaticStyle = staticStyle;
      // if (!item.fixed) {
      let zIndex = createStylesConf.lastZIndex++;
      newStaticStyle = Object.assign({
        zIndex,
      }, staticStyle);
      // }
      item.styleStatic = newStaticStyle;
    }

    initializeItemStyle(item, createStylesConf, height);

    if (!item.styleFixed) {
      let extraStyle = createStylesConf.getFixedExtraStyle(item.level, createStylesConf.identationDistance);
      let zIndex = createStylesConf.lastZIndex++;
      let style = Object.assign(
        {
          position: 'fixed',
          top: height,
          width: `calc(100% - ${item.level * createStylesConf.identationDistance}px)`,
          zIndex,
        },
        extraStyle
      );
      item.styleFixed = style;
    }
  }
}

function createStyles(parent, createStylesConf) {
  if (parent.fixedChildren) {
    /**
     * @type Item
     */
    let itemFixed = parent.fixedChildren;
    // let height = itemFixed.height;

    createStyles(itemFixed, createStylesConf);

    // initializeItemStyleFixed(itemFixed, height);
    if (itemFixed.style !== itemFixed.styleFixed) {
      // console.log('change to styleFixed');
      itemFixed.style = itemFixed.styleFixed;
      if (createStyle(createStylesConf.styles, itemFixed)) {
        // console.log('forceUpdate: ', itemFixed.style);
        itemFixed.item.component.forceUpdate();
      }
    }


    // console.log('fixed: ', height, itemFixed.level, itemFixed.item.registrationId, itemFixed);
    for (let item of parent.children) {
      if (item !== itemFixed) {
        // initializeItemStyleFixed(item, height);

        item.fixedChildren = undefined;
        createStyles(item, createStylesConf);

        if (item.style !== item.styleStatic) {
          // console.log('change to styleStatic 1');
          item.style = item.styleStatic;
          if (createStyle(createStylesConf.styles, item)) {
            item.item.component.forceUpdate();
          }
        }
      }
    }
  } else {
    for (let item of parent.children) {
      item.fixedChildren = undefined;
      createStyles(item, createStylesConf);

      // initializeItemStyle(item);
      if (item.style !== item.styleStatic) {
        // console.log('change to styleStatic 2');
        item.style = item.styleStatic;
        if (createStyle(createStylesConf.styles, item)) {
          item.item.component.forceUpdate();
        }
      }
    }
  }
}

function clearFixedStates(allItens) {
  for (let item of allItens) {
    item.fixed = false;
    item.fixedChildren = undefined;
    // item.style = undefined;
  }
}

function __calculateStyles(contexto) {
  let cache = contexto.cache;

  let root = cache.root;

  if (root === null) {
    root = new Item();
    cache.root = root;
    cache.allItens = [ root ];

    let itemsOfPreviousLevel = [];
    contexto.components.forEach((levelItems, level) => {

      if (level === 0) {

        levelItems.forEach((item, registrationId) => {
          let item_ = new Item(item, root, level);
          cache.allItens.push(item_);
          itemsOfPreviousLevel.push(item_);
        });
      } else {
        let createdItemsInThisLevel = [];

        levelItems.forEach((item) => {
          const itemOffsetTop = item.offsetTop();
          let previous;
          for (let itemOfPreviousLevel of itemsOfPreviousLevel) {
            if (itemOffsetTop < itemOfPreviousLevel.item.offsetTop()) {
              break;
            }
            previous = itemOfPreviousLevel;
          }
          if (previous) {
            let item_ = new Item(item, previous, level);
            cache.allItens.push(item_);
            createdItemsInThisLevel.push(item_);
          }
        });

        itemsOfPreviousLevel = createdItemsInThisLevel;
      }
    });
  } else {
    clearFixedStates(cache.allItens);
  }


  // console.log('root: ');
  // root.print();


  // let top = window.pageYOffset + 0;//height;
  // console.log('top: ', top);


  if (!cache.fixedItens) {
    // Only to reuse the array between scrolls.
    cache.fixedItens = [];
  }
  cache.fixedItens.length = 0;
  // while (cache.fixedItens.pop()) {}

  detectFixeds(root, cache.fixedItens);

  // console.log('root: ');
  // root.print();

  let createStylesConf = {
    lastZIndex: 10,
    styles: contexto.styles,
    identationDistance: contexto.props.identationDistance,
    getFixedExtraStyle: contexto.props.getFixedExtraStyle,
  };

  initializeItemStyle(root, createStylesConf);

  createStyles(root, createStylesConf);

  return createStylesConf.styles;
}

const defaultFixedExtraStyle = {};


const StickyHierarchicalContext = React.createClass({

  propTypes: {
    children: React.PropTypes.any,
    /**
     * Function with a itemLevel and identationDistance parameters.
     */
    getFixedExtraStyle: React.PropTypes.func,
    identationDistance: React.PropTypes.number,
  },

  childContextTypes: {
    getStyle: React.PropTypes.func,
    register: React.PropTypes.func,
    clearCacheAndUpdate: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      identationDistance: 0,
      getFixedExtraStyle: () => defaultFixedExtraStyle,
    };
  },

  getInitialState() {
    this.components = [];
    this.styles = [];
    this.cache = {
      root: null,
    };
    return {
      // items: [],
      // styles: [],
    };
  },

  componentDidMount() {
    window.addEventListener('scroll', this.___calculateStyles);
    window.addEventListener('touchmove', this.___calculateStyles);
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.___calculateStyles);
    window.removeEventListener('touchmove', this.___calculateStyles);
  },

  getChildContext() {
    return {
      getStyle: this._getStyle,
      register: this._register,
      clearCacheAndUpdate: this._clearCacheAndUpdate,
    };
  },

  _clearCache() {
    this.cache.root = null;
    if (this.cache.allItens) {
      clearFixedStates(this.cache.allItens);
      delete this.cache.allItens;
    }
    if (this.cache.fixedItens) {
      delete this.cache.fixedItens;
    }
  },

  _clearCacheAndUpdate() {
    this._clearCache();
    this.___calculateStyles();
  },

  updateFixedStyles() {
    this._clearCache();
    this._calculateStyles();
  },

  _register(component, level) {
    // const {items} = this.state;
    const {components} = this;

    // const {offsetTop, offsetHeight, clientHeight} = component.domRef2;

    this.cache.root = null;

    // if (!items[level]) {
    //   items[level] = [];
    // }
    if (!components[level]) {
      components[level] = [];
    }

    if (!this.lastRegistrationId) {
      this.lastRegistrationId = 1;
    }
    let registrationId = this.lastRegistrationId++;

    // console.log('teste: ', component.domRef2.style.position);

    components[level][registrationId] = {
      component,
      offsetTop_: component.domRef2.offsetTop,
      offsetTop() {
        // console.log('teste2: ', this.component.domRef2.style.position);
        // console.log('offsetTop: ', this.component.domRef2.offsetTop);
        // return this.component.domRef2.offsetTop;
        let result;
        if (this.component.domRef2.style.position !== 'fixed') {
          this.offsetTop_ = this.component.domRef2.offsetTop;
        }
        result = this.offsetTop_;
        return result;
      },
      offsetHeight() {
        return this.component.domRef2.offsetHeight;
      },
      registrationId,
    };

    // items[level][registrationId] = {
    //   offsetTop,
    //   offsetHeight,
    //   registrationId,
    // };

    // this.setState({
    //   items,
    // });

    return {
      registrationId,
      unregister: () => {
        const {components, styles} = this;

        // const {items, styles} = this.state;
        // delete items[level][registrationId];
        if (styles[level] && styles[level][registrationId]) {
          delete styles[level][registrationId];
        }

        // const {components} = this;
        delete components[level][registrationId];

        // this.setState({
        //     items,
        //     styles,
        // });
      },
    };
  },

  _getStyle(level, registrationRef) {
    const {styles} = this;

    if (registrationRef && styles[level] && styles[level][registrationRef.registrationId]) {
      // console.log('_getStyle: ', styles[level][registrationRef.registrationId]);
      return styles[level][registrationRef.registrationId];
    } else {
      // console.log('_getStyle (static): ', staticStyle);
      return staticStyle;
    }
  },

  _calculateStyles() {
    // console.log('_calculateStyles');
    this.styles = [];

    let contexto = {
      props: this.props,
      components: this.components,
      styles: this.styles,
      cache: this.cache,
    };

    // let styles_ = __calculateStyles(contexto);
    __calculateStyles(contexto);
    // this.styles = styles_;

    // this.setState({
    //   styles,
    // });
  },

  // calculating: false,

  ___calculateStyles() {
    // if (!this.__debounced_calculateStyles) {
    //   this.__debounced_calculateStyles = debounce(this._calculateStyles, 0);
    // }
    // this.__debounced_calculateStyles();

    // if (!this.calculating) {
    //   this.calculating = true;
    //   window.requestAnimationFrame(() => {
    //     this._calculateStyles();
    //     this.calculating = false;
    //   });
    // } else {
    //   console.log('skip');
    // }

    this._calculateStyles();
    // setTimeout(this._calculateStyles, 0);
  },

  render() {
    const {children} = this.props;

    return (
      <div>
        {children}
      </div>
    );
  },

});

export default StickyHierarchicalContext;
