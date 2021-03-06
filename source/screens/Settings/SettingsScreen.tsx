import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Settings from "../../scripts/settings";
import { AccessRequestStatus, ServerAuth } from "../../scripts/server/auth";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useFocusEffect } from "@react-navigation/native";
import { getFontScale } from "react-native-device-info";
import { SettingComponent, SettingSwitchComponent } from "./SettingComponent" ;

const Header: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.settingHeader}>{title}</Text>
);

const SettingsScreen: React.FC = () => {
  const confirmModalCallback: MutableRefObject<((isConfirmed: boolean) => void) | undefined> =
    useRef(undefined);
  const [confirmModalMessage, setConfirmModalMessage] = useState<string | undefined>(undefined);
  const [isReloading, setReloading] = useState(false);

  const confirmModalCallbackWrapper = (isConfirmed: boolean) => {
    setConfirmModalMessage(undefined);
    confirmModalCallback.current?.(isConfirmed);
  };

  const setConfirmModalCallback = (message: string | undefined, callback: ((isConfirmed: boolean) => void) | undefined) => {
    if (message === undefined || callback === undefined) {
      setConfirmModalMessage(undefined);
      return;
    }

    confirmModalCallback.current = callback;
    setConfirmModalMessage(message);
  };

  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return onBlur;
    }, [])
  );

  const onFocus = () => {
    reloadSettings();
  };

  const onBlur = () => {
  };


  const reloadSettings = () => {
    setReloading(true);
    setTimeout(() => setReloading(false), 100);
  };

  function getAuthenticationStateAsMessage() {
    if (ServerAuth.isAuthenticated()) {
      return "Approved as " + Settings.authClientName;
    } else if (Settings.authStatus === AccessRequestStatus.DENIED) {
      return "Denied: " + Settings.authDeniedReason;
    } else if (Settings.authStatus === AccessRequestStatus.REQUESTED) {
      return "Requested...";
    }
    return "Not authenticated";
  }

  const authenticationStatus = getAuthenticationStateAsMessage();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl onRefresh={reloadSettings} refreshing={isReloading} />}>

      <ConfirmationModal isOpen={confirmModalMessage !== undefined}
                         onClose={() => confirmModalCallbackWrapper(false)}
                         onConfirm={() => confirmModalCallbackWrapper(true)}>
        <Text>{confirmModalMessage}</Text>
      </ConfirmationModal>

      {isReloading ? null : <>
        <Header title={"Layout"} />
        <SettingComponent name={"Songs scale"}
                          sKey={"songScale"}
                          onPress={(setValue) => setValue(1)}
                          valueRender={(it) => Math.round(it * 100) + " %"} />
        <SettingSwitchComponent name={"Animate scroll to top"}
                                sKey={"scrollToTopAnimated"}
                                onPress={(setValue, key, newValue) => setValue(newValue)} />

        <Header title={"Backend"} />
        <SettingSwitchComponent name={"Use authentication with backend"}
                                sKey={"useAuthentication"}
                                onPress={(setValue, key, newValue) => setValue(newValue)} />
        <SettingComponent name={"Authentication status with backend"}
                          value={authenticationStatus}
                          onPress={(setValue) =>
                            setConfirmModalCallback(
                              "Reset/forget authentication?",
                              (isConfirmed) => {
                                if (isConfirmed) {
                                  ServerAuth.forgetCredentials();
                                }
                                setValue(getAuthenticationStateAsMessage);
                              })} />
      </>}
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {},

  settingHeader: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
    color: "#999"
  }
});
