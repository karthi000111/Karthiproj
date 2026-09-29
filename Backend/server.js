const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const flashcards = [
  {
    id: 1,
    subject: 'Java',
    question: 'What is a class in Java?',
    answer: 'A class is a blueprint for creating objects and defines attributes and methods.',
    difficulty: 'Easy',
  },
  {
    id: 2,
    subject: 'Java',
    question: 'What is inheritance?',
    answer: 'Inheritance allows a subclass to reuse code and behavior from a parent class.',
    difficulty: 'Medium',
  },
  {
    id: 3,
    subject: 'Computer Networks',
    question: 'What is TCP?',
    answer: 'TCP is a connection-oriented protocol that provides reliable, ordered delivery of data.',
    difficulty: 'Easy',
  },
  {
    id: 4,
    subject: 'Operating System',
    question: 'What is a process?',
    answer: 'A process is a running program with its own memory space and execution state.',
    difficulty: 'Medium',
  },
];

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({status: 'ok', message: 'Note2Flash backend is running'});
});

app.get('/api/flashcards', (req, res) => {
  res.json(flashcards);
});

app.post('/api/flashcards', (req, res) => {
  const {subject, question, answer, difficulty} = req.body;

  if (!subject || !question || !answer) {
    return res.status(400).json({message: 'Subject, question, and answer are required.'});
  }

  const newFlashcard = {
    id: Date.now(),
    subject: subject.trim(),
    question: question.trim(),
    answer: answer.trim(),
    difficulty: difficulty || 'Medium',
  };

  flashcards.unshift(newFlashcard);
  return res.status(201).json(newFlashcard);
});

app.put('/api/flashcards/:id', (req, res) => {
  const {id} = req.params;
  const index = flashcards.findIndex(card => String(card.id) === String(id));

  if (index === -1) {
    return res.status(404).json({message: 'Flashcard not found.'});
  }

  const {subject, question, answer, difficulty} = req.body;

  if (!subject || !question || !answer) {
    return res.status(400).json({message: 'Subject, question, and answer are required.'});
  }

  flashcards[index] = {
    ...flashcards[index],
    subject: subject.trim(),
    question: question.trim(),
    answer: answer.trim(),
    difficulty: difficulty || flashcards[index].difficulty,
  };

  return res.json(flashcards[index]);
});

app.delete('/api/flashcards/:id', (req, res) => {
  const {id} = req.params;
  const index = flashcards.findIndex(card => String(card.id) === String(id));

  if (index === -1) {
    return res.status(404).json({message: 'Flashcard not found.'});
  }

  const [deletedCard] = flashcards.splice(index, 1);
  return res.json({message: 'Flashcard deleted successfully.', deletedCard});
});

app.use((req, res) => {
  res.status(404).json({message: 'Endpoint not found.'});
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({message: 'Something went wrong on the server.'});
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Note2Flash backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
