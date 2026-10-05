const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const {randomBytes} = require('node:crypto');

const Flashcard = require('./models/Flashcard');
const User = require('./models/User');
const Session = require('./models/Session');
const Deck = require('./models/Deck');
const StudyState = require('./models/StudyState');
const {createRequireUser, hashToken} = require('./middleware/requireUser');

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const BUILT_IN_DECK_IDS = new Set([
  'java',
  'java-scenarios',
  'computer-networks',
  'computer-network-scenarios',
  'operating-system',
  'operating-system-scenarios',
]);

function asPlainObject(document) {
  return typeof document.toObject === 'function' ? document.toObject() : document;
}

function toApiUser(document) {
  const user = asPlainObject(document);
  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    gender: user.gender || 'Other',
    course: user.course || 'Computer Science',
    notificationsEnabled: user.notificationsEnabled !== false,
  };
}

function toApiFlashcard(document) {
  const card = asPlainObject(document);

  return {
    id: String(card._id || card.id),
    deckId: card.deckId || 'java',
    subject: card.subject,
    question: card.question,
    answer: card.answer,
    difficulty: card.difficulty || 'Medium',
  };
}

function toApiDeck(document) {
  const deck = asPlainObject(document);
  return {
    id: String(deck._id || deck.id),
    title: deck.title,
    description: deck.description || '',
  };
}

function toApiStudyState(document) {
  const state = asPlainObject(document);
  return {
    cardId: state.cardId,
    level: state.level || 0,
    reviews: state.reviews || 0,
    lastReviewed: state.lastReviewed ? new Date(state.lastReviewed).getTime() : 0,
    completed: Boolean(state.completed),
    favourite: Boolean(state.favourite),
  };
}

function getRequiredFields(body) {
  const {subject, question, answer} = body || {};
  if (![subject, question, answer].every(value => typeof value === 'string' && value.trim())) {
    return null;
  }

  return {
    subject: subject.trim(),
    question: question.trim(),
    answer: answer.trim(),
  };
}

function createApp({
  FlashcardModel = Flashcard,
  UserModel = User,
  SessionModel = Session,
  DeckModel = Deck,
  StudyStateModel = StudyState,
} = {}) {
  const app = express();
  const requireUser = createRequireUser({SessionModel, UserModel});

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'Note2Flash backend is running'});
  });

  app.post('/api/auth/register', async (req, res, next) => {
    const {name, email, password} = req.body || {};
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({message: 'Enter a name with at most 100 characters.'});
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({message: 'Enter a valid email address.'});
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({message: 'Password must be at least 8 characters.'});
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (await UserModel.findOne({email: normalizedEmail})) {
        return res.status(409).json({message: 'An account with this email already exists.'});
      }

      const user = await UserModel.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 12),
        gender: req.body.gender || 'Other',
        course: req.body.course || 'Computer Science',
        notificationsEnabled: req.body.notificationsEnabled !== false,
      });
      const token = randomBytes(32).toString('base64url');
      await SessionModel.create({
        userId: user._id || user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      });

      return res.status(201).json({token, user: toApiUser(user)});
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({message: 'An account with this email already exists.'});
      }
      return next(error);
    }
  });

  app.post('/api/auth/login', async (req, res, next) => {
    const {email, password} = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({message: 'Email and password are required.'});
    }

    try {
      const userQuery = UserModel.findOne({email: email.trim().toLowerCase()});
      const user = await (typeof userQuery.select === 'function'
        ? userQuery.select('+passwordHash')
        : userQuery);
      if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({message: 'Email or password is incorrect.'});
      }

      const token = randomBytes(32).toString('base64url');
      await SessionModel.create({
        userId: user._id || user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      });
      return res.json({token, user: toApiUser(user)});
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/auth/me', requireUser, (req, res) => {
    res.json({user: toApiUser(req.user)});
  });

  app.put('/api/auth/me', requireUser, async (req, res, next) => {
    const updates = {};
    if (typeof req.body.name === 'string' && req.body.name.trim()) updates.name = req.body.name.trim();
    if (typeof req.body.gender === 'string') updates.gender = req.body.gender;
    if (typeof req.body.course === 'string') updates.course = req.body.course;
    if (typeof req.body.notificationsEnabled === 'boolean') updates.notificationsEnabled = req.body.notificationsEnabled;

    try {
      const user = await UserModel.findByIdAndUpdate(req.user._id || req.user.id, updates, {new: true});
      return res.json({user: toApiUser(user)});
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/auth/logout', requireUser, async (req, res, next) => {
    try {
      await SessionModel.deleteOne({tokenHash: req.sessionTokenHash});
      return res.json({message: 'Signed out.'});
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/flashcards', requireUser, async (req, res, next) => {
    try {
      const cards = await FlashcardModel.find({ownerId: req.user._id || req.user.id}).sort({createdAt: -1});
      return res.json(cards.map(toApiFlashcard));
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/flashcards', requireUser, async (req, res, next) => {
    const fields = getRequiredFields(req.body);
    if (!fields) {
      return res.status(400).json({message: 'Subject, question, and answer are required.'});
    }

    try {
      const difficulty = typeof req.body.difficulty === 'string' ? req.body.difficulty.trim() : '';
      const deckId = typeof req.body.deckId === 'string' && req.body.deckId ? req.body.deckId : 'java';
      const ownerId = req.user._id || req.user.id;
      if (!BUILT_IN_DECK_IDS.has(deckId)) {
        const deck = await DeckModel.findOne({_id: deckId, ownerId});
        if (!deck) {
          return res.status(404).json({message: 'Study set not found.'});
        }
      }
      const card = await FlashcardModel.create({
        ...fields,
        difficulty: difficulty || 'Medium',
        deckId,
        ownerId,
      });
      return res.status(201).json(toApiFlashcard(card));
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/flashcards/:id', requireUser, async (req, res, next) => {
    const fields = getRequiredFields(req.body);
    if (!fields) {
      return res.status(400).json({message: 'Subject, question, and answer are required.'});
    }

    const updates = {...fields};
    if (typeof req.body.difficulty === 'string' && req.body.difficulty.trim()) {
      updates.difficulty = req.body.difficulty.trim();
    }

    try {
      const card = await FlashcardModel.findOneAndUpdate({
        _id: req.params.id,
        ownerId: req.user._id || req.user.id,
      }, updates, {
        new: true,
        runValidators: true,
      });
      if (!card) {
        return res.status(404).json({message: 'Flashcard not found.'});
      }
      return res.json(toApiFlashcard(card));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({message: 'Invalid flashcard ID.'});
      }
      return next(error);
    }
  });

  app.delete('/api/flashcards/:id', requireUser, async (req, res, next) => {
    try {
      const card = await FlashcardModel.findOneAndDelete({
        _id: req.params.id,
        ownerId: req.user._id || req.user.id,
      });
      if (!card) {
        return res.status(404).json({message: 'Flashcard not found.'});
      }
      return res.json({
        message: 'Flashcard deleted successfully.',
        deletedCard: toApiFlashcard(card),
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({message: 'Invalid flashcard ID.'});
      }
      return next(error);
    }
  });

  app.get('/api/decks', requireUser, async (req, res, next) => {
    try {
      const decks = await DeckModel.find({ownerId: req.user._id || req.user.id}).sort({createdAt: 1});
      return res.json(decks.map(toApiDeck));
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/decks', requireUser, async (req, res, next) => {
    const {title, description} = req.body || {};
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) {
      return res.status(400).json({message: 'Set title is required and must be at most 100 characters.'});
    }

    try {
      const deck = await DeckModel.create({
        ownerId: req.user._id || req.user.id,
        title: title.trim(),
        description: typeof description === 'string' ? description.trim().slice(0, 300) : '',
      });
      return res.status(201).json(toApiDeck(deck));
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/study-state', requireUser, async (req, res, next) => {
    try {
      const states = await StudyStateModel.find({ownerId: req.user._id || req.user.id});
      return res.json(states.map(toApiStudyState));
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/study-state/:cardId', requireUser, async (req, res, next) => {
    const {level, reviews, completed, favourite, lastReviewed} = req.body || {};
    const updates = {};
    if (Number.isInteger(level) && level >= 0 && level <= 5) updates.level = level;
    if (Number.isInteger(reviews) && reviews >= 0) updates.reviews = reviews;
    if (typeof completed === 'boolean') updates.completed = completed;
    if (typeof favourite === 'boolean') updates.favourite = favourite;
    if (typeof lastReviewed === 'number' && Number.isFinite(lastReviewed) && lastReviewed > 0) {
      updates.lastReviewed = new Date(lastReviewed);
    }

    try {
      const state = await StudyStateModel.findOneAndUpdate({
        ownerId: req.user._id || req.user.id,
        cardId: req.params.cardId,
      }, {$set: updates}, {new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true});
      return res.json(toApiStudyState(state));
    } catch (error) {
      return next(error);
    }
  });

  app.use((req, res) => {
    res.status(404).json({message: 'Endpoint not found.'});
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({message: 'A record with these details already exists.'});
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: 'The submitted data is invalid.'});
    }
    res.status(500).json({message: 'Something went wrong on the server.'});
  });

  return app;
}

module.exports = {createApp};