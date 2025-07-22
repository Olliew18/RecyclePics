// Mock food items data - in production, this would come from a database
const foodItems = [
  {
    id: 'apple_001',
    name: 'Apple',
    alternate_names: ['red apple', 'green apple', 'gala apple', 'fuji apple'],
    category: 'fruit',
    bin_color: 'brown',
    disposal_note: 'Remove sticker, compost in brown bin',
    requires_user_input: false,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
      'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
    }
  },
  {
    id: 'banana_001',
    name: 'Banana',
    alternate_names: ['yellow banana', 'ripe banana', 'green banana'],
    category: 'fruit',
    bin_color: 'brown',
    disposal_note: 'Quick decomposition, high potassium content',
    requires_user_input: false,
    packaging_warning: false,
    location_rules: {
      'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
      'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
    }
  },
  {
    id: 'plastic_bottle_001',
    name: 'Plastic Bottle',
    alternate_names: ['water bottle', 'soda bottle', 'drink bottle'],
    category: 'container',
    bin_color: 'blue',
    disposal_note: 'Remove cap, rinse, check plastic number',
    requires_user_input: true,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'Recycling bin (blue) if clean, general waste if contaminated',
      'Tower Hamlets': 'Mixed recycling bin - must be clean and cap removed'
    }
  },
  {
    id: 'pizza_box_001',
    name: 'Pizza Box',
    alternate_names: ['takeaway box', 'cardboard box'],
    category: 'packaging',
    bin_color: 'brown',
    disposal_note: 'Greasy boxes to general waste, clean parts to recycling',
    requires_user_input: true,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'Clean cardboard → recycling, greasy parts → general waste',
      'Tower Hamlets': 'Tear off clean parts for recycling, rest to general waste'
    }
  },
  {
    id: 'bread_001',
    name: 'Bread',
    alternate_names: ['sliced bread', 'loaf', 'sandwich bread'],
    category: 'bread',
    bin_color: 'brown',
    disposal_note: 'Break into pieces, moldy bread OK',
    requires_user_input: false,
    packaging_warning: false,
    location_rules: {
      'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
      'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
    }
  },
  {
    id: 'cheese_001',
    name: 'Cheese',
    alternate_names: ['cheddar', 'mozzarella', 'parmesan'],
    category: 'dairy',
    bin_color: 'black',
    disposal_note: 'General waste only, attracts pests',
    requires_user_input: false,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'General waste - not compostable',
      'Tower Hamlets': 'General waste - not compostable'
    }
  },
  {
    id: 'coffee_cup_001',
    name: 'Coffee Cup',
    alternate_names: ['disposable cup', 'takeaway cup'],
    category: 'packaging',
    bin_color: 'black',
    disposal_note: 'Most disposable cups not recyclable',
    requires_user_input: true,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'General waste - disposable cups not recyclable',
      'Tower Hamlets': 'General waste - check for special collection'
    }
  },
  {
    id: 'orange_001',
    name: 'Orange',
    alternate_names: ['citrus', 'mandarin', 'clementine'],
    category: 'fruit',
    bin_color: 'brown',
    disposal_note: 'Citrus benefits for compost, pest deterrent',
    requires_user_input: false,
    packaging_warning: false,
    location_rules: {
      'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
      'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
    }
  },
  {
    id: 'yogurt_container_001',
    name: 'Yogurt Container',
    alternate_names: ['yogurt pot', 'dairy container'],
    category: 'packaging',
    bin_color: 'blue',
    disposal_note: 'Empty contents, check container recyclability',
    requires_user_input: true,
    packaging_warning: true,
    location_rules: {
      'Westminster': 'Recycling if clean, general waste if contaminated',
      'Tower Hamlets': 'Mixed recycling if clean'
    }
  },
  {
    id: 'egg_shells_001',
    name: 'Egg Shells',
    alternate_names: ['eggshell', 'egg shell'],
    category: 'organic',
    bin_color: 'brown',
    disposal_note: 'Crush first, high calcium content',
    requires_user_input: false,
    packaging_warning: false,
    location_rules: {
      'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
      'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
    }
  }
];

export const searchFoodItems = async (query: string, limit: number = 20, offset: number = 0) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return foodItems.slice(offset, offset + limit);
  }

  const results = foodItems.filter(item => {
    const searchableText = [
      item.name.toLowerCase(),
      ...item.alternate_names.map(name => name.toLowerCase()),
      item.category.toLowerCase(),
      item.disposal_note.toLowerCase()
    ].join(' ');

    return searchableText.includes(normalizedQuery);
  });

  return results.slice(offset, offset + limit);
};

export const getFoodItemById = async (id: string) => {
  return foodItems.find(item => item.id === id) || null;
};

export const getFoodItemsByCategory = async (category: string) => {
  const normalizedCategory = category.toLowerCase();
  return foodItems.filter(item => 
    item.category.toLowerCase() === normalizedCategory
  );
};

export const getFoodItemsByBinColor = async (binColor: string) => {
  const normalizedBinColor = binColor.toLowerCase();
  return foodItems.filter(item => 
    item.bin_color.toLowerCase() === normalizedBinColor
  );
};

export const getFoodItemCategories = async () => {
  const categories = [...new Set(foodItems.map(item => item.category))];
  return categories.sort();
};