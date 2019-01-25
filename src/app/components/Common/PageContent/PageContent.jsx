import React from 'react';
import cx from 'classnames';
import classes from './PageContent.scss';
import ModalContext from '../Modal/ModalContext';

export default class PageContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: !this.props.innerRef,
    };
  }

  componentDidMount() {
    const { innerRef } = this.props;

    if (innerRef) {
      this.setState({
        mounted: true,
      });
    }
  }

  render() {
    const { innerRef, ...rest } = this.props;
    const { mounted } = this.state;

    return (
      <ModalContext.Consumer>
        {({ opened }) => (
          <div
            className={cx(classes.pageContent, { [classes.blurred]: opened })}
            ref={innerRef}
            {...rest}
          >
            {mounted && this.props.children}
          </div>
        )}
      </ModalContext.Consumer>
    );
  }
}
