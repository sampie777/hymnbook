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
import CustomDrawerContent from "./components/CustomDrawerContent";
import Icon from "react-native-vector-icons/FontAwesome";

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const fillDatabaseWithMockValues = () => {
    Db.realm.write(() => {
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 1", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 2", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 3", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 004", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 100", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 101", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 102", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 111", content: "Yolo" }));
      Db.realm.create(Song.schema.name, new Song({ title: "Psalm 150", content: "Yolo" }));
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
        <Drawer.Navigator initialRouteName={routes.Search}
                          drawerContent={CustomDrawerContent}>
          <Drawer.Screen name={routes.Search} component={SearchScreen}
                         options={{
                           drawerIcon: ({ focused, color, size }) =>
                             <Icon name="search" size={size} color={color} />,
                         }} />
          <Drawer.Screen name={routes.Song} component={SongDisplayScreen}
                         initialParams={{ title: undefined }}
                         options={{
                           hideInMenu: true,
                         }} />
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
