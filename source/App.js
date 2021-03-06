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
import { NavigationContainer } from "@react-navigation/native";
import { routes } from "./navigation";
import SearchScreen from "./screens/SearchScreen";
import SongDisplayScreen from "./screens/SongDisplay/SongDisplayScreen";
import Db from "./scripts/db";
import CustomDrawerContent from "./components/CustomDrawerContent";
import Icon from "react-native-vector-icons/FontAwesome";
import DownloadSongsScreen from "./screens/DownloadSongsScreen";
import Settings from "./scripts/settings";
import SettingsScreen from "./screens/Settings/SettingsScreen";
import SongListScreen from "./screens/SongListScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    Db.settings.connect()
      .then(() => Settings.load())
      .catch(e => {
        console.error("Could not connect to local settings database", e);
        alert("Could not connect to local settings database: " + e);
      });

    Db.songs.connect()
      .catch(e => {
        console.error("Could not connect to local song database", e);
        alert("Could not connect to local song database: " + e);
      });
  };

  const onExit = () => {
    Settings.store();
    Db.songs.disconnect();
    Db.settings.disconnect();
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
          <Drawer.Screen name={routes.SongList} component={SongListScreen}
                         options={{
                           title: "Song list",
                           drawerIcon: ({ focused, color, size }) =>
                             <Icon name="list-ul" size={size} color={color} />,
                         }} />
          <Drawer.Screen name={routes.Import} component={DownloadSongsScreen}
                         options={{
                           drawerIcon: ({ focused, color, size }) =>
                             <Icon name="database" size={size} color={color} />,
                         }} />
          <Drawer.Screen name={routes.Settings} component={SettingsScreen}
                         options={{
                           drawerIcon: ({ focused, color, size }) =>
                             <Icon name="cogs" size={size} color={color} />,
                         }} />

          {/* Hidden screens */}
          <Drawer.Screen name={routes.Song} component={SongDisplayScreen}
                         initialParams={{
                           id: undefined,
                           previousScreen: undefined,
                           songListIndex: undefined,
                         }}
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
