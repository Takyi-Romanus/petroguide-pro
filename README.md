# PetroGuide Pro ⛽

**NextGen Petro-Tech | Smart Petroleum Engineering Platform**

A comprehensive web platform designed for petroleum engineering students, professionals, and safety officers. PetroGuide Pro delivers real-time guidance, interactive learning modules, hazard reporting, career opportunities, and AI-powered technical assistance.

---

## 🌟 Features

### 📚 **Interactive Learning Modules**
- Comprehensive petroleum engineering curriculum
- Modules covering: Drilling, Reservoir Engineering, Production, HSE, Digital Analytics
- Filter by category and experience level (beginner, intermediate, advanced)
- Real-time enrollment tracking and user ratings

### ⚠️ **Hazard Reporting System**
- Report safety incidents in real-time
- Classify by severity (low, medium, high)
- Track incident status and location
- Monitor resolution progress
- Generate safety insights and trends

### 💼 **Career Portal**
- Browse job listings from leading oil & gas companies
- Filter by position type (full-time, internship) and category
- View salary ranges, requirements, and benefits
- Direct links to opportunities in Ghana and beyond

### 🤖 **AI-Powered PetroAI Assistant**
- Instant answers to technical petroleum engineering questions
- Knowledge base covering:
  - Drilling operations & well control
  - Reservoir engineering concepts
  - Production optimization
  - HSE protocols and procedures
  - Environmental management
  - Petroleum data analytics

### 👥 **User Authentication**
- Secure registration and login system
- Bcrypt password encryption
- Session-based authentication
- Role-based access (student, professional, instructor)

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Middleware**: express-session, connect-flash, morgan, CORS

### **Frontend**
- **HTML5, CSS3, Vanilla JavaScript**
- **Responsive Design**: Mobile-first approach
- **Interactive UI**: Real-time data fetching with fetch API

### **Development Tools**
- Nodemon (auto-restart on file changes)
- Dotenv (environment variables)
- Express-validator (input validation)

---

## 📋 Prerequisites

- **Node.js** v14.x or higher
- **npm** v6.x or higher
- **MongoDB** (local or Atlas connection string)
- Git (optional)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Takyi-Romanus/petroguide-pro.git
cd petroguide-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/petroguide_pro

# Server Port
PORT=3000

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API Key (for future AI features)
OPENAI_API_KEY=your_openai_key_here

# Node Environment
NODE_ENV=development
```

### 4. MongoDB Setup

**Option A: Using MongoDB Atlas (Cloud)**
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database user
3. Copy connection string and add to `.env`

**Option B: Using Local MongoDB**
```bash
# Install MongoDB Community Edition
# Then ensure MongoDB is running
mongod

# Update .env
MONGO_URI=mongodb://localhost:27017/petroguide_pro
```

---

## ▶️ Running the Project

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at `http://localhost:3000`

---

## 📁 Project Structure

```
petroguide-pro/
├── public/                 # Static assets & frontend files
│   ├── index.html         # Homepage
│   ├── dashboard.html     # User dashboard
│   ├── learn.html         # Learning modules page
│   ├── hazard.html        # Hazard reports page
│   ├── career.html        # Career portal
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── 404.html           # Error page
│   ├── style.css          # Global styles
│   ├── script.js          # Frontend utilities
│   ├── petroai-widget.js  # PetroAI assistant widget
│   └── images/            # Logos, favicons, assets
│
├── routes/                # API and page routes
│   ├── index.js          # Main page routes (/, /dashboard)
│   ├── auth.js           # Authentication routes (/auth/login, /auth/register)
│   ├── learn.js          # Learning module routes (/learn)
│   ├── hazard.js         # Hazard reporting routes (/hazards)
│   ├── career.js         # Career portal routes (/careers)
│   └── api.js            # API endpoints (/api/*)
│
├── models/                # MongoDB Mongoose schemas
│   ├── user.js           # User model with authentication
│   ├── module.js         # Learning module schema
│   ├── hazard.js         # Safety incident schema
│   └── career.js         # Job listing schema
│
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication checks
│
├── views/                 # HTML templates (if using template engine)
│
├── server.js             # Main server file
├── package.json          # Project metadata & dependencies
├── .env                  # Environment variables (not in git)
└── README.md             # This file
```

---

## 🔌 API Endpoints

### **Authentication Routes** (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Login page |
| GET | `/auth/register` | Registration page |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/logout` | Logout user |

### **Learning Modules API** (`/api`)
| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/module` | `?category=drilling&level=beginner&search=query` | Get modules (with filters) |
| GET | `/api/modules` | Same as above | Alias for `/api/module` |

### **Hazard Reports API** (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hazards` | Get all hazard reports |
| GET | `/api/hazard` | Get hazard reports |
| POST | `/api/hazard` | Submit new hazard report |

**POST `/api/hazard` Body:**
```json
{
  "title": "Gas Leak at Wellhead",
  "description": "Methane leak detected from master valve",
  "location": "Well Pad A, Block 7",
  "severity": "high",
  "category": "gas_leak",
  "reportedByName": "John Doe"
}
```

### **Careers API** (`/api`)
| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/career` | `?type=full-time&category=drilling` | Get job listings |
| GET | `/api/careers` | Same as above | Alias for `/api/career` |

### **User & Utility** (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me` | Get current user session |
| GET | `/api/stats` | Get platform statistics |
| POST | `/api/assistant/chat` | Chat with PetroAI |

**POST `/api/assistant/chat` Body:**
```json
{
  "message": "Explain Darcy's law"
}
```

---

## 🗄️ Database Models

### **User Model** (`models/user.js`)
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|professional|instructor),
  createdAt: Date,
  updatedAt: Date
}
```

### **Module Model** (`models/module.js`)
```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  category: String (drilling|reservoir|production|safety|digital),
  level: String (beginner|intermediate|advanced),
  duration: Number (minutes),
  enrolledCount: Number,
  rating: Number (0-5),
  tags: [String],
  createdAt: Date
}
```

### **Hazard Model** (`models/hazard.js`)
```javascript
{
  title: String,
  description: String,
  location: String,
  severity: String (low|medium|high),
  category: String,
  status: String (reported|investigating|resolved),
  reportedBy: ObjectId (User reference),
  reportedByName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Career Model** (`models/career.js`)
```javascript
{
  title: String,
  company: String,
  location: String,
  type: String (full-time|internship|contract),
  category: String,
  description: String,
  requirements: [String],
  benefits: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  isActive: Boolean,
  deadline: Date,
  postedAt: Date
}
```

---

## 🔐 Authentication Flow

1. User registers or logs in via `/auth/register` or `/auth/login`
2. Password is hashed using bcryptjs
3. Session is created and stored in express-session
4. Session cookie is sent to browser
5. Protected routes check `req.session.user`
6. User can access personalized dashboard and features

---

## 🤖 PetroAI Assistant

The AI assistant provides instant technical guidance through the `/api/assistant/chat` endpoint. It covers:

- **Drilling**: Operations, bit selection, well control, mud engineering
- **Reservoir**: Darcy's Law, porosity, permeability, material balance
- **Production**: Artificial lift, nodal analysis, optimization
- **Safety**: H₂S protocols, JHA, ESD systems, STOP WORK procedures
- **Environment**: Oil spills, produced water, flaring reduction
- **Calculations**: API gravity, mud weight, formation pressure

---

## 🌍 Alignment with Sustainable Development Goals

PetroGuide Pro supports the UN Agenda 2030:

- **SDG 7**: Affordable & Clean Energy - Digital optimization tools
- **SDG 8**: Decent Work & Economic Growth - Career opportunities & training
- **SDG 9**: Industry, Innovation & Infrastructure - Digital transformation
- **SDG 13**: Climate Action - Smart reporting & waste reduction

---

## 🛣️ Routes Overview

| Route | Handler | Description |
|-------|---------|-------------|
| `/` | `/routes/index.js` | Homepage & dashboard landing |
| `/auth/` | `/routes/auth.js` | Authentication pages & endpoints |
| `/learn` | `/routes/learn.js` | Learning modules page |
| `/hazards` | `/routes/hazard.js` | Hazard reporting page |
| `/careers` | `/routes/career.js` | Career portal page |
| `/api/` | `/routes/api.js` | All API endpoints |

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` is correct

### **Port Already in Use**
```bash
# Change PORT in .env or use:
PORT=3001 npm run dev
```

### **Module Not Found**
```bash
npm install
```

### **Session Errors**
- Ensure `SESSION_SECRET` is set in `.env`
- Clear browser cookies and try again

---

## 📝 Environment Variables

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `MONGO_URI` | String | MongoDB connection string | `mongodb://localhost:27017/petroguide_pro` |
| `PORT` | Number | Server port | `3000` |
| `SESSION_SECRET` | String | Session encryption key | `petroguide_secret` |
| `JWT_SECRET` | String | JWT signing key | `supersecretkey123` |
| `NODE_ENV` | String | Environment mode | `development` |
| `OPENAI_API_KEY` | String | OpenAI API key | (optional) |

---

## 🚀 Deployment

### Heroku
```bash
heroku login
heroku create petroguide-pro
git push heroku main
```

### Railway
1. Link GitHub repository
2. Set environment variables in Dashboard
3. Deploy automatically on push

### Self-Hosted (VPS)
```bash
# SSH into server
ssh user@your-server.com

# Clone repo, install dependencies
git clone <repo-url>
cd petroguide-pro
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name petroguide

# Set up reverse proxy (Nginx) pointing to port 3000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. See `package.json` for details.

---

## 👨‍💻 Author

**Takyi Romanus**

- GitHub: [@Takyi-Romanus](https://github.com/Takyi-Romanus)
- Project: [Group Twenty-One (21) – Level 100 Petroleum Engineering](https://github.com/Takyi-Romanus/PROJECTS)

---

## 🙏 Acknowledgments

- **NextGen Petro-Tech** – Platform vision and design
- **Group Twenty-One (21)** – Level 100 Petroleum Engineering Project
- **MongoDB** – Database infrastructure
- **Express.js Community** – Web framework

---

## 📞 Support

For issues, bugs, or feature requests: [GitHub Issues](https://github.com/Takyi-Romanus/PROJECTS/issues)

---

**Made with ⛽ for petroleum engineers and students worldwide.**
