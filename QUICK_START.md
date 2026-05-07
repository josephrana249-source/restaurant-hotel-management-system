# RHMS - Quick Start Guide

## Access Your Application

### Local Development (PHP Development Server)
- **URL**: http://localhost:8000
- **Database**: Already initialized and seeded

### XAMPP Installation  
- **URL**: http://localhost/rhms
- **Database**: rhms_db
- **Admin**: http://localhost/rhms/api/setup.php (to re-initialize database if needed)

---

## Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@rhms.com | Admin123! | Admin |
| user@rhms.com | User123! | User |
| user@gmail.com | Pass123! | User |

---

## Key Features

### 👨‍💼 Admin Panel
- Dashboard with revenue analytics
- Manage food inventory
- Manage rooms & booking
- View and manage orders
- View and manage bookings
- User management
- System alerts & settings

### 🍔 Food Ordering
- Browse food menu
- Filter by category (Appetizers, Main Course, Desserts, Beverages)
- Add to cart
- Place orders with payment method selection
- View order history
- Order status tracking

### 🏨 Room Booking
- Browse luxury rooms
- View room details and amenities
- Check-in/Check-out date selection
- Guest count management
- View room reviews and ratings
- Leave reviews for booked rooms

### 🛒 Shopping Cart
- Add/remove items
- Adjust quantities
- Real-time total calculation
- 10% tax auto-calculated

---

## File Structure

```
C:\xampp\htdocs\rhms\
├── index.html              # Frontend entry point
├── styles.css              # Styling
├── app.js                  # Admin panel & routing
├── components.js           # UI components
├── pages.js                # Page templates
├── data.js                 # Store & API integration
├── utils.js                # Utilities
│
├── api/
│   ├── config.php          # Database configuration
│   ├── api.php             # REST API endpoints
│   ├── setup.php           # Database initialization
│   ├── mpesa_*.php         # M-Pesa payment integration
│   ├── upload.php          # File uploads
│   └── logs/               # API logs
│
├── uploads/
│   └── food/               # Food images storage
│
├── SETUP_GUIDE.md          # Full setup documentation
└── README.md               # This file
```

---

## API Endpoints

Base URL: `http://localhost/rhms/api/api.php`

### Authentication
```
POST ?action=users
Body: { "action": "login", "email": "...", "password": "..." }
Body: { "action": "signup", "name": "...", "email": "...", "password": "...", "phone": "..." }
```

### Users (Admin)
```
GET  ?action=users              # Get all users
GET  ?action=users&id=u1        # Get user by ID
POST ?action=users              # Create user
PUT  ?action=users              # Update user
DELETE ?action=users&id=u1      # Delete user
```

### Food Items
```
GET  ?action=food               # Get all food
GET  ?action=food&id=f1         # Get food by ID
POST ?action=food               # Create food
PUT  ?action=food               # Update food
DELETE ?action=food&id=f1       # Delete food
```

### Rooms
```
GET  ?action=rooms              # Get all rooms
GET  ?action=rooms&id=h1        # Get room by ID
POST ?action=rooms              # Create room
PUT  ?action=rooms              # Update room
DELETE ?action=rooms&id=h1      # Delete room
```

### Orders
```
GET  ?action=orders             # Get all orders
GET  ?action=orders&id=ORD-abc  # Get order by ID
GET  ?action=orders&userId=u1   # Get user's orders
POST ?action=orders             # Create order
PUT  ?action=orders             # Update order status
DELETE ?action=orders&id=ORD-abc # Delete order
```

### Bookings
```
GET  ?action=bookings           # Get all bookings
GET  ?action=bookings&id=BK-abc # Get booking by ID
GET  ?action=bookings&userId=u1 # Get user's bookings
POST ?action=bookings           # Create booking
PUT  ?action=bookings           # Update booking status
DELETE ?action=bookings&id=BK-abc # Delete booking
```

### Cart
```
GET  ?action=cart&userId=u1     # Get user's cart
POST ?action=cart               # Add to cart
PUT  ?action=cart               # Update cart item
DELETE ?action=cart&userId=u1&foodId=f1 # Remove from cart
```

### Reviews
```
GET  ?action=reviews            # Get all reviews
GET  ?action=reviews&roomId=h1  # Get room reviews
POST ?action=reviews            # Create review
```

---

## Database Schema

### users
- Stores user accounts with authentication
- Supports admin and user roles
- Tracks user status and verification

### food
- Food menu items with pricing
- Stock tracking
- Category organization
- Auto-generated descriptions

### rooms
- Rental properties
- Pricing, capacity, amenities
- Host information
- Rating and review count

### orders
- Food orders with items list
- Total price and tax
- Payment method tracking
- Status: Pending → Preparing → Delivered

### bookings
- Room reservations
- Date range and guest count
- Total price calculation
- Status: Confirmed → Checked In → Checked Out

### cart_items
- Shopping cart items per user
- Quantity tracking

### reviews
- Room reviews with ratings
- Guest feedback

---

## Development Notes

### Frontend Technology Stack
- **HTML5** - Structure
- **CSS3** - Responsive design
- **Vanilla JavaScript** - No frameworks
- **localStorage** - Client-side caching
- **Fetch API** - HTTP requests

### Backend Technology Stack
- **PHP 8.2** - Server-side logic
- **MySQLi** - Database driver (prepared statements for security)
- **JSON** - Data format

### Architecture
- **Frontend-Driven**: Client-side routing with hash navigation (#/)
- **API-First**: Backend provides pure JSON REST API
- **Hybrid Caching**: localStorage for instant UX + API sync for persistence

### Key Features
- ✅ SQL Injection protected (prepared statements)
- ✅ Strong password validation (8+ chars, uppercase, lowercase, numbers, special chars)
- ✅ Gmail-only registration
- ✅ Real-time cart synchronization
- ✅ Responsive design (mobile-friendly)
- ✅ Admin dashboard with analytics
- ✅ CORS-enabled API

---

## Common Issues & Solutions

### Issue: API returns 500 error
**Solution**: Verify MySQL is running and database credentials in `config.php` are correct

### Issue: Login fails with correct credentials
**Solution**: Ensure database was initialized with `http://localhost/rhms/api/setup.php`

### Issue: CORS errors in browser console
**Solution**: CORS headers are already configured in `config.php`; ensure API is accessible

### Issue: Images not loading
**Solution**: Check that image URLs are valid; external images require internet connection

### Issue: Payment (M-Pesa) not working
**Solution**: M-Pesa is configured for sandbox; requires ngrok for callback testing

---

## Next Steps

1. **Start Development**: Modify the code as needed for your requirements
2. **Add Database Backup**: Regular backups of `rhms_db` database
3. **Deploy**: For production, update database credentials in `api/config.php`
4. **Testing**: Use Postman or similar tool to test API endpoints
5. **Documentation**: Update SETUP_GUIDE.md with your specific deployment details

---

## Support

For issues or questions:
1. Check the browser console (F12 → Console tab)
2. Check the server logs in `api/logs/`
3. Review the API responses using network tab (F12 → Network tab)
4. Verify database tables exist: `SHOW TABLES FROM rhms_db;`

---

**Last Updated**: April 2026  
**Version**: 1.0 with Database Integration
