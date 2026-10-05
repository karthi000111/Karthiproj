const test = require('node:test');
const assert = require('node:assert/strict');

const {createApp} = require('../src/app');
const {hashToken} = require('../src/middleware/requireUser');

const userId = '000000000000000000000001';
const testToken = 'test-session-token';

function createAuthModels(initialUsers) {
  const defaultUser = {
    _id: userId,
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: '$2b$12$not-used-by-card-tests',
    gender: 'Other',
    course: 'Computer Science',
    notificationsEnabled: true,
  };
  const users = initialUsers || [defaultUser];
  const sessions = initialUsers ? [] : [{
    _id: 'session-id',
    userId,
    tokenHash: hashToken(testToken),
    expiresAt: new Date(Date.now() + 60_000),
  }];

  return {
    UserModel: {
      findOne: async filter => users.find(item => item.email === filter.email) || null,
      findById: async id => users.find(item => String(item._id) === String(id)) || null,
      create: async fields => {
        if (users.some(item => item.email === fields.email)) {
          const error = new Error('Duplicate email');
          error.code = 11000;
          throw error;
        }
        const created = {_id: `user-${users.length + 1}`, ...fields};
        users.push(created);
        return created;
      },
      findByIdAndUpdate: async (id, updates) => {
        const found = users.find(item => String(item._id) === String(id));
        if (!found) return null;
        Object.assign(found, updates);
        return found;
      },
    },
    SessionModel: {
      findOne: async filter => sessions.find(item => item.tokenHash === filter.tokenHash && item.expiresAt > filter.expiresAt.$gt) || null,
      create: async fields => {
        const created = {_id: `session-${sessions.length + 1}`, ...fields};
        sessions.push(created);
        return created;
      },
      deleteOne: async filter => {
        const index = sessions.findIndex(item => item.tokenHash === filter.tokenHash);
        if (index !== -1) sessions.splice(index, 1);
        return {deletedCount: index === -1 ? 0 : 1};
      },
    },
    authorization: {Authorization: `Bearer ${testToken}`},
    users,
  };
}

function createFlashcardModel(initialCards = []) {
  const cards = initialCards.map(card => ({...card}));
  let nextId = 2;

  return {
    find: filter => ({sort: async () => cards.filter(card => String(card.ownerId) === String(filter.ownerId))}),
    create: async fields => {
      const card = {_id: String(nextId++).padStart(24, '0'), ...fields};
      cards.unshift(card);
      return card;
    },
    findOneAndUpdate: async (filter, updates) => {
      const index = cards.findIndex(card => String(card._id) === filter._id && String(card.ownerId) === String(filter.ownerId));
      if (index === -1) return null;
      cards[index] = {...cards[index], ...updates};
      return cards[index];
    },
    findOneAndDelete: async filter => {
      const index = cards.findIndex(card => String(card._id) === filter._id && String(card.ownerId) === String(filter.ownerId));
      if (index === -1) return null;
      return cards.splice(index, 1)[0];
    },
  };
}

function createDeckModel(initialDecks = []) {
  const decks = initialDecks.map(deck => ({...deck}));
  return {
    find: filter => ({sort: async () => decks.filter(deck => String(deck.ownerId) === String(filter.ownerId))}),
    create: async fields => {
      const deck = {_id: `deck-${decks.length + 1}`, ...fields};
      decks.push(deck);
      return deck;
    },
  };
}

function createStudyStateModel(initialStates = []) {
  const states = initialStates.map(state => ({...state}));
  return {
    find: async filter => states.filter(state => String(state.ownerId) === String(filter.ownerId)),
    findOneAndUpdate: async (filter, update) => {
      let state = states.find(item => String(item.ownerId) === String(filter.ownerId) && item.cardId === filter.cardId);
      if (!state) {
        state = {_id: `study-${states.length + 1}`, ...filter};
        states.push(state);
      }
      Object.assign(state, update.$set);
      return state;
    },
  };
}

async function withServer(app, run) {
  const server = app.listen(0, '127.0.0.1');

  try {
    await new Promise(resolve => server.once('listening', resolve));
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('GET /api/flashcards returns a list of flashcards', async () => {
  const FlashcardModel = createFlashcardModel([
    {
      _id: '000000000000000000000001',
      ownerId: userId,
      subject: 'Java',
      question: 'What is a class?',
      answer: 'A blueprint for creating objects.',
      difficulty: 'Easy',
    },
    {
      _id: '000000000000000000000003',
      ownerId: 'another-user',
      subject: 'Private',
      question: 'Should this be visible?',
      answer: 'No.',
      difficulty: 'Easy',
    },
  ]);
  const auth = createAuthModels();
  const app = createApp({FlashcardModel, ...auth});

  await withServer(app, async baseUrl => {
    const response = await fetch(`${baseUrl}/api/flashcards`, {headers: auth.authorization});
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.ok(Array.isArray(payload));
    assert.equal(payload.length, 1);
    assert.equal(payload[0].id, '000000000000000000000001');
    assert.equal(payload[0].question, 'What is a class?');
  });
});

test('registration hashes passwords, login issues a session, and logout revokes it', async () => {
  const auth = createAuthModels([]);
  const app = createApp({...auth});

  await withServer(app, async baseUrl => {
    const registrationResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'New User',
        email: 'New.User@example.com',
        password: 'a-secure-password',
        course: 'Computer Science',
      }),
    });
    assert.equal(registrationResponse.status, 201);
    const registration = await registrationResponse.json();
    assert.equal(registration.user.email, 'new.user@example.com');
    assert.ok(registration.token);
    assert.equal('passwordHash' in registration.user, false);
    assert.notEqual(auth.users[0].passwordHash, 'a-secure-password');

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'NEW.USER@example.com', password: 'a-secure-password'}),
    });
    assert.equal(loginResponse.status, 200);
    const login = await loginResponse.json();

    const profileResponse = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {Authorization: `Bearer ${login.token}`},
    });
    assert.equal(profileResponse.status, 200);
    assert.equal((await profileResponse.json()).user.id, auth.users[0]._id);

    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${login.token}`},
    });
    assert.equal(logoutResponse.status, 200);

    const revokedResponse = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {Authorization: `Bearer ${login.token}`},
    });
    assert.equal(revokedResponse.status, 401);
  });
});

test('protected flashcard routes reject requests without a session', async () => {
  const app = createApp({FlashcardModel: createFlashcardModel(), ...createAuthModels()});

  await withServer(app, async baseUrl => {
    const response = await fetch(`${baseUrl}/api/flashcards`);
    assert.equal(response.status, 401);
  });
});

test('custom decks and study state are scoped to the signed-in user', async () => {
  const auth = createAuthModels();
  const app = createApp({
    ...auth,
    DeckModel: createDeckModel([
      {_id: 'other-deck', ownerId: 'another-user', title: 'Private set', description: ''},
    ]),
    StudyStateModel: createStudyStateModel([
      {ownerId: 'another-user', cardId: 'other-card', level: 4, reviews: 8, completed: true, favourite: true},
    ]),
  });

  await withServer(app, async baseUrl => {
    const createResponse = await fetch(`${baseUrl}/api/decks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...auth.authorization},
      body: JSON.stringify({title: 'My Algorithms', description: 'Interview prep'}),
    });
    assert.equal(createResponse.status, 201);
    const createdDeck = await createResponse.json();
    assert.equal(createdDeck.title, 'My Algorithms');

    const decksResponse = await fetch(`${baseUrl}/api/decks`, {headers: auth.authorization});
    assert.deepEqual((await decksResponse.json()).map(deck => deck.id), [createdDeck.id]);

    const saveStateResponse = await fetch(`${baseUrl}/api/study-state/card-1`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', ...auth.authorization},
      body: JSON.stringify({level: 3, reviews: 5, completed: true, favourite: true, lastReviewed: 12345}),
    });
    assert.equal(saveStateResponse.status, 200);

    const studyStatesResponse = await fetch(`${baseUrl}/api/study-state`, {headers: auth.authorization});
    const studyStates = await studyStatesResponse.json();
    assert.deepEqual(studyStates, [{
      cardId: 'card-1',
      level: 3,
      reviews: 5,
      lastReviewed: 12345,
      completed: true,
      favourite: true,
    }]);
  });
});

test('POST, PUT, and DELETE /api/flashcards persist through the model', async () => {
  const auth = createAuthModels();
  const app = createApp({FlashcardModel: createFlashcardModel(), ...auth});

  await withServer(app, async baseUrl => {
    const createdResponse = await fetch(`${baseUrl}/api/flashcards`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...auth.authorization},
      body: JSON.stringify({subject: ' Java ', question: ' What is Java? ', answer: ' A language. '}),
    });
    assert.equal(createdResponse.status, 201);
    const created = await createdResponse.json();
    assert.equal(created.subject, 'Java');
    assert.equal(created.difficulty, 'Medium');

    const updatedResponse = await fetch(`${baseUrl}/api/flashcards/${created.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', ...auth.authorization},
      body: JSON.stringify({subject: 'Java', question: 'Updated question', answer: 'Updated answer'}),
    });
    assert.equal(updatedResponse.status, 200);
    assert.equal((await updatedResponse.json()).question, 'Updated question');

    const deletedResponse = await fetch(`${baseUrl}/api/flashcards/${created.id}`, {
      method: 'DELETE',
      headers: auth.authorization,
    });
    assert.equal(deletedResponse.status, 200);
    assert.equal((await deletedResponse.json()).deletedCard.id, created.id);
  });
});

test('POST /api/flashcards rejects incomplete cards', async () => {
  const auth = createAuthModels();
  const app = createApp({FlashcardModel: createFlashcardModel(), ...auth});

  await withServer(app, async baseUrl => {
    const response = await fetch(`${baseUrl}/api/flashcards`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...auth.authorization},
      body: JSON.stringify({subject: 'Java'}),
    });
    assert.equal(response.status, 400);
  });
});
