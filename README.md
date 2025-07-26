# 🎬 Movie API

A secure, test-driven backend API for managing and searching movies. Built with TypeScript, Express, Prisma, and PostgreSQL — following Clean Architecture principles.

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://gitlab.com/orestischaral/movie-api.git
cd movie-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file:

```bash
cp .env.example .env
```

Then edit it:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/moviesdb
HASHED_API_KEYS=API key hash
PORT=3000
```

To generate a secure API key hash:

```bash
echo -n "your-raw-api-key" | openssl dgst -sha256
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npm db-reset
```

### 5. Start the server

```bash
npm run dev
```

Server will run at: http://localhost:3000

## 🔐 API Key System (SHA-256 Protected)

This project uses a secure SHA-256–based API key system.

Clients send the raw API key via ?api_key=...

Server hashes the key and compares against the list in HASHED_API_KEYS

✅ Example Request : http://localhost:3000/movies/popular?api_key=your-raw-api-key

## 📘 API Endpoints

Method Endpoint Description

### GET /movies/popular Top 50 movies (paginated)

#### example

```bash
http://localhost:3000/movies/popular?api_key=your-secret
http://localhost:3000/movies/popular?page=2&api_key=project-highCircl  (with pagination)
```

### GET /movies/search Search by title, genre, year, rating

#### 🧾 Search Filters

```bash

── query=Movie (required)
── filter=genre:Action,year:2015
── sort_by=rating or release_date
── page=1
```

#### example

```bash
http://localhost:3000/movies/search?query=Star&api_key=your-secret
http://localhost:3000/movies/search?query=Star&filter=genre:Action,year:2015&sort_by=rating&page=1&api_key=your-secret

```

### GET /movies/:id Full details for one movie

#### example

```bash
http://localhost:3000/movies/1?api_key=your-secret

```

## 🧪 Testing the API

```bash
npm run test
```

## 🧠 Architecture Overview

```bash
src/
├── domain/         # Core models and interfaces
├── application/    # Use cases (business logic)
├── infrastructure/ # Express, Prisma, API key middleware, endpoints, repositories
Follows Onion/Clean Architecture for separation of concerns and testability.
```

## 👤 Author

#### Orestis Charalampakos

Software Engineer

### 🪪 License

MIT — free to use, modify, and extend.
