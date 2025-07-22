import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  notifications: boolean;
  location: boolean;
  autoSave: boolean;
  highQuality: boolean;
  defaultCouncil: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

const initialState: SettingsState = {
  notifications: true,
  location: true,
  autoSave: true,
  highQuality: false,
  defaultCouncil: 'Westminster',
  theme: 'light',
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    toggleLocation: (state) => {
      state.location = !state.location;
    },
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave;
    },
    toggleHighQuality: (state) => {
      state.highQuality = !state.highQuality;
    },
    setDefaultCouncil: (state, action: PayloadAction<string>) => {
      state.defaultCouncil = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  toggleNotifications,
  toggleLocation,
  toggleAutoSave,
  toggleHighQuality,
  setDefaultCouncil,
  setTheme,
  setLanguage,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;