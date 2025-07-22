import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Detection {
  item: string;
  confidence: number;
  bin_color: string;
  category: string;
  disposal_note: string;
  requires_user_input: boolean;
  location_guidance: Record<string, string>;
}

export interface HistoryItem {
  id: string;
  photo: string;
  detections: Detection[];
  timestamp: string;
  location: string;
}

interface RecognitionState {
  currentImage: string | null;
  currentDetections: Detection[];
  isProcessing: boolean;
  history: HistoryItem[];
  error: string | null;
}

const initialState: RecognitionState = {
  currentImage: null,
  currentDetections: [],
  isProcessing: false,
  history: [],
  error: null,
};

// Async thunk for image recognition
export const recognizeImage = createAsyncThunk(
  'recognition/recognizeImage',
  async (imageData: { base64: string; location?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/recognize', {
        image: imageData.base64,
        location: imageData.location || 'SW1A 1AA',
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Recognition failed');
      }
      return rejectWithValue('Recognition failed');
    }
  }
);

const recognitionSlice = createSlice({
  name: 'recognition',
  initialState,
  reducers: {
    setCurrentImage: (state, action: PayloadAction<string>) => {
      state.currentImage = action.payload;
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
      state.currentDetections = [];
    },
    addToHistory: (state, action: PayloadAction<HistoryItem>) => {
      state.history.unshift(action.payload);
      // Keep only last 100 items
      if (state.history.length > 100) {
        state.history = state.history.slice(0, 100);
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recognizeImage.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(recognizeImage.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentDetections = action.payload.detections || [];
        state.error = null;
      })
      .addCase(recognizeImage.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentImage,
  clearCurrentImage,
  addToHistory,
  clearHistory,
  removeFromHistory,
  setError,
} = recognitionSlice.actions;

export default recognitionSlice.reducer;