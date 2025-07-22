import { Router } from 'express';
import { searchFoodItems, getFoodItemById, getFoodItemsByCategory } from '../services/itemService';

const router = Router();

/**
 * @route   GET /api/v1/items
 * @desc    Get all food items with optional filtering
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;
    
    let items;
    
    if (category) {
      items = await getFoodItemsByCategory(category as string);
    } else {
      items = await searchFoodItems('', parseInt(limit as string), parseInt(offset as string));
    }

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: items.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/items/search
 * @desc    Search food items by name or description
 * @access  Public
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q = '', limit = 20, offset = 0 } = req.query;
    
    if (!q || (q as string).trim().length === 0) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search term'
      });
    }

    const items = await searchFoodItems(
      q as string, 
      parseInt(limit as string), 
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
      query: q,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: items.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/items/:id
 * @desc    Get specific food item by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: 'Item ID required',
        message: 'Please provide a valid item ID'
      });
    }

    const item = await getFoodItemById(id);
    
    if (!item) {
      return res.status(404).json({
        error: 'Item not found',
        message: `No food item found with ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: item,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/items/category/:category
 * @desc    Get food items by category
 * @access  Public
 */
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        error: 'Category required',
        message: 'Please provide a valid category'
      });
    }

    const items = await getFoodItemsByCategory(category);
    
    if (!items || items.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No items found in category: ${category}`,
        suggestions: [
          'fruit',
          'vegetable', 
          'bread',
          'dairy',
          'meat',
          'packaging'
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
      category: category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/items/categories
 * @desc    Get all available food item categories
 * @access  Public
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = [
      'fruit',
      'vegetable',
      'bread',
      'dairy',
      'meat',
      'packaging',
      'beverage',
      'organic',
      'container',
      'unknown'
    ];

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

export default router;