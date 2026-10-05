import {fetchDecks, fetchFlashcards, fetchStudyStates} from './flashcardApi';

export async function fetchAccountSnapshot() {
  const [flashcards, decks, studyStates] = await Promise.all([
    fetchFlashcards(),
    fetchDecks(),
    fetchStudyStates(),
  ]);

  return {flashcards, decks, studyStates};
}