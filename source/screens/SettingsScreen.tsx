import React, { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Settings from "../scripts/settings";
import { AccessRequestStatus, ServerAuth } from "../scripts/server/auth";

interface SettingProps {
  name: string;
  sKey?: string;
  value?: any;
  onPress?: (key?: string) => void;
}

const Setting: React.FC<SettingProps> =
  ({ name, sKey, value, onPress = undefined }) => {
    if (value === undefined && sKey !== undefined) {
      value = Settings.get(sKey);
    }

    return (
      <TouchableOpacity
        style={styles.settingContainer}
        onPress={onPress === undefined ? undefined : () => onPress(sKey)}>
        <Text style={styles.settingKey}>{name}</Text>
        {value === undefined ? null : <Text style={styles.settingValue}>{value.toString()}</Text>}
      </TouchableOpacity>
    );
  };

interface ComponentProps {
}

const SettingsScreen: React.FC<ComponentProps> = () => {

  useEffect(() => {
    return () => undefined;
  }, [Settings]);

  const reloadSettings = () => {
    // todo...
  };

  let authenticationStatus = "No";
  if (ServerAuth.isAuthenticated()) {
    authenticationStatus = "Approved";
  } else if (Settings.authStatus === AccessRequestStatus.DENIED) {
    authenticationStatus = "Denied: " + Settings.authDeniedReason;
  } else if (Settings.authStatus === AccessRequestStatus.REQUESTED) {
    authenticationStatus = "Requested...";
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl onRefresh={reloadSettings} refreshing={false} />}>
      {/*<Setting name={"Max input length"} sKey={"maxSearchInputLength"} />*/}
      {/*<Setting name={"Max. results to display"} sKey={"maxSearchResultsLength"} />*/}
      {/*<Setting name={"SongBundle API URL"} sKey={"songBundlesApiUrl"} />*/}

      <Setting name={"Reset songs scale"} onPress={() => Settings.songScale = 1.0} />
      {/*<Setting name={"Songs text size"} sKey={"songVerseTextSize"} />*/}

      <Setting name={"Use authentication with backend"} sKey={"useAuthentication"}
               onPress={() => Settings.useAuthentication = !Settings.useAuthentication} />
      <Setting name={"Authentication status with backend"} value={authenticationStatus} />
    </ScrollView>
  );
};

export default SettingsScreen;


const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  settingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 1,
    backgroundColor: "#fcfcfc",
    borderColor: "#ddd",
    borderBottomWidth: 1
  },
  settingKey: {
    fontSize: 16
  },
  settingValue: {
    color: "#555",
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 5
  }
});
