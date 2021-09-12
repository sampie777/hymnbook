import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Db from "../scripts/db";
import { Song } from "../models/Songs";
import { routes } from "../navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import SongList from "../scripts/songList/songList";
import { SongListModel, SongListSongModel } from "../models/SongListModel";
import { CollectionChangeCallback } from "realm";

const SongItem: React.FC<{ index: number, song: Song, onPress: (song: Song) => void }> =
  ({ index, song, onPress }) => (
    <TouchableOpacity onPress={() => onPress(song)} style={styles.songListItem}>
      <Text style={styles.songListItemText}>{song.name}</Text>

      <TouchableOpacity onPress={() => SongList.deleteSongAtIndex(index)}
                        style={styles.songListItemButton}>
        <Icon name={"times"}
              size={styles.songListItemButton.fontSize}
              color={styles.songListItemButton.color} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

const SongListScreen: React.FC<{ navigation: DrawerNavigationProp<any> }> =
  ({ navigation }) => {

    const [list, setList] = useState<Array<SongListSongModel>>([]);

    useFocusEffect(
      React.useCallback(() => {
        onFocus();
        return onBlur;
      }, [])
    );

    const reloadSongList = () => {
      setList(SongList.list());
    };

    const onFocus = () => {
      reloadSongList();
    };

    const onBlur = () => {
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

    const onSearchResultItemPress = (song: Song) => {
      navigation.navigate(routes.Song, { id: song.id });
    };

    const renderSongListItem = ({ item }: { item: SongListSongModel }) => (
      <SongItem index={item.index} song={item.song} onPress={onSearchResultItemPress} />
    );

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
    fontSize: 24,
    color: "#f17c7c"
  }

});
