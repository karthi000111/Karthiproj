/**
 * @format
 */

import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import LoginScreen from '../Backend/src/screens/LoginScreen';
import {ThemeProvider} from '../Backend/src/contexts/ThemeContext';
import {UserProvider} from '../Backend/src/contexts/UserContext';
import flashcardReducer from '../Backend/src/store/slices/flashcardSlice';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('navigates to home after a successful login', async () => {
  const goToHome = jest.fn();

  let root;
  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(
      <ThemeProvider>
        <UserProvider>
          <LoginScreen
            goToHome={goToHome}
            goToRegister={jest.fn()}
            goToWelcome={jest.fn()}
          />
        </UserProvider>
      </ThemeProvider>,
    );
  });

  const emailInput = root.root.findAllByType(TextInput)[0];
  const passwordInput = root.root.findAllByType(TextInput)[1];

  await ReactTestRenderer.act(() => {
    emailInput.props.onChangeText('user@example.com');
    passwordInput.props.onChangeText('password123');
  });

  await ReactTestRenderer.act(() => {
    root.root.findAllByType(TouchableOpacity)[0].props.onPress();
  });

  expect(goToHome).toHaveBeenCalledTimes(1);
}, 15000);

test('includes the Java, Computer Networks, and Operating System study decks', () => {
  const state = flashcardReducer(undefined, {type: '@@INIT'});

  expect(state.decks.map(deck => deck.title)).toEqual(
    expect.arrayContaining(['Java', 'Computer Networks', 'Operating System']),
  );
  expect(state.items.some(card => card.deckId === 'java' && card.subject === 'OOP Concepts')).toBe(true);
  expect(state.items.some(card => card.deckId === 'computer-networks' && card.subject === 'OSI Model')).toBe(true);
  expect(state.items.some(card => card.deckId === 'operating-system' && card.subject === 'Processes')).toBe(true);
});

test('maps JSONPlaceholder posts into flashcards with question and answer fields', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {id: 1, title: 'What is REST?', body: 'REST is an architectural style for web APIs.'},
    ],
  });

  const {fetchFlashcards} = require('../Backend/src/services/flashcardApi');
  const cards = await fetchFlashcards();

  expect(cards).toEqual([
    {
      id: 1,
      subject: 'REST API',
      question: 'What is REST?',
      answer: 'REST is an architectural style for web APIs.',
      difficulty: 'General',
    },
  ]);
});
