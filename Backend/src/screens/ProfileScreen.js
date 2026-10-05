import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {useSelector} from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useTheme} from '../contexts/ThemeContext';
import {useUser} from '../contexts/UserContext';
import {javaInterviewQuestions} from '../data/javaInterviewQuestions';
import {getCurrentStudyStreak} from '../store/slices/progressSlice';

export default function ProfileScreen({activeScreen, goToScreen, goToWelcome}) {
  const {user} = useUser();
  const {isDark, theme, toggleTheme} = useTheme();
  const allCards = useSelector(state => state.flashcards.items);
  const favouriteIds = useSelector(state => state.flashcards.favouriteIds);
  const completedIds = useSelector(state => state.flashcards.completedIds);
  const activeDates = useSelector(state => state.progress.activeDates);
  const favouriteCards = useMemo(
    () => allCards.filter(card => favouriteIds.includes(card.id)),
    [allCards, favouriteIds],
  );

  const displayName = user?.name || 'Learner';
  const displayEmail = user?.email || 'learner@note2flash.com';
  const displayCourse = user?.course || 'Computer Science';

  const javaCards = useMemo(
    () => allCards.filter(card => (card.deckId || 'starter') === 'java'),
    [allCards],
  );
  const javaCompleted = useMemo(
    () => javaCards.filter(card => completedIds.includes(String(card.id))).length,
    [completedIds, javaCards],
  );
  const javaProgress = javaCards.length ? Math.round((javaCompleted / javaCards.length) * 100) : 0;
  const totalCompleted = completedIds.length;
  const totalQuestions = allCards.length;
  const studyStreak = getCurrentStudyStreak(activeDates);

  const [rapidIndex, setRapidIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showRapidAnswer, setShowRapidAnswer] = useState(false);
  const [isRapidRunning, setIsRapidRunning] = useState(true);

  useEffect(() => {
    if (!isRapidRunning) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 1) {
          clearInterval(timer);
          setIsRapidRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRapidRunning, rapidIndex]);

  const currentRapidQuestion = javaInterviewQuestions[rapidIndex % javaInterviewQuestions.length];

  const handleNextRapidQuestion = () => {
    setRapidIndex(index => (index + 1) % javaInterviewQuestions.length);
    setShowRapidAnswer(false);
    setTimeLeft(20);
    setIsRapidRunning(true);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, {color: theme.text}]}>{displayName}</Text>
          <Text style={[styles.email, {color: isDark ? '#D0D5DD' : '#667085'}]}>{displayEmail}</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>📚 {displayCourse.toUpperCase()}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subject progress</Text>
            <View style={styles.subjectRingRow}>
              <ProgressRing
                label="Java"
                progress={javaProgress}
                value={`${javaCompleted}/${javaCards.length}`}
                color="#5F42E8"
              />
              <View style={styles.overallStatBox}>
                <Text style={styles.overallStatTitle}>Overall</Text>
                <Text style={styles.overallStatNumber}>{totalCompleted}</Text>
                <Text style={styles.overallStatMeta}>of {totalQuestions} questions</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rapid Fire — Java</Text>
            <View style={styles.timerRow}>
              <Text style={styles.timerLabel}>Time left</Text>
              <Text style={[styles.timerValue, timeLeft <= 5 && styles.timerDanger]}>{timeLeft}s</Text>
            </View>
            <Text style={styles.rapidQuestion}>{currentRapidQuestion.question}</Text>
            <Text style={styles.rapidScenario}>{currentRapidQuestion.scenario}</Text>
            {showRapidAnswer ? (
              <View style={styles.answerPanel}>
                <Text style={styles.answerTitle}>Expected answer</Text>
                <Text style={styles.answerText}>{currentRapidQuestion.expectedAnswer}</Text>
              </View>
            ) : null}
            <View style={styles.rapidActions}>
              <TouchableOpacity onPress={() => setShowRapidAnswer(true)} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Reveal Answer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextRapidQuestion} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your study snapshot</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalCompleted}</Text>
                <Text style={styles.statLabel}>COMPLETED</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{favouriteCards.length}</Text>
                <Text style={styles.statLabel}>FAVOURITES</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{studyStreak}</Text>
                <Text style={styles.statLabel}>DAY STREAK</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your favourites</Text>
            {favouriteCards.length === 0 ? (
              <Text style={styles.emptyText}>No favourite cards yet. Tap the star on a flashcard to save it here.</Text>
            ) : (
              <FlatList
                data={favouriteCards}
                keyExtractor={item => String(item.id)}
                scrollEnabled={false}
                contentContainerStyle={styles.favoriteList}
                renderItem={({item}) => (
                  <View style={styles.favoriteItem}>
                    <Text style={styles.favoriteSubject}>{item.subject}</Text>
                    <Text style={styles.favoriteQuestion}>{item.question}</Text>
                  </View>
                )}
              />
            )}
          </View>

          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Text style={styles.themeButtonText}>
              {isDark ? '☀️ Switch to Light Theme' : '🌙 Switch to Dark Theme'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={goToWelcome}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

function ProgressRing({color, label, progress, value}) {
  const size = 92;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.ringWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringPercent}>{progress}%</Text>
        <Text style={styles.ringValue}>{value}</Text>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {paddingBottom: 30},
  container: {alignItems: 'center', flex: 1, padding: 24},
  avatar: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderColor: '#CFC4FF',
    borderRadius: 50,
    borderWidth: 5,
    elevation: 9,
    height: 100,
    justifyContent: 'center',
    marginTop: 28,
    width: 100,
  },
  avatarText: {color: 'white', fontSize: 40, fontWeight: 'bold'},
  name: {fontSize: 27, fontWeight: 'bold', marginTop: 15},
  email: {fontSize: 15, marginTop: 4},
  levelPill: {
    backgroundColor: '#E8E1FF',
    borderRadius: 99,
    marginTop: 13,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  levelText: {
    color: '#5F42E8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 22,
    elevation: 7,
    marginTop: 24,
    padding: 20,
    width: '100%',
  },
  cardTitle: {
    color: '#344054',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subjectRingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ringWrap: {alignItems: 'center', justifyContent: 'center'},
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ringPercent: {color: '#172B4D', fontSize: 15, fontWeight: 'bold'},
  ringValue: {color: '#667085', fontSize: 10, marginTop: 2},
  ringLabel: {color: '#5F42E8', fontSize: 12, fontWeight: '700', marginTop: 8},
  overallStatBox: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    flex: 1,
    paddingVertical: 18,
  },
  overallStatTitle: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', marginBottom: 8},
  overallStatNumber: {color: '#172B4D', fontSize: 28, fontWeight: 'bold'},
  overallStatMeta: {color: '#667085', fontSize: 11, marginTop: 4},
  timerRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},
  timerLabel: {color: '#475467', fontSize: 12, fontWeight: '700'},
  timerValue: {color: '#5F42E8', fontSize: 22, fontWeight: 'bold'},
  timerDanger: {color: '#D92D20'},
  rapidQuestion: {color: '#172B4D', fontSize: 18, fontWeight: '700', lineHeight: 26},
  rapidScenario: {color: '#475467', fontSize: 13, lineHeight: 20, marginTop: 10},
  answerPanel: {
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    marginTop: 14,
    padding: 12,
  },
  answerTitle: {color: '#5F42E8', fontSize: 12, fontWeight: 'bold', marginBottom: 6},
  answerText: {color: '#172B4D', fontSize: 13, lineHeight: 20},
  rapidActions: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
  },
  primaryButtonText: {color: '#FFFFFF', fontSize: 14, fontWeight: 'bold'},
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#EDE9FF',
    borderRadius: 12,
    flex: 0.4,
    paddingVertical: 12,
  },
  secondaryButtonText: {color: '#5F42E8', fontSize: 14, fontWeight: 'bold'},
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {alignItems: 'center', flex: 1},
  statValue: {color: '#5F42E8', fontSize: 25, fontWeight: 'bold'},
  statLabel: {color: '#667085', fontSize: 9, fontWeight: 'bold', marginTop: 5},
  divider: {backgroundColor: '#E4E7EC', height: 36, width: 1},
  favoriteList: {paddingBottom: 4},
  favoriteItem: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
  },
  favoriteSubject: {
    color: '#5F42E8',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  favoriteQuestion: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
  },
  themeButton: {
    backgroundColor: '#FFFFFFD9',
    borderColor: '#CFC4FF',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    padding: 15,
    width: '100%',
  },
  themeButtonText: {
    color: '#5F42E8',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {marginTop: 14, padding: 12},
  logoutText: {color: '#D92D20', fontSize: 15, fontWeight: 'bold'},
});
