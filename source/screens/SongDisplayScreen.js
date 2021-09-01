import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Song } from "../models/Song";
import { useFocusEffect } from "@react-navigation/native";

const ContentVerse = ({children}) => {
  return (
    <Text style={styles.contentText}>{children}</Text>
  )
}

export default function SongDisplayScreen() {
  const [song, setSong] = useState(undefined);

  const loadSong = () => {
    const newSong = Song(0, "Psalm 150", "I'm a verse!" +
      "\nWhat about new lines?" +
      " Wha t a b o u t n e w l i n es?" +
      " What about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\n" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\n" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\n" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\n" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\n" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nWhat about new lines?" +
      "\nLast line");
    setSong(newSong);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSong();
      return () => setSong(null);
    }, []),
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
        contentContainerStyle={styles.contentSectionList}>
      </FlatList>
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
