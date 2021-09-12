import React, { useState } from "react";
import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import { Song, Verse } from "../models/Songs";
import { useFocusEffect } from "@react-navigation/native";
import Db from "../scripts/db";
import LoadingOverlay from "../components/LoadingOverlay";
import { routes } from "../navigation";
import Settings from "../scripts/settings";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface ContentVerseProps {
  title: string;
  content: string;
  scale: number;
}

const ContentVerse: React.FC<ContentVerseProps> = ({ title, content, scale }) => {
  const scalableStyles = StyleSheet.create({
    contentVerseTitle: {
      fontSize: 14 * scale
    },
    contentVerseText: {
      fontSize: Settings.songVerseTextSize * scale,
      lineHeight: 25 * scale
    }
  });

  return (
    <View style={styles.contentVerse}>
      {title === "" ? null :
        <Text style={[styles.contentVerseTitle, scalableStyles.contentVerseTitle]}>{title}</Text>}
      <Text style={[styles.contentVerseText, scalableStyles.contentVerseText]}>{content}</Text>
    </View>
  );
};

const Footer: React.FC = () => (
  <View style={styles.footer} />
);


interface SongDisplayScreenProps {
  route: any;
  navigation: DrawerNavigationProp<any>;
}

const SongDisplayScreen: React.FC<SongDisplayScreenProps> = ({ route, navigation }) => {
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [scale, setScale] = useState(Settings.songScale);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return onBlur;
    }, [route.params.id, route.params.previousScreen])
  );

  const onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    setScale(Settings.songScale);
    loadSong();
  };

  const onBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    setSong(undefined);
    navigation.setOptions({ title: "" });
  };

  const onBackPress = (): boolean => {
    if (route.params.previousScreen === undefined) {
      return false;
    }

    navigation.navigate(route.params.previousScreen);
    return true;
  }

  const loadSong = () => {
    if (!Db.songs.isConnected()) {
      return;
    }
    setIsLoading(true);

    if (route.params.id === undefined) {
      setSong(undefined);
      setIsLoading(false);
      return;
    }

    const newSong = Db.songs.realm()
      .objectForPrimaryKey(Song.schema.name, route.params.id) as (Song | undefined);

    if (newSong === undefined) {
      // Song not found
    }

    setSong(newSong);
    navigation.setOptions({ title: newSong?.name });
    setIsLoading(false);
  };

  const renderContentItem = ({ item }: { item: Verse }) => {
    return (
      <ContentVerse title={item.name} content={item.content} scale={scale} />
    );
  };

  const nextSong = () => {
    if (song === undefined) {
      return;
    }
    navigateToSongMatching(song.id + 1);
  };

  const previousSong = () => {
    if (song === undefined) {
      return;
    }
    navigateToSongMatching(song.id - 1);
  };

  const navigateToSongMatching = (id: number) => {
    setIsLoading(true);

    const newSong = Db.songs.realm().objectForPrimaryKey(Song.schema.name, id);

    if (newSong === undefined) {
      setIsLoading(false);
      return;
    }

    navigation.navigate(routes.Song, { id: id });
  };

  const _onPanGestureEvent = () => {

  };

  const _onPinchHandlerStateChange = (event: any) => {
    setScale(scale * event.nativeEvent.scale);
    Settings.songScale = scale;
  };

  return (
    <PinchGestureHandler
      onGestureEvent={_onPanGestureEvent}
      onHandlerStateChange={_onPinchHandlerStateChange}>
      <View style={styles.container}>
        <FlatList
          data={song?.verses}
          renderItem={renderContentItem}
          contentContainerStyle={styles.contentSectionList}
          ListFooterComponent={<Footer />} />

        <LoadingOverlay text={null} isVisible={isLoading} />
      </View>
    </PinchGestureHandler>
  );
};

export default SongDisplayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },

  contentSectionList: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 300
  },
  contentVerse: {
    marginBottom: 40
  },
  contentVerseTitle: {
    color: "#777",
    textTransform: "lowercase",
    left: -10,
    marginBottom: 7
  },
  contentVerseText: {},

  footer: {
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    width: "50%",
    marginTop: 70,
    alignSelf: "center"
  }
});
