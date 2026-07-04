# Book Management System

A modern Book Management System developed as part of the **Azura Labs Fullstack Engineer Internship Technical Assessment**.

This application allows users to manage book categories and books through a clean and responsive interface. The UI design is inspired by modern web novel platforms, featuring a premium dark theme, elegant typography, and a card-based layout to provide a polished user experience.

---

## Features

### Category Management
- Create category
- Update category
- Delete category
- View all categories

### Book Management
- Create book
- Update book
- Delete book
- View all books

Each book includes:
- Title
- Author
- Publication Date
- Publisher
- Number of Pages
- Category

### Advanced Filtering
- Filter by category
- Search by title, author, or publisher
- Filter by publication date range

---

## Tech Stack

- Next.js 16 (App Router)
- React
- Prisma ORM
- SQLite
- CSS Modules
- Lucide React

---

## Project Structure

```
app/
components/
lib/
prisma/
public/
```

---

## Installation

### Install dependencies

```bash
npm install
```

### Configure environment

Create `.env`

```env
DATABASE_URL="file:./dev.db"
```

### Initialize database

```bash
npx prisma db push
```

### Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Design Inspiration

The interface is inspired by modern web novel platforms, focusing on:
- Premium dark theme
- Responsive layout
- Modern typography
- Card-based UI
- Smooth user experience

---

## Assessment Information

This project was completed as part of the **Technical Assessment** for the **Azura Labs Internship Recruitment Process**.

The implementation focuses on:
- Clean and maintainable code
- RESTful API using Next.js Route Handlers
- Prisma ORM integration
- Responsive UI
- CRUD functionality
- Search and filtering capabilities

---
