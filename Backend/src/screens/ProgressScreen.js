import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ProgressCard from '../components/ProgressCard';
import CustomButton from '../components/CustomButton';
import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useTheme} from '../contexts/ThemeContext';
import {getCurrentStudyStreak, resetProgress} from '../store/slices/progressSlice';
import {saveStudyState} from '../services/flashcardApi';

export function getSubjectTopicProgress(cards, completedIds, decks) {
  const decksById = new Map(decks.map(deck => [String(deck.id), deck]));
  const completedIdSet = new Set(completedIds.map(String));
  const subjectProgress = new Map();

  cards.forEach(card => {
    const deckId = String(card.deckId || decks[0]?.id || 'default');
    const deck = decksById.get(deckId);
    let subject = subjectProgress.get(deckId);

    if (!subject) {
      subject = {
        id: deckId,
        title: deck?.title || deckId,
        completed: 0,
        total: 0,
        topics: new Map(),
      };
      subjectProgress.set(deckId, subject);
    }

    const topicTitle = card.subject || 'General';
    let topic = subject.topics.get(topicTitle);
    if (!topic) {
      topic = {title: topicTitle, completed: 0, total: 0};
      subject.topics.set(topicTitle, topic);
    }

    const isCompleted = completedIdSet.has(String(card.id));
    subject.total += 1;
    topic.total += 1;
    if (isCompleted) {
      subject.completed += 1;
      topic.completed += 1;
    }
  });

  return [...subjectProgress.values()].map(subject => ({
    ...subject,
    percentage: Math.round((subject.completed / subject.total) * 100),
    topics: [...subject.topics.values()].map(topic => ({
      ...topic,
      percentage: Math.round((topic.completed / topic.total) * 100),
    })),
  }));
}

export default function ProgressScreen({activeScreen, goToScreen}) {
  const dispatch = useDispatch();
  const completed = useSelector(state => state.progress.completedIds.length);
  const completedIds = useSelector(state => state.progress.completedIds);
  const cards = useSelector(state => state.flashcards.items);
  const decks = useSelector(state => state.flashcards.decks);
  const total = cards.length;
  const activeDates = useSelector(state => state.progress.activeDates);
  const studyStreak = getCurrentStudyStreak(activeDates);
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const {theme} = useTheme();
  const subjectProgress = getSubjectTopicProgress(cards, completedIds, decks);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Study Progress',
      'Are you sure you want to clear your completed flashcards progress?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch(resetProgress());
            completedIds.forEach(id => {
              saveStudyState(id, {completed: false}).catch(() => {});
            });
            Alert.alert('Progress Reset', 'Your study completion has been reset.');
          },
        },
      ],
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>STUDY COMPLETION</Text>
            <Text style={styles.summaryValue}>{percentage}%</Text>
            <Text style={styles.summaryText}>{completed} of {total} flashcards mastered</Text>
          </View>

          <Text style={[styles.title, {color: theme.text}]}>
            Study Progress
          </Text>

          <ProgressCard
            title="Total Flashcards"
            value={String(total)}
          />

          <ProgressCard
            title="Completed Flashcards"
            value={String(completed)}
          />

          <ProgressCard
            title="🔥 Study Streak"
            value={`${studyStreak} Days`}
          />

          <Text style={[styles.progress, {color: theme.text}]}>
            Progress: {percentage}%
          </Text>

          <View style={styles.bar}>
            <View style={[styles.fill, {width: `${percentage}%`}]} />
          </View>

          <View style={styles.breakdownHeader}>
            <Text style={[styles.breakdownTitle, {color: theme.text}]}>Subject &amp; Topic Progress</Text>
            <Text style={styles.breakdownSubtitle}>See how you’re progressing in each study area.</Text>
          </View>

          {subjectProgress.length ? (
            subjectProgress.map(subject => (
              <View key={subject.id} style={[styles.subjectCard, {backgroundColor: theme.card}]}>
                <View style={styles.subjectHeader}>
                  <Text style={[styles.subjectTitle, {color: theme.text}]}>{subject.title}</Text>
                  <Text style={styles.subjectPercentage}>{subject.percentage}%</Text>
                </View>
                <Text style={styles.subjectCount}>
                  {subject.completed} of {subject.total} flashcards completed
                </Text>
                <View style={styles.subjectBar}>
                  <View style={[styles.subjectFill, {width: `${subject.percentage}%`}]} />
                </View>

                {subject.topics.map(topic => (
                  <View key={topic.title} style={styles.topicRow}>
                    <View style={styles.topicHeader}>
                      <Text style={[styles.topicTitle, {color: theme.text}]}>{topic.title}</Text>
                      <Text style={styles.topicCount}>
                        {topic.completed}/{topic.total} · {topic.percentage}%
                      </Text>
                    </View>
                    <View style={styles.topicBar}>
                      <View style={[styles.topicFill, {width: `${topic.percentage}%`}]} />
                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={[styles.emptyBreakdown, {color: theme.text}]}>
              Add flashcards to see progress by subject and topic.
            </Text>
          )}

          <View style={styles.actionButtons}>
            <CustomButton
              title="Start Revision"
              onPress={() => goToScreen('learn')}
            />

            {completed > 0 ? (
              <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
                <Text style={styles.resetButtonText}>🗑 Reset Progress</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderRadius: 24,
    elevation: 8,
    marginBottom: 18,
    padding: 21,
  },
  summaryLabel: {
    color: '#DED6FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  summaryValue: {
    color: 'white',
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summaryText: {
    color: '#F0EDFF',
    fontSize: 14,
  },

  progress: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },

  bar: {
    height: 15,
    backgroundColor: '#E4E7EC',
    borderRadius: 10,
    margin: 15,
    overflow: 'hidden',
  },

  fill: {
    height: 15,
    backgroundColor: '#5F42E8',
    borderRadius: 10,
  },

  breakdownHeader: {
    marginBottom: 14,
    marginTop: 12,
  },
  breakdownTitle: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  breakdownSubtitle: {
    color: '#667085',
    fontSize: 13,
    marginTop: 4,
  },
  subjectCard: {
    borderRadius: 18,
    elevation: 3,
    marginBottom: 14,
    padding: 18,
  },
  subjectHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 10,
  },
  subjectPercentage: {
    color: '#5F42E8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectCount: {
    color: '#667085',
    fontSize: 13,
    marginTop: 5,
  },
  subjectBar: {
    backgroundColor: '#E4E7EC',
    borderRadius: 5,
    height: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  subjectFill: {
    backgroundColor: '#5F42E8',
    borderRadius: 5,
    height: 8,
  },
  topicRow: {
    borderTopColor: '#EAECF0',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 13,
  },
  topicHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topicTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  topicCount: {
    color: '#667085',
    fontSize: 12,
  },
  topicBar: {
    backgroundColor: '#E4E7EC',
    borderRadius: 4,
    height: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  topicFill: {
    backgroundColor: '#21A67A',
    borderRadius: 4,
    height: 6,
  },
  emptyBreakdown: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },

  actionButtons: {
    marginTop: 10,
  },

  resetButton: {
    alignItems: 'center',
    backgroundColor: '#FEE4E2',
    borderColor: '#FDA29B',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    paddingVertical: 13,
  },

  resetButtonText: {
    color: '#B42318',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
