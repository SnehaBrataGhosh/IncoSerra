# IncoSerra

Production-style web app for stabilizing gig income: **React (Vite) + Tailwind** frontend, **Express** API, **MySQL** data, and **session + bcrypt** authentication (no JWT).

The runnable application lives in **`beta/`**:

- `beta/client` — React UI  
- `beta/server` — Express API  
- `beta/database` — SQL schema  

Legacy static prototype files remain in `prototype/` and are not required to run the beta stack.

---

## Prerequisites

- Node.js 18+ (global `fetch` on the server)  
- MySQL 8+ (or compatible)  
- Optional: [OpenWeatherMap](https://openweathermap.org/api) API key for live weather in the claim pipeline  

---

## 1. Database

Create the schema:

```bash
mysql -u root -p < beta/database/schema.sql
```

---

## 2. Server environment

```bash
cd beta/server
cp .env.example .env
```

Edit **`.env`** (do not commit real secrets):

| Variable | Purpose |
|----------|---------|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `PORT` | API port (default `4000`) |
| `SESSION_SECRET` | Long random string for signed cookies |
| `OPENWEATHER_API_KEY` | Optional; without it, weather falls back to a safe placeholder |
| `OPENWEATHER_DEFAULT_CITY` | Default city when the client omits one |
| `CLIENT_ORIGIN` | Frontend origin for CORS (default `http://localhost:5173`) |

Install and run:

```bash
npm install
npm run dev
```

Optional demo accounts (Silver plan, same password):

```bash
npm run seed
```

Uses **`SEED_DEMO_PASSWORD`** from `.env` if set; otherwise **`IncoSerraDemo2026`**. Demo identities: **NIHARIKA** and **PADMINI** only.

---

## 3. Client

```bash
cd beta/client
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:4000`.

For production builds, set `VITE_API_URL` to your API origin (e.g. `https://api.example.com`) so the browser calls the correct host.

---

## API routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register (name, phone, 12-digit aadhaar, domain, password) |
| POST | `/api/auth/login` | Login (name + password), session cookie |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/user` | Profile, totals, deposit and claim history |
| PATCH | `/api/user/plan` | Set or change plan (max **5** plan **changes** after first plan) |
| POST | `/api/deposit` | Simulated deposit within plan limits (max **3** deposits per week) |
| POST | `/api/process` | Run payout / fraud pipeline |
| POST | `/api/claim` | Same body as `/api/process` (alias) |
| GET | `/api/claim/:id` | Fetch one claim |

---

## Plans and rules (demo)

| Plan | Deposit range (INR) | Weekly deposit cap |
|------|---------------------|--------------------|
| Silver | 20 – 60 | 3 |
| Gold | 40 – 120 | 3 |
| Platinum | 50 – 150 | 3 |

Claim processing uses weather (when configured), activity level, simulated demand, movement, and recent claim patterns to produce **risk score**, **status** (`approved` / `review` / `rejected`), and **payout amount**.




---

## Repository

Remote: `https://github.com/SnehaBrataGhosh/IncoSerra.git`
