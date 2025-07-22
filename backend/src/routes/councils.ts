import { Router } from 'express';
import { getCouncilByPostcode, getAllCouncils } from '../services/councilService';

const router = Router();

/**
 * @route   GET /api/v1/councils
 * @desc    Get all available councils
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const councils = await getAllCouncils();
    
    res.status(200).json({
      success: true,
      data: councils,
      count: councils.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/councils/:postcode
 * @desc    Get council information by postcode
 * @access  Public
 */
router.get('/:postcode', async (req, res, next) => {
  try {
    const { postcode } = req.params;
    
    if (!postcode) {
      return res.status(400).json({
        error: 'Postcode required',
        message: 'Please provide a valid UK postcode'
      });
    }

    const council = await getCouncilByPostcode(postcode);
    
    if (!council) {
      return res.status(404).json({
        error: 'Council not found',
        message: `No council found for postcode: ${postcode}`,
        suggestions: [
          'Check the postcode format (e.g., SW1A 1AA)',
          'Try a different postcode',
          'Contact support if the issue persists'
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: council,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/councils/:postcode/rules
 * @desc    Get disposal rules for a specific council
 * @access  Public
 */
router.get('/:postcode/rules', async (req, res, next) => {
  try {
    const { postcode } = req.params;
    
    if (!postcode) {
      return res.status(400).json({
        error: 'Postcode required',
        message: 'Please provide a valid UK postcode'
      });
    }

    const council = await getCouncilByPostcode(postcode);
    
    if (!council) {
      return res.status(404).json({
        error: 'Council not found',
        message: `No council found for postcode: ${postcode}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        council: council.name,
        postcode: postcode,
        rules: council.rules,
        collection_schedule: council.collection_schedule,
        special_instructions: council.special_instructions
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/councils/:postcode/schedule
 * @desc    Get collection schedule for a specific council
 * @access  Public
 */
router.get('/:postcode/schedule', async (req, res, next) => {
  try {
    const { postcode } = req.params;
    
    if (!postcode) {
      return res.status(400).json({
        error: 'Postcode required',
        message: 'Please provide a valid UK postcode'
      });
    }

    const council = await getCouncilByPostcode(postcode);
    
    if (!council) {
      return res.status(404).json({
        error: 'Council not found',
        message: `No council found for postcode: ${postcode}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        council: council.name,
        postcode: postcode,
        collection_schedule: council.collection_schedule,
        next_collection: council.next_collection
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

export default router;