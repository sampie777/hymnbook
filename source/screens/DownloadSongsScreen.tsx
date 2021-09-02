import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import { api, throwErrorsIfNotOk } from "../api";
import { SongBundle } from "../models/SongBundle";
import Db from "../db";
import { Song, SongBundle as LocalSongBundle } from "../models/Song";
import DisposableMessage from "../components/DisposableMessage";
import ConfirmationModal from "../components/ConfirmationModal";
import Icon from "react-native-vector-icons/FontAwesome5";

interface SongBundleItemComponentProps {
  bundle: SongBundle;
  onPress: (bundle: SongBundle) => void;
}

const SongBundleItem: React.FC<SongBundleItemComponentProps>
  = ({
       bundle,
       onPress
     }) => {
  return (
    <TouchableOpacity onPress={() => onPress(bundle)}
                      style={styles.songBundleItemContainer}>
      <Text style={styles.songBundleItemText}>
        {bundle.name}
      </Text>
      <Icon name={"cloud-download-alt"}
            size={styles.songBundleItemIcon.fontSize}
            color={styles.songBundleItemIconDownload.color} />
    </TouchableOpacity>
  );
};

interface LocalSongBundleItemComponentProps {
  bundle: LocalSongBundle;
  onPress: (bundle: LocalSongBundle) => void;
}

const LocalSongBundleItem: React.FC<LocalSongBundleItemComponentProps>
  = ({
       bundle,
       onPress
     }) => {
  return (
    <TouchableOpacity onPress={() => onPress(bundle)}
                      style={styles.songBundleItemContainer}>
      <Text style={styles.songBundleItemText}>
        {bundle.title}
      </Text>
      <Text style={styles.songBundleItemInfoText}>
        {bundle.songs.length} songs
      </Text>
      <Icon name={"check"}
            size={styles.songBundleItemIcon.fontSize}
            color={styles.songBundleItemIconLocal.color} />
    </TouchableOpacity>
  );
};

interface ComponentProps {
}

const DownloadSongsScreen: React.FC<ComponentProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [localBundles, setLocalBundles] = useState<Array<LocalSongBundle>>([]);
  const [progressResult, setProgressResult] = useState("");
  const [requestDownloadForBundle, setRequestDownloadForBundle] = useState<SongBundle | undefined>(undefined);
  const [requestDeleteForBundle, setRequestDeleteForBundle] = useState<LocalSongBundle | undefined>(undefined);
  const [requestDeleteAll, setRequestDeleteAll] = useState(false);

  useEffect(() => {
    onOpen();
    return onClose;
  }, []);

  const onOpen = () => {
    loadLocalSongBundles();
    fetchSongBundles();
  };

  const onClose = () => {
  };

  const loadLocalSongBundles = () => {
    if (!Db.isConnected()) {
      return;
    }
    setIsLoading(true);

    const bundles = Db.realm()
      .objects<LocalSongBundle>(LocalSongBundle.schema.name)
      .map(it => it as unknown as LocalSongBundle);
    setLocalBundles(bundles);

    setIsLoading(false);
  };

  const fetchSongBundles = () => {
    setIsLoading(true);
    api.songBundles.list()
      .then(throwErrorsIfNotOk)
      .then(response => response.json())
      .then(data => {
        if (data.status === "error") {
          throw new Error(data.data);
        }

        setBundles(data.content);
      })
      .catch(error => {
        console.error(`Error fetching song bundles`, error);
        Alert.alert("Error", `Error fetching song bundles: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSongBundlePress = (bundle: SongBundle) => {
    if (isLoading) {
      return;
    }

    setRequestDownloadForBundle(bundle);
  };

  const onLocalSongBundlePress = (bundle: LocalSongBundle) => {
    if (isLoading) {
      return;
    }

    setRequestDeleteForBundle(bundle);
  };

  const onDeleteAllPress = () => {
    if (isLoading) {
      return;
    }

    setRequestDeleteAll(true);
  };

  const onConfirmDownloadSongBundle = () => {
    const songBundle = requestDownloadForBundle;
    setRequestDownloadForBundle(undefined);

    if (isLoading || songBundle === undefined) {
      return;
    }

    downloadSongBundle(songBundle);
  };

  const downloadSongBundle = (bundle: SongBundle) => {
    console.log("Downloading song bundle: " + bundle.name);
    setIsLoading(true);

    api.songBundles.getWithSongs(bundle.id, true)
      .then(throwErrorsIfNotOk)
      .then(response => response.json())
      .then(data => {
        if (data.status === "error") {
          throw new Error(data.data);
        }

        saveSongBundle(data.content);
      })
      .catch(error => {
        console.error(`Error fetching songs for song bundle ${bundle.name}`, error);
        Alert.alert("Error", `Error fetching songs for song bundle ${bundle.name}: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const saveSongBundle = (bundle: SongBundle) => {
    if (!Db.isConnected()) {
      console.log("Database is not connected");
      return;
    }

    if (bundle.songs == null) {
      console.warn("Song bundle contains no songs");
      return;
    }

    setIsLoading(true);

    const existingBundle = Db.realm().objects(LocalSongBundle.schema.name).filtered(`title = "${bundle.name}"`);
    if (existingBundle.length > 0) {
      Alert.alert("Error", `Bundle ${bundle.name} already exists`);
      setIsLoading(false);
      return;
    }

    let songs = bundle.songs
      .map(song => {
        return new Song({
          title: song.name,
          content: song.verses
            ?.map(verse => verse.name + "\n" + verse.content)
            .join("\n\n") || ""
        });
      });

    const songBundle = new LocalSongBundle({
      title: bundle.name,
      songs: songs
    });

    console.log("Saving to database.");
    try {
      Db.realm().write(() => {
        Db.realm().create(LocalSongBundle.schema.name, songBundle);
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      Alert.alert("Error", `Failed to import songs: ${e}`);
      throw e;
    }

    console.log(`Created ${songs.length} songs`);
    setIsLoading(false);
    Alert.alert("Success", `${songs.length} songs added!`);
    loadLocalSongBundles();
  };

  const onConfirmDeleteSongBundle = () => {
    const bundle = requestDeleteForBundle;
    setRequestDeleteForBundle(undefined);

    if (isLoading || bundle === undefined) {
      return;
    }

    deleteSongBundle(bundle);
  };

  const deleteSongBundle = (bundle: LocalSongBundle) => {
    setIsLoading(true);

    const songCount = bundle.songs.length;
    const bundleTitle = bundle.title;

    Db.realm().write(() => {
      console.log("Deleting songs for song bundle: " + bundle.title);
      Db.realm().delete(bundle.songs);

      console.log("Deleting song bundle: " + bundle.title);
      Db.realm().delete(bundle);
    });

    setIsLoading(false);
    Alert.alert("Success", `Deleted all ${songCount} songs for ${bundleTitle}`);
    loadLocalSongBundles();
  };

  const isBundleLocal = (bundle: SongBundle) => {
    return localBundles.some(it => it.title == bundle.name);
  };

  const onConfirmDeleteAll = () => {
    setRequestDeleteAll(false);

    if (!Db.isConnected()) {
      console.log("Database is not connected");
      return;
    }
    setIsLoading(true);

    console.log("Deleting database");
    Db.deleteDb();

    setLocalBundles([]);
    Db.connect()
      .catch(e => {
        console.error("Could not connect to local database", e);
        Alert.alert("Success", "Could not connect to local database: " + e);
      });


    setIsLoading(false);
    Alert.alert("Success", "Deleted all songs");
    loadLocalSongBundles();
  };

  return (
    <View style={styles.container}>
      <ConfirmationModal isOpen={requestDownloadForBundle !== undefined}
                         onClose={() => setRequestDownloadForBundle(undefined)}
                         onConfirm={onConfirmDownloadSongBundle}>
        <Text>Download songs for {requestDownloadForBundle?.name}?</Text>
      </ConfirmationModal>

      <ConfirmationModal isOpen={requestDeleteForBundle !== undefined}
                         onClose={() => setRequestDeleteForBundle(undefined)}
                         onConfirm={onConfirmDeleteSongBundle}>
        <Text>Delete all songs for {requestDeleteForBundle?.title}?</Text>
      </ConfirmationModal>

      <ConfirmationModal isOpen={requestDeleteAll}
                         onClose={() => setRequestDeleteAll(false)}
                         onConfirm={onConfirmDeleteAll}>
        <Text>Delete ALL songs?</Text>
      </ConfirmationModal>

      <DisposableMessage message={progressResult}
                         onPress={() => setProgressResult("")}
                         maxDuration={5000} />

      <Text style={styles.informationText}>Select a bundle to download:</Text>
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl onRefresh={fetchSongBundles}
                                        refreshing={isLoading} />}>

        {localBundles.map((bundle: LocalSongBundle) =>
          <LocalSongBundleItem key={bundle.title}
                               bundle={bundle}
                               onPress={onLocalSongBundlePress} />)}

        {bundles.filter(it => !isBundleLocal(it))
          .map((bundle: SongBundle) =>
            <SongBundleItem key={bundle.name}
                            bundle={bundle}
                            onPress={onSongBundlePress} />)}

        {bundles.length > 0 ? null :
          <Text style={styles.emptyListText}>{isLoading ? "Loading..." : "No data loaded"}</Text>}
      </ScrollView>

      <TouchableHighlight style={styles.deleteAllButton}
                          onPress={onDeleteAllPress}>
        <Text style={styles.deleteAllButtonText}>Delete all</Text>
      </TouchableHighlight>
    </View>
  );
};

export default DownloadSongsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },

  informationText: {
    fontSize: 16,
    padding: 20
  },

  listContainer: {},

  songBundleItemContainer: {
    padding: 20,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  songBundleItemText: {
    fontSize: 18,
    flexGrow: 1
  },
  songBundleItemInfoText: {
    fontSize: 13,
    color: "#888",
    paddingRight: 20
  },
  songBundleItemIcon: {
    fontSize: 18
  },
  songBundleItemIconDownload: {
    color: "dodgerblue"
  },
  songBundleItemIconLocal: {
    color: "#0d0"
  },

  emptyListText: {
    padding: 20
  },

  deleteAllButton: {
    padding: 10,
    margin: 25,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#e00",
    borderColor: "#b00",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  deleteAllButtonText: {
    color: "#fff",
    fontSize: 16
  }
});
