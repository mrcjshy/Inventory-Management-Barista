// DARRYL YAM C. CANDILADA - BSIT -2-I

const { 
  User, 
  InventoryItem, 
  Settings,
  Transaction 
} = require('../models');
const bcrypt = require('bcryptjs');

// Extract items from the seeder file structure
// Since the other file exports an object with an 'up' function that calls bulkInsert,
// we can't just require it and get the data directly without some parsing or restructuring.
// However, for a clean refactor, I'll manually copy the item data structure here 
// or create a helper to extract it if I could, but copying is safer to ensure 
// we use Sequelize model methods (findOrCreate) instead of raw queryInterface.bulkInsert
// which might bypass model hooks/validations if we were using them (though bulkInsert is faster).

// Given the request is to "Import the array of items", but the file is a migration/seeder 
// that executes code, we'll extract the data array from the file content or 
// create a new data file. 
// BUT, to keep it simple and single-command as requested, I will adapt the 
// "20240305000000-demo-inventory-items.js" file to export the data 
// OR I will duplicate the data here.

// BETTER APPROACH: Let's modify this file to define the items directly 
// or require a separate data file. 
// Since I can't easily "require" the data from the other file because it's inside an async function,
// I will read the raw items from the other file and include them here.

const fullInventoryItems = [
      // TEAS & COFFEE - in exact order from image
      {
        name: 'Thai Tea Premium',
        unit: 'pack',
        category: 'TEAS & COFFEE',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Thai Green Tea',
        unit: 'pack',
        category: 'TEAS & COFFEE',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Full Tea',
        unit: 'pack',
        category: 'TEAS & COFFEE',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Half Tea',
        unit: 'pack',
        category: 'TEAS & COFFEE',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Thai Coffee',
        unit: 'pack',
        category: 'TEAS & COFFEE',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // SYRUPS - in exact order from image
      {
        name: 'Fructose Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Lemon Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Wintermelon Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Passion Fruit Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Lychee Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Green Apple Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Strawberry Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Strawberry Pulp',
        unit: 'gallon',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Red Sala Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Roasted Brown Sugar',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Caramel Syrup (Da  Vinci)',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Ube Syrup',
        unit: 'bottle',
        category: 'SYRUPS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // PUREES - in exact order from image
      {
        name: 'Blueberry Puree',
        unit: 'canister',
        category: 'PUREES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Banana Puree',
        unit: 'canister',
        category: 'PUREES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Ube Puree',
        unit: 'canister',
        category: 'PUREES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // DAIRY & POWDER - in exact order from image
      {
        name: 'Condensed Milk',
        unit: 'can',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Evaporated Milk',
        unit: 'can',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Creamer Powder Milk Mixture',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Creamer Powder Full Tea',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Whipping Cream (Arla)',
        unit: '1l',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Whipping Cream (PG)',
        unit: '1l',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Full Cream Milk',
        unit: '1l',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Cheesecake Powder',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Salty Cheese Powder',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Dark Choco Powder',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'RSC Powder',
        unit: 'sachet',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Lime Powder',
        unit: 'g',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Tapioca Big Pearl',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Mini Pearl',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Grass Jelly',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Nata Original',
        unit: 'gallon',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Coffee Jelly',
        unit: 'gallon',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Fruit Jelly',
        unit: 'gallon',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Egg Pudding',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Taro Balls',
        unit: 'pack',
        category: 'DAIRY & POWDER',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // OTHER EQUIPMENTS - in exact order from image
      {
        name: 'Permanent Marker',
        unit: 'pc',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Masking Tape',
        unit: 'pc',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Receipt Paper',
        unit: 'pc',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Butane',
        unit: 'pc',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Garbage Bag',
        unit: 'pc',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Egg Pudding Container',
        unit: 'pack',
        category: 'OTHER EQUIPMENTS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // GH SAUCES - in exact order from image
      {
        name: 'Sea Salt Caramel',
        unit: 'bottle',
        category: 'GH SAUCES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Chocolate',
        unit: 'bottle',
        category: 'GH SAUCES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Caramel',
        unit: 'bottle',
        category: 'GH SAUCES',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // GH POWDERS - in exact order from image
      {
        name: 'RSC Powder',
        unit: 'pack',
        category: 'GH POWDERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Dark Chocolate',
        unit: 'can',
        category: 'GH POWDERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Frozen Hot Cocoa',
        unit: 'can',
        category: 'GH POWDERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Vanilla',
        unit: 'can',
        category: 'GH POWDERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Mocha',
        unit: 'can',
        category: 'GH POWDERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // OTHERS - in exact order from image
      {
        name: 'Brown Sugar 1kg',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Brown Sugar 250g Pack',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'White/Washed Sugar',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Crushed Oreo',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Biscoff Biscuit',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Cream Charger',
        unit: 'pack',
        category: 'OTHERS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // CUPS/STRAWS/TISSUE ETC. - modified to make Boba Straw and Slim Straw consecutive
      {
        name: '500 ml Frosted Cups',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: '700 ml Frosted Cups',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: '500 ml Frappe Cups',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Conjoined Lid',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: '98mm Dome Lid (Frappe)',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Egg Pudding Container',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Boba Straw',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Slim Straw',
        unit: 'pc',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Tissue',
        unit: 'pack',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Single Take-out Plastic',
        unit: 'pack',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Double Take-out Plastic',
        unit: 'pack',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Cling Wrap',
        unit: 'roll',
        category: 'CUPS/STRAWS/TISSUE ETC.',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },

      // TWINNINGS - in exact order from image
      {
        name: 'Green Tea Jasmine',
        unit: 'bag',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Peach & Passionfruit',
        unit: 'bag',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'English Breakfast Tea',
        unit: 'bag',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Pure Chamomile',
        unit: 'bag',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Lemon and Ginger',
        unit: 'bag',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Pure Honey (Stick)',
        unit: 'stick',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Passionfruit Jam',
        unit: 'gallon',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      },
      {
        name: 'Lime Fruit (Green)',
        unit: 'pc',
        category: 'TWINNINGS',
        beginning: 0,
        in: 0,
        totalInventory: 0,
        out: 0,
        spoilage: 0,
        remaining: 0,
        isActive: true
      }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    const adminUser = await User.findOrCreate({
      where: { username: 'teamlead' },
      defaults: {
        username: 'teamlead',
        email: 'teamlead@inventory.com',
        password: 'teamlead123',
        role: 'teamlead'
      }
    });

    // Create staff user
    const staffUser = await User.findOrCreate({
      where: { username: 'barista' },
      defaults: {
        username: 'barista',
        email: 'barista@inventory.com',
        password: 'barista123',
        role: 'barista'
      }
    });

    // Seed full inventory items
    console.log('Seeding inventory items...');
    
    // Process items in chunks to avoid overwhelming the database connection
    // or transaction limits if there are many items
    const chunkSize = 50;
    for (let i = 0; i < fullInventoryItems.length; i += chunkSize) {
      const chunk = fullInventoryItems.slice(i, i + chunkSize);
      
      for (const itemData of chunk) {
        // Calculate totalInventory and remaining (though they are 0 in the seed data)
        const totalInventory = itemData.beginning + itemData.in;
        const remaining = totalInventory - itemData.out - itemData.spoilage;

        await InventoryItem.findOrCreate({
          where: { name: itemData.name },
          defaults: {
            ...itemData,
            totalInventory,
            remaining
          }
        });
      }
      console.log(`Processed items ${i + 1} to ${Math.min(i + chunkSize, fullInventoryItems.length)}`);
    }

    // Create sample settings
    const settings = [
      {
        key: 'lowStockThreshold',
        value: '10',
        type: 'number',
        description: 'Low stock threshold for inventory items'
      },
      {
        key: 'companyName',
        value: 'Inventory Management System',
        type: 'string',
        description: 'Company name displayed in the application'
      },
      {
        key: 'enableNotifications',
        value: 'true',
        type: 'boolean',
        description: 'Enable system notifications'
      }
    ];

    for (const settingData of settings) {
      await Settings.findOrCreate({
        where: { key: settingData.key },
        defaults: settingData
      });
    }

    console.log('Database seeding completed successfully!');
    console.log('Admin User: username: teamlead, password: teamlead123');
    console.log('Staff User: username: barista, password: barista123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;
