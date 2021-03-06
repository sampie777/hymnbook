import React, { useEffect, useState } from "react";
import { BackHandler, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Db from "../scripts/db";
import { Song } from "../models/Songs";
import { routes } from "../navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import SongList from "../scripts/songList/songList";
import { SongListModel, SongListSongModel } from "../models/SongListModel";
import { CollectionChangeCallback } from "realm";

const DeleteModeButton: React.FC<{ callback: () => void }> =
  ({ callback }) => (
    <TouchableOpacity onPress={callback}
                      style={styles.deleteModeButton}>
      <Icon name={"trash-alt"}
            size={styles.deleteModeButton.fontSize}
            color={styles.deleteModeButton.color} />
    </TouchableOpacity>
  );

const SongItem: React.FC<{
  index: number,
  song: Song,
  onPress: (index: number, song: Song) => void,
  showDeleteButton: boolean,
}> =
  ({ index, song, onPress, showDeleteButton }) => (
    <TouchableOpacity onPress={() => onPress(index, song)} style={styles.songListItem}>
      <Text style={styles.songListItemText}>{song.name}</Text>

      {!showDeleteButton ? undefined :
        <View style={styles.songListItemButton}>
          <Icon name={"times"}
                size={styles.songListItemButton.fontSize}
                color={styles.songListItemButton.color} />
        </View>
      }
    </TouchableOpacity>
  );

const SongListScreen: React.FC<{ navigation: DrawerNavigationProp<any> }> =
  ({ navigation }) => {

    const [list, setList] = useState<Array<SongListSongModel>>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (<DeleteModeButton callback={toggleDeleteMode} />)
      });
    }, [navigation]);

    useFocusEffect(
      React.useCallback(() => {
        onFocus();
        return onBlur;
      }, [isDeleteMode])
    );

    const reloadSongList = () => {
      setList(SongList.list());
    };

    const onFocus = () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      reloadSongList();
    };

    const onBlur = () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };

    const onBackPress = (): boolean => {
      if (isDeleteMode) {
        setIsDeleteMode(false);
        return true;
      }
      return false;
    };

    useEffect(() => {
      onLaunch();
      return onExit;
    }, []);

    const onLaunch = () => {
      Db.songs.realm().objects(SongListModel.schema.name).addListener(onCollectionChange);
    };

    const onExit = () => undefined;

    const onCollectionChange: CollectionChangeCallback<Object> = (songLists, changes) => {
      reloadSongList();
    };

    const onSearchResultItemPress = (index: number, song: Song) => {
      if (isDeleteMode) {
        return SongList.deleteSongAtIndex(index);
      }
      navigation.navigate(routes.Song, {
        id: song.id,
        previousScreen: routes.SongList,
        songListIndex: index
      });
    };

    const renderSongListItem = ({ item }: { item: SongListSongModel }) => (
      <SongItem index={item.index}
                song={item.song}
                onPress={onSearchResultItemPress}
                showDeleteButton={isDeleteMode} />
    );

    const toggleDeleteMode = () => setIsDeleteMode(it => !it);

    return (
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={renderSongListItem}
          contentContainerStyle={styles.songList} />
      </View>
    );
  };

export default SongListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch"
  },

  songList: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 10,
    paddingTop: 20
  },
  songListItem: {
    marginBottom: 1,
    backgroundColor: "#fcfcfc",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  songListItemText: {
    padding: 15,
    fontSize: 24,
    flex: 1
  },
  songListItemButton: {
    padding: 15,
    right: 7,
    fontSize: 21,
    color: "#f17c7c"
  },

  deleteModeButton: {
    padding: 15,
    right: 5,
    fontSize: 21,
    color: "#f17c7c"
  }
});
