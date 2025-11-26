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
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const targetDate = new Date(date);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    // 1. Fetch all active items (Fastest)
    const inventoryItems = await InventoryItem.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'unit', 'category', 'beginning', 'isActive', 'createdAt', 'updatedAt'],
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    // 2. Fetch DailyInventory records for the target date
    const dailyInventoryEntries = await DailyInventory.findAll({
      where: { date: targetDateStr },
      attributes: ['inventoryItemId', 'beginning', 'inQuantity', 'outQuantity', 'spoilage', 'remaining']
    });

    // Create a map for quick lookup of daily entries
    const dailyMap = {};
    dailyInventoryEntries.forEach(entry => {
      dailyMap[entry.inventoryItemId] = entry;
    });

    // 3. Fetch transactions for calculation fallback
    // Calculate date ranges
    // Use string manipulation for precise date math to avoid timezone issues
    const targetDateObj = new Date(targetDateStr);
    targetDateObj.setDate(targetDateObj.getDate() - 1);
    const previousDateStr = targetDateObj.toISOString().split('T')[0];
    
    console.log('Fetching history for date:', previousDateStr);

    // Fetch previous day's DailyInventory entries to maintain continuity
    // (Already implemented but verifying usage)
    const previousDailyEntries = await DailyInventory.findAll({
      where: { date: previousDateStr },
      attributes: ['inventoryItemId', 'remaining']
    });

    // Create a map for quick lookup of yesterday's remaining values
    const yesterdayMap = new Map();
    previousDailyEntries.forEach(entry => {
      yesterdayMap.set(entry.inventoryItemId, entry.remaining);
    });

    // Fetch ALL relevant transactions in TWO queries
    const previousDayTransactions = await Transaction.findAll({
      where: {
        date: {
          [Op.between]: [
            new Date(previousDateStr + 'T00:00:00.000Z'),
            new Date(previousDateStr + 'T23:59:59.999Z')
          ]
        }
      },
      attributes: ['inventoryItemId', 'type', 'quantity']
    });

    const todayTransactions = await Transaction.findAll({
      where: {
        date: {
          [Op.between]: [
            new Date(targetDateStr + 'T00:00:00.000Z'),
            new Date(targetDateStr + 'T23:59:59.999Z')
          ]
        }
      },
      attributes: ['inventoryItemId', 'type', 'quantity']
    });

    // Helper function to aggregate transactions by item ID
    const groupTransactionsByItem = (transactions) => {
      const grouped = {};
      transactions.forEach(t => {
        if (!grouped[t.inventoryItemId]) {
          grouped[t.inventoryItemId] = { beginning: 0, in: 0, out: 0, spoilage: 0 };
        }
        
        if (t.type === 'beginning') grouped[t.inventoryItemId].beginning += t.quantity;
        else if (t.type === 'in') grouped[t.inventoryItemId].in += t.quantity;
        else if (t.type === 'out') grouped[t.inventoryItemId].out += t.quantity;
        else if (t.type === 'spoilage') grouped[t.inventoryItemId].spoilage += t.quantity;
      });
      return grouped;
    };

    const prevDayMap = groupTransactionsByItem(previousDayTransactions);
    const todayMap = groupTransactionsByItem(todayTransactions);

    // 4. FOR EACH ITEM, construct the data using Priority Logic
    const computedInventory = inventoryItems.map(item => {
      const itemId = item.id;
      
      // PRIORITY 1: If a DailyInventory record exists, use it DIRECTLY
      if (dailyMap[itemId]) {
        const entry = dailyMap[itemId];
        return {
          id: item.id,
          name: item.name,
          unit: item.unit,
          category: item.category,
          beginning: entry.beginning,
          in: entry.inQuantity,
          out: entry.outQuantity,
          spoilage: entry.spoilage,
          totalInventory: entry.beginning + entry.inQuantity,
          remaining: entry.remaining,
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      }

      // PRIORITY 2: Fallback to calculation logic
      const prevTrans = prevDayMap[itemId] || { beginning: 0, in: 0, out: 0, spoilage: 0 };
      const todayTrans = todayMap[itemId] || { beginning: 0, in: 0, out: 0, spoilage: 0 };

      let todayBeginning = 0;
      
      // IF (Yesterday's Record Exists in yesterdayMap) -> Use Yesterday's Remaining as Today's Beginning
      if (yesterdayMap.has(itemId)) {
        todayBeginning = yesterdayMap.get(itemId) || 0;
      } else {
        // ELSE -> Default to 0 (or master beginning if this is day 1)
        // Note: We only fallback to master 'beginning' if there is absolutely NO history found
        // But for day-to-day continuity, 0 is safer than recalculating from scratch without context
        todayBeginning = 0;
      }

      const todayIn = todayTrans.in;
      const todayOut = todayTrans.out;
      const todaySpoilage = todayTrans.spoilage;

      const totalInventory = todayBeginning + todayIn;
      const remaining = Math.max(0, totalInventory - todayOut - todaySpoilage);

      return {
        id: item.id,
        name: item.name,
        unit: item.unit,
        category: item.category,
        beginning: todayBeginning,
        in: todayIn,
        out: todayOut,
        spoilage: todaySpoilage,
        totalInventory,
        remaining,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });

    return sendInventoryResponse(res, targetDateStr, computedInventory);

  } catch (error) {
    console.error('Error in getInventoryByDate:', error);
    res.status(500).json({ 
      message: 'Error fetching inventory by date', 
      error: error.message 
    });
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
