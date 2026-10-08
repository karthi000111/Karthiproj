/**
 * @format
 */

import React from 'react';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import LoginScreen from '../Backend/src/screens/LoginScreen';
import {ThemeProvider} from '../Backend/src/contexts/ThemeContext';
import {UserProvider} from '../Backend/src/contexts/UserContext';
import flashcardReducer from '../Backend/src/store/slices/flashcardSlice';
import {getCurrentStudyStreak} from '../Backend/src/store/slices/progressSlice';
import {getSubjectTopicProgress} from '../Backend/src/screens/ProgressScreen';
import {getNewlyCompletedSubject} from '../Backend/src/utils/subjectCompletion';
import {loginAccount} from '../Backend/src/services/authApi';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../Backend/src/services/authApi', () => ({
  getCurrentUser: jest.fn(),
  loginAccount: jest.fn(),
  logoutAccount: jest.fn(),
  registerAccount: jest.fn(),
  updateAccount: jest.fn(),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}, 15000);

test('opens registration from the Welcome screen', async () => {
  let root;
  await ReactTestRenderer.act(async () => {
    root = ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });

  const registerButton = root.root.findAllByType(TouchableOpacity).find(button =>
    button.findAllByType(Text).some(text => text.props.children === 'Get Started (Register)'),
  );

  await ReactTestRenderer.act(() => registerButton.props.onPress());
  expect(root.root.findAllByType(Text).some(text => text.props.children === 'Create Account')).toBe(true);
}, 15000);

test('navigates to home after a successful login', async () => {
  const goToHome = jest.fn();
  loginAccount.mockResolvedValue({
    token: 'test-token',
    user: {name: 'User', email: 'user@example.com'},
  });

  let root;
  await ReactTestRenderer.act(async () => {
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
    await Promise.resolve();
    await Promise.resolve();
  });

  const emailInput = root.root.findAllByType(TextInput)[0];
  const passwordInput = root.root.findAllByType(TextInput)[1];

  await ReactTestRenderer.act(() => {
    emailInput.props.onChangeText('user@example.com');
    passwordInput.props.onChangeText('password123');
  });

  await ReactTestRenderer.act(async () => {
    await root.root.findAllByType(TouchableOpacity)[0].props.onPress();
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

test('includes a separate 30-question Java scenario study set', () => {
  const state = flashcardReducer(undefined, {type: '@@INIT'});
  const scenarioCards = state.items.filter(card => card.deckId === 'java-scenarios');

  expect(state.decks.some(deck => deck.id === 'java-scenarios' && deck.title === 'Java Scenario Questions')).toBe(true);
  expect(scenarioCards).toHaveLength(30);
  expect(scenarioCards[0]).toEqual(expect.objectContaining({
    scenario: expect.any(String),
    question: expect.any(String),
    answer: expect.any(String),
  }));
});

test('includes a separate 30-question Computer Networks scenario study set', () => {
  const state = flashcardReducer(undefined, {type: '@@INIT'});
  const scenarioCards = state.items.filter(card => card.deckId === 'computer-network-scenarios');

  expect(state.decks.some(deck => deck.id === 'computer-network-scenarios' && deck.title === 'Computer Network Scenarios')).toBe(true);
  expect(scenarioCards).toHaveLength(30);
  expect(scenarioCards[0]).toEqual(expect.objectContaining({
    scenario: expect.any(String),
    question: expect.any(String),
    answer: expect.any(String),
  }));
});

test('includes a separate 30-question Operating System scenario study set', () => {
  const state = flashcardReducer(undefined, {type: '@@INIT'});
  const scenarioCards = state.items.filter(card => card.deckId === 'operating-system-scenarios');

  expect(state.decks.some(deck => deck.id === 'operating-system-scenarios' && deck.title === 'Operating System Scenarios')).toBe(true);
  expect(scenarioCards).toHaveLength(30);
  expect(scenarioCards[0]).toEqual(expect.objectContaining({
    scenario: expect.any(String),
    question: expect.any(String),
    answer: expect.any(String),
  }));
});

test('computes the current study streak from consecutive UTC dates', () => {
  const dateAtOffset = offset => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    return date.toISOString().slice(0, 10);
  };

  expect(getCurrentStudyStreak([dateAtOffset(0), dateAtOffset(1), dateAtOffset(2)])).toBe(3);
  expect(getCurrentStudyStreak([dateAtOffset(1)])).toBe(1);
  expect(getCurrentStudyStreak([dateAtOffset(2)])).toBe(0);
});

test('groups completed flashcards by subject deck and topic', () => {
  const progress = getSubjectTopicProgress(
    [
      {id: 'java-1', deckId: 'java', subject: 'OOP Concepts'},
      {id: 'java-2', deckId: 'java', subject: 'OOP Concepts'},
      {id: 'java-3', deckId: 'java', subject: 'Inheritance'},
      {id: 'net-1', deckId: 'computer-networks', subject: 'OSI Model'},
    ],
    ['java-1', 'net-1'],
    [
      {id: 'java', title: 'Java'},
      {id: 'computer-networks', title: 'Computer Networks'},
    ],
  );

  expect(progress).toEqual([
    {
      id: 'java',
      title: 'Java',
      completed: 1,
      total: 3,
      percentage: 33,
      topics: [
        {title: 'OOP Concepts', completed: 1, total: 2, percentage: 50},
        {title: 'Inheritance', completed: 0, total: 1, percentage: 0},
      ],
    },
    {
      id: 'computer-networks',
      title: 'Computer Networks',
      completed: 1,
      total: 1,
      percentage: 100,
      topics: [{title: 'OSI Model', completed: 1, total: 1, percentage: 100}],
    },
  ]);
});

test('identifies a subject only when its final flashcard is newly completed', () => {
  const cards = [
    {id: 'java-1', deckId: 'java'},
    {id: 'java-2', deckId: 'java'},
    {id: 'net-1', deckId: 'computer-networks'},
    {id: 'net-2', deckId: 'computer-networks'},
  ];
  const decks = [
    {id: 'java', title: 'Java'},
    {id: 'computer-networks', title: 'Computer Networks'},
  ];

  expect(
    getNewlyCompletedSubject(cards, ['java-1'], decks, cards[1]),
  ).toBe('Java');
  expect(
    getNewlyCompletedSubject(cards, [], decks, cards[0]),
  ).toBeNull();
  expect(
    getNewlyCompletedSubject(cards, ['java-1', 'java-2'], decks, cards[1]),
  ).toBeNull();
  expect(
    getNewlyCompletedSubject(cards, ['java-1'], decks, cards[2]),
  ).toBeNull();
});

test('maps JSONPlaceholder posts into flashcards with question and answer fields', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 'card-1',
        deckId: 'java',
        subject: 'REST API',
        question: 'What is REST?',
        answer: 'REST is an architectural style for web APIs.',
        difficulty: 'General',
      },
    ],
  });

  const {fetchFlashcards} = require('../Backend/src/services/flashcardApi');
  const cards = await fetchFlashcards();

  expect(cards).toEqual([
    {
      id: 'card-1',
      subject: 'REST API',
      deckId: 'java',
      question: 'What is REST?',
      answer: 'REST is an architectural style for web APIs.',
      difficulty: 'General',
      persisted: true,
    },
  ]);
});
