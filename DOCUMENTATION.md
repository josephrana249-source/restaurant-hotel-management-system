# Technical Documentation — RHMS

## 🏗️ System Architecture

RHMS follows a decoupled **Frontend-Backend Architecture**:

### Frontend
- **Vanilla JavaScript**: No heavy frameworks. Uses a custom `Store` object in `data.js` to manage state.
- **LocalStorage Caching**: Data is cached locally to provide an "instant" feel. The system attempts to sync with the API in the background.
- **Component-Based UI**: UI elements are generated dynamically via `components.js` and `pages.js`.

### Backend
- **RESTful API**: `api/api.php` acts as a central controller for all CRUD operations.
- **PHP MySQLi**: Uses prepared statements for all database interactions to ensure security.
- **JSON Protocol**: All communication between frontend and backend uses JSON.

---

## 📊 Database Schema

### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(10) | Primary Key (e.g., u1, u2) |
| `name` | VARCHAR(100) | Full Name |
| `email` | VARCHAR(100) | Unique Email |
| `password` | VARCHAR(255) | Hashed Password |
| `role` | ENUM | 'admin' or 'customer' |

### `food`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(10) | Primary Key |
| `name` | VARCHAR(100) | Item Name |
| `price` | DECIMAL | Item Price |
| `stock` | INT | Current Inventory |

### `rooms`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(10) | Primary Key |
| `type` | VARCHAR(50) | Room Category |
| `status` | ENUM | 'available', 'booked', 'maintenance' |

---

## 📡 API Endpoints

### Base URL: `/api/api.php`

| Method | Action | Description |
| :--- | :--- | :--- |
| `GET` | `?action=food` | Retrieve all food items |
| `GET` | `?action=rooms` | Retrieve all room listings |
| `POST` | `?action=users&sub=login` | User authentication |
| `POST` | `?action=orders` | Place a new food order |
| `POST` | `?action=bookings` | Reserve a room |

#### Example Request (Login)
```json
{
    "email": "admin@rhms.com",
    "password": "Admin123!"
}
```

#### Example Response
```json
{
    "success": true,
    "data": {
        "id": "u1",
        "name": "Admin User",
        "role": "admin"
    }
}
```

---

## 💳 Payment Integration (M-Pesa)

The system integrates with Safaricom's Daraja API.

1. **Trigger**: When a user pays via M-Pesa, the system calls `api/mpesa_stk_push.php`.
2. **STK Push**: A prompt is sent to the user's phone.
3. **Callback**: Safaricom sends a result to `api/mpesa_callback.php`.
4. **Update**: The order/booking status is updated based on the callback result.

---

## 🛡️ Security Implementation

- **Prepared Statements**: `mysqli::prepare()` is used for every query to prevent SQL Injection.
- **XSS Prevention**: User-generated content is sanitized before being rendered in the DOM.
- **Password Hashing**: Passwords are encrypted using `password_hash()` (Bcrypt).
- **Validation**: Strict server-side validation for emails (must be @gmail.com) and password complexity.

---

## 🛠️ Troubleshooting & Debugging

- **API Logs**: Check `api/logs/error.log` for backend failures.
- **Console**: Use Browser DevTools (F12) to monitor `data.js` sync operations.
- **Setup Script**: If data is missing, re-run `api/setup.php` to restore default tables and records.

---

**Version**: 1.0.0  
**Last Updated**: May 7, 2026
