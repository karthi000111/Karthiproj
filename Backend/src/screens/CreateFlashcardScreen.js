import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CustomButton from '../components/CustomButton';
import ScreenBackground from '../components/ScreenBackground';
import {createFlashcard} from '../services/flashcardApi';
import {addFlashcard} from '../store/slices/flashcardSlice';

const difficulties = ['Easy', 'Medium', 'Hard'];

export default function CreateFlashcardScreen({goToHome, goToStudy}) {
  const dispatch = useDispatch();
  const decks = useSelector(state => state.flashcards.decks);
  const selectedDeckId = useSelector(state => state.flashcards.selectedDeckId);
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  const saveFlashcard = async () => {
    if (!subject.trim() || !question.trim() || !answer.trim()) {
      Alert.alert('Complete your flashcard', 'Please add a subject, question, and answer.');
      return;
    }

    try {
      const createdCard = await createFlashcard({
        subject: subject.trim(),
        question: question.trim(),
        answer: answer.trim(),
        difficulty,
      });

      dispatch(addFlashcard({
        ...createdCard,
        deckId: selectedDeckId,
      }));
      goToStudy();
    } catch (error) {
      Alert.alert('Save failed', error.message || 'Unable to create flashcard right now.');
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <TouchableOpacity onPress={goToHome}><Text style={styles.back}>← Back to Home</Text></TouchableOpacity>
        <Text style={styles.eyebrow}>BUILD YOUR DECK</Text>
        <Text style={styles.title}>Create a flashcard</Text>
        <Text style={styles.subtitle}>Adding to {decks.find(deck => deck.id === selectedDeckId)?.title || 'your study set'}.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>SUBJECT</Text>
          <TextInput value={subject} onChangeText={setSubject} placeholder="e.g. Java" placeholderTextColor="#98A2B3" style={styles.input} />
          <Text style={styles.label}>QUESTION</Text>
          <TextInput value={question} onChangeText={setQuestion} multiline placeholder="What do you want to remember?" placeholderTextColor="#98A2B3" style={[styles.input, styles.largeInput]} />
          <Text style={styles.label}>ANSWER</Text>
          <TextInput value={answer} onChangeText={setAnswer} multiline placeholder="Write a clear answer" placeholderTextColor="#98A2B3" style={[styles.input, styles.largeInput]} />
          <Text style={styles.label}>DIFFICULTY</Text>
          <View style={styles.difficulties}>{difficulties.map(item => <TouchableOpacity key={item} onPress={() => setDifficulty(item)} style={[styles.difficulty, difficulty === item && styles.activeDifficulty]}><Text style={[styles.difficultyText, difficulty === item && styles.activeDifficultyText]}>{item}</Text></TouchableOpacity>)}</View>
          <CustomButton title="Save Flashcard" onPress={saveFlashcard} />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 22}, back: {color: '#5F42E8', fontSize: 15, fontWeight: 'bold', marginTop: 18}, eyebrow: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.3, marginTop: 28}, title: {color: '#172B4D', fontSize: 30, fontWeight: 'bold', marginTop: 8}, subtitle: {color: '#667085', fontSize: 15, marginTop: 5},
  form: {backgroundColor: '#FFFFFFEE', borderRadius: 24, elevation: 8, marginTop: 24, padding: 20}, label: {color: '#475467', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 7, marginTop: 11}, input: {backgroundColor: '#F7F7FB', borderColor: '#E4E1F6', borderRadius: 12, borderWidth: 1, color: '#172B4D', fontSize: 16, padding: 13}, largeInput: {height: 72, textAlignVertical: 'top'}, difficulties: {flexDirection: 'row', justifyContent: 'space-between'}, difficulty: {borderColor: '#D0D5DD', borderRadius: 99, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 9}, activeDifficulty: {backgroundColor: '#5F42E8', borderColor: '#5F42E8'}, difficultyText: {color: '#667085', fontWeight: 'bold'}, activeDifficultyText: {color: 'white'},
});
