'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ResizeSensor = require('css-element-queries/src/ResizeSensor');

var _ResizeSensor2 = _interopRequireDefault(_ResizeSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StickyStackItem = _react2.default.createClass({
  displayName: 'StickyStackItem',


  propTypes: {
    children: _react2.default.PropTypes.any,
    position: _react2.default.PropTypes.number
  },

  contextTypes: {
    getStyle: _react2.default.PropTypes.func,
    register: _react2.default.PropTypes.func,
    clearCache: _react2.default.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      height: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _context = this.context,
        register = _context.register,
        clearCache = _context.clearCache;
    var position = this.props.position;
    var _domRef = this.domRef2,
        offsetTop = _domRef.offsetTop,
        offsetHeight = _domRef.offsetHeight;


    this.offsetTop = offsetTop;
    this.offsetHeight = offsetHeight;
    // this.clientHeight = clientHeight;
    new _ResizeSensor2.default(this.domRef2, function () {
      var _domRef2 = _this.domRef2,
          offsetTop = _domRef2.offsetTop,
          offsetHeight = _domRef2.offsetHeight;

      // console.log('Changed to ', this.clientHeight, '!=', clientHeight);
      // if (clientHeight !== this.clientHeight) {
      //   console.log('Changed to ', this.clientHeight, '!=', clientHeight);
      //   this.clientHeight = clientHeight;
      // }

      if (offsetTop !== _this.offsetTop || offsetHeight !== _this.offsetHeight) {
        // console.log('Changed to ', this.offsetTop, '!=', offsetTop, ' : ', this.offsetHeight, offsetHeight);
        _this._setHeight(offsetHeight);
        _this.offsetTop = offsetTop;
        _this.offsetHeight = offsetHeight;
        // Notify change to sticky-stack-context
        clearCache();
      }
    });

    //     let observer = new MutationObserver(function(mutations) {
    //       mutations.forEach(function(mutation) {
    //         console.log('mutation.type: ', mutation.type);
    //       });
    //     });
    //
    // // configuration of the observer:
    //     var config = {
    //       attributes: true, childList: true, characterData: true,
    //       subtree: true,
    //       attributeOldValue: true,
    //       characterDataOldValue: true,
    //     };
    //
    //
    // // pass in the target node, as well as the observer options
    //     observer.observe(this.domRef, config);
    //
    // // later, you can stop observing
    // //     observer.disconnect();


    this.registrationRef = register(this, position
    // offsetTop,
    // offsetHeight
    );

    this._setHeight(offsetHeight);
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.domRef.offsetHeight != this.state.height) {
      this._setHeight(this.domRef.offsetHeight);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.registrationRef.unregister();
  },
  _setHeight: function _setHeight(height) {
    this.setState({
      height: height
    });
  },
  render: function render() {
    var _this2 = this;

    var getStyle = this.context.getStyle;
    var _props = this.props,
        children = _props.children,
        position = _props.position;
    var height = this.state.height;


    return _react2.default.createElement(
      'div',
      { ref: function ref(domRef) {
          return _this2.domRef = domRef;
        }, style: { height: height } },
      _react2.default.createElement(
        'div',
        { ref: function ref(domRef2) {
            return _this2.domRef2 = domRef2;
          }, style: getStyle(position, this.registrationRef) },
        children
      )
    );
  }
});

exports.default = StickyStackItem;