import {Platform} from 'react-native';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const FLASHCARDS_URL = `${API_BASE_URL}/flashcards`;

async function handleJsonResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }

  return payload;
}

export async function fetchFlashcards() {
  try {
    const response = await fetch(FLASHCARDS_URL);
    const payload = await handleJsonResponse(response, 'Unable to load flashcards right now. Please try again.');

    if (!Array.isArray(payload)) {
      throw new Error('The flashcards service returned an invalid response.');
    }

    return payload.map(card => ({
      id: card.id,
      subject: card.subject || 'General',
      question: card.question || 'Untitled question',
      answer: card.answer || 'No answer available.',
      difficulty: card.difficulty || 'General',
    }));
  } catch (error) {
    throw new Error(error.message || 'Unable to load flashcards right now. Please try again.');
  }
}

export async function createFlashcard(cardData) {
  try {
    const response = await fetch(FLASHCARDS_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(cardData),
    });

    return await handleJsonResponse(response, 'Unable to create flashcard right now.');
  } catch (error) {
    throw new Error(error.message || 'Unable to create flashcard right now.');
  }
}

export async function updateFlashcard(id, cardData) {
  try {
    const response = await fetch(`${FLASHCARDS_URL}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(cardData),
    });

    return await handleJsonResponse(response, 'Unable to update flashcard right now.');
  } catch (error) {
    throw new Error(error.message || 'Unable to update flashcard right now.');
  }
}

export async function deleteFlashcard(id) {
  try {
    const response = await fetch(`${FLASHCARDS_URL}/${id}`, {
      method: 'DELETE',
    });

    return await handleJsonResponse(response, 'Unable to delete flashcard right now.');
  } catch (error) {
    throw new Error(error.message || 'Unable to delete flashcard right now.');
  }
}
