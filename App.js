import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Provider, useDispatch} from 'react-redux';

import {FlashcardProvider} from './Backend/src/contexts/FlashcardContext';
import {ThemeProvider} from './Backend/src/contexts/ThemeContext';
import {UserProvider, useUser} from './Backend/src/contexts/UserContext';
import WelcomeScreen from './Backend/src/screens/WelcomeScreen';
import LoginScreen from './Backend/src/screens/LoginScreen';
import RegisterScreen from './Backend/src/screens/RegisterScreen';
import HomeScreen from './Backend/src/screens/HomeScreen';
import FlashcardScreen from './Backend/src/screens/FlashCardScreen';
import ProgressScreen from './Backend/src/screens/ProgressScreen';
import DecksScreen from './Backend/src/screens/DecksScreen';
import LearnScreen from './Backend/src/screens/LearnScreen';
import CreateFlashcardScreen from './Backend/src/screens/CreateFlashcardScreen';
import MatchScreen from './Backend/src/screens/MatchScreen';
import ProfileScreen from './Backend/src/screens/ProfileScreen';
import SubjectCompletionCelebration from './Backend/src/components/SubjectCompletionCelebration';
import {store} from './Backend/src/store/store';
import {fetchAccountSnapshot} from './Backend/src/services/accountApi';
import {clearAccountData, hydrateAccountData} from './Backend/src/store/slices/flashcardSlice';
import {hydrateProgress} from './Backend/src/store/slices/progressSlice';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <UserProvider>
          <FlashcardProvider>
            <AppContent />
          </FlashcardProvider>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  );
}

function AppContent() {
  const [screen, setScreen] = useState('welcome');
  const [isAccountReady, setIsAccountReady] = useState(false);
  const [completedSubject, setCompletedSubject] = useState(null);
  const dispatch = useDispatch();
  const {token, isRestoringSession, logout} = useUser();

  useEffect(() => {
    if (isRestoringSession) return undefined;

    if (!token) {
      dispatch(clearAccountData());
      dispatch(hydrateProgress({completedIds: []}));
      setScreen('welcome');
      setIsAccountReady(true);
      return undefined;
    }

    let isMounted = true;
    setIsAccountReady(false);

    fetchAccountSnapshot()
      .then(snapshot => {
        if (!isMounted) return;
        dispatch(hydrateAccountData(snapshot));
        dispatch(hydrateProgress({
          completedIds: snapshot.studyStates.filter(item => item.completed).map(item => item.cardId),
          activeDates: snapshot.studyStates
            .filter(item => item.lastReviewed)
            .map(item => new Date(item.lastReviewed).toISOString().slice(0, 10)),
        }));
        setScreen('home');
      })
      .catch(error => {
        if (error.status === 401) {
          logout();
          return;
        }
        if (isMounted) setScreen('home');
      })
      .finally(() => {
        if (isMounted) setIsAccountReady(true);
      });

    return () => { isMounted = false; };
  }, [dispatch, isRestoringSession, logout, token]);

  const goToScreen = nextScreen => {
    if (nextScreen === 'flashcard') {
      setScreen('flashcards');
      return;
    }

    setScreen(nextScreen);
  };

  if (isRestoringSession || (token && !isAccountReady)) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#5F42E8" /></View>;
  }

  if (screen === 'welcome') {
    return <WelcomeScreen goToLogin={() => setScreen('login')} goToRegister={() => setScreen('register')} />;
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        goToHome={() => setScreen('home')}
        goToRegister={() => setScreen('register')}
        goToWelcome={() => setScreen('welcome')}
      />
    );
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        goToLogin={() => setScreen('login')}
        goToHome={() => setScreen('home')}
        goToWelcome={() => setScreen('welcome')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'home' && <HomeScreen activeScreen="home" goToScreen={goToScreen} />}
        {screen === 'flashcards' && (
          <FlashcardScreen
            activeScreen="flashcard"
            goToScreen={goToScreen}
            onSubjectCompleted={setCompletedSubject}
          />
        )}
        {screen === 'decks' && <DecksScreen activeScreen="decks" goToScreen={goToScreen} />}
        {screen === 'learn' && (
          <LearnScreen
            activeScreen="decks"
            goToScreen={goToScreen}
            onSubjectCompleted={setCompletedSubject}
          />
        )}
        {screen === 'create' && (
          <CreateFlashcardScreen
            goToHome={() => setScreen('home')}
            goToStudy={() => setScreen('learn')}
          />
        )}
        {screen === 'match' && <MatchScreen activeScreen="decks" goToScreen={goToScreen} />}
        {screen === 'progress' && (
          <ProgressScreen activeScreen="progress" goToScreen={goToScreen} />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            activeScreen="profile"
            goToScreen={goToScreen}
            goToWelcome={logout}
          />
        )}
      </View>
      <SubjectCompletionCelebration
        subject={completedSubject}
        onDismiss={() => setCompletedSubject(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {alignItems: 'center', backgroundColor: '#F5F7FA', flex: 1, justifyContent: 'center'},
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});