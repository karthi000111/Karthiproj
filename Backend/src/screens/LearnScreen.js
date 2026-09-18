import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CustomButton from '../components/CustomButton';
import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {recordReview} from '../store/slices/flashcardSlice';

export default function LearnScreen({activeScreen, goToScreen}) {
  const dispatch = useDispatch();
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = useSelector(state => state.flashcards.items);
  const selectedDeckId = useSelector(state => state.flashcards.selectedDeckId);
  const progress = useSelector(state => state.flashcards.cardProgress);
  const deck = useSelector(state => state.flashcards.decks.find(item => item.id === selectedDeckId));
  const studyCards = useMemo(
    () => cards
      .filter(card => (card.deckId || 'starter') === selectedDeckId)
      .sort((first, second) => {
        const firstProgress = progress[first.id] || {level: 0, lastReviewed: 0};
        const secondProgress = progress[second.id] || {level: 0, lastReviewed: 0};
        return firstProgress.level - secondProgress.level || firstProgress.lastReviewed - secondProgress.lastReviewed;
      }),
    [cards, progress, selectedDeckId],
  );
  const card = studyCards[currentIndex % Math.max(studyCards.length, 1)];
  const level = card ? (progress[card.id]?.level || 0) : 0;

  const rateCard = rating => {
    dispatch(recordReview({id: card.id, rating}));
    setShowAnswer(false);
    setCurrentIndex(index => (index + 1) % studyCards.length);
  };

  if (!card) {
    return (
      <ScreenBackground>
        <View style={styles.emptyState}>
          <Text style={styles.title}>This set is empty</Text>
          <Text style={styles.subtitle}>Add a few cards, then come back to start learning.</Text>
          <CustomButton title="Add Flashcard" onPress={() => goToScreen('create')} />
        </View>
        <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.page}>
        <Text style={styles.eyebrow}>LEARN MODE</Text>
        <Text style={styles.title}>{deck?.title || 'Study set'}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.status}>{currentIndex + 1} of {studyCards.length}</Text>
          <Text style={styles.mastery}>Mastery {level}/5</Text>
        </View>
        <View style={[styles.card, showAnswer && styles.answerCard]}>
          <Text style={styles.sideLabel}>{showAnswer ? 'ANSWER' : 'TERM'}</Text>
          <Text style={styles.subject}>{card.subject}</Text>
          <Text style={styles.cardText}>{showAnswer ? card.answer : card.question}</Text>
        </View>
        {!showAnswer ? (
          <CustomButton title="Show Answer" onPress={() => setShowAnswer(true)} />
        ) : (
          <View style={styles.ratings}>
            <RatingButton label="Again" caption="Restart" color="#E85D75" onPress={() => rateCard('again')} />
            <RatingButton label="Hard" caption="Keep practicing" color="#F59E0B" onPress={() => rateCard('hard')} />
            <RatingButton label="Got it" caption="Build mastery" color="#22BFA3" onPress={() => rateCard('gotIt')} />
          </View>
        )}
        <Text style={styles.tip}>Cards with the lowest mastery are shown first and stay on this device.</Text>
        <TouchableOpacity onPress={() => goToScreen('match')} style={styles.matchLink}>
          <Text style={styles.matchLinkText}>Play Match with this set</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

function RatingButton({caption, color, label, onPress}) {
  return <TouchableOpacity onPress={onPress} style={[styles.ratingButton, {borderColor: color}]}>
    <Text style={[styles.ratingLabel, {color}]}>{label}</Text>
    <Text style={styles.ratingCaption}>{caption}</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: {flex: 1, padding: 20}, emptyState: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28},
  eyebrow: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.3, marginTop: 12},
  title: {color: '#172B4D', fontSize: 29, fontWeight: 'bold', marginTop: 7},
  subtitle: {color: '#667085', fontSize: 15, lineHeight: 22, marginBottom: 20, marginTop: 8, textAlign: 'center'},
  statusRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, marginTop: 13}, status: {color: '#667085', fontWeight: '600'}, mastery: {color: '#5F42E8', fontWeight: 'bold'},
  card: {alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#D8EBFA', borderRadius: 24, borderWidth: 1, elevation: 7, flex: 1, justifyContent: 'center', marginBottom: 20, padding: 28},
  answerCard: {backgroundColor: '#EAF6FF'}, sideLabel: {color: '#3498DB', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 14}, subject: {color: '#475467', fontSize: 16, fontWeight: '600', marginBottom: 18}, cardText: {color: '#172B4D', fontSize: 22, fontWeight: 'bold', lineHeight: 30, textAlign: 'center'},
  ratings: {flexDirection: 'row', justifyContent: 'space-between'}, ratingButton: {alignItems: 'center', backgroundColor: '#FFFFFFE8', borderRadius: 13, borderWidth: 2, paddingHorizontal: 7, paddingVertical: 13, width: '31%'}, ratingLabel: {fontSize: 15, fontWeight: 'bold'}, ratingCaption: {color: '#667085', fontSize: 10, marginTop: 4, textAlign: 'center'},
  tip: {color: '#667085', fontSize: 13, lineHeight: 19, marginTop: 18, textAlign: 'center'},
  matchLink: {alignItems: 'center', marginTop: 12, padding: 8}, matchLinkText: {color: '#5F42E8', fontWeight: 'bold'},
});
