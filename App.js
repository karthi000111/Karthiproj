import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';

import {FlashcardProvider} from './Backend/src/contexts/FlashcardContext';
import {ThemeProvider} from './Backend/src/contexts/ThemeContext';
import {UserProvider} from './Backend/src/contexts/UserContext';
import WelcomeScreen from './Backend/src/screens/WelcomeScreen';
import LoginScreen from './Backend/src/screens/LoginScreen';
import HomeScreen from './Backend/src/screens/HomeScreen';
import FlashcardScreen from './Backend/src/screens/FlashCardScreen';
import ProgressScreen from './Backend/src/screens/ProgressScreen';
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
  const [darkMode, setDarkMode] = useState(false);

  if (screen === 'welcome') {
    return <WelcomeScreen goToLogin={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <LoginScreen goToHome={() => setScreen('home')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'home' && <HomeScreen darkMode={darkMode} />}
        {screen === 'flashcards' && <FlashcardScreen darkMode={darkMode} />}
        {screen === 'progress' && <ProgressScreen darkMode={darkMode} />}
        {screen === 'profile' && (
          <View>
            <Text>Profile Screen</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomNav}>
        <Text onPress={() => setScreen('home')}>🏠 Home</Text>
        <Text onPress={() => setScreen('flashcards')}>📚 Flashcards</Text>
        <Text onPress={() => setScreen('progress')}>📊 Progress</Text>
        <Text onPress={() => setScreen('profile')}>👤 Profile</Text>
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    elevation: 8,
  },
});