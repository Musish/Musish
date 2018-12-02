import React from 'react';

export default class MainPaginatedResults extends React.Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.main = document.getElementById('main-content');

    this.main.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    this.main.removeEventListener('scroll', this.onScroll);
  }

  onScroll(event) {
    if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight)
    {
      this.props.more()
    }
  }

  render() {
    return this.props.children;
  }
}