import {configureStore} from '@reduxjs/toolkit';
import flashcardsReducer from './slices/flashcardSlice';
import progressReducer from './slices/progressSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({reducer: {flashcards: flashcardsReducer, progress: progressReducer, user: userReducer}});
