import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Key = ({ children, onPress, extraStyle }) => {
  const keyTextStyle = [styles.keyText];
  if (extraStyle !== undefined && extraStyle !== null) {
    keyTextStyle.push(extraStyle);
  }
  return (
    <TouchableOpacity style={styles.key}
                        onPress={onPress}>
      <Text style={keyTextStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const NumberKey = ({ number, onPress }) => {
  return (
    <Key onPress={() => onPress(number)}>
      {number}
    </Key>
  );
};

export default function SearchScreen({}) {
  const [inputValue, setInputValue] = useState("");
  const maxInputLength = 4;

  const onNumberKeyPress = (number) => {
    if (inputValue.length >= maxInputLength) {
      return;
    }

    setInputValue(inputValue + number);
  };

  const onDeleteKeyPress = () => {
    if (inputValue.length <= 1) {
      setInputValue("");
      return;
    }

    setInputValue(inputValue.substring(0, inputValue.length - 1));
  };

  const onClearKeyPress = () => {
    setInputValue("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.infoText}>Enter song number:</Text>
        <Text style={styles.inputTextField}>{inputValue}</Text>
      </View>

      <View style={styles.keyPad}>
        <View style={styles.keyPadRow}>
          <NumberKey number={1} onPress={onNumberKeyPress} />
          <NumberKey number={2} onPress={onNumberKeyPress} />
          <NumberKey number={3} onPress={onNumberKeyPress} />
        </View>
        <View style={styles.keyPadRow}>
          <NumberKey number={4} onPress={onNumberKeyPress} />
          <NumberKey number={5} onPress={onNumberKeyPress} />
          <NumberKey number={6} onPress={onNumberKeyPress} />
        </View>
        <View style={styles.keyPadRow}>
          <NumberKey number={7} onPress={onNumberKeyPress} />
          <NumberKey number={8} onPress={onNumberKeyPress} />
          <NumberKey number={9} onPress={onNumberKeyPress} />
        </View>
        <View style={styles.keyPadRow}>
          <Key onPress={onClearKeyPress} extraStyle={styles.specialKeyText}>Clear</Key>
          <NumberKey number={0} onPress={onNumberKeyPress} />
          <Key onPress={onDeleteKeyPress} extraStyle={styles.specialKeyText}>Del</Key>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },

  inputContainer: {
    flex: 1,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#888",
    paddingTop: 20,
    fontFamily: "sans-serif-light",
  },
  inputTextField: {
    fontSize: 100,
    fontFamily: "sans-serif-light",
    color: "#555",
  },

  keyPad: {
    flex: 1,
  },
  keyPadRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
  },
  key: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderWidth: 1,
  },
  keyText: {
    fontSize: 40,
    fontFamily: "sans-serif-thin",
    color: "#555",
  },
  specialKeyText: {
    fontSize: 20,
    fontFamily: "sans-serif-light",
  },
});
