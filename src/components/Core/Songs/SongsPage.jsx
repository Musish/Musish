import React from 'react';
import Loader from '../../common/Loader';
import PageTitle from '../../common/PageTitle';
import PageContent from "../Layout/PageContent";
import {AutoSizer, List, WindowScroller} from "react-virtualized";

const els = [...Array(10000).keys()];

export default class SongsPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.setState({
      mounted: true
    })
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  renderItems(items, more, {loading, end}) {
    return (
      <>
        <PageTitle title={"Songs"} context={"My Library"}/>


        <div>
          {els.map(i => (
            <div style={{background: 'red', border: '1px solid green', margin: 10}}>
              {i} Lorem
            </div>
          ))}
        </div>
        {loading && <Loader/>}
      </>
    );
  }

  rowRenderer({index, isScrolling, isVisible, key, style}) {
    return (
      <div key={key} style={style}>
        <div style={{background: 'red', border: '1px solid green', margin: 10}}>
          {index} Lorem
        </div>
      </div>
    )
  }


  render() {
    return (
      <PageContent innerRef={this.ref}>
        {/*<InfiniteScroll load={this.load} render={this.renderItems}/>*/}

        {this.ref.current && <WindowScroller scrollElement={this.ref.current}>
          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
            <div style={{flex: 1}}>
              <AutoSizer disableHeight>
                {({width}) => (
                  <div>
                    <h1>I m  A TESTTTSTTSTSTS</h1>
                    <h1>I m  A TESTTTSTTSTSTS</h1>
                    <h1>I m  A TESTTTSTTSTSTS</h1>
                    <h1>I m  A TESTTTSTTSTSTS</h1>

                    <div ref={registerChild}>
                      <List
                        ref={el => {
                          window.listEl = el;
                        }}
                        autoHeight
                        // className={styles.List}
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        overscanRowCount={2}
                        rowCount={els.length}
                        rowHeight={30}
                        rowRenderer={this.rowRenderer}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    </div>
                  </div>

                )}
              </AutoSizer>
            </div>
          )}
        </WindowScroller>}
      </PageContent>
    );
  }
}
