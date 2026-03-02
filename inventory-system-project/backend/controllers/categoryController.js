const { InventoryItem } = require('../models');
const sequelize = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const categories = await InventoryItem.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'name']
      ],
      where: { isActive: true },
      order: [['category', 'ASC']],
      raw: true
    });

    res.status(200).json(categories.map(c => ({ name: c.name })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const items = await InventoryItem.findAll({
      where: { category: id, isActive: true },
      order: [['name', 'ASC']]
    });

    if (items.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ name: id, items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

const createCategory = async (req, res) => {
  res.status(501).json({ message: 'Categories are derived from inventory items. Add an item with the desired category instead.' });
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'New category name is required' });
    }

    const [updatedCount] = await InventoryItem.update(
      { category: name },
      { where: { category: id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category renamed successfully', updatedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const itemCount = await InventoryItem.count({ where: { category: id, isActive: true } });
    if (itemCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with active items. Deactivate or move items first.',
        itemCount
      });
    }

    res.status(200).json({ message: 'Category has no active items' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}; 