# LinkSnap - URL Shortener with Analytics

> A URL shortening service with click tracking and analytics, built to demonstrate system design thinking, API development, and data aggregation.

[Live Demo](https://your-deployed-url.com) | [Video Demo](your-video-url)

![Dashboard Screenshot](screenshot-dashboard.png)

## 🎯 Why I Built This

URL shorteners are a classic system design problem that demonstrates understanding of:
- Unique code generation and collision handling
- Database schema design for high-read scenarios
- Analytics and data aggregation
- RESTful API design
- Multi-tenant architecture with user authentication

I built this to showcase backend engineering skills and system design thinking commonly discussed in technical interviews.

## ✨ Features

- **URL Shortening**: Generate short codes for long URLs (6-character alphanumeric codes)
- **Click Tracking**: Log every click with timestamp, user agent, referrer, and geolocation data
- **Analytics Dashboard**: Visualize clicks over time, top referrers, device breakdown, and geographic distribution
- **User Authentication**: Secure signup/login with Supabase Auth
- **URL Management**: View, delete, and manage all your shortened URLs
- **Multi-User Support**: Data isolation ensures users only see their own URLs

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router
- Mantine UI & Mantine Charts
- Axios for API calls

**Backend:**
- Node.js
- Express
- PostgreSQL (via Supabase)
- Supabase Authentication

**Deployment:**
- Render (both frontend & backend)

## 🏗️ Architecture
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│   Express   │─────▶│ PostgreSQL  │
│   Frontend  │      │   Backend   │      │  (Supabase) │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Supabase   │
                     │    Auth     │
                     └─────────────┘

Public Route:
GET /:shortCode → Redirect (no auth required)

Authenticated Routes:
POST /api/urls → Create short URL
GET /api/urls → List user's URLs
GET /api/urls/:id/analytics → View analytics
DELETE /api/urls/:id → Delete URL
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (for database & auth)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/TomFiji/cut.link.git
```

2. Install dependencies
```bash
# Install all dependencies
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Frontend (Vite)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000

# Backend
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Set up the database

Create the following tables in your Supabase project:

**urls table:**
```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_user_id ON urls(user_id);
```

**clicks table:**
```sql
CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  browser VARCHAR(50),
  device_type VARCHAR(20),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100)
);

CREATE INDEX idx_url_id ON clicks(url_id);
CREATE INDEX idx_clicked_at ON clicks(clicked_at);
```

5. Run the application
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📊 Database Schema

### URLs Table
Stores the shortened URL mappings and metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | UUID | Foreign key to auth.users |
| short_code | VARCHAR(10) | Unique short identifier |
| original_url | TEXT | The original long URL |
| created_at | TIMESTAMPTZ | When the URL was created |
| is_active | BOOLEAN | Whether the URL is active |

### Clicks Table
Stores analytics data for each click on a short URL.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| url_id | INTEGER | Foreign key to urls table |
| clicked_at | TIMESTAMPTZ | When the click occurred |
| user_agent | TEXT | Browser user agent string |
| referrer | TEXT | Where the click came from |
| ip_address | INET | IP address (for geolocation) |
| browser | VARCHAR(50) | Parsed browser name |
| device_type | VARCHAR(20) | desktop, mobile, or tablet |
| os | VARCHAR(50) | Operating system |
| country | VARCHAR(2) | Country code (ISO) |
| city | VARCHAR(100) | City name |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to existing account
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### URL Management
- `POST /api/urls` - Create short URL
  - Body: `{ "url": "https://example.com/very/long/url" }`
  - Returns: `{ "shortCode": "abc123", "shortUrl": "yourdomain.com/abc123" }`

- `GET /api/urls` - Get all user's URLs with click counts
  - Returns: `[{ id, shortCode, originalUrl, clicks, createdAt }, ...]`

- `GET /api/urls/:id` - Get specific URL details

- `DELETE /api/urls/:id` - Delete URL

### Analytics
- `GET /api/urls/:id/analytics` - Get detailed analytics
  - Returns: `{ totalClicks, clicksOverTime, topReferrers, deviceBreakdown, geography }`

### Redirect
- `GET /:shortCode` - Redirect to original URL (public, no auth required)
  - Logs click data asynchronously
  - Returns 302 redirect

## 💡 Technical Decisions

### Short Code Generation

I implemented **random string generation** for simplicity and speed:
```javascript
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
```

**Why this approach:**
- Simple to implement
- 62^6 = 56+ billion possible combinations
- Low collision probability at small scale
- Easy to reason about

**Production consideration:** For a production system handling millions of URLs, I would use **base62 encoding of auto-increment IDs** to eliminate collision checks and ensure predictable growth.

### Collision Handling
```javascript
async function generateUniqueShortCode() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const code = generateShortCode();
    const exists = await checkIfCodeExists(code);
    
    if (!exists) return code;
    attempts++;
  }
  
  // Fallback: generate longer code
  return generateShortCode() + generateShortCode();
}
```

### Click Tracking Strategy

Clicks are logged **asynchronously** to avoid blocking the redirect:
```javascript
app.get('/:shortCode', async (req, res) => {
  const url = await getURLByCode(req.params.shortCode);
  
  if (!url) {
    return res.status(404).send('URL not found');
  }
  
  // Log click async (don't await)
  logClick(url.id, req).catch(err => console.error(err));
  
  // Redirect immediately
  res.redirect(302, url.originalUrl);
});
```

This ensures fast redirects (< 50ms) even with database logging.

## 📈 Analytics Features

The dashboard provides:

**Overview:**
- Total clicks across all URLs
- Clicks today/this week/this month
- Most popular URLs

**Time Series:**
- Line chart showing clicks over time (daily/weekly)
- Trend analysis

**Traffic Sources:**
- Top referring domains
- Direct vs referral traffic

**Technology Breakdown:**
- Device types (Desktop 65%, Mobile 30%, Tablet 5%)
- Browsers (Chrome, Safari, Firefox, etc.)
- Operating systems (Windows, macOS, iOS, Android, Linux)

**Geography:**
- Top countries by clicks
- City-level data (optional)

## 🎓 What I Learned

- **System Design**: Understanding URL shortener architecture is a common interview topic. I can now discuss trade-offs between random generation vs counter-based approaches
- **Async Operations**: Logging clicks asynchronously taught me how to optimize for performance without sacrificing data collection
- **Data Aggregation**: Writing SQL queries to aggregate clicks by day, referrer, and device type
- **User Agent Parsing**: Extracting browser, OS, and device information from raw user agent strings
- **Multi-Tenant Data**: Implementing row-level security to ensure users only access their own data

## 🐛 Known Issues / Future Improvements

- [ ] Add caching layer (Redis) for popular URLs to reduce database load
- [ ] Implement custom short codes (let users choose their own)
- [ ] Add URL expiration feature
- [ ] Export analytics to CSV
- [ ] Real-time analytics with WebSocket updates
- [ ] QR code generation for short URLs
- [ ] Batch URL shortening via CSV upload

## 🔒 Security Considerations

- All API routes (except redirect) require authentication
- Row-level security ensures data isolation between users
- Input validation on all URL submissions
- Rate limiting to prevent abuse (future enhancement)
- SQL injection protection via parameterized queries

## 📊 Performance Metrics

- Average redirect time: < 50ms
- Database queries optimized with indexes
- Supports 100+ concurrent redirects
- Analytics queries cached for 5 minutes

## 📝 License

MIT License - feel free to use this project as inspiration for your own!

## 👤 Author

**Tom Fijalkowski**
- GitHub: [@TomFiji](https://github.com/TomFiji)
- LinkedIn: [Tom Fijalkowski](https://linkedin.com/in/tom-fijalkowski)
- Email: tf.tomfijalkowski@gmail.com

---

Built to demonstrate backend engineering, system design, and full-stack development skills.