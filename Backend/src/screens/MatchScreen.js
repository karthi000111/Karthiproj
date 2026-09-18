import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import CustomButton from '../components/CustomButton';
import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';

const shuffle = items => [...items].sort(() => Math.random() - 0.5);

export default function MatchScreen({activeScreen, goToScreen}) {
  const cards = useSelector(state => state.flashcards.items);
  const selectedDeckId = useSelector(state => state.flashcards.selectedDeckId);
  const deck = useSelector(state => state.flashcards.decks.find(item => item.id === selectedDeckId));
  const gameCards = useMemo(
    () => cards.filter(card => (card.deckId || 'starter') === selectedDeckId).slice(0, 8),
    [cards, selectedDeckId],
  );
  const [termOrder, setTermOrder] = useState([]);
  const [answerOrder, setAnswerOrder] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [message, setMessage] = useState('Pick a term, then its matching answer.');

  const resetGame = useCallback(() => {
    setTermOrder(shuffle(gameCards.map(card => card.id)));
    setAnswerOrder(shuffle(gameCards.map(card => card.id)));
    setSelectedTerm(null);
    setMatchedIds([]);
    setMessage('Pick a term, then its matching answer.');
  }, [gameCards]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const chooseTerm = id => {
    if (matchedIds.includes(id)) return;
    setSelectedTerm(id);
    setMessage('Now choose the matching answer.');
  };

  const chooseAnswer = id => {
    if (matchedIds.includes(id) || !selectedTerm) return;
    if (id === selectedTerm) {
      const nextMatches = [...matchedIds, id];
      setMatchedIds(nextMatches);
      setSelectedTerm(null);
      setMessage(nextMatches.length === gameCards.length ? 'Perfect! You matched every card.' : 'Correct match! Keep going.');
    } else {
      setSelectedTerm(null);
      setMessage('Not quite—try another pair.');
    }
  };

  if (!gameCards.length) {
    return <ScreenBackground><View style={styles.emptyState}><Text style={styles.title}>This set is empty</Text><Text style={styles.subtitle}>Add cards before playing Match.</Text><CustomButton title="Add Flashcard" onPress={() => goToScreen('create')} /></View><NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} /></ScreenBackground>;
  }

  const complete = matchedIds.length === gameCards.length;
  return (
    <ScreenBackground>
      <View style={styles.page}>
        <Text style={styles.eyebrow}>MATCH MODE</Text>
        <Text style={styles.title}>{deck?.title || 'Study set'}</Text>
        <Text style={styles.subtitle}>{matchedIds.length} of {gameCards.length} pairs matched</Text>
        <Text style={[styles.message, complete && styles.success]}>{message}</Text>
        <View style={styles.board}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>TERMS</Text>
            {termOrder.map(id => {
              const card = gameCards.find(item => item.id === id);
              const matched = matchedIds.includes(id);
              return <TouchableOpacity key={id} disabled={matched} onPress={() => chooseTerm(id)} style={[styles.tile, selectedTerm === id && styles.selectedTile, matched && styles.matchedTile]}><Text numberOfLines={3} style={styles.tileText}>{matched ? 'Matched' : card.question}</Text></TouchableOpacity>;
            })}
          </View>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>ANSWERS</Text>
            {answerOrder.map(id => {
              const card = gameCards.find(item => item.id === id);
              const matched = matchedIds.includes(id);
              return <TouchableOpacity key={id} disabled={matched} onPress={() => chooseAnswer(id)} style={[styles.tile, matched && styles.matchedTile]}><Text numberOfLines={3} style={styles.tileText}>{matched ? 'Matched' : card.answer}</Text></TouchableOpacity>;
            })}
          </View>
        </View>
        {complete && <CustomButton title="Play Again" onPress={resetGame} />}
      </View>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, padding: 16}, emptyState: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28},
  eyebrow: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.3, marginTop: 8}, title: {color: '#172B4D', fontSize: 27, fontWeight: 'bold', marginTop: 6}, subtitle: {color: '#667085', marginTop: 5},
  message: {backgroundColor: '#F0EDFF', borderRadius: 12, color: '#4C3AA7', fontWeight: '600', marginTop: 15, padding: 12, textAlign: 'center'}, success: {backgroundColor: '#DDF8F2', color: '#137C6D'},
  board: {flex: 1, flexDirection: 'row', gap: 10, marginTop: 14}, column: {flex: 1}, columnTitle: {color: '#667085', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, textAlign: 'center'},
  tile: {backgroundColor: '#FFFFFFE8', borderColor: '#E4E1F6', borderRadius: 12, borderWidth: 1, elevation: 2, justifyContent: 'center', marginBottom: 9, minHeight: 68, padding: 9}, selectedTile: {backgroundColor: '#E8E1FF', borderColor: '#5F42E8', borderWidth: 2}, matchedTile: {backgroundColor: '#DDF8F2', borderColor: '#22BFA3'}, tileText: {color: '#172B4D', fontSize: 13, fontWeight: '600', textAlign: 'center'},
});
