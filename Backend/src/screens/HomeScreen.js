import React, {useMemo, useState} from 'react';

import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationBar from '../components/NavigationBar';
import ScreenBackground from '../components/ScreenBackground';
import {useTheme} from '../contexts/ThemeContext';
import {useUser} from '../contexts/UserContext';
import useFlashcardsApi from '../hooks/useFlashcardsApi';

export default function HomeScreen({activeScreen, goToScreen}) {
  const [search, setSearch] = useState('');
  const {user} = useUser();
  const {theme} = useTheme();
  const {error, flashcards, isLoading, isRefreshing, refreshFlashcards} = useFlashcardsApi();

  const subjects = ['Java', 'Computer Networks', 'Operating System'];
  const displayName = user?.name || 'Karthi';
  const displayEmail = user?.email || 'karthi@example.com';
  const displayCourse = user?.course || 'Computer Science';

  const filteredFlashcards = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return flashcards;
    }

    return flashcards.filter(card => {
      const text = `${card.question} ${card.subject} ${card.answer}`.toLowerCase();
      return text.includes(query);
    });
  }, [flashcards, search]);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
            </View>
            <Text style={[styles.name, {color: theme.text}]}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
            <View style={styles.coursePill}>
              <Text style={styles.courseText}>📚 {displayCourse.toUpperCase()}</Text>
            </View>
          </View>

          <TextInput
            placeholder="Search flashcards..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          <TouchableOpacity style={styles.refreshButton} onPress={refreshFlashcards}>
            <Text style={styles.refreshText}>{isRefreshing ? 'Refreshing...' : '+ Refresh Flashcards'}</Text>
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your study snapshot</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>COMPLETED</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{flashcards.length}</Text>
                <Text style={styles.statLabel}>RECENT</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>DAY STREAK</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.subjectContainer}>
            {subjects.map(subject => (
              <View style={styles.subject} key={subject}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Your recent flashcards</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {isLoading && !flashcards.length ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#5F42E8" />
              <Text style={styles.loadingText}>Loading flashcards...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredFlashcards}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              onRefresh={refreshFlashcards}
              refreshing={isRefreshing}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No flashcards found.</Text>
                </View>
              }
              renderItem={({item}) => (
                <View style={styles.flashcard}>
                  <Text style={styles.flashcardSubject}>{item.subject}</Text>
                  <Text style={styles.flashcardQuestion}>{item.question}</Text>
                  <Text style={styles.flashcardDifficulty}>{item.difficulty}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
      <NavigationBar activeScreen={activeScreen} onNavigate={goToScreen} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {paddingBottom: 28},
  container: {flex: 1, paddingHorizontal: 22, paddingTop: 18},
  profileHeader: {alignItems: 'center', marginTop: 12},
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderRadius: 50,
    elevation: 8,
    height: 90,
    justifyContent: 'center',
    width: 90,
  },
  avatarText: {color: 'white', fontSize: 36, fontWeight: 'bold'},
  name: {fontSize: 30, fontWeight: 'bold', marginTop: 12},
  email: {color: '#667085', fontSize: 15, marginTop: 4},
  coursePill: {
    backgroundColor: '#E9E1FF',
    borderRadius: 15,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  courseText: {
    color: '#5F42E8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  search: {
    backgroundColor: '#FFFFFFEE',
    borderColor: '#E4E1F6',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    padding: 12,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderRadius: 14,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 22,
    elevation: 7,
    marginTop: 18,
    padding: 20,
  },
  summaryTitle: {
    color: '#172B4D',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {alignItems: 'center', flex: 1},
  statValue: {color: '#5F42E8', fontSize: 26, fontWeight: 'bold'},
  statLabel: {color: '#667085', fontSize: 9, fontWeight: 'bold', marginTop: 5},
  divider: {backgroundColor: '#E4E7EC', height: 36, width: 1},
  sectionTitle: {
    color: '#172B4D',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 12,
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  subject: {
    backgroundColor: '#FFFFFFEE',
    borderColor: '#E4E1F6',
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  subjectText: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#475467',
    marginTop: 8,
  },
  flashcard: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 16,
    elevation: 4,
    marginBottom: 10,
    padding: 14,
  },
  flashcardSubject: {
    color: '#5F42E8',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  flashcardQuestion: {
    color: '#172B4D',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  flashcardDifficulty: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#475467',
  },
});