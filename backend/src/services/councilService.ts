// Mock council data - in production, this would come from a database
const councils = [
  {
    id: 'westminster',
    name: 'Westminster City Council',
    postcode_prefixes: ['SW1A', 'SW1P', 'SW1E', 'SW1H', 'SW1V', 'SW1W', 'SW1X', 'SW1Y'],
    rules: {
      disposable_cups: 'general_waste',
      pizza_boxes: 'split_disposal',
      plastic_bottles: 'clean_recycling',
      food_waste: 'brown_bin'
    },
    collection_schedule: {
      compost: 'Wednesday',
      recycling: 'Monday',
      general: 'Tuesday'
    },
    special_instructions: [
      'Disposable cups go to general waste',
      'Pizza boxes: clean parts to recycling, greasy parts to general waste',
      'Plastic bottles must be clean and caps removed'
    ]
  },
  {
    id: 'tower_hamlets',
    name: 'Tower Hamlets Council',
    postcode_prefixes: ['E1', 'E2', 'E3', 'E14'],
    rules: {
      disposable_cups: 'recycling',
      pizza_boxes: 'split_disposal',
      plastic_bottles: 'mixed_recycling',
      food_waste: 'green_caddy'
    },
    collection_schedule: {
      compost: 'Thursday',
      recycling: 'Friday',
      general: 'Monday'
    },
    special_instructions: [
      'Disposable cups can be recycled',
      'Pizza boxes: tear off clean parts for recycling',
      'Mixed recycling bin for all clean containers'
    ]
  }
];

export const getCouncilByPostcode = async (postcode: string) => {
  // Normalize postcode format
  const normalizedPostcode = postcode.toUpperCase().replace(/\s+/g, '');
  const prefix = normalizedPostcode.match(/^[A-Z]{1,2}[0-9][A-Z0-9]?/)?.[0];
  
  if (!prefix) {
    return null;
  }

  // Find council by postcode prefix
  const council = councils.find(c => 
    c.postcode_prefixes.some(p => 
      normalizedPostcode.startsWith(p.replace(/\s+/g, ''))
    )
  );

  if (!council) {
    return null;
  }

  // Add next collection dates (mock data)
  const today = new Date();
  const nextCollection = {
    compost: new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)), // 3 days from now
    recycling: new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)), // 5 days from now
    general: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)) // 2 days from now
  };

  return {
    ...council,
    postcode: postcode,
    next_collection: nextCollection
  };
};

export const getAllCouncils = async () => {
  return councils.map(council => ({
    id: council.id,
    name: council.name,
    postcode_prefixes: council.postcode_prefixes,
    collection_schedule: council.collection_schedule
  }));
};

export const getCouncilRules = async (councilId: string) => {
  const council = councils.find(c => c.id === councilId);
  return council ? council.rules : null;
};

export const getCouncilSchedule = async (councilId: string) => {
  const council = councils.find(c => c.id === councilId);
  return council ? council.collection_schedule : null;
};