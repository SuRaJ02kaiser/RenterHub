## RenterHub

## 🏠 Introduction
**RenterHub** is a property management platform that bridges communication between landlords and tenants. It enables users to manage rental properties, track maintenance requests, and access tenant/landlord dashboards. The system supports user authentication, role-based access, and organized CRUD operations for managing real estate operations effectively.

---

## 🚀 Project Type
**Full-stack Web Application**

---

## 🔗 Deployed Application
- **Frontend:** [RenterHub Frontend](https://renterhub.netlify.app/)
- **Backend:** [RenterHub Backend](https://renterhub.onrender.com)
- **Database:** MongoDB (via Mongoose)

---

## 📁 Directory Structure

### **Frontend**
```
client/
│── images/
│
│── lander/
│   ├── lander.html
│
│── landlord_Dashboard/
│   ├── landDash.html
│   ├── landDash.css
│   ├── landDash.js
│
│── login_signup/
│   ├── login_signup.html
│   ├── login_signup.css
│   ├── login_signup.js
│
│── tenant_Dashboard/
│   ├── tenantDash.html
│   ├── tenantDash.css
│   ├── tenantDash.js
│
│── home.html
│── home.css
│── home.js
```

---

### **Backend**
```
server/
│── config/
│   ├── db.js
│
│── controllers/
│   ├── landlord.controller.js
│   ├── tenant.controller.js
│   ├── property.controller.js
│   ├── request.controller.js
│
│── middlewares/
│   ├── auth.middleware.js
│
│── models/
│   ├── landlord.model.js
│   ├── tenant.model.js
│   ├── property.model.js
│   ├── request.model.js
│
│── routes/
│   ├── landlord.route.js
│   ├── tenant.route.js
│   ├── property.route.js
│   ├── request.route.js
│
│── .env
│── .env.example
│── .gitignore
│── package.json
│── package-lock.json
│── server.js
```

---

## ✨ Features

- 🔐 **User Authentication** – Signup/Login for landlords and tenants
- 🏢 **Property Management** – Add, update, delete, and view properties
- 📬 **Request Management** – Tenants can raise maintenance requests; landlords can manage them
- 📊 **Separate Dashboards** – Custom views for landlord and tenant roles
- 📤 **RESTful APIs** – For all major entities and operations

---

## 🛠️ Installation & Getting Started

### Backend Setup
```bash
git clone https://github.com/YourUsername/renterHub2.git
cd RenterHub/server
npm install
```

Create a `.env` file:
```ini
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SALT=your_salt_number
```

Start the server:
```bash
node server.js
```

### Frontend Setup
1. Navigate to the `client/` directory.
2. Open `lander/lander.html` in your browser.
3. Ensure backend is running for API functionality.

---

## 🔌 API Endpoints

### Landlord Routes
- `POST /landlord/signup` – Register a landlord
- `POST /landlord/login` – Landlord login
- `GET /landlord/:id` – Get landlord by ID
- `GET /landlord/getProperties` – Get all properties of a landlord

### Tenant Routes
- `POST /tenant/signup` – Register a tenant
- `POST /tenant/login` – Tenant login
- `GET /tenant/:id` – Get tenant by ID

### Property Routes
- `POST /property/addProperty` – Add a new property
- `GET /property/getAll` – Get all properties
- `PATCH /property/updateProperty/:id` – Update a property
- `DELETE /property/deleteProperty/:id` – Delete a property

### Request Routes
- `POST /request/create` – Create a maintenance request
- `GET /request/:userId` – Get all requests for a user
- `PATCH /request/updateRequest/:rid` – Update request status
- `DELETE /request/getTenants/:rid` – Delete a request

---

## 🧰 Technology Stack

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **Mongoose** – MongoDB ODM
- **JWT** – Authentication
- **Bcrypt** - Password hashing

### Frontend
- **HTML** – Structure
- **CSS** – Styling
- **JavaScript** – Logic and interaction

---

## 📌 Authors
**Suraj Singh** – Developer, Designer

---

## 📃 License
This project is licensed under the MIT License.
