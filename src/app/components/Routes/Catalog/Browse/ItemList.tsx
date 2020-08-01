import cx from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import commonClasses from '../../../../assets/styles/common.scss';
import AlbumItem from '../../../Common/AlbumItem/AlbumItem';
import CuratorItem from '../../../Common/CuratorItem/CuratorItem';
import PlaylistItem from '../../../Common/PlaylistItem/PlaylistItem';
import classes from './BrowsePage.scss';
import MediaItem = MusicKit.MediaItem;
import Resource = MusicKit.Resource;

interface ItemListProps {
  title: ReactNode;
  type: 'playlist' | 'album' | 'curator' | 'apple-curator';
  items?: Resource[] | null;
  itemIds?: string[] | null;
  rows?: number;
  size?: number;
}

const ItemList: React.FC<ItemListProps> = ({
  title,
  items = null,
  itemIds = null,
  type,
  rows = 1,
  size = 170,
}: ItemListProps) => {
  const [innerItems, setInnerItems] = useState<Resource[] | null>(null);

  async function fetchItems(ids: string[]) {
    const music = MusicKit.getInstance();
    let newItems;

    switch (type) {
      case 'playlist':
        newItems = await music.api.playlists(ids);
        break;
      case 'album':
        newItems = await music.api.albums(ids);
        break;
      case 'curator':
        newItems = await music.api.curators(ids);
        break;
      case 'apple-curator':
        newItems = await music.api.appleCurators(ids);
        break;
      default:
        return;
    }

    setInnerItems(newItems);
  }

  useEffect(() => {
    if (!items && itemIds) {
      fetchItems(itemIds);
    }
  }, []);

  const finalItems = items || innerItems;

  const styles = {
    gridTemplateRows: 'auto '.repeat(rows),
  };

  if (!finalItems) {
    return null;
  }

  return (
    <>
      <h3>{title}</h3>
      <div className={commonClasses.scrollWrapperThin}>
        <div className={cx(classes.scrollGrid)} style={styles}>
          {finalItems.map((item: MediaItem) => {
            switch (type) {
              case 'playlist':
                return <PlaylistItem key={item.id} playlist={item} size={size} />;
              case 'album':
                return <AlbumItem key={item.id} album={item} size={size} />;
              case 'curator':
              case 'apple-curator':
                return <CuratorItem key={item.id} curator={item} size={size} />;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default ItemList;
