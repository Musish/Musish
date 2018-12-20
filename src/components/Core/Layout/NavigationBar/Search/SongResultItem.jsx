import React from 'react';
import cx from "classnames";
import classes from "./SearchBar.scss";
import withMK from "../../../../../hoc/withMK";
import {createMediaItem} from "../../../common/Utils";

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
         onClick={play}>
      {song.attributes.name}
    </div>
  )
}

export default withMK(SongResultItem);
