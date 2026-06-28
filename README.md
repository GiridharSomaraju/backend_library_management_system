# Library Management System API

## About the Project

This is a backend REST API for a Library Management System built with **Node.js**, **Express.js**, and **PostgreSQL**.

Librarians can manage books and members, while members can browse, borrow, and return books. Authentication is handled with JWT, and passwords are hashed using bcrypt before being stored.

---

## Features

### Authentication
- Register a new member
- Login with email and password
- JWT-based authentication for protected routes

### Book Management
- Add a new book
- Get all books
- Get details of a specific book
- Update book details
- Soft delete a book

### Member Management
- View all members
- Soft delete a member

### Borrow Management
- Borrow a book
- Return a book
- View borrowed books of the logged-in member

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt
- dotenv

---

## Project Setup

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd library-management-system
```

---

## Installation Steps

Install all dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_DATABASE=library_management
JWT_SECRET_KEY=your_secret_key
```

---

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE library_management_system;
```

2. Connect to the database:

```sql
\c library_management_system
```

3. Create the required tables:
   - `users`
   - `books`
   - `borrow_record`

   (SQL schema is included in this project.)

---

## How to Run the Project

Start the server:

```bash
npm start
```

If using nodemon for development:

```bash
npm run dev
```

The server runs on:

```
http://localhost:3000
```

---

## API Documentation

### Authentication

**Register**
```
POST /register
```
Request Body:
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

**Login**
```
POST /login
```
Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Books

| Method | Endpoint     | Description           |
|--------|--------------|------------------------|
| GET    | /books       | Get all books          |
| GET    | /books/:id   | Get a specific book    |
| POST   | /books       | Add a new book         |
| PUT    | /books/:id   | Update book details    |
| DELETE | /books/:id   | Soft delete a book     |

---

### Members

| Method | Endpoint       | Description            |
|--------|----------------|-------------------------|
| GET    | /members       | Get all members         |
| DELETE | /members/:id   | Soft delete a member    |

---

### Borrow

| Method | Endpoint      | Description             |
|--------|---------------|--------------------------|
| POST   | /borrow/:id   | Borrow a book            |
| PATCH  | /return/:id   | Return a book            |
| GET    | /my-books     | View borrowed books      |

---

## Authentication

For protected routes, pass the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Future Improvements

Planned for upcoming updates:

- Express Validator for request validation
- Model layer for better MVC separation
- Centralized error handling
- API documentation using Swagger
- Docker support
- Unit testing