import {useCallback, useEffect, useState} from 'react';

import {fetchFlashcards} from '../services/flashcardApi';

export default function useFlashcardsApi() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadFlashcards = useCallback(async ({refreshing = false} = {}) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const cards = await fetchFlashcards();
      setFlashcards(cards);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load flashcards.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  return {
    error,
    flashcards,
    isLoading,
    isRefreshing,
    refreshFlashcards: () => loadFlashcards({refreshing: true}),
  };
}
