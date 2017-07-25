import React from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

const StickyHierarchicalItem = React.createClass({

  propTypes: {
    children: React.PropTypes.any,
    hierarchicalLevel: React.PropTypes.number,
  },

  contextTypes: {
    getStyle: React.PropTypes.func,
    register: React.PropTypes.func,
    clearCache: React.PropTypes.func,
  },

  getInitialState() {
    return {
      height: null,
    };
  },

  componentDidMount() {
    const {register, clearCache} = this.context;
    const {hierarchicalLevel} = this.props;

    this.offsetTop = this.domRef2.offsetTop;
    this.offsetHeight = this.domRef2.offsetHeight;
    // this.clientHeight = this.domRef2.clientHeight;
    new ResizeSensor(this.domRef2, () => {
      const {
        offsetTop,
        offsetHeight,
        // clientHeight,
      } = this.domRef2;

      // console.log('Changed to ', this.clientHeight, '!=', clientHeight);
      // if (clientHeight !== this.clientHeight) {
      //   console.log('Changed to ', this.clientHeight, '!=', clientHeight);
      //   this.clientHeight = clientHeight;
      // }

      if (offsetTop !== this.offsetTop || offsetHeight !== this.offsetHeight) {
        // console.log('Changed to ', this.offsetTop, '!=', offsetTop, ' : ', this.offsetHeight, offsetHeight);
        this._setHeight(offsetHeight);
        this.offsetTop = offsetTop;
        this.offsetHeight = offsetHeight;
        // Notify change to sticky-stack-context
        clearCache();
      }
    });


    this.registrationRef = register(
      this,
      hierarchicalLevel
      // offsetTop,
      // offsetHeight
    );

    this._setHeight(this.offsetHeight);
  },

  componentDidUpdate() {
    if (this.domRef.offsetHeight !== this.state.height) {
      this._setHeight(this.domRef.offsetHeight);
    }
  },

  componentWillUnmount() {
    this.registrationRef.unregister();
  },

  _setHeight(height) {
    this.setState({
      height,
    });
  },

  render() {
    const {getStyle} = this.context;
    const {children, hierarchicalLevel} = this.props;
    const {height} = this.state;

    return (
      <div ref={domRef => this.domRef = domRef} style={{height}}>
        <div ref={domRef2 => this.domRef2 = domRef2} style={getStyle(hierarchicalLevel, this.registrationRef)}>
          {children}
        </div>
      </div>
    );
  },

});

export default StickyHierarchicalItem;
