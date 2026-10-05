import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, Easing, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CustomButton from '../components/CustomButton';
import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useFlashcardStudy} from '../contexts/FlashcardContext';
import {useTheme} from '../contexts/ThemeContext';
import {deleteFlashcard, saveStudyState} from '../services/flashcardApi';
import {markCompleted, removeFlashcard, toggleFavourite} from '../store/slices/flashcardSlice';
import {recordCompletion} from '../store/slices/progressSlice';

export default function FlashcardScreen({activeScreen, goToScreen}) {
  const dispatch = useDispatch();
  const selectedDeckId = useSelector(state => state.flashcards.selectedDeckId);
  const allFlashcards = useSelector(state => state.flashcards.items);
  const flashcards = allFlashcards.filter(card => (card.deckId || 'starter') === selectedDeckId);
  const favouriteIds = useSelector(state => state.flashcards.favouriteIds);
  const completedIds = useSelector(state => state.flashcards.completedIds);
  const cardProgress = useSelector(state => state.flashcards.cardProgress);
  const {changeQuestion, currentQuestion, setCurrentQuestion, setShowAnswer, showAnswer} = useFlashcardStudy();
  const {theme} = useTheme();
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);
  const card = flashcards[currentQuestion];

  useEffect(() => {
    setCurrentQuestion(0);
    setShowAnswer(false);
  }, [selectedDeckId, setCurrentQuestion, setShowAnswer]);

  if (!card) {
    return (
      <ScreenBackground>
        <View style={styles.emptyState}>
          <Text style={[styles.title, {color: theme.text}]}>This set is empty</Text>
          <Text style={styles.counter}>Add a card to start studying this set.</Text>
          <CustomButton title="Add Flashcard" onPress={() => goToScreen('create')} />
        </View>
        <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
      </ScreenBackground>
    );
  }

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: showAnswer ? 0 : 1,
      duration: 450,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowAnswer(!showAnswer));
  };

  const moveQuestion = direction => {
    if (currentQuestion + direction < 0 || currentQuestion + direction >= flashcards.length) return;
    flipAnimation.setValue(0);
    changeQuestion(direction, flashcards.length);
  };

  const questionRotation = flipAnimation.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']});
  const answerRotation = flipAnimation.interpolate({inputRange: [0, 1], outputRange: ['180deg', '360deg']});
  const isFavourite = favouriteIds.includes(card.id);
  const isCompleted = completedIds.includes(card.id);

  const handleDeleteCard = async () => {
    try {
      setIsDeleting(true);
      await deleteFlashcard(card.id);
      dispatch(removeFlashcard(card.id));
      if (currentQuestion >= flashcards.length - 1) {
        setCurrentQuestion(Math.max(0, flashcards.length - 2));
      }
      Alert.alert('Deleted', 'The flashcard was removed from the deck.');
    } catch (error) {
      Alert.alert('Delete failed', error.message || 'Unable to delete flashcard right now.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleCardFavourite = () => {
    const favourite = !isFavourite;
    dispatch(toggleFavourite(card.id));
    const previous = cardProgress[card.id] || {};
    saveStudyState(card.id, {
      level: previous.level || 0,
      reviews: previous.reviews || 0,
      lastReviewed: previous.lastReviewed || 0,
      completed: isCompleted,
      favourite,
    }).catch(error => Alert.alert('Sync failed', error.message));
  };

  const completeCard = () => {
    dispatch(markCompleted(card.id));
    dispatch(recordCompletion(card.id));
    const previous = cardProgress[card.id] || {};
    saveStudyState(card.id, {
      level: previous.level || 0,
      reviews: previous.reviews || 0,
      lastReviewed: previous.lastReviewed || 0,
      completed: true,
      favourite: isFavourite,
      lastReviewed: Date.now(),
    }).catch(error => Alert.alert('Sync failed', error.message));
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>FOCUSED STUDY</Text>
            <Text style={[styles.title, {color: theme.text}]}>Flashcards</Text>
            <Text style={styles.subtitle}>Build recall, one concept at a time.</Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterNumber}>{currentQuestion + 1}</Text>
            <Text style={styles.counterTotal}>/{flashcards.length}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${((currentQuestion + 1) / flashcards.length) * 100}%`}]} />
        </View>
        <View style={styles.cardArea}>
          <Animated.View pointerEvents={showAnswer ? 'none' : 'auto'} style={[styles.card, styles.questionCard, {transform: [{rotateY: questionRotation}]}]}>
            <View style={styles.cardTopRow}><Text style={styles.sideLabel}>QUESTION</Text><Text style={styles.cardIndex}>01</Text></View>
            <View style={styles.subjectPill}><Text style={styles.subject}>{card.subject}</Text></View>
            <Text style={styles.cardText}>{card.question}</Text>
            <Text style={styles.hint}>Reveal the answer when you are ready</Text>
          </Animated.View>
          <Animated.View pointerEvents={showAnswer ? 'auto' : 'none'} style={[styles.card, styles.answerCard, {transform: [{rotateY: answerRotation}]}]}>
            <View style={styles.cardTopRow}><Text style={styles.sideLabel}>ANSWER</Text><Text style={styles.cardIndex}>02</Text></View>
            <View style={styles.subjectPill}><Text style={styles.subject}>{card.subject}</Text></View>
            <Text style={styles.cardText}>{card.answer}</Text>
            <Text style={styles.hint}>Difficulty: {card.difficulty}</Text>
          </Animated.View>
        </View>
        <CustomButton title={showAnswer ? 'Show Question' : 'Show Answer'} onPress={flipCard} />
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={toggleCardFavourite} style={[styles.secondaryAction, isFavourite && styles.activeSecondaryAction]}>
            <Text style={[styles.secondaryActionIcon, isFavourite && styles.activeActionText]}>{isFavourite ? '★' : '☆'}</Text>
            <Text style={[styles.secondaryActionText, isFavourite && styles.activeActionText]}>Favourite</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={completeCard} style={[styles.secondaryAction, isCompleted && styles.activeSecondaryAction]}>
            <Text style={[styles.secondaryActionIcon, isCompleted && styles.activeActionText]}>{isCompleted ? '✓' : '○'}</Text>
            <Text style={[styles.secondaryActionText, isCompleted && styles.activeActionText]}>{isCompleted ? 'Completed' : 'Mark complete'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity disabled={currentQuestion === 0} onPress={() => moveQuestion(-1)} style={[styles.controlButton, currentQuestion === 0 && styles.disabledButton]}><Text style={styles.arrow}>‹</Text><Text style={styles.controlText}>Previous</Text></TouchableOpacity>
          <TouchableOpacity disabled={currentQuestion === flashcards.length - 1} onPress={() => moveQuestion(1)} style={[styles.controlButton, currentQuestion === flashcards.length - 1 && styles.disabledButton]}><Text style={styles.controlText}>Next</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleDeleteCard} disabled={!card.persisted || isDeleting} style={[styles.deleteButton, (!card.persisted || isDeleting) && styles.deleteButtonDisabled]}>
          <Text style={styles.deleteButtonText}>{isDeleting ? 'Deleting...' : card.persisted ? 'Delete Card' : 'Built-in Card'}</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1}, container: {alignItems: 'center', flex: 1, padding: 20},
  emptyState: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24},
  headerRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}, eyebrow: {color: '#5F42E8', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.6}, title: {fontSize: 30, fontWeight: '800', marginTop: 5}, subtitle: {color: '#667085', fontSize: 14, marginTop: 5},
  counterBadge: {alignItems: 'baseline', backgroundColor: '#FFFFFF', borderColor: '#E4E1F6', borderRadius: 16, borderWidth: 1, flexDirection: 'row', paddingHorizontal: 13, paddingVertical: 10}, counterNumber: {color: '#5F42E8', fontSize: 22, fontWeight: '800'}, counterTotal: {color: '#98A2B3', fontSize: 14, fontWeight: '600'}, progressTrack: {backgroundColor: '#DDE3F2', borderRadius: 5, height: 7, marginBottom: 18, marginTop: 18, overflow: 'hidden', width: '100%'}, progressFill: {backgroundColor: '#5F42E8', borderRadius: 5, height: '100%'},
  cardArea: {height: 290, marginBottom: 12, width: '100%'}, card: {alignItems: 'center', backfaceVisibility: 'hidden', borderRadius: 24, elevation: 7, justifyContent: 'center', minHeight: 290, padding: 28, position: 'absolute', width: '100%'},
  questionCard: {backgroundColor: '#FFFFFF', borderColor: '#E4E1F6', borderWidth: 1}, answerCard: {backgroundColor: '#EDE9FF'}, cardTopRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 22, width: '100%'}, sideLabel: {color: '#5F42E8', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.6}, cardIndex: {color: '#98A2B3', fontSize: 12, fontWeight: 'bold'}, subjectPill: {backgroundColor: '#F1EEFF', borderRadius: 20, marginBottom: 18, paddingHorizontal: 13, paddingVertical: 7}, subject: {color: '#5F42E8', fontSize: 13, fontWeight: '700'},
  cardText: {color: '#172B4D', fontSize: 21, fontWeight: '800', lineHeight: 29, textAlign: 'center'}, hint: {color: '#667085', fontSize: 13, marginTop: 20, textAlign: 'center'},
  actionRow: {flexDirection: 'row', gap: 10, marginBottom: 12, width: '100%'}, secondaryAction: {alignItems: 'center', backgroundColor: '#FFFFFFCC', borderColor: '#E4E1F6', borderRadius: 13, borderWidth: 1, flex: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 48, paddingHorizontal: 8}, activeSecondaryAction: {backgroundColor: '#EDE9FF', borderColor: '#5F42E8'}, secondaryActionIcon: {color: '#667085', fontSize: 20, marginRight: 7}, secondaryActionText: {color: '#475467', fontSize: 12, fontWeight: '700'}, activeActionText: {color: '#5F42E8'},
  controls: {flexDirection: 'row', justifyContent: 'space-between', width: '100%'}, controlButton: {alignItems: 'center', backgroundColor: '#FFFFFFCC', borderColor: '#D8D2F5', borderRadius: 13, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 48, paddingHorizontal: 16, width: '47%'}, disabledButton: {borderColor: '#D0D5DD', opacity: 0.45}, controlText: {color: '#5F42E8', fontSize: 14, fontWeight: '800'}, arrow: {color: '#5F42E8', fontSize: 26, lineHeight: 22, marginHorizontal: 5}, deleteButton: {alignItems: 'center', backgroundColor: '#FDE8E8', borderColor: '#F7B7B7', borderRadius: 12, borderWidth: 1, marginTop: 12, paddingVertical: 12, width: '100%'}, deleteButtonDisabled: {opacity: 0.7}, deleteButtonText: {color: '#B42318', fontSize: 14, fontWeight: '800'},
});
