import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { getAll } from 'react-native-get-music-files';

const Home = () => {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {
    setupTrackPlayer();
    requestStoragePermission();
  }, []);

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
  
        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissão concedida');
          // Permissão concedida, agora podemos buscar as músicas
          fetchMusic();
        } else {
          console.log('Permissão negada');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchMusic = async () => {
    try {
      const musicFiles = await getAll({
        id: true,
        title: true,
        artist: true,
        duration: true,
        cover: false,
        genre: false,
        minimumSongDuration: 10000,
      });

      setMusicList(musicFiles);
      console.log(musicFiles);
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => playMusic(item)}>
      <View style={{ padding: 10 }}>
        <Text>{item.title}</Text>
        <Text>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  const playMusic = async (music) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: music.id,
        url: music.path, // Supondo que o caminho da música seja fornecido pela biblioteca react-native-get-music-files
        title: music.title,
        artist: music.artist,
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Erro ao reproduzir música:', error);
    }
  };

  const keyExtractor = (item, index) => index.toString();

  return (
    <View>
      <FlatList
        data={musicList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Home;
