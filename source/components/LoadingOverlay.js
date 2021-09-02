import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";


export default function LoadingOverlay({ isVisible }) {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={styles.icon.fontSize} color={styles.icon.color} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#ffffffcc",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 80,
    color: "#ccc",
  },
  text: {
    paddingTop: 10,
    fontSize: 16,
    color: "#aaa",
  },
});
