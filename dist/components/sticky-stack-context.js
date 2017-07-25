'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var staticStyle = {
  position: 'relative'
};

var Item = function () {
  // item;
  // parent;
  // level;
  // children;

  function Item() {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

    _classCallCheck(this, Item);

    this.item = item;
    this.parent = parent;
    this.level = level;
    if (this.parent) {
      this.parent.children.push(this);
    }
    this.children = [];
  }

  _createClass(Item, [{
    key: 'print',
    value: function print() {
      var ident = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      console.log('' + ident + (this.item && this.item.registrationId) + ' (' + this.level + ') (' + !!this.fixed + ') (' + (this.fixedChildren && this.fixedChildren.item.registrationId) + ')');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          child.print(ident + '  ');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Item;
}();

function detectFixeds(parent, fixedItens) {
  var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.pageYOffset + 0;
  var lastFixedHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    lastFixed: undefined
  };


  var height = parent.item ? parent.item.offsetHeight() + lastFixedHeight : 0;

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = parent.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var item = _step2.value;


      item.height = height;

      // let top1 = top - item.offsetHeight;
      // let top2 = top;
      // let top3 = top + item.offsetHeight;

      if (item.item.offsetTop() <= top + height) {
        item.fixed = true;
        fixedItens.push(item);
        context.lastFixed = item;
        parent.fixedChildren = item;

        detectFixeds(item, fixedItens, top, height, context);
        parent.heightWithChildren = item.heightWithChildren + (parent.item ? parent.item.offsetHeight() : 0);
      } else {
        while (context.lastFixed && item.item.offsetTop() <= top + context.lastFixed.height) {
          context.lastFixed.fixed = false;
          context.lastFixed.parent.fixedChildren = undefined;
          context.lastFixed = fixedItens.pop();
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function createStyle(styles, item) {

  var level = item.level;
  var registrationId = item.item.registrationId;
  var style = item.style;

  if (!styles[level]) {
    styles[level] = [];
  }
  var changed = styles[level][registrationId] !== style;
  styles[level][registrationId] = style;
  return changed;
  // return true;
}

function initializeItemStyle(parent, createStylesConf) {
  var initialHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;


  var height = parent.item ? parent.item.offsetHeight() + initialHeight : 0;

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = parent.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var item = _step3.value;


      // let height = initialHeight + item.height;

      if (!item.styleStatic) {
        var newStaticStyle = staticStyle;
        // if (!item.fixed) {
        var zIndex = createStylesConf.lastZIndex++;
        newStaticStyle = Object.assign({
          zIndex: zIndex
        }, staticStyle);
        // }
        item.styleStatic = newStaticStyle;
      }

      initializeItemStyle(item, createStylesConf, height);

      if (!item.styleFixed) {
        var extraStyle = createStylesConf.getFixedExtraStyle(item.level, createStylesConf.identationDistance);
        var _zIndex = createStylesConf.lastZIndex++;
        var style = Object.assign({
          position: 'fixed',
          top: height,
          width: 'calc(100% - ' + item.level * createStylesConf.identationDistance + 'px)',
          zIndex: _zIndex
        }, extraStyle);
        item.styleFixed = style;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
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
    var itemFixed = parent.fixedChildren;
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
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = parent.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var item = _step4.value;

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
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  } else {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {

      for (var _iterator5 = parent.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _item = _step5.value;


        _item.fixedChildren = undefined;
        createStyles(_item, createStylesConf);

        // initializeItemStyle(item);
        if (_item.style !== _item.styleStatic) {
          _item.style = _item.styleStatic;
          if (createStyle(createStylesConf.styles, _item)) {
            _item.item.component.forceUpdate();
          }
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }
}

function clearFixedStates(allItens) {
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = allItens[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var item = _step6.value;

      item.fixed = false;
      item.fixedChildren = undefined;
      item.style = undefined;
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}

function __calculateStyles(contexto) {

  var cache = contexto.cache;

  var root = cache.root;
  if (root === null) {

    root = new Item();
    cache.root = root;
    cache.allItens = [root];

    var itemsOfPreviousLevel = [];
    contexto.components.forEach(function (levelItems, level) {

      if (level === 0) {

        levelItems.forEach(function (item, registrationId) {
          var item_ = new Item(item, root, level);
          cache.allItens.push(item_);
          itemsOfPreviousLevel.push(item_);
        });
      } else {

        var createdItemsInThisLevel = [];

        levelItems.forEach(function (item) {
          var previous = void 0;
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = itemsOfPreviousLevel[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var itemOfPreviousLevel = _step7.value;

              if (item.offsetTop() < itemOfPreviousLevel.item.offsetTop()) {
                break;
              }
              previous = itemOfPreviousLevel;
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          ;
          if (previous) {
            var item_ = new Item(item, previous, level);
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

  var createStylesConf = {
    lastZIndex: 10,
    styles: contexto.styles,
    identationDistance: contexto.props.identationDistance,
    getFixedExtraStyle: contexto.props.getFixedExtraStyle
  };

  initializeItemStyle(root, createStylesConf);

  createStyles(root, createStylesConf);

  return createStylesConf.styles;
}

var defaultFixedExtraStyle = {};

var StickyStackContext = _react2.default.createClass({
  displayName: 'StickyStackContext',


  propTypes: {
    children: _react2.default.PropTypes.any,
    identationDistance: _react2.default.PropTypes.number,
    /**
     * Function with a itemLevel and identationDistance parameters.
     */
    getFixedExtraStyle: _react2.default.PropTypes.func
  },

  defaultProps: {
    identationDistance: 0,
    getFixedExtraStyle: function getFixedExtraStyle() {
      return defaultFixedExtraStyle;
    }
  },

  childContextTypes: {
    getStyle: _react2.default.PropTypes.func,
    register: _react2.default.PropTypes.func,
    clearCache: _react2.default.PropTypes.func
  },

  getInitialState: function getInitialState() {
    this.components = [];
    this.styles = [];
    this.cache = {
      root: null
    };
    return {
      // items: [],
      // styles: [],
    };
  },
  componentDidMount: function componentDidMount() {
    window.addEventListener('scroll', this.___calculateStyles);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('scroll', this.___calculateStyles);
  },
  getChildContext: function getChildContext() {
    return {
      getStyle: this._getStyle,
      register: this._register,
      clearCache: this._clearCache
    };
  },
  _clearCache: function _clearCache() {
    this.cache.root = null;
    if (this.cache.allItens) {
      clearFixedStates(this.cache.allItens);
      delete this.cache.allItens;
    }
    if (this.cache.fixedItens) {
      delete this.cache.fixedItens;
    }
  },
  updateFixedStyles: function updateFixedStyles() {
    this._clearCache();
    this._calculateStyles();
  },
  _register: function _register(component, level) {
    var _this = this;

    // const {items} = this.state;
    var components = this.components;

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
    var registrationId = this.lastRegistrationId++;

    // console.log('teste: ', component.domRef2.style.position);

    components[level][registrationId] = {
      component: component,
      offsetTop_: component.domRef2.offsetTop,
      offsetTop: function offsetTop() {
        // console.log('teste2: ', this.component.domRef2.style.position);
        // console.log('offsetTop: ', this.component.domRef2.offsetTop);
        // return this.component.domRef2.offsetTop;
        var result = void 0;
        if (this.component.domRef2.style.position !== 'fixed') {
          this.offsetTop_ = this.component.domRef2.offsetTop;
        }
        result = this.offsetTop_;
        return result;
      },
      offsetHeight: function offsetHeight() {
        return this.component.domRef2.offsetHeight;
      },

      registrationId: registrationId
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
      registrationId: registrationId,
      unregister: function unregister() {
        var components = _this.components,
            styles = _this.styles;

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
  _getStyle: function _getStyle(level, registrationRef) {
    var styles = this.styles;


    if (registrationRef && styles[level] && styles[level][registrationRef.registrationId]) {
      // console.log('_getStyle: ', styles[level][registrationRef.registrationId]);
      return styles[level][registrationRef.registrationId];
    } else {
      // console.log('_getStyle (static): ', staticStyle);
      return staticStyle;
    }
  },
  ___calculateStyles: function ___calculateStyles() {

    if (!this.__debounced_calculateStyles) {
      this.__debounced_calculateStyles = (0, _debounce2.default)(this._calculateStyles, 10);
    }
    // console.log('1');
    this.__debounced_calculateStyles();

    // this._calculateStyles();
    // setTimeout(this._calculateStyles, 0);
  },
  _calculateStyles: function _calculateStyles() {

    // console.log('  2');
    this.styles = [];
    var components = this.components,
        styles = this.styles,
        props = this.props,
        cache = this.cache;


    var contexto = {
      props: props,
      components: components,
      styles: styles,
      cache: cache
    };

    var styles_ = __calculateStyles(contexto);
    // this.styles = styles_;

    // this.setState({
    //   styles,
    // });
  },
  render: function render() {
    var children = this.props.children;


    return _react2.default.createElement(
      'div',
      null,
      children
    );
  }
});

exports.default = StickyStackContext;