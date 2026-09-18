import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useTheme} from '../contexts/ThemeContext';
import {useUser} from '../contexts/UserContext';

export default function ProfileScreen({activeScreen, goToScreen, goToWelcome}) {
  const {user} = useUser();
  const {isDark, theme, toggleTheme} = useTheme();
  const favourites = useSelector(state => state.flashcards.favouriteIds.length);
  const completed = useSelector(state => state.flashcards.completedIds.length);

  const displayName = user?.name || 'Learner';
  const displayEmail = user?.email || 'learner@note2flash.com';
  const displayCourse = user?.course || 'Computer Science';

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, {color: theme.text}]}>{displayName}</Text>
        <Text style={[styles.email, {color: isDark ? '#D0D5DD' : '#667085'}]}>
          {displayEmail}
        </Text>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>📚 {displayCourse.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your study snapshot</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>COMPLETED</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{favourites}</Text>
              <Text style={styles.statLabel}>FAVOURITES</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>DAY STREAK</Text>
            </View>
          </View>
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
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {alignItems: 'center', flex: 1},
  statValue: {color: '#5F42E8', fontSize: 25, fontWeight: 'bold'},
  statLabel: {color: '#667085', fontSize: 9, fontWeight: 'bold', marginTop: 5},
  divider: {backgroundColor: '#E4E7EC', height: 36, width: 1},
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
