import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateImageUpload = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    location: Joi.string().pattern(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/).optional()
      .messages({
        'string.pattern.base': 'Please provide a valid UK postcode format (e.g., SW1A 1AA)'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }

  next();
};

export const validateFeedback = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    item_id: Joi.string().required()
      .messages({
        'string.empty': 'Item ID is required',
        'any.required': 'Item ID is required'
      }),
    user_correction: Joi.string().optional(),
    was_correct: Joi.boolean().required()
      .messages({
        'boolean.base': 'Please indicate if the recognition was correct',
        'any.required': 'Please indicate if the recognition was correct'
      }),
    confidence_score: Joi.number().min(0).max(100).optional(),
    user_location: Joi.string().optional(),
    feedback_type: Joi.string().valid('recognition', 'disposal', 'general').optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }

  next();
};

export const validateCouncilLookup = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    postcode: Joi.string().pattern(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/).required()
      .messages({
        'string.pattern.base': 'Please provide a valid UK postcode format (e.g., SW1A 1AA)',
        'any.required': 'Postcode is required'
      })
  });

  const { error } = schema.validate(req.params);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }

  next();
};

export const validateItemSearch = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    q: Joi.string().min(1).required()
      .messages({
        'string.empty': 'Search query is required',
        'string.min': 'Search query must be at least 1 character',
        'any.required': 'Search query is required'
      }),
    limit: Joi.number().integer().min(1).max(100).optional(),
    offset: Joi.number().integer().min(0).optional()
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }

  next();
};

export const validateBatchFeedback = (req: Request, res: Response, next: NextFunction) => {
  const feedbackItemSchema = Joi.object({
    item_id: Joi.string().required(),
    user_correction: Joi.string().optional(),
    was_correct: Joi.boolean().required(),
    confidence_score: Joi.number().min(0).max(100).optional(),
    user_location: Joi.string().optional(),
    feedback_type: Joi.string().valid('recognition', 'disposal', 'general').optional()
  });

  const schema = Joi.object({
    feedback_items: Joi.array().items(feedbackItemSchema).min(1).max(100).required()
      .messages({
        'array.min': 'At least one feedback item is required',
        'array.max': 'Maximum 100 feedback items per batch',
        'any.required': 'Feedback items array is required'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }

  next();
};