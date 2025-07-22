// Mock feedback storage - in production, this would be a database
let feedbackStorage: any[] = [];

export interface Feedback {
  item_id: string;
  user_correction?: string;
  was_correct: boolean;
  confidence_score?: number;
  user_location?: string;
  feedback_type: 'recognition' | 'disposal' | 'general';
  timestamp: string;
}

export const saveFeedback = async (feedback: Feedback) => {
  // In production, save to database
  feedbackStorage.push({
    id: Date.now().toString(),
    ...feedback
  });

  // Keep only last 1000 feedback items in memory
  if (feedbackStorage.length > 1000) {
    feedbackStorage = feedbackStorage.slice(-1000);
  }

  return feedback;
};

export const getFeedbackStats = async () => {
  const totalFeedback = feedbackStorage.length;
  const correctFeedback = feedbackStorage.filter(f => f.was_correct).length;
  const incorrectFeedback = totalFeedback - correctFeedback;

  // Calculate confidence breakdown
  const confidenceBreakdown = feedbackStorage.reduce((acc, feedback) => {
    if (feedback.confidence_score !== undefined) {
      const range = Math.floor(feedback.confidence_score / 10) * 10;
      const key = `${range}-${range + 9}`;
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate accuracy by feedback type
  const accuracyByType = feedbackStorage.reduce((acc, feedback) => {
    const type = feedback.feedback_type;
    if (!acc[type]) {
      acc[type] = { total: 0, correct: 0 };
    }
    acc[type].total++;
    if (feedback.was_correct) {
      acc[type].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  // Calculate percentage accuracy for each type
  Object.keys(accuracyByType).forEach(type => {
    const { total, correct } = accuracyByType[type];
    accuracyByType[type] = {
      total,
      correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0
    };
  });

  return {
    total_feedback: totalFeedback,
    correct_feedback: correctFeedback,
    incorrect_feedback: incorrectFeedback,
    overall_accuracy: totalFeedback > 0 ? (correctFeedback / totalFeedback) * 100 : 0,
    confidence_breakdown: confidenceBreakdown,
    accuracy_by_type: accuracyByType,
    recent_feedback: feedbackStorage.slice(-10).map(f => ({
      item_id: f.item_id,
      was_correct: f.was_correct,
      feedback_type: f.feedback_type,
      timestamp: f.timestamp
    }))
  };
};

export const getFeedbackByItem = async (itemId: string) => {
  return feedbackStorage.filter(f => f.item_id === itemId);
};

export const getFeedbackByType = async (feedbackType: string) => {
  return feedbackStorage.filter(f => f.feedback_type === feedbackType);
};

export const getRecentFeedback = async (limit: number = 50) => {
  return feedbackStorage.slice(-limit);
};

export const clearFeedback = async () => {
  feedbackStorage = [];
  return { message: 'All feedback cleared' };
};

// Mock function to simulate feedback analysis for ML model improvement
export const analyzeFeedbackForModelImprovement = async () => {
  const stats = await getFeedbackStats();
  
  const analysis = {
    total_items_analyzed: stats.total_feedback,
    accuracy_trend: stats.overall_accuracy > 85 ? 'improving' : 'needs_attention',
    problem_areas: [] as string[],
    recommendations: [] as string[]
  };

  // Identify problem areas
  if (stats.accuracy_by_type.recognition?.accuracy < 80) {
    analysis.problem_areas.push('recognition_accuracy');
    analysis.recommendations.push('Retrain model with more diverse food waste images');
  }

  if (stats.accuracy_by_type.disposal?.accuracy < 90) {
    analysis.problem_areas.push('disposal_guidance');
    analysis.recommendations.push('Update disposal rules database');
  }

  // Check confidence vs accuracy correlation
  const highConfidenceFeedback = feedbackStorage.filter(f => 
    f.confidence_score && f.confidence_score > 80
  );
  
  const highConfidenceAccuracy = highConfidenceFeedback.length > 0 
    ? (highConfidenceFeedback.filter(f => f.was_correct).length / highConfidenceFeedback.length) * 100
    : 0;

  if (highConfidenceAccuracy < 90) {
    analysis.problem_areas.push('confidence_calibration');
    analysis.recommendations.push('Recalibrate model confidence scores');
  }

  return analysis;
};