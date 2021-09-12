import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Settings from "../scripts/settings";
import { AccessRequestStatus, ServerAuth } from "../scripts/server/auth";
import ConfirmationModal from "../components/ConfirmationModal";
import { useFocusEffect } from "@react-navigation/native";
import { getFontScale } from "react-native-device-info";

interface SettingProps {
  name: string;
  sKey?: string;
  value?: any;
  onPress?: (setValue: (newValue: any) => void, key?: string) => void;
  valueRender?: (value: any) => string;
}

const Setting: React.FC<SettingProps> =
  ({ name, sKey, value, onPress = undefined, valueRender = (it) => it.toString() }) => {
    if (value === undefined && sKey !== undefined) {
      value = Settings.get(sKey);
    }

    const [_value, _setValue] = useState(value);
    const setValue = (newValue: any) => {
      if (sKey !== undefined) {
        // @ts-ignore
        Settings[sKey] = newValue;
        // @ts-ignore
        _setValue(Settings[sKey]);
      } else {
        _setValue(newValue);
      }
    };

    return (
      <TouchableOpacity
        style={styles.settingContainer}
        onPress={onPress === undefined ? undefined : () => onPress(setValue, sKey)}>
        <Text style={styles.settingKey}>{name}</Text>
        {value === undefined ? null : <Text style={styles.settingValue}>{valueRender(_value)}</Text>}
      </TouchableOpacity>
    );
  };

const Header: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.settingHeader}>{title}</Text>
);

interface ComponentProps {
}

const SettingsScreen: React.FC<ComponentProps> = () => {

  let confirmModalCallback: MutableRefObject<((isConfirmed: boolean) => void) | undefined> =
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

  let authenticationStatus = getAuthenticationStateAsMessage();

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
        <Setting name={"Songs scale"} sKey={"songScale"}
                 onPress={(setValue) => getFontScale().then((it: number) => setValue(it))}
                 valueRender={(it) => Math.round(it * 100) + " %"} />

        <Header title={"Backend"} />
        <Setting name={"Use authentication with backend"} sKey={"useAuthentication"}
                 onPress={(setValue) => setValue(!Settings.useAuthentication)} />
        <Setting name={"Authentication status with backend"} value={authenticationStatus}
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
  container: {
  },

  settingHeader: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
    color: "#999"
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
