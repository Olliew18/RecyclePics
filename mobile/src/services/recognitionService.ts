import api from './api';

export interface RecognitionRequest {
  image: string; // base64 encoded image
  location?: string;
}

export interface Detection {
  item: string;
  confidence: number;
  bin_color: string;
  category: string;
  disposal_note: string;
  requires_user_input: boolean;
  location_guidance: Record<string, string>;
}

export interface RecognitionResponse {
  success: boolean;
  detections: Detection[];
  processing_time: number;
  model_info: {
    model: string;
    version: string;
  };
}

export const recognizeImage = async (data: RecognitionRequest): Promise<RecognitionResponse> => {
  try {
    const response = await api.post('/recognize', data);
    return response.data;
  } catch (error) {
    console.error('Recognition error:', error);
    throw error;
  }
};

export const getRecognitionStatus = async () => {
  try {
    const response = await api.get('/recognize/status');
    return response.data;
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
};

export const submitFeedback = async (feedback: {
  item_id: string;
  user_correction?: string;
  was_correct: boolean;
  confidence_score?: number;
  user_location?: string;
  feedback_type?: 'recognition' | 'disposal' | 'general';
}) => {
  try {
    const response = await api.post('/feedback', feedback);
    return response.data;
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw error;
  }
};

export const submitBatchFeedback = async (feedbackItems: any[]) => {
  try {
    const response = await api.post('/feedback/batch', {
      feedback_items: feedbackItems,
    });
    return response.data;
  } catch (error) {
    console.error('Batch feedback error:', error);
    throw error;
  }
};