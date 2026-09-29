import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';

import {FlashcardProvider} from './Backend/src/contexts/FlashcardContext';
import {ThemeProvider} from './Backend/src/contexts/ThemeContext';
import {UserProvider} from './Backend/src/contexts/UserContext';
import WelcomeScreen from './Backend/src/screens/WelcomeScreen';
import LoginScreen from './Backend/src/screens/LoginScreen';
import HomeScreen from './Backend/src/screens/HomeScreen';
import FlashcardScreen from './Backend/src/screens/FlashCardScreen';
import ProgressScreen from './Backend/src/screens/ProgressScreen';
import DecksScreen from './Backend/src/screens/DecksScreen';
import LearnScreen from './Backend/src/screens/LearnScreen';
import CreateFlashcardScreen from './Backend/src/screens/CreateFlashcardScreen';
import MatchScreen from './Backend/src/screens/MatchScreen';
import ProfileScreen from './Backend/src/screens/ProfileScreen';
import {store} from './Backend/src/store/store';

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

  const goToScreen = nextScreen => {
    if (nextScreen === 'flashcard') {
      setScreen('flashcards');
      return;
    }

    setScreen(nextScreen);
  };

  if (screen === 'welcome') {
    return <WelcomeScreen goToLogin={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <LoginScreen goToHome={() => setScreen('home')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'home' && <HomeScreen activeScreen="home" goToScreen={goToScreen} />}
        {screen === 'flashcards' && (
          <FlashcardScreen activeScreen="flashcard" goToScreen={goToScreen} />
        )}
        {screen === 'decks' && <DecksScreen activeScreen="decks" goToScreen={goToScreen} />}
        {screen === 'learn' && <LearnScreen activeScreen="decks" goToScreen={goToScreen} />}
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
            goToWelcome={() => setScreen('welcome')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});