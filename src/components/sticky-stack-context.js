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

  constructor(item=null, parent=null, level=-1) {
    this.item = item;
    this.parent = parent;
    this.level = level;
    if (this.parent) {
      this.parent.children.push(this);
    }
    this.children = [];
  }

  print(ident='') {
    console.log(`${ident}${this.item && this.item.registrationId} (${this.level}) (${!!this.fixed}) (${this.fixedChildren && this.fixedChildren.item.registrationId})`);
    for (let child of this.children) {
      child.print(ident + '  ');
    }
  }
}


function detectFixeds(parent, fixedItens, top = window.pageYOffset + 0, lastFixedHeight = 0, context = {
  lastFixed: undefined,
}) {

  let height = parent.item ? (parent.item.offsetHeight() + lastFixedHeight) : 0;

  for (let item of parent.children) {

    item.height = height;

    // let top1 = top - item.offsetHeight;
    // let top2 = top;
    // let top3 = top + item.offsetHeight;

    if (item.item.offsetTop() <= (top + height)) {
      item.fixed = true;
      fixedItens.push(item);
      context.lastFixed = item;
      parent.fixedChildren = item;

      detectFixeds(item, fixedItens, top, height, context);
      parent.heightWithChildren = item.heightWithChildren + (parent.item ? parent.item.offsetHeight() : 0);
    } else {
      while (context.lastFixed && item.item.offsetTop() <= (top + context.lastFixed.height)) {
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

function initializeItemStyle(parent, createStylesConf, initialHeight=0) {

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

  // function initializeItemStyleFixed(item: Item, height) {
  //   if (!item.styleFixed) {
  //     let extraStyle = createStylesConf.getFixedExtraStyle(item.level, createStylesConf.identationDistance);
  //     let zIndex = createStylesConf.lastZIndex++;
  //     let style = Object.assign(
  //       {
  //         position: 'fixed',
  //         top: height,
  //         width: `calc(100% - ${item.level * createStylesConf.identationDistance}px)`,
  //         zIndex,
  //       },
  //       extraStyle
  //     );
  //     item.styleFixed = style;
  //   }
  // }


  if (parent.fixedChildren) {

    /**
     * @type Item
     */
    let itemFixed = parent.fixedChildren;
    // let height = itemFixed.height;

    createStyles(itemFixed, createStylesConf);

    // initializeItemStyleFixed(itemFixed, height);
    if (itemFixed.style !== itemFixed.styleFixed) {
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
    item.style = undefined;
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
          let previous;
          for (let itemOfPreviousLevel of itemsOfPreviousLevel) {
            if (item.offsetTop() < itemOfPreviousLevel.item.offsetTop()) {
              break;
            }
            previous = itemOfPreviousLevel;
          };
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


const StickyStackContext = React.createClass({

  propTypes: {
    children: React.PropTypes.any,
    /**
     * Function with a itemLevel and identationDistance parameters.
     */
    getFixedExtraStyle: React.PropTypes.func,
    identationDistance: React.PropTypes.number,
    // TODO: Adicionar uma propriedade para permitir diminuir a largura do fixed (além da identação)
    // TODO: Usar esse parâmetro quando o menu aparece empurrando a tela.
    // TODO: Limpar o código, documenta-lo e alterar o Readme.
    // TODO: Renomear a propriedade position para nestingLevel.
  },

  childContextTypes: {
    getStyle: React.PropTypes.func,
    register: React.PropTypes.func,
    clearCache: React.PropTypes.func,
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
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.___calculateStyles);
  },

  getChildContext() {
    return {
      getStyle: this._getStyle,
      register: this._register,
      clearCache: this._clearCache,
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
      }
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

  ___calculateStyles() {

    if (!this.__debounced_calculateStyles) {
      this.__debounced_calculateStyles = debounce(this._calculateStyles, 10);
    }
    // console.log('1');
    this.__debounced_calculateStyles();

    // this._calculateStyles();
    // setTimeout(this._calculateStyles, 0);
  },

  _calculateStyles() {

    // console.log('  2');
    this.styles = [];
    const {components, styles, props, cache} = this;

    let contexto = {
      props,
      components,
      styles,
      cache,
    };

    let styles_ = __calculateStyles(contexto);
    // this.styles = styles_;

    // this.setState({
    //   styles,
    // });
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

export default StickyStackContext;
