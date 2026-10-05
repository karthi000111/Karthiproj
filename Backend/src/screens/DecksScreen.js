import React, {useMemo, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {createDeck as createDeckRequest} from '../services/flashcardApi';
import {addDeck, selectDeck} from '../store/slices/flashcardSlice';

export default function DecksScreen({activeScreen, goToScreen}) {
  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const decks = useSelector(state => state.flashcards.decks);
  const cards = useSelector(state => state.flashcards.items);
  const selectedDeckId = useSelector(state => state.flashcards.selectedDeckId);
  const cardCounts = useMemo(
    () => cards.reduce((counts, card) => ({...counts, [card.deckId || 'starter']: (counts[card.deckId || 'starter'] || 0) + 1}), {}),
    [cards],
  );

  const createDeck = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Name your set', 'Please give this study set a title.');
      return;
    }
    try {
      const deck = await createDeckRequest({
        title: trimmedTitle,
        description: description.trim() || 'A saved study set.',
      });
      dispatch(addDeck(deck));
      dispatch(selectDeck(deck.id));
      setTitle('');
      setDescription('');
      setIsCreating(false);
    } catch (error) {
      Alert.alert('Set not saved', error.message || 'Unable to save this set right now.');
    }
  };

  const openDeck = deck => {
    dispatch(selectDeck(deck.id));
    if (cardCounts[deck.id]) goToScreen('learn');
    else goToScreen('create');
  };

  return (
    <ScreenBackground>
      <View style={styles.page}>
        <Text style={styles.eyebrow}>YOUR LIBRARY</Text>
        <Text style={styles.title}>Study sets</Text>
        <Text style={styles.subtitle}>Your custom sets are saved to your account.</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(!isCreating)}>
          <Text style={styles.createButtonText}>{isCreating ? 'Cancel' : '+ Create study set'}</Text>
        </TouchableOpacity>
        {isCreating && <View style={styles.form}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Set title (for example, Biology Unit 1)" placeholderTextColor="#98A2B3" style={styles.input} />
          <TextInput value={description} onChangeText={setDescription} placeholder="Optional description" placeholderTextColor="#98A2B3" style={styles.input} />
          <TouchableOpacity style={styles.saveButton} onPress={createDeck}><Text style={styles.saveButtonText}>Save set</Text></TouchableOpacity>
        </View>}
        <FlatList
          data={decks}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => {
            const count = cardCounts[item.id] || 0;
            const selected = item.id === selectedDeckId;
            return <TouchableOpacity style={[styles.deck, selected && styles.selectedDeck]} onPress={() => openDeck(item)}>
              <View style={styles.deckText}><Text style={styles.deckTitle}>{item.title}</Text><Text style={styles.description}>{item.description}</Text></View>
              <View style={styles.count}><Text style={styles.countNumber}>{count}</Text><Text style={styles.countLabel}>{count === 1 ? 'CARD' : 'CARDS'}</Text></View>
              <Text style={styles.action}>{count ? 'Learn' : 'Add cards'}</Text>
            </TouchableOpacity>;
          }}
        />
      </View>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, padding: 20},
  eyebrow: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.3, marginTop: 12},
  title: {color: '#172B4D', fontSize: 30, fontWeight: 'bold', marginTop: 7},
  subtitle: {color: '#667085', fontSize: 15, marginTop: 5},
  createButton: {alignSelf: 'flex-start', backgroundColor: '#5F42E8', borderRadius: 12, marginTop: 18, paddingHorizontal: 16, paddingVertical: 12},
  createButtonText: {color: 'white', fontWeight: 'bold'},
  form: {backgroundColor: '#FFFFFFE8', borderRadius: 16, marginTop: 14, padding: 14},
  input: {backgroundColor: '#F7F7FB', borderColor: '#E4E1F6', borderRadius: 10, borderWidth: 1, color: '#172B4D', marginBottom: 10, padding: 12},
  saveButton: {alignItems: 'center', backgroundColor: '#22BFA3', borderRadius: 10, padding: 12},
  saveButtonText: {color: 'white', fontWeight: 'bold'},
  list: {paddingBottom: 18, paddingTop: 16},
  deck: {alignItems: 'center', backgroundColor: '#FFFFFFE8', borderColor: 'transparent', borderRadius: 18, elevation: 3, flexDirection: 'row', marginBottom: 12, padding: 16},
  selectedDeck: {borderColor: '#5F42E8', borderWidth: 2},
  deckText: {flex: 1}, deckTitle: {color: '#172B4D', fontSize: 17, fontWeight: 'bold'},
  description: {color: '#667085', fontSize: 13, marginTop: 4},
  count: {alignItems: 'center', marginHorizontal: 12}, countNumber: {color: '#5F42E8', fontSize: 20, fontWeight: 'bold'}, countLabel: {color: '#667085', fontSize: 9, fontWeight: 'bold'},
  action: {color: '#5F42E8', fontSize: 13, fontWeight: 'bold'},
});
