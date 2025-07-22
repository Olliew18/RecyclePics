import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import { validateImageUpload } from '../middleware/validation';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @route   POST /api/v1/recognize
 * @desc    Recognize food waste items in uploaded image
 * @access  Public
 */
router.post('/', upload.single('image'), validateImageUpload, async (req, res, next) => {
  try {
    const imageFile = req.file;
    const { location = 'SW1A 1AA' } = req.body;

    if (!imageFile) {
      return res.status(400).json({
        error: 'No image file provided',
        message: 'Please upload an image file'
      });
    }

    // Convert image to base64 for ML service
    const imageBuffer = imageFile.buffer;
    const base64Image = imageBuffer.toString('base64');

    // Call ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
    
    const startTime = Date.now();
    
    const response = await axios.post(`${mlServiceUrl}/recognize`, {
      image: base64Image,
      location: location
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const processingTime = Date.now() - startTime;

    // Add processing time to response
    const result = {
      ...response.data,
      processing_time: processingTime,
      backend_timestamp: new Date().toISOString()
    };

    res.status(200).json(result);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'ML service unavailable',
          message: 'Image recognition service is currently unavailable'
        });
      }
      
      if (error.response) {
        return res.status(error.response.status).json({
          error: 'ML service error',
          message: error.response.data?.message || 'Error processing image'
        });
      }
    }

    next(error);
  }
});

/**
 * @route   GET /api/v1/recognize/status
 * @desc    Check ML service status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
    
    const response = await axios.get(`${mlServiceUrl}/health`, {
      timeout: 5000
    });

    res.status(200).json({
      status: 'connected',
      ml_service: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(503).json({
      status: 'disconnected',
      error: 'ML service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;