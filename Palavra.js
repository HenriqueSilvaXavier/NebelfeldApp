import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Palavra = ({ route }) => {
  const { palavra } = route.params;

  const [language, setLanguage] = useState('pt-br');
  const [definition, setDefinition] = useState('Aqui vai a definição da palavra.');
  const [synonyms, setSynonyms] = useState('Aqui vai a lista de sinônimos da palavra.');
  const [phrases, setPhrases] = useState('Aqui vão algumas frases contendo a palavra.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para pegar os dados da API
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.12:3000');
        const data = await response.json();

        // Encontrar a palavra na resposta
        const wordData = data.find((item) => item.name.toLowerCase() === palavra.toLowerCase());

        if (wordData) {
          setDefinition(`•${wordData.definition1}\n•${wordData.definition2}`);
          setSynonyms(wordData.synonyms);
          setPhrases(`•${wordData.phrase1}\n•${wordData.phrase2}`);
        } else {
          setDefinition('Palavra não encontrada.');
          setSynonyms('Sinônimos não disponíveis.');
          setPhrases('Frases não disponíveis.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [palavra]);

  const goBackToHome = () => {
    // Implementar lógica de navegação de volta para a tela inicial
    console.log('Voltar para a página inicial');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

    <Text style={styles.word}>{palavra}</Text>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Definições</Text>
        <Text>{definition}</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Sinônimos</Text>
        <Text>{synonyms}</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Frases</Text>
        <Text>{phrases}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    backgroundColor: 'rgb(121, 30, 206)',
    padding: 10,
    textAlign: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
  logo: {
    fontFamily: 'Montserrat',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  word: {
    fontSize: 20,
    color: 'rgb(121, 30, 206)',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  contentSection: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    color: 'rgb(121, 30, 206)',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Palavra;
