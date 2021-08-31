/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { routes } from "./navigation";
import SearchScreen from "./screens/SearchScreen";
import ReactNativeInfoScreen from "./screens/ReactNativeInfoScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName={routes.Search}>
          <Drawer.Screen name={routes.Search} component={SearchScreen} />
          <Drawer.Screen name={routes.Home} component={ReactNativeInfoScreen} />
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
