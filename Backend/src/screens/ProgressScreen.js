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

export default function ProgressScreen({activeScreen, goToScreen}) {
  const dispatch = useDispatch();
  const completed = useSelector(state => state.progress.completedIds.length);
  const completedIds = useSelector(state => state.progress.completedIds);
  const total = useSelector(state => state.flashcards.items.length);
  const activeDates = useSelector(state => state.progress.activeDates);
  const studyStreak = getCurrentStudyStreak(activeDates);
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const {theme} = useTheme();

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
