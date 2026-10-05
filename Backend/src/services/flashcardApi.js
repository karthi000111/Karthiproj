import {apiRequest} from './apiClient';

export async function fetchFlashcards() {
  const payload = await apiRequest('/flashcards');
  if (!Array.isArray(payload)) {
    throw new Error('The flashcards service returned an invalid response.');
  }

  return payload.map(card => ({
    id: card.id,
    deckId: card.deckId || 'java',
    subject: card.subject || 'General',
    question: card.question || 'Untitled question',
    answer: card.answer || 'No answer available.',
    difficulty: card.difficulty || 'General',
    persisted: true,
  }));
}

export async function createFlashcard(cardData) {
  return apiRequest('/flashcards', {method: 'POST', body: JSON.stringify(cardData)});
}

export async function updateFlashcard(id, cardData) {
  return apiRequest(`/flashcards/${encodeURIComponent(id)}`, {method: 'PUT', body: JSON.stringify(cardData)});
}

export async function deleteFlashcard(id) {
  return apiRequest(`/flashcards/${encodeURIComponent(id)}`, {method: 'DELETE'});
}

export async function fetchDecks() {
  const decks = await apiRequest('/decks');
  return decks.map(deck => ({...deck, custom: true}));
}

export async function createDeck(deckData) {
  const deck = await apiRequest('/decks', {method: 'POST', body: JSON.stringify(deckData)});
  return {...deck, custom: true};
}

export async function fetchStudyStates() {
  return apiRequest('/study-state');
}

export function saveStudyState(cardId, state) {
  return apiRequest(`/study-state/${encodeURIComponent(cardId)}`, {
    method: 'PUT',
    body: JSON.stringify(state),
  });
}
