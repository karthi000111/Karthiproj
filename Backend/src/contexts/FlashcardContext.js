import React, {createContext, useContext, useState} from 'react';

const FlashcardContext = createContext();

export function FlashcardProvider({children}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const changeQuestion = (direction, total) => {
    setCurrentQuestion(current => Math.max(0, Math.min(total - 1, current + direction)));
    setShowAnswer(false);
  };
  return <FlashcardContext.Provider value={{changeQuestion, currentQuestion, setCurrentQuestion, setShowAnswer, showAnswer}}>{children}</FlashcardContext.Provider>;
}

export function useFlashcardStudy() {
  return useContext(FlashcardContext);
}
