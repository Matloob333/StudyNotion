const express = require('express');
const { body, validationResult } = require('express-validator');
const { Category } = require('../models/index');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/categories
// @desc    Create a new category (Admin only)
// @access  Private
router.post('/', [
  auth,
  body('name', 'Category name is required').not().isEmpty(),
  body('description', 'Category description is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, icon, color } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({
      name,
      description,
      icon: icon || '📚',
      color: color || '#6366f1'
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category (Admin only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Instead of deleting, mark as inactive
    category.isActive = false;
    await category.save();

    res.json({ message: 'Category deactivated' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router; 