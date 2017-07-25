'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ResizeSensor = require('css-element-queries/src/ResizeSensor');

var _ResizeSensor2 = _interopRequireDefault(_ResizeSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StickyHierarchicalItem = _react2.default.createClass({
  displayName: 'StickyHierarchicalItem',


  propTypes: {
    children: _react2.default.PropTypes.any,
    hierarchicalLevel: _react2.default.PropTypes.number
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
    var hierarchicalLevel = this.props.hierarchicalLevel;


    this.offsetTop = this.domRef2.offsetTop;
    this.offsetHeight = this.domRef2.offsetHeight;
    // this.clientHeight = this.domRef2.clientHeight;
    new _ResizeSensor2.default(this.domRef2, function () {
      var _domRef = _this.domRef2,
          offsetTop = _domRef.offsetTop,
          offsetHeight = _domRef.offsetHeight;

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

    this.registrationRef = register(this, hierarchicalLevel
    // offsetTop,
    // offsetHeight
    );

    this._setHeight(this.offsetHeight);
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.domRef.offsetHeight !== this.state.height) {
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
        hierarchicalLevel = _props.hierarchicalLevel;
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
          }, style: getStyle(hierarchicalLevel, this.registrationRef) },
        children
      )
    );
  }
});

exports.default = StickyHierarchicalItem;