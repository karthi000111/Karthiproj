import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function FlashcardCard({
  question,
  subject,
  difficulty,
  answer,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.subject}>{subject}</Text>

      <Text style={styles.question}>
        {question}
      </Text>

      {answer && <Text style={styles.answer}>Answer: {answer}</Text>}

      <Text>
        Difficulty: {difficulty}
      </Text>

      <Text style={styles.favorite}>♡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },

  subject: {
    color: '#3498DB',
    fontWeight: 'bold',
  },

  question: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 15,
  },

  answer: {
    color: '#475467',
    lineHeight: 20,
    marginBottom: 12,
  },

  favorite: {
    fontSize: 25,
  },
});
