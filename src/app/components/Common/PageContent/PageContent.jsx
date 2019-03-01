import React from 'react';
import PropTypes from 'prop-types';
import classes from './PageContent.scss';

class PageContent extends React.Component {
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
      <div className={classes.pageContent} ref={innerRef} {...rest}>
        {mounted && this.props.children}
      </div>
    );
  }
}

PageContent.propTypes = {
  innerRef: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
};

export default PageContent;
