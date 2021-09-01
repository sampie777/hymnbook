import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Db from "../db";
import { Song } from "../models/Song";
import { routes } from "../navigation";

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

const NumberKey = ({ number, onPress }) => (
  <Key onPress={() => onPress(number)}>
    {number}
  </Key>
);

const SearchResultItem = ({ song, onPress }) => (
  <TouchableOpacity onPress={() => onPress(song)}>
    <Text style={styles.searchListItem}>{song.title}</Text>
  </TouchableOpacity>
);

export default function SearchScreen({ navigation }) {
  const [inputValue, setInputValue] = useState("");
  const [results, setSearchResult] = useState([]);

  const maxInputLength = 4;
  const maxResultsLength = 10;

  useEffect(() => {
    fetchSearchResults();
    return () => null;
  }, [inputValue]);

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

  const fetchSearchResults = () => {
    if (!Db.isConnected()) {
      return;
    }
    const query = inputValue;

    if (query.length === 0) {
      setSearchResult([]);
      return;
    }

    const results = Db.realm.objects(Song.schema.name)
      .sorted("title")
      .filtered(`title CONTAINS "${query}" LIMIT(${maxResultsLength})`);

    setSearchResult(results);
  };

  const onSearchResultItemPress = (song) =>
    navigation.navigate(routes.Song, { title: song.title });

  const renderSearchResultItem = ({ item }) => (
    <SearchResultItem song={item} onPress={onSearchResultItemPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.infoText}>Enter song number:</Text>
        <Text style={styles.inputTextField}>{inputValue}</Text>
      </View>

      <FlatList
        data={results}
        renderItem={renderSearchResultItem}
        contentContainerStyle={styles.searchList} />

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
          <Key onPress={onClearKeyPress}
               extraStyle={styles.specialKeyText}>Clear</Key>
          <NumberKey number={0} onPress={onNumberKeyPress} />
          <Key onPress={onDeleteKeyPress}
               extraStyle={styles.specialKeyText}>Del</Key>
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
    flexBasis: 200,
    flexGrow: 0,
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

  searchList: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 10,
  },
  searchListItem: {
    fontSize: 24,
    padding: 15,
    marginBottom: 1,
    backgroundColor: "#fcfcfc",
    borderColor: "#ddd",
    borderBottomWidth: 1,
  },

  keyPad: {
    flex: 1,
    flexBasis: 300,
    flexGrow: 0,
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