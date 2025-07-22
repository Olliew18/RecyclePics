import { Router } from 'express';
import { saveFeedback, getFeedbackStats } from '../services/feedbackService';

const router = Router();

/**
 * @route   POST /api/v1/feedback
 * @desc    Submit user feedback for recognition accuracy
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { 
      item_id, 
      user_correction, 
      was_correct, 
      confidence_score,
      user_location,
      feedback_type = 'recognition'
    } = req.body;

    // Validate required fields
    if (!item_id) {
      return res.status(400).json({
        error: 'Item ID required',
        message: 'Please provide the item ID for feedback'
      });
    }

    if (was_correct === undefined) {
      return res.status(400).json({
        error: 'Accuracy feedback required',
        message: 'Please indicate if the recognition was correct'
      });
    }

    const feedback = {
      item_id,
      user_correction: user_correction || null,
      was_correct,
      confidence_score: confidence_score || null,
      user_location: user_location || null,
      feedback_type,
      timestamp: new Date().toISOString()
    };

    await saveFeedback(feedback);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        feedback_id: Date.now().toString(), // In production, use actual DB ID
        timestamp: feedback.timestamp
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/feedback/stats
 * @desc    Get feedback statistics for model improvement
 * @access  Public
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getFeedbackStats();

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/feedback/batch
 * @desc    Submit multiple feedback items at once
 * @access  Public
 */
router.post('/batch', async (req, res, next) => {
  try {
    const { feedback_items } = req.body;

    if (!feedback_items || !Array.isArray(feedback_items)) {
      return res.status(400).json({
        error: 'Feedback items required',
        message: 'Please provide an array of feedback items'
      });
    }

    if (feedback_items.length === 0) {
      return res.status(400).json({
        error: 'Empty feedback array',
        message: 'Please provide at least one feedback item'
      });
    }

    if (feedback_items.length > 100) {
      return res.status(400).json({
        error: 'Too many feedback items',
        message: 'Maximum 100 feedback items per batch'
      });
    }

    const savedFeedback = [];

    for (const feedback of feedback_items) {
      const { 
        item_id, 
        user_correction, 
        was_correct, 
        confidence_score,
        user_location,
        feedback_type = 'recognition'
      } = feedback;

      if (!item_id || was_correct === undefined) {
        continue; // Skip invalid feedback
      }

      const feedbackData = {
        item_id,
        user_correction: user_correction || null,
        was_correct,
        confidence_score: confidence_score || null,
        user_location: user_location || null,
        feedback_type,
        timestamp: new Date().toISOString()
      };

      await saveFeedback(feedbackData);
      savedFeedback.push(feedbackData);
    }

    res.status(201).json({
      success: true,
      message: `Successfully saved ${savedFeedback.length} feedback items`,
      data: {
        saved_count: savedFeedback.length,
        total_submitted: feedback_items.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/feedback/accuracy
 * @desc    Get recognition accuracy statistics
 * @access  Public
 */
router.get('/accuracy', async (req, res, next) => {
  try {
    const { timeframe = '7d' } = req.query;

    const stats = await getFeedbackStats();
    
    // Calculate accuracy metrics
    const totalFeedback = stats.total_feedback || 0;
    const correctFeedback = stats.correct_feedback || 0;
    const accuracy = totalFeedback > 0 ? (correctFeedback / totalFeedback) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        total_feedback: totalFeedback,
        correct_feedback: correctFeedback,
        incorrect_feedback: totalFeedback - correctFeedback,
        timeframe: timeframe,
        confidence_breakdown: stats.confidence_breakdown || {}
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

export default router;