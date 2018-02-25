import React, { Component } from 'react';
import './style.scss';

export const withAnimatedWrapper = (WrappedComponent, componentProps = {}) => {
  return class extends Component {
    render() {
      return (
        <div className="AnimatedWrapper">
          <WrappedComponent {...this.props} {...componentProps} />
        </div>
      );
    }
  };
};
