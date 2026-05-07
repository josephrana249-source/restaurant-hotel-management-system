# 🏨 RHMS — Restaurant & Hotel Management System


## 🌟 Overview

**RHMS** is a comprehensive, all-in-one management solution designed for modern hospitality businesses. Whether you're running a boutique hotel, a busy restaurant, or both, RHMS provides the tools to streamline operations, manage inventory, and provide a seamless booking experience for your guests.

Built with a focus on speed, security, and user experience, RHMS bridges the gap between traditional hospitality and digital excellence.

---

## ✨ Key Features

### 🍽️ Restaurant Management
- **Dynamic Menu**: Manage food items, categories, and stock in real-time.
- **Order Tracking**: Seamless flow from cart to kitchen with status updates.
- **Automated Pricing**: Real-time tax calculation and total estimation.

### 🛌 Hotel Management
- **Room Inventory**: Detailed room profiles with amenities, capacity, and pricing.
- **Booking Engine**: Intuitive date-range booking system for guests.
- **Guest Reviews**: Integrated rating and feedback system for rooms.

### 🔐 User & Security
- **Role-Based Access**: Separate interfaces for Admins and Customers.
- **Secure Authentication**: Strong password enforcement and @gmail-only registration.
- **SQL Protection**: Fully protected against SQL injection via prepared statements.

### 💳 Payments & Integration
- **M-Pesa Ready**: Integrated Safaricom Daraja API for mobile payments.
- **Local Caching**: Vanilla JS store with localStorage for lightning-fast UI responsiveness.

---

## 🚀 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Modern CSS3
- **Backend**: PHP 8.x
- **Database**: MySQL (MariaDB)
- **API**: RESTful JSON API
- **Payments**: Safaricom M-Pesa (Daraja API)

---

## 🛠️ Installation Guide

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (Apache & MySQL)
- Git (optional)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/josephrana249-source/restaurant-hotel-management-system.git
   cd restaurant-hotel-management-system
   ```

2. **Move to Htdocs**
   Copy the project folder to your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\RHMS`).

3. **Start Services**
   Open XAMPP Control Panel and start **Apache** and **MySQL**.

4. **Initialize Database**
   Open your browser and navigate to:
   `http://localhost/RHMS/api/setup.php`
   *This will automatically create the `rhms_db` database and seed initial data.*

5. **Access the App**
   Open: `http://localhost/RHMS`

---

## 👤 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@rhms.com` | `Admin123!` |
| **Customer** | `user@rhms.com` | `User123!` |

---

## 📂 Project Structure

```text
rhms/
├── assets/             # Project images & banners
├── api/
│   ├── config.php      # Database & M-Pesa configuration
│   ├── api.php         # Main REST API controller
│   ├── setup.php       # Database initialization script
│   └── logs/           # System logs (ignored by git)
├── data.js             # Frontend state management & API sync
├── app.js              # Application routing & admin logic
├── styles.css          # Main styling framework
└── index.html          # Application entry point
```

---

## 🗺️ Roadmap
- [ ] Mobile App (Flutter/React Native)
- [ ] Multi-language support
- [ ] SMS Notifications for bookings
- [ ] Detailed Financial Analytics Dashboard

---

**Developed with ❤️ by [Joe Rana](https://github.com/josephrana249-source)**
