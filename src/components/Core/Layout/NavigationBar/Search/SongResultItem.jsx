import React from 'react';
import cx from "classnames";
import classes from "./SearchBar.scss";
import withMK from "../../../../../hoc/withMK";
import {createMediaItem} from "../../../common/Utils";
import SongDecoration from "../../../common/SongList/SongDecoration";

function SongResultItem({song, mk}) {
  const play = async () => {
    let music = mk.instance;
    await music.setQueue({
      items: [createMediaItem(song)],
    });
    await music.player.play();
  };

  return (
    <div className={cx(classes.result, classes.song)}
         key={song.id}
         onClick={play}
    >
      <div className={classes.artwork}>
        <SongDecoration song={song} showAlbum={true} size={30}/>
      </div>

      <span className={classes.name}>
        {song.attributes.name}
      </span>
    </div>
  )
}

export default withMK(SongResultItem);
