const { InventoryItem, Transaction, DailyInventory } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

// Get all inventory items
const getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: {
        isActive: true
      },
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory items', error: error.message });
  }
};

// Get a single inventory item by ID
const getItemById = async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory item', error: error.message });
  }
};

// Create a new inventory item
const createItem = async (req, res) => {
  try {
    const { 
      name, unit, category, beginning = 0, in: inValue = 0,
      out = 0, spoilage = 0
    } = req.body;

    // Validate required fields
    if (!name || !unit || !category) {
      return res.status(400).json({ 
        message: 'Name, unit, and category are required fields' 
      });
    }

    // Calculate derived values
    const totalInventory = parseInt(beginning) + parseInt(inValue);
    const remaining = Math.max(0, totalInventory - parseInt(out) - parseInt(spoilage));

    // Create new item
    const newItem = await InventoryItem.create({
      name,
      unit,
      category,
      beginning: parseInt(beginning),
      in: parseInt(inValue),
      totalInventory,
      out: parseInt(out),
      spoilage: parseInt(spoilage),
      remaining,
      isActive: true
    });

    res.status(201).json({
      message: 'Inventory item created successfully',
      item: newItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating inventory item', error: error.message });
  }
};

// Update an inventory item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, unit, category, beginning, in: inValue,
      out, spoilage, isActive
    } = req.body;

    // Check if item exists
    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Prepare update data with validated numbers
    const updateData = {
      ...(name && { name }),
      ...(unit && { unit }),
      ...(category && { category }),
      ...(beginning !== undefined && { beginning: parseInt(beginning) || 0 }),
      ...(inValue !== undefined && { in: parseInt(inValue) || 0 }),
      ...(out !== undefined && { out: parseInt(out) || 0 }),
      ...(spoilage !== undefined && { spoilage: parseInt(spoilage) || 0 }),
      ...(isActive !== undefined && { isActive })
    };

    // Calculate derived values if relevant fields are being updated
    if (beginning !== undefined || inValue !== undefined) {
      updateData.totalInventory = (parseInt(beginning) || item.beginning) + (parseInt(inValue) || item.in);
    }

    if (beginning !== undefined || inValue !== undefined || out !== undefined || spoilage !== undefined) {
      const totalInv = updateData.totalInventory || item.totalInventory;
      const outVal = parseInt(out) || item.out;
      const spoilageVal = parseInt(spoilage) || item.spoilage;
      updateData.remaining = Math.max(0, totalInv - outVal - spoilageVal);
    }

    // Update item
    await item.update(updateData);

    // Fetch updated item to return
    const updatedItem = await InventoryItem.findByPk(id);

    res.status(200).json({
      message: 'Inventory item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
};

// Soft delete an inventory item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Soft delete by setting isActive to false
    await item.update({ isActive: false });

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};

// Get low stock items (items with remaining quantity below 20% of total inventory)
const getLowStockItems = async (req, res) => {
  try {
    const items = await InventoryItem.findAll({
      where: {
        isActive: true,
        [Op.and]: [
          sequelize.literal('CAST("totalInventory" AS INTEGER) > 0'),
          sequelize.literal('CAST("remaining" AS FLOAT) / CAST("totalInventory" AS FLOAT) <= 0.2')
        ]
      },
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ]
    });

    if (!items || items.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error in getLowStockItems:', error);
    res.status(500).json({ 
      message: 'Error fetching low stock items', 
      error: error.message 
    });
  }
};

// Get inventory items computed for a specific date (Optimized)
const getInventoryByDate = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // 1. Get all active items
    const allItems = await InventoryItem.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    // 2. Calculate yesterday's date
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateStr = yesterday.toISOString().split('T')[0];
    const todayDateStr = new Date(date).toISOString().split('T')[0];

    // 3. Get TODAY's inventory records
    const todayRecords = await DailyInventory.findAll({
      where: { date: todayDateStr },
      raw: true
    });

    // 4. Get YESTERDAY's inventory records
    const yesterdayRecords = await DailyInventory.findAll({
      where: { date: yesterdayDateStr },
      raw: true
    });

    console.log(`📅 Date: ${date}`);
    console.log(`📅 Yesterday: ${yesterdayDateStr}`);
    console.log(`📦 Today records found: ${todayRecords.length}`);
    console.log(`📦 Yesterday records found: ${yesterdayRecords.length}`);

    // 5. Build lookup maps - Checking both inventoryItemId and item_id as requested
    const todayLookup = {};
    todayRecords.forEach(r => {
      const key = String(r.inventoryItemId || r.item_id); 
      todayLookup[key] = r;
    });

    const yesterdayLookup = {};
    yesterdayRecords.forEach(r => {
      const key = String(r.inventoryItemId || r.item_id); 
      yesterdayLookup[key] = r.remaining;
      console.log(`✅ Stored yesterday: ID=${key}, remaining=${r.remaining}`);
    });

    // 6. Build response for each item
    const response = allItems.map(item => {
      const itemId = String(item.id);
      const todayData = todayLookup[itemId];
      const yesterdayRemaining = yesterdayLookup[itemId] || 0;

      console.log(`\n🔍 ${item.name} (ID: ${itemId})`);
      console.log(`   Yesterday remaining: ${yesterdayRemaining}`);
      console.log(`   Today has entry: ${!!todayData}`);

      // If today has data, use it
      if (todayData) {
        return {
          id: item.id,
          name: item.name,
          unit: item.unit,
          category: item.category,
          beginning: todayData.beginning,
          in: todayData.inQuantity,
          out: todayData.outQuantity,
          spoilage: todayData.spoilage,
          totalInventory: todayData.beginning + todayData.inQuantity,
          remaining: todayData.remaining,
          isActive: item.isActive,
          hasManualEntry: true,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      }

      // Otherwise, carry over from yesterday
      return {
        id: item.id,
        name: item.name,
        unit: item.unit,
        category: item.category,
        beginning: yesterdayRemaining,  // ← THIS IS THE MAGIC LINE
        in: 0,
        out: 0,
        spoilage: 0,
        totalInventory: yesterdayRemaining,
        remaining: yesterdayRemaining,
        isActive: item.isActive,
        hasManualEntry: false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });

    // Maintain response structure expected by frontend
    const groupedInventory = response.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      date: todayDateStr,
      inventory: response,
      groupedInventory,
      summary: {
        totalItems: response.length,
        totalInventoryValue: response.reduce((sum, item) => sum + item.totalInventory, 0),
        totalRemaining: response.reduce((sum, item) => sum + item.remaining, 0)
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory', details: error.message });
  }
};

// Helper to format and send response
const sendInventoryResponse = (res, dateStr, inventoryData) => {
  // Group by category
  const groupedInventory = inventoryData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  res.status(200).json({
    date: dateStr,
    inventory: inventoryData,
    groupedInventory,
    summary: {
      totalItems: inventoryData.length,
      totalInventoryValue: inventoryData.reduce((sum, item) => sum + item.totalInventory, 0),
      totalRemaining: inventoryData.reduce((sum, item) => sum + item.remaining, 0)
    }
  });
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  getInventoryByDate
};
