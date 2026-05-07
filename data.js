/* ================================================================
   RHMS — Data Layer: Seed Data, State Management, localStorage
   ================================================================ */

const JOSEPH_RANA = {
  name: 'Joseph Rana',
  phone: '0712345678',
  img: 'https://i.pravatar.cc/150?u=joseph_rana',
  joined: 'March 2017',
  responseRate: '100%',
  responseTime: 'within an hour'
};

const MERU_LOCATION = {
  address: 'Meru, Kenya',
  coords: { lat: 0.0515, lng: 37.6456 }
};

// Function to generate random food descriptions
function generateRandomFoodDescription(name, category) {
  const adjectives = [
    'delicious', 'mouthwatering', 'flavorful', 'succulent', 'tender', 'crispy', 'juicy',
    'fresh', 'premium', 'authentic', 'traditional', 'gourmet', 'exquisite', 'savory',
    'aromatic', 'perfectly seasoned', 'rich', 'creamy', 'tangy', 'spicy', 'sweet'
  ];

  const preparations = {
    'Main Course': [
      'grilled to perfection', 'slow-cooked', 'pan-seared', 'roasted', 'baked fresh',
      'slow-roasted', 'char-grilled', 'braised', 'steamed', 'fried golden'
    ],
    'Appetizers': [
      'freshly prepared', 'crispy and golden', 'lightly seasoned', 'perfectly crisp',
      'fresh from the oven', 'hand-crafted', 'artfully arranged', 'fresh and vibrant'
    ],
    'Desserts': [
      'decadently rich', 'sweet and indulgent', 'perfectly balanced', 'creamy smooth',
      'warm and comforting', 'artfully layered', 'sweet perfection', 'divinely delicious'
    ],
    'Beverages': [
      'refreshingly cool', 'perfectly blended', 'smooth and creamy', 'energizing',
      'invigorating', 'smooth and refreshing', 'perfectly mixed', 'delightfully chilled'
    ]
  };

  const accompaniments = {
    'Main Course': [
      'with seasonal vegetables', 'served with fresh herbs', 'accompanied by gourmet sides',
      'with house-made sauces', 'paired with complementary flavors', 'finished with a drizzle'
    ],
    'Appetizers': [
      'served with dipping sauces', 'garnished with fresh herbs', 'on artisan bread',
      'with balsamic reduction', 'topped with microgreens', 'finished with olive oil'
    ],
    'Desserts': [
      'served with fresh berries', 'drizzled with chocolate', 'topped with whipped cream',
      'accompanied by ice cream', 'finished with caramel', 'garnished with mint'
    ],
    'Beverages': [
      'made with fresh ingredients', 'blended to perfection', 'served ice cold',
      'with a refreshing twist', 'perfectly balanced', 'crafted with care'
    ]
  };

  const prep = preparations[category] || preparations['Main Course'];
  const accomp = accompaniments[category] || accompaniments['Main Course'];

  const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const prepMethod = prep[Math.floor(Math.random() * prep.length)];
  const accompaniment = accomp[Math.floor(Math.random() * accomp.length)];

  // Ensure different adjectives
  const finalAdj2 = adj1 === adj2 ? adjectives[Math.floor(Math.random() * adjectives.length)] : adj2;

  return `${adj1.charAt(0).toUpperCase() + adj1.slice(1)} ${name.toLowerCase()} ${prepMethod} ${accompaniment}. A ${finalAdj2} culinary experience that delights the senses.`;
}

const SEED_FOOD = [
  { id: 'f1', name: 'Grilled Salmon', category: 'Main Course', price: 1200, stock: 50, emoji: '🐟', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Grilled Salmon', 'Main Course') },
  { id: 'f2', name: 'Caesar Salad', category: 'Appetizers', price: 450, stock: 50, emoji: '🥗', img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Caesar Salad', 'Appetizers') },
  { id: 'f3', name: 'Tiramisu', category: 'Desserts', price: 550, stock: 30, emoji: '🍰', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Tiramisu', 'Desserts') },
  { id: 'f4', name: 'Mango Smoothie', category: 'Beverages', price: 250, stock: 100, emoji: '🥭', img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Mango Smoothie', 'Beverages') },
  { id: 'f5', name: 'Beef Wellington', category: 'Main Course', price: 1500, stock: 20, emoji: '🥩', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Beef Wellington', 'Main Course') },
  { id: 'f6', name: 'Bruschetta', category: 'Appetizers', price: 350, stock: 45, emoji: '🍅', img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Bruschetta', 'Appetizers') },
  { id: 'f7', name: 'Chocolate Lava Cake', category: 'Desserts', price: 650, stock: 25, emoji: '🍫', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Chocolate Lava Cake', 'Desserts') },
  { id: 'f8', name: 'Espresso Martini', category: 'Beverages', price: 800, stock: 40, emoji: '☕', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop', desc: generateRandomFoodDescription('Espresso Martini', 'Beverages') }
];

const SAMPLE_REVIEWS = [
  { id: 'r1', userName: 'Malik', userAvatar: 'https://i.pravatar.cc/150?u=malik', location: 'Nairobi', date: 'January 2026', rating: 5, stayType: 'Stayed with kids', comment: 'We ended up staying longer than planned initially! That is how good this place is. Beyond description. Amazing place, lifetime experience! Place is so beautiful.' },
  { id: 'r2', userName: 'Zeinab', userAvatar: 'https://i.pravatar.cc/150?u=zeinab', location: 'Meru', date: 'December 2025', rating: 4, stayType: 'Group trip', comment: 'Pictures don’t do this place justice 😍 I absolutely loved our stay. It was so good we had to extend our stay. The staff were amazing! Special thanks to the Chef.' },
  { id: 'r3', userName: 'Omri', userAvatar: 'https://i.pravatar.cc/150?u=omri', location: 'Mombasa', date: 'November 2025', rating: 5, stayType: 'Stayed one night', comment: 'I spent one night at this beachfront house in Nyali, and it was truly perfect. The home is stylish, clean, and exactly as described.' },
  { id: 'r4', userName: 'Alain', userAvatar: 'https://i.pravatar.cc/150?u=alain', location: 'Nairobi', date: 'October 2025', rating: 5, stayType: 'Business trip', comment: 'Beautiful and modern villa, well located and friendly staff. I would recommend anyone to stay at RHMS.' }
];

const SEED_ROOMS = [
  { 
    id: 'h1', status: 'active', name: 'Nyati House', type: 'Building', price: 25000, 
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1519167758993-ddeea6be4e3e?w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 10, bedrooms: 5, beds: 8, baths: 4,
    amenities: ['WiFi', 'Kitchen', 'Free Parking', 'TV', 'Security'],
    desc: 'Grand luxury building at the heart of our Meru complex. Features multiple rooms that can be allocated upon arrival.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 4,
    reviews: SAMPLE_REVIEWS
  },
  { 
    id: 'h2', status: 'active', name: 'Saluti House', type: 'Building', price: 22000, 
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?w=800&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
      'https://images.unsplash.com/photo-1515182629504-727d7753751f?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1494926902405-14365b3fb2b5?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 8, bedrooms: 4, beds: 6, baths: 3,
    amenities: ['WiFi', 'TV', 'Security', 'Private Parking', 'Balcony'],
    desc: 'Elegant and modern building offering a blend of contemporary style and classic comfort.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 4.8, reviewCount: 2,
    reviews: SAMPLE_REVIEWS.slice(0, 2)
  },
  { 
    id: 'h3', status: 'active', name: 'Mukiko House', type: 'Building', price: 18000, 
    images: [
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
      'https://images.unsplash.com/photo-1600047915290-98e5dba7214d?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1520932057f53-fe206f0a75ab?w=800&q=80',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 6, bedrooms: 3, beds: 4, baths: 2,
    amenities: ['WiFi', 'TV', 'Dedicated Workspace', 'Garden'],
    desc: 'A serene building surrounded by nature, perfect for long-term stays or family retreats.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 1,
    reviews: SAMPLE_REVIEWS.slice(2, 3)
  },
  { 
    id: 'h4', status: 'active', name: 'Nzombo House', type: 'Building', price: 20000, 
    images: [
      'https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=800&q=80',
      'https://images.unsplash.com/photo-1502005075163-5abe13998b33?w=800&q=80',
      'https://images.unsplash.com/photo-1549517044-8b3d0061e3bc?w=800&q=80',
      'https://images.unsplash.com/photo-1617930038919-01c1128e83fb?w=800&q=80',
      'https://images.unsplash.com/photo-1494526585181-752496244840?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&q=80',
      'https://images.unsplash.com/photo-1540550191acb2acd02672bacca269e8e8b9d5a6?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 8, bedrooms: 4, beds: 6, baths: 3,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Hot Water'],
    desc: 'Sophisticated architectural design with spacious interiors and high-end finishes.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 1,
    reviews: SAMPLE_REVIEWS.slice(3, 4)
  },
  { 
    id: 'h5', status: 'active', name: 'Bita House', type: 'Building', price: 15000, 
    images: [
      'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1433360405326-e50f909805b3?w=800&q=80',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80',
      'https://images.unsplash.com/photo-1566707566747-fd5310d4ae0f?w=800&q=80',
      'https://images.unsplash.com/photo-1595949246809-93c288f72ce3?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 4, bedrooms: 2, beds: 3, baths: 2,
    amenities: ['WiFi', 'TV', 'Free Parking', 'Kitchen'],
    desc: 'Cozy and well-appointed building ideal for couples or small families.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 0
  },
  { 
    id: 'h6', status: 'active', name: 'Mutisa House', type: 'Building', price: 21000, 
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
      'https://images.unsplash.com/photo-1605692823903-f64b2957ebc3?w=800&q=80',
      'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1537151608828-8a63ddc6f65c?w=800&q=80',
      'https://images.unsplash.com/photo-1536376074432-8442658296ad?w=800&q=80',
      'https://images.unsplash.com/photo-1600121848804-33d393a22071?w=800&q=80',
      'https://images.unsplash.com/photo-1556909920-84bef77e4e00?w=800&q=80',
      'https://images.unsplash.com/photo-1551433473-00b96a58c5f8?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 8, bedrooms: 4, beds: 6, baths: 3,
    amenities: ['WiFi', 'Kitchen', 'Washing Machine', 'Hot Water'],
    desc: 'A modern building with all the essentials for a luxurious stay in Meru.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 0
  },
  { 
    id: 'h7', status: 'active', name: 'Arena House', type: 'Building', price: 28000, 
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1584520909691-46a4aff2db90?w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1595949246809-93c288f72ce3?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 12, bedrooms: 6, beds: 10, baths: 5,
    amenities: ['Pool', 'WiFi', 'Gym', 'Kitchen', 'Security'],
    desc: 'The crown jewel of our property, Arena House offers unmatched luxury and space.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 0
  },
  { 
    id: 'h8', status: 'active', name: 'Burita House', type: 'Building', price: 17000, 
    images: [
      'https://images.unsplash.com/photo-1512918766775-d560ae57548d?w=800&q=80',
      'https://images.unsplash.com/photo-1604070945435-b379147cefe0?w=800&q=80',
      'https://images.unsplash.com/photo-1518451307873-35167f3450e0?w=800&q=80',
      'https://images.unsplash.com/photo-1449156001427-463229b4f2c5?w=800&q=80',
      'https://images.unsplash.com/photo-1480044965905-02f247d2a735?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1558618669-15436f52b628?w=800&q=80',
      'https://images.unsplash.com/photo-1576098160235-017d6acc6b27?w=800&q=80'
    ], 
    location: MERU_LOCATION, 
    capacity: 6, bedrooms: 3, beds: 4, baths: 2,
    amenities: ['WiFi', 'TV', 'Dedicated Workspace', 'Kitchen'],
    desc: 'A charming building with character, offering a quiet and professional atmosphere.',
    hostName: JOSEPH_RANA.name, hostPhone: JOSEPH_RANA.phone, hostImg: JOSEPH_RANA.img, hostJoined: JOSEPH_RANA.joined,
    hostResponseRate: JOSEPH_RANA.responseRate, hostResponseTime: JOSEPH_RANA.responseTime,
    rating: 5.0, reviewCount: 0
  }
];

const SEED_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@rhms.com', phone: '0700000000', password: 'Admin123!', role: 'admin', joined: '2025-01-01' },
  { id: 'u2', name: 'John Demo', email: 'user@rhms.com', phone: '0711111111', password: 'User123!', role: 'user', joined: '2025-06-15' },
  { id: 'u3', name: 'Kumerra', email: 'user@gmail.com', phone: '0722222222', password: 'Pass123!', role: 'user', joined: '2026-04-05' }
];

/* ── State Manager ────────────────────────────────────────── */
const Store = {
  _key: 'rhms_data',
  _version: 'v17_api',
  _cache: {},
  _apiBase: 'api/api.php',
  _initialized: false,

  _defaults() {
    return {
      _version: this._version,
      users: [],
      food: [],
      rooms: [],
      orders: [],
      bookings: [],
      cart: [],
      currentUser: null
    };
  },

  async init() {
    // Load from localStorage first for instant UX
    const raw = localStorage.getItem(this._key);
    if (raw) {
      this._cache = JSON.parse(raw);
    } else {
      // Initialize with seed data if localStorage is empty
      this._cache = this._defaults();
      this._cache.rooms = SEED_ROOMS.map(r => ({
        ...r,
        images: r.images || [],
        amenities: r.amenities || []
      }));
      this._cache.food = SEED_FOOD;
      this._cache.users = SEED_USERS;
      this._persist(); // Save seed data to localStorage
    }
    
    // Then sync with server in background
    this._syncWithServer();
    this._initialized = true;
  },

  async _syncWithServer() {
    try {
      // Load initial data from API
      const [users, food, rooms, orders, bookings] = await Promise.all([
        fetch(this._apiBase + '?action=users').then(r => r.json()),
        fetch(this._apiBase + '?action=food').then(r => r.json()),
        fetch(this._apiBase + '?action=rooms').then(r => r.json()),
        fetch(this._apiBase + '?action=orders').then(r => r.json()),
        fetch(this._apiBase + '?action=bookings').then(r => r.json())
      ]);

      if (users.success) this._cache.users = users.data || [];
      if (food.success) this._cache.food = food.data || [];
      if (rooms.success) {
        this._cache.rooms = (rooms.data || []).map(r => ({
          ...r,
          images: r.images || [],
          amenities: r.amenities || [],
          location: { address: r.location_address, coords: { lat: r.location_lat || 0, lng: r.location_lng || 0 } }
        }));
      }
      if (orders.success) this._cache.orders = orders.data || [];
      if (bookings.success) this._cache.bookings = bookings.data || [];

      this._persist();
    } catch (error) {
      console.warn('Failed to sync with server, using local cache:', error);
    }
  },

  _persist() {
    localStorage.setItem(this._key, JSON.stringify(this._cache));
  },

  _read() {
    return this._cache || this._defaults();
  },

  _write(data) {
    this._cache = data;
    this._persist();
  },

  get(key) { return this._read()[key]; },

  set(key, value) {
    const data = this._read();
    data[key] = value;
    this._write(data);
  },

  // Auth helpers
  async login(email, password) {
    try {
      const response = await fetch(this._apiBase + '?action=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const result = await response.json();
      if (result.success) { 
        this.set('currentUser', result.data);
        localStorage.setItem('rhms_last_user', result.data.name);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  logout() { 
    this.set('currentUser', null); 
    localStorage.removeItem('rhms_last_user');
  },

  async signup(userData) {
    try {
      const response = await fetch(this._apiBase + '?action=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...userData })
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Signup failed' };
    }
  },

  validateStrongPassword(password) {
    if (!password || password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  },

  addUser(userData) {
    const users = this.get('users');
    if (users.find(u => u.email === userData.email)) return null;
    const newUser = { 
      ...userData, 
      id: 'u' + Date.now(), 
      joined: new Date().toISOString().split('T')[0] 
    };
    users.push(newUser);
    this.set('users', users);
    return newUser;
  },

  updateUserStatus(userId, status) {
    const users = this.get('users');
    const user = users.find(u => u.id === userId);
    if (user) { user.status = status; this.set('users', users); }
  },

  deleteUser(userId) {
    const users = this.get('users').filter(u => u.id !== userId);
    this.set('users', users);
  },

  currentUser() { return this.get('currentUser'); },
  isAdmin() { const u = this.currentUser(); return u && u.role === 'admin'; },
  isLoggedIn() { return !!this.currentUser(); },

  // Cart helpers
  async addToCart(foodId, qty = 1) {
    const cart = this.get('cart');
    const existing = cart.find(c => c.foodId === foodId);
    if (existing) { existing.qty += qty; } else { cart.push({ foodId, qty }); }
    this.set('cart', cart);

    // Sync with API if logged in
    const user = this.currentUser();
    if (user) {
      try {
        await fetch(this._apiBase + '?action=cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, foodId, quantity: qty })
        });
      } catch (error) {
        console.warn('Failed to sync cart:', error);
      }
    }
  },

  removeFromCart(foodId) {
    this.set('cart', this.get('cart').filter(c => c.foodId !== foodId));
  },

  updateCartQty(foodId, qty) {
    const cart = this.get('cart');
    const item = cart.find(c => c.foodId === foodId);
    if (item) { if (qty <= 0) { this.removeFromCart(foodId); } else { item.qty = qty; this.set('cart', cart); } }
  },

  cartCount() { return this.get('cart').reduce((s, c) => s + c.qty, 0); },

  cartTotal() {
    const food = this.get('food');
    return this.get('cart').reduce((s, c) => {
      const f = food.find(x => x.id === c.foodId);
      return s + (f ? f.price * c.qty : 0);
    }, 0);
  },

  // Order helpers
  async placeOrder(address, paymentMethod) {
    const orders = this.get('orders');
    const cart = this.get('cart');
    const food = this.get('food');
    const user = this.currentUser();
    if (!cart.length || !user) return null;
    
    const items = cart.map(c => { 
      const f = food.find(x => x.id === c.foodId); 
      return { ...f, qty: c.qty, subtotal: f.price * c.qty }; 
    });
    
    // Deduct stock
    cart.forEach(c => {
      const idx = food.findIndex(x => x.id === c.foodId);
      if (idx !== -1) {
        food[idx].stock = Math.max(0, (food[idx].stock || 0) - c.qty);
      }
    });
    this.set('food', food);

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const tax = subtotal * 0.1;
    const order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      userId: user.id, userName: user.name, items, subtotal, tax, total: subtotal + tax,
      address, paymentMethod, status: 'Pending',
      date: new Date().toISOString()
    };
    
    // Save to API
    try {
      const response = await fetch(this._apiBase + '?action=orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (result.success) {
        orders.push(order);
        this.set('orders', orders);
        this.set('cart', []);
        return order;
      }
    } catch (error) {
      console.warn('Failed to save order:', error);
      // Still add to local cache
      orders.push(order);
      this.set('orders', orders);
      this.set('cart', []);
      return order;
    }
  },

  // Booking helpers
  async bookRoom(roomId, checkIn, checkOut, guests, allocatedRoom) {
    const bookings = this.get('bookings');
    const rooms = this.get('rooms');
    const user = this.currentUser();
    if (!user) return null;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return null;
    
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
    const booking = {
      id: 'BK-' + Date.now().toString(36).toUpperCase(),
      userId: user.id, userName: user.name,
      roomId, roomName: room.name, roomType: room.type,
      checkIn, checkOut, guests, nights, allocatedRoom,
      totalPrice: room.price * nights, status: 'Confirmed',
      date: new Date().toISOString()
    };
    
    // Save to API
    try {
      const response = await fetch(this._apiBase + '?action=bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const result = await response.json();
      if (result.success) {
        bookings.push(booking);
        this.set('bookings', bookings);
        return booking;
      }
    } catch (error) {
      console.warn('Failed to save booking:', error);
      bookings.push(booking);
      this.set('bookings', bookings);
      return booking;
    }
  },

  // Admin helpers
  async addFood(food) {
    const items = this.get('food');
    food.id = 'f' + Date.now();
    
    if (!food.desc || food.desc.trim() === '') {
      food.desc = generateRandomFoodDescription(food.name, food.category);
    }
    
    // Save to API
    try {
      const response = await fetch(this._apiBase + '?action=food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food)
      });
      const result = await response.json();
      if (result.success) {
        await this._syncFood(); // Reload food from API after saving
        return food;
      }
    } catch (error) {
      console.warn('Failed to save food:', error);
      items.push(food);
      this.set('food', items);
      return food;
    }
  },

  async updateFood(id, updates) {
    const items = this.get('food');
    const idx = items.findIndex(f => f.id === id);
    if (idx >= 0) { 
      const existing = items[idx];
      const updated = { ...existing, ...updates };
      
      if (updates.desc === '' || (updates.desc === undefined && (updates.name || updates.category))) {
        updated.desc = generateRandomFoodDescription(updated.name, updated.category);
      }
      
      // Update API
      try {
        const response = await fetch(this._apiBase + '?action=food', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const result = await response.json();
        if (result.success) {
          await this._syncFood(); // Reload food from API after saving
        }
      } catch (error) {
        console.warn('Failed to update food:', error);
      }
      
      items[idx] = updated; 
      this.set('food', items); 
      return items[idx]; 
    }
    return null;
  },

  async deleteFood(id) {
    try {
      await fetch(this._apiBase + '?action=food&id=' + id, { method: 'DELETE' });
    } catch (error) {
      console.warn('Failed to delete food:', error);
    }
    this.set('food', this.get('food').filter(f => f.id !== id));
  },

  async addRoom(room) {
    const items = this.get('rooms');
    room.id = 'h' + Date.now();
    room.hostName = JOSEPH_RANA.name;
    room.hostImg = JOSEPH_RANA.img;
    room.hostJoined = JOSEPH_RANA.joined;
    room.hostResponseRate = JOSEPH_RANA.responseRate;
    room.hostResponseTime = JOSEPH_RANA.responseTime;
    room.location = MERU_LOCATION;
    room.status = 'active';

    try {
      const response = await fetch(this._apiBase + '?action=rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      });
      const result = await response.json();
      if (result.success) {
        await this._syncRooms(); // Reload rooms from API after saving
        return room;
      }
    } catch (error) {
      console.warn('Failed to save room:', error);
      items.push(room);
      this.set('rooms', items);
      return room;
    }
  },

  async updateRoom(id, updates) {
    const items = this.get('rooms');
    const idx = items.findIndex(r => r.id === id);
    if (idx >= 0) { 
      const updated = { ...items[idx], ...updates };
      
      try {
        const response = await fetch(this._apiBase + '?action=rooms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const result = await response.json();
        if (result.success) {
          await this._syncRooms(); // Reload rooms from API after saving
        }
      } catch (error) {
        console.warn('Failed to update room:', error);
      }
      
      items[idx] = updated;
      this.set('rooms', items);
      return items[idx]; 
    }
    return null;
  },

  async deleteRoom(id) {
    try {
      await fetch(this._apiBase + '?action=rooms&id=' + id, { method: 'DELETE' });
    } catch (error) {
      console.warn('Failed to delete room:', error);
    }
    this.set('rooms', this.get('rooms').filter(r => r.id !== id));
  },

  async _syncRooms() {
    try {
      const response = await fetch(this._apiBase + '?action=rooms');
      const result = await response.json();
      if (result.success) {
        this._cache.rooms = (result.data || []).map(r => {
          const existing = this._cache.rooms.find(x => x.id === r.id);
          return {
            ...r,
            images: (r.images && r.images.length) ? r.images : (existing && existing.images ? existing.images : []),
            amenities: r.amenities || [],
            location: { address: r.location_address, coords: { lat: r.location_lat || 0, lng: r.location_lng || 0 } }
          };
        });
        this._persist();
      }
    } catch (error) {
      console.warn('Failed to sync rooms:', error);
    }
  },

  async _syncFood() {
    try {
      const response = await fetch(this._apiBase + '?action=food');
      const result = await response.json();
      if (result.success) {
        this._cache.food = result.data || [];
        this._persist();
      }
    } catch (error) {
      console.warn('Failed to sync food:', error);
    }
  },

  async updateOrderStatus(id, status) {
    const orders = this.get('orders');
    const o = orders.find(x => x.id === id);
    if (o) { 
      o.status = status;
      try {
        await fetch(this._apiBase + '?action=orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status })
        });
      } catch (error) {
        console.warn('Failed to update order status:', error);
      }
      this.set('orders', orders);
    }
  },

  async updateBookingStatus(id, status) {
    const bookings = this.get('bookings');
    const b = bookings.find(x => x.id === id);
    if (b) { 
      b.status = status;
      try {
        await fetch(this._apiBase + '?action=bookings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status })
        });
      } catch (error) {
        console.warn('Failed to update booking status:', error);
      }
      this.set('bookings', bookings);
    }
  },

  async addReview(roomId, reviewData) {
    const rooms = this.get('rooms');
    const room = rooms.find(r => r.id === roomId);
    const user = this.currentUser();
    if (room && user) {
      if (!room.reviews) room.reviews = [];
      const newReview = { 
        id: 'rev' + Date.now(), 
        userName: user.name, 
        userAvatar: user.userAvatar || `https://i.pravatar.cc/150?u=${user.id}`,
        location: 'Verified Guest',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), 
        rating: parseInt(reviewData.rating), 
        stayType: reviewData.stayType || 'Stayed with RHMS',
        comment: reviewData.comment 
      };
      
      try {
        await fetch(this._apiBase + '?action=reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newReview, roomId })
        });
      } catch (error) {
        console.warn('Failed to save review:', error);
      }
      
      room.reviews.unshift(newReview);
      const total = room.reviews.reduce((s, r) => s + r.rating, 0);
      room.rating = parseFloat((total / room.reviews.length).toFixed(1));
      room.reviewCount = room.reviews.length;
      this.set('rooms', rooms);
      return newReview;
    }
    return null;
  }
};


Store.init();
