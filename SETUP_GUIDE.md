# RHMS - Restaurant & Hotel Management System
## Database & Setup Guide

### Project Location
- **Project**: `C:\xampp\htdocs\rhms`
- **Access**: http://localhost/rhms

### Database Information
- **Database Name**: `rhms_db`
- **Tables**: users, food, rooms, orders, bookings, cart_items, reviews

### Initial Setup Steps

#### 1. Start XAMPP Services
- Start Apache Server
- Start MySQL Server

#### 2. Initialize Database
Open your browser and visit:
```
http://localhost/rhms/api/setup.php
```

This will:
- Create the `rhms_db` database
- Create all required tables
- Seed initial data (users, food items, rooms)

**Expected Response:**
```json
{
  "success": true,
  "message": "Database initialized successfully!"
}
```

#### 3. Access the Application
Open: `http://localhost/rhms`

### Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@rhms.com | Admin123! | Admin |
| user@rhms.com | User123! | User |
| user@gmail.com | Pass123! | User |

### API Endpoints

All API endpoints are located in `/api/api.php`

#### Users
- `GET /api/api.php?action=users` - Get all users
- `POST /api/api.php?action=users` - Create/Login user
- `PUT /api/api.php?action=users` - Update user
- `DELETE /api/api.php?action=users&id={id}` - Delete user

#### Food Items
- `GET /api/api.php?action=food` - Get all food
- `POST /api/api.php?action=food` - Create food
- `PUT /api/api.php?action=food` - Update food
- `DELETE /api/api.php?action=food&id={id}` - Delete food

#### Rooms
- `GET /api/api.php?action=rooms` - Get all rooms
- `POST /api/api.php?action=rooms` - Create room
- `PUT /api/api.php?action=rooms` - Update room
- `DELETE /api/api.php?action=rooms&id={id}` - Delete room

#### Orders
- `GET /api/api.php?action=orders` - Get all orders
- `POST /api/api.php?action=orders` - Create order
- `PUT /api/api.php?action=orders` - Update order status
- `DELETE /api/api.php?action=orders&id={id}` - Delete order

#### Bookings
- `GET /api/api.php?action=bookings` - Get all bookings
- `POST /api/api.php?action=bookings` - Create booking
- `PUT /api/api.php?action=bookings` - Update booking status
- `DELETE /api/api.php?action=bookings&id={id}` - Delete booking

#### Cart
- `GET /api/api.php?action=cart&userId={id}` - Get user cart
- `POST /api/api.php?action=cart` - Add to cart
- `PUT /api/api.php?action=cart` - Update cart item
- `DELETE /api/api.php?action=cart&userId={id}&foodId={id}` - Remove from cart

#### Reviews
- `GET /api/api.php?action=reviews` - Get all reviews
- `GET /api/api.php?action=reviews&roomId={id}` - Get room reviews
- `POST /api/api.php?action=reviews` - Create review

### Features

✅ **User Management**
- Registration with @gmail.com validation
- Strong password requirements (8+ chars, uppercase, lowercase, numbers, special chars)
- User roles (Admin, User)
- Account suspension

✅ **Food Management**
- Add/Edit/Delete food items
- Stock tracking
- Category management
- Auto-generated descriptions

✅ **Room Management**
- Add/Edit/Delete rooms
- Booking system
- Reviews & ratings
- Host information

✅ **Orders**
- Place orders from food menu
- Payment methods
- Order status tracking
- Tax calculation (10%)

✅ **Bookings**
- Book rooms by date range
- Guest count management
- Booking status tracking

✅ **Shopping Cart**
- Add/Remove items
- Quantity management
- Real-time total calculation

### Database Schema

#### users
- id (PK)
- name
- email (UNIQUE)
- phone
- password
- role (admin/user)
- status (active/suspended)
- userAvatar
- isVerified
- joined
- timestamps

#### food
- id (PK)
- name
- category
- price
- stock
- emoji
- img (image URL)
- desc
- timestamps

#### rooms
- id (PK)
- name
- type
- status
- price
- capacity
- bedrooms
- beds
- baths
- images (JSON)
- location_address
- location_lat/lng
- amenities (JSON)
- description
- host info
- rating
- reviewCount
- timestamps

#### orders
- id (PK)
- userId (FK)
- items (JSON)
- total
- status
- paymentMethod
- date
- timestamps

#### bookings
- id (PK)
- userId (FK)
- roomId (FK)
- checkIn
- checkOut
- guests
- allocatedRoom
- totalPrice
- status
- timestamps

#### cart_items
- id (PK)
- userId (FK)
- foodId (FK)
- quantity
- UNIQUE(userId, foodId)

#### reviews
- id (PK)
- roomId (FK)
- userName
- userAvatar
- location
- date
- rating
- stayType
- comment
- timestamps

### Troubleshooting

**Issue**: Database not found
- **Solution**: Run the setup script at http://localhost/rhms/api/setup.php

**Issue**: API returns 500 error
- **Solution**: Check that MySQL is running and credentials in config.php are correct

**Issue**: CORS errors in browser console
- **Solution**: CORS headers are already configured in config.php

### Development Notes

- Frontend uses vanilla JavaScript with localStorage caching
- Backend uses MySQLi with prepared statements (SQL injection safe)
- API responses are JSON formatted
- Store object syncs with API while maintaining local cache for better UX

### File Structure

```
rhms/
├── index.html           # Main entry point
├── app.js              # Admin panel & routing
├── components.js       # UI components
├── pages.js            # Page templates
├── data.js             # Store & API integration
├── utils.js            # Utilities & helpers
├── styles.css          # Styling
├── api/
│   ├── config.php      # Database & API config
│   ├── api.php         # API endpoints
│   ├── setup.php       # Database initialization
│   ├── mpesa_*.php     # Payment integration
│   ├── upload.php      # File upload
│   └── logs/           # Log files
└── uploads/
    └── food/           # Food images
```
