import React from 'react';
import css from './InfiniteScroll.scss';

export default class InfiniteScroll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      page: 0,
      loading: false,
      end: false,
    };

    this.ref = React.createRef();

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.loadMore();

    this.ref.current.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('scroll', this.onScroll);
  }

  onScroll(event) {
    if (event.target.scrollHeight - event.target.scrollTop >= event.target.clientHeight - 500) {
      this.loadMore()
    }
  }

  async loadMore() {
    if (this.state.end || this.state.loading) {
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
    return (
      <div ref={this.ref} className={css.container}>
        {this.props.render(this.state.items, this.loadMore, {...this.state})}
      </div>
    );
  }
}
