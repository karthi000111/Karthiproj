import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function HomeScreen() {

  const [search, setSearch] = useState('');

  const subjects = [
    'Java',
    'Computer Networks',
    'Operating System',
  ];

  const flashcards = [
    {
      id: '1',
      question: 'What is inheritance?',
      subject: 'Java',
      difficulty: 'Easy',
    },
    {
      id: '2',
      question: 'What are the seven layers of the OSI model?',
      subject: 'Computer Networks',
      difficulty: 'Medium',
    },
    {
      id: '3',
      question: 'What is virtual memory?',
      subject: 'Operating System',
      difficulty: 'Easy',
    },
    {
      id: '4',
      question: 'What is encapsulation?',
      subject: 'Java',
      difficulty: 'Easy',
    },
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Note2Flash 📚
      </Text>

      <TextInput
        placeholder="Search flashcards..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <TouchableOpacity style={styles.upload}>
        <Text style={styles.uploadText}>
          + Upload Notes
        </Text>
      </TouchableOpacity>

      <View style={styles.progress}>
        <Text style={styles.progressTitle}>
          Study Progress
        </Text>

        <Text>
          65% Completed
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Subjects
      </Text>

      <View style={styles.subjectContainer}>

        {subjects.map(subject => (
          <View style={styles.subject} key={subject}>
            <Text>{subject}</Text>
          </View>
        ))}

      </View>

      <Text style={styles.sectionTitle}>
        Recent Flashcards
      </Text>

      <FlatList
        data={flashcards}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item}) => (

          <View style={styles.flashcard}>

            <Text style={styles.question}>
              {item.question}
            </Text>

            <Text>
              {item.subject}
            </Text>

            <Text style={styles.difficulty}>
              {item.difficulty}
            </Text>

            <Text>
              ♡
            </Text>

          </View>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f7fa',
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  search: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  upload: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  uploadText: {
    color: 'white',
    fontWeight: 'bold',
  },

  progress: {
    backgroundColor: '#dff3ff',
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  subject: {
    backgroundColor: 'white',
    padding: 12,
    margin: 5,
    borderRadius: 20,
    elevation: 2,
  },

  flashcard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    padding: 15,
    borderRadius: 15,
    elevation: 4,
    minHeight: 130,
  },

  question: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  difficulty: {
    marginTop: 8,
    color: '#3498db',
  },

});