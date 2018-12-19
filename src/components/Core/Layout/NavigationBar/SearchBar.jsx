import React from 'react';
import classes from "./SearchBar.scss";
import cx from 'classnames';
import withMK from "../../../../hoc/withMK";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
      query: '',
    };

    this.handleShowResults = this.handleShowResults.bind(this);
    this.handleHideResults = this.handleHideResults.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleShowResults() {
    this.setState({
      showResults: true,
    })
  }

  handleHideResults() {
    this.setState({
      showResults: false,
    })
  }

  async handleSearch({target: {value: query}}) {
    this.setState({
      query
    });

    await Promise.all([
      this.searchCatalog(query),
      this.searchLibrary(query)
    ])
  }

  async searchCatalog(query) {
    const data = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists', 'music-videos']
    });

    console.log("CATALOG", data)
  }

  async searchLibrary(query) {
    const data = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists', 'library-music-videos']
    });

    console.log("LIBRARY", data)
  }

  render() {
    const {query, showResults} = this.state;

    return (
      <div className={cx(classes.navSearch, {[classes.active]: showResults})}>
        <div className={classes.navSearchWrapper}>
          <input type="text"
                 placeholder="Search music"
                 value={query}
                 onChange={this.handleSearch}
                 onFocus={this.handleShowResults}
                 onBlur={this.handleHideResults}/>

          <div className={classes.results}>

          </div>
        </div>
      </div>
    )
  }
}

export default withMK(SearchBar);
