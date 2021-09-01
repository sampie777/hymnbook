import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Song } from "../models/Song";
import { useFocusEffect } from "@react-navigation/native";
import Db from "../db";

const ContentVerse = ({ children }) => (
  <Text style={styles.contentText}>{children}</Text>
);

export default function SongDisplayScreen({ route }) {
  const [song, setSong] = useState(undefined);

  const loadSong = () => {
    if (!Db.isConnected()) {
      return;
    }

    if (route.params.title === undefined) {
      setSong(undefined);
      return;
    }

    const newSong = Db.realm.objects(Song.schema.name)
      .find((it) => it.title === route.params.title);

    if (newSong === undefined) {
      // Song not found
    }

    setSong(newSong);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSong();
      return () => setSong(undefined);
    }, [route.params.title]),
  );

  const renderContentItem = ({ item }) => (
    <ContentVerse>{item}</ContentVerse>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>{song ? song.title : ""}</Text>
      </View>
      <FlatList
        data={song ? song.content.split("\n") : ["No song loaded..."]}
        renderItem={renderContentItem}
        contentContainerStyle={styles.contentSectionList} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  titleSection: {
    flexBasis: 55,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 26,
  },

  contentSectionList: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 300,
  },
  contentText: {
    fontSize: 18,
  },
});
