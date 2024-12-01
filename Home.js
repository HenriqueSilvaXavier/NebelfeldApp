import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Button,
  Slider
} from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [recording, setRecording] = useState(null);
  const [recordingFileURI, setRecordingFileURI] = useState(null);
  const [sound, setSound] = useState(null); // Objeto para reproduzir o áudio

  const navigation=useNavigation();

  useEffect(() => {
    const requestPermissions = async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      console.log('Permissão de microfone concedida:', granted);
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: true,
        });
      }
    };
    requestPermissions();
  }, []);

  const handleListening = async () => {
    if (!recording) {
      try {
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(newRecording);
      } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
      }
    } else {
      try {
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI();
        setRecordingFileURI(fileUri);
        console.log('Gravação salva em:', fileUri);
        setRecording(null);
      } catch (error) {
        console.error('Erro ao parar gravação:', error);
        Alert.alert('Erro', 'Não foi possível parar a gravação.');
      }
    }
  };

  const handleAudioPlay = async () => {
    if (recordingFileURI) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordingFileURI },
          { shouldPlay: true }
        );
        await newSound.setVolumeAsync(1.0); // Define o volume fixo (1.0 equivale a 100%)
        setSound(newSound);
        await newSound.playAsync();
      } catch (error) {
        console.error('Erro ao reproduzir áudio:', error);
      }
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Dicionário <Text style={styles.logo}>Nebelfeld</Text>
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputEMicrofone}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua palavra"
            value={pesquisa}
            onChangeText={setPesquisa}
            editable={!recording}
          />
          <TouchableOpacity onPress={handleListening} style={styles.microfone}>
            <View
              style={[
                styles.microphoneButton,
                recording && styles.microphoneActive,
              ]}
            >
              <Icon
                name="microphone"
                size={24}
                color={recording ? '#fff' : '#9400D3'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=> navigation.navigate('Palavra', { palavra: pesquisa })}>
          <View style={styles.pesquisarBtn}>
            <Text style={styles.pesquisarText}>Pesquisar</Text>
          </View>
        </TouchableOpacity>
      </View>

      {recordingFileURI && (
        <View>
          <Button title="Ouvir Áudio" onPress={handleAudioPlay} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', marginBottom: 16, marginTop: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  logo: { color: '#9400d3' },
  searchContainer: { marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 8, width: 260 },
  pesquisarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9400D3',
    padding: 10,
    borderRadius: 5,
  },
  pesquisarText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  microphoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  microphoneActive: {
    backgroundColor: '#9400D3',
    borderRadius: 25,
    alignItems: 'center',
  },
  inputEMicrofone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  volumeSlider: {
    width: '80%',
    alignSelf: 'center',
  },
});

export default Home;
