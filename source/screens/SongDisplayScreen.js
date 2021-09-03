import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Song } from "../models/Song";
import { useFocusEffect } from "@react-navigation/native";
import Db from "../db";
import LoadingOverlay from "../components/LoadingOverlay";
import GestureRecognizer from "react-native-swipe-gestures";
import { routes } from "../navigation";

const ContentVerse = ({ title, content }) => (
  <View style={styles.contentVerse}>
    {title === "" ? null : <Text style={styles.contentVerseTitle}>{title}</Text>}
    <Text style={styles.contentVerseText}>{content}</Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer} />
);

export default function SongDisplayScreen({ route, navigation }) {
  const [song, setSong] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return onBlur;
    }, [route.params.title]),
  );

  const onFocus = () => {
    navigation.setOptions({ title: route.params.title });
    loadSong();
  };

  const onBlur = () => {
    setSong(undefined);
    navigation.setOptions({ title: "" });
  };

  const loadSong = () => {
    if (!Db.isConnected()) {
      return;
    }
    setIsLoading(true);

    if (route.params.title === undefined) {
      setSong(undefined);
      setIsLoading(false);
      return;
    }

    const newSong = Db.realm().objects(Song.schema.name)
      .find((it) => it.title === route.params.title);

    if (newSong === undefined) {
      // Song not found
    }

    setSong(newSong);
    setIsLoading(false);
  };

  const renderContentItem = ({ item }) => {
    const lines = item.split("\n");
    let title = lines[0];
    let content = lines.slice(1);
    if (!title.toLowerCase().includes("verse")) {
      title = "";
      content = lines;
    }
    return (
      <ContentVerse title={title} content={content.join("\n")} />
    );
  };

  const nextSong = () => {
    let songNumber = route.params.query;
    if (songNumber === undefined) {
      return;
    }

    const newNumber = +songNumber + 1;

    const newTitle = song.title.replace(+songNumber, newNumber);
    navigateToSongMatching(newTitle, newNumber);
  };

  const previousSong = () => {
    let songNumber = route.params.query;
    if (songNumber === undefined) {
      return;
    }

    const newNumber = +songNumber - 1;
    if (newNumber <= 0) {
      return;
    }

    const newTitle = song.title.replace(+songNumber, newNumber);
    navigateToSongMatching(newTitle, newNumber);
  };

  const navigateToSongMatching = (newTitle, query) => {
    setIsLoading(true);

    const results = Db.realm().objects(Song.schema.name)
      .sorted("title")
      .filtered(`title = "${newTitle}" LIMIT(1)`);

    if (results.length === 0) {
      setIsLoading(false);
      return;
    }

    navigation.navigate(routes.Song, { title: results[0].title, query: query });
  };

  return (
    <GestureRecognizer
      onSwipeLeft={nextSong}
      onSwipeRight={previousSong}
      config={{
        velocityThreshold: 0.7,
        directionalOffsetThreshold: 80,
        gestureIsClickThreshold: 5,
      }}
      style={styles.container}>
      <FlatList
        data={song ? song.content.split("\n\n") : []}
        renderItem={renderContentItem}
        contentContainerStyle={styles.contentSectionList}
        ListFooterComponent={<Footer />} />

      <LoadingOverlay text={null} isVisible={isLoading} />
    </GestureRecognizer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  contentSectionList: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 300,
  },
  contentVerse: {
    marginBottom: 40,
  },
  contentVerseTitle: {
    fontSize: 14,
    color: "#777",
    textTransform: "lowercase",
    left: -10,
    marginBottom: 7,
  },
  contentVerseText: {
    fontSize: 18,
    lineHeight: 25,
  },

  footer: {
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    width: "50%",
    marginTop: 70,
    alignSelf: "center",
  },
});
