import React from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import ProgressCard from '../components/ProgressCard';
import CustomButton from '../components/CustomButton';
import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useTheme} from '../contexts/ThemeContext';

export default function ProgressScreen({activeScreen, goToScreen}) {
  const completed = useSelector(state => state.progress.completedIds.length);
  const total = useSelector(state => state.flashcards.items.length);
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const {theme} = useTheme();
  return (
    <ScreenBackground>
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
        value="7 Days"
      />

      <Text style={[styles.progress, {color: theme.text}]}>
        Progress: {percentage}%
      </Text>

      <View style={styles.bar}>
        <View style={[styles.fill, {width: `${percentage}%`}]} />
      </View>

      <CustomButton
        title="Start Revision"
        onPress={() => {}}
      />

      </View>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    backgroundColor: '#ddd',
    borderRadius: 10,
    margin: 15,
  },

  fill: {
    width: '70%',
    height: 15,
    backgroundColor: '#3498DB',
    borderRadius: 10,
  },
});
