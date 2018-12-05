import React from 'react';

export default class PaginatedResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      page: 0,
      loading: false,
      end: false,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.loadMore();
  }

  async loadMore() {
    if (this.state.end) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const limit = 50;

      const newItems = await this.props.load({
        limit,
        offset: this.state.page * limit,
      });

      this.setState(state => ({
        page: state.page + 1,
        items: [...(state.items || []), ...newItems],
        end: newItems.length < limit,
      }));
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    return this.props.render(this.state.items, this.loadMore, {...this.state});
  }
}