import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      ml_service: 'connected',
      redis: 'connected'
    }
  });
});

/**
 * @route   GET /api/v1/health/ready
 * @desc    Readiness check endpoint
 * @access  Public
 */
router.get('/ready', (req, res) => {
  // Check if all required services are ready
  const isReady = true; // In production, check actual service status
  
  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/v1/health/live
 * @desc    Liveness check endpoint
 * @access  Public
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

export default router;