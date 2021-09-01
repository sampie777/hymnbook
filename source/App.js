/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { routes } from "./navigation";
import SearchScreen from "./screens/SearchScreen";
import ReactNativeInfoScreen from "./screens/ReactNativeInfoScreen";
import SongDisplayScreen from "./screens/SongDisplayScreen";
import Db from "./db";
import { Song } from "./models/Song";

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const fillDatabaseWithMockValues = () => {
    Db.realm.write(() => {
      Db.realm.create(Song.schema.name, new Song({
        title: "Psalm 100",
        content: "Yolo",
      }));
      Db.realm.create(Song.schema.name, new Song({
        title: "Psalm 3",
        content: "Yolo",
      }));
      Db.realm.create(Song.schema.name, new Song({
        title: "Psalm 004",
        content: "Yolo",
      }));
    });

    console.log("Songs: " + Db.realm.objects(Song.schema.name).map((it) => `${it._id} ${it.title}`));
  };

  const onLaunch = () => {
    Db.connect()
      // .then(fillDatabaseWithMockValues)
      .catch(e => {
        console.error("Could not connect to local database", e);
        alert("Could not connect to local database: " + e);
      });

  };

  const onExit = () => {
    Db.disconnect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName={routes.Search}>
          <Drawer.Screen name={routes.Search} component={SearchScreen} />
          <Drawer.Screen name={routes.Home} component={ReactNativeInfoScreen} />
          <Drawer.Screen name={routes.Song} component={SongDisplayScreen} initialParams={{title: undefined}} />
        </Drawer.Navigator>
      </NavigationContainer>

      <StatusBar style={"auto"} hidden={false} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
