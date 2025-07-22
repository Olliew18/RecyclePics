import { configureStore } from '@reduxjs/toolkit';
import recognitionReducer from './slices/recognitionSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    recognition: recognitionReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['recognition/recognizeImage/pending'],
        ignoredPaths: ['recognition.currentImage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;