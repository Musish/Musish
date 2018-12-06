import React, {Component} from 'react';

import styles from './ArtistItem.scss';
import cx from 'classnames';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class ArtistItem extends Component {
  constructor(props){
    super(props);

    this.imgUrl = null;

    this.getImgUrl = this.getImgUrl.bind(this);
  }

  async getImgUrl() {
    if(this.imgUrl !== null) {
      console.log(this.imgUrl);
      return this.imgUrl;
    }
    const music = MusicKit.getInstance();
    music.api.search(this.props.artist.attributes.name).then(results => {
      let artistURL = results.artists.data[0].attributes.url;
      // console.log(results.artists.data[0].attributes.url);
      axios.get(artistURL).then(
        (response) => {
          const regex = /<meta property="og:image" content="[a-zA-Z0-9:\/.-]*/;
          const data = response.data;
          const imgData = data.match(regex);
          if(imgData !== null) {
            let imgUrl = imgData[0];
            imgUrl = imgUrl.replace("<meta property=\"og:image\" content=\"","");
            imgUrl = imgUrl.substring(0, imgUrl.lastIndexOf("/") + 1) + "190x190cc.jpg";
            // console.log(imgUrl);
            this.imgUrl = imgUrl;
            console.log(imgUrl);
            return imgUrl;
          } else {
            // console.log("No artist picture sadly");
            this.imgUrl = '';
            return '';
          }
        }
      );
    });
  }

  render() {
    return (
        <div className={cx(styles.container)}>
          <Link to={`/artists/${this.props.artist.id}`}>
            <div className={'whatever'}>
              <img
                src={this.getImgUrl()}
                // className={Classes.image}
              />
            </div>
            <h1>{this.props.artist.attributes.name}</h1>
          </Link>
        </div>
    );
  }
}
