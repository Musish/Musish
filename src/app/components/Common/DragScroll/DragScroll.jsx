import React from 'react';
import PropTypes from 'prop-types';

class DragScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.dataSource,
      dragging: false,
      pointerEvents: 'auto'
    };
  }

  render() {
    return (
      <div
        className={this.props.className}
        onMouseUp={this.mouseUpHandle.bind(this)}
        onMouseMove={this.mouseMoveHandle.bind(this)}
        ref={(c) => { this.container = c; }}
        style={{ pointerEvents: this.state.pointerEvents }}
      >
        {this.props.children && this.renderChildren(this.props.children)}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.mouseUpHandle.bind(this));
    window.addEventListener('mousemove', this.mouseMoveHandle.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseUpHandle.bind(this));
    window.removeEventListener('mousemove', this.mouseMoveHandle.bind(this));
  }

  mouseUpHandle(e) {
    if (this.state.dragging) {
      setTimeout(() => {
        this.setState({
          pointerEvents: 'auto',
        });
      }, 100);
      this.setState({
        dragging: false,
      });
    }
  }

  mouseDownHandle(e) {
    if (!this.state.dragging) {
      this.setState({
        dragging: true,
      });
      this.lastClientX = e.clientX;
      this.lastClientY = e.clientY;
      setTimeout(() => {
        this.setState({
          pointerEvents: 'none',
        });
      }, 100);

      e.preventDefault();
    }
  }

  mouseMoveHandle(e) {
    if (this.state.dragging) {
      this.container.scrollLeft -= -this.lastClientX + (this.lastClientX = e.clientX);
      this.container.scrollTop -= -this.lastClientY + (this.lastClientY = e.clientY);
    }
  }

  renderChildren(dom, type) {
    if (this.isArray(dom)) {
      return dom.map((item, index) => 
        React.cloneElement(item, {
          key: item.key || index,
          onMouseUp: this.mouseUpHandle.bind(this),
          onMouseDown: this.mouseDownHandle.bind(this),
        })
      );
    } else if ('object' === typeof dom) {
      return React.cloneElement(dom, {
        onMouseUp: this.mouseUpHandle.bind(this),
        onMouseDown: this.mouseDownHandle.bind(this),
      });
    }
    return;
  }

  static isArray(object) {
    return (
      object &&
      typeof object === 'object' &&
      typeof object.length === 'number' &&
      typeof object.splice === 'function' &&
      !{}.propertyIsEnumerable.call(object, 'length')
    );
  }
}

DragScroll.propTypes = {
  children: PropTypes.node.isRequired
};

export default DragScroll;