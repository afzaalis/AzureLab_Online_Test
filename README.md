# Book Management System

A modern Book Management System developed as a **Technical Assessment Project for Azura Labs Internship - Fullstack Engineer**. This application enables users to efficiently manage books and book categories through a clean, responsive, and user-friendly interface.

The UI/UX design is **inspired by modern web novel platforms**, adopting a premium dark-themed aesthetic with elegant typography, card-based layouts, and smooth interactions to create a more engaging reading and library management experience.

## Features & Specifications

This application fulfills the following core requirements:

### 1. Book Categories Management
- Create, update, and delete book categories.
- View a complete list of all categories (`/categories`).

### 2. Books Management
- Create, update, and delete books.
- Each book contains:
  - Title
  - Author
  - Publication Date
  - Publisher
  - Number of Pages
  - Category
- Display books in a responsive card-based layout (`/books`).

### 3. Advanced Filtering
- **Category Filter** – Browse books by selected category.
- **Text Search** – Search books by Title, Author, or Publisher using a single search bar.
- **Publication Date Filter** – Filter books using "From" and "To" publication date ranges.

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React, CSS Modules
- **Backend:** Next.js Route Handlers (API)
- **Database:** SQLite with Prisma ORM
- **Icons:** Lucide React

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

Then initialize the database:

```bash
npx prisma db push
```

### 3. Run the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser to access the application.

## Project Notes

- Developed as a **Technical Assessment** for the **Azura Labs Internship Recruitment Process**.
- Designed with inspiration from **modern web novel platforms**, emphasizing a premium visual experience while maintaining usability and responsive design.
- Implements complete CRUD operations, advanced filtering, and a clean architecture using Next.js and Prisma.
