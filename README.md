# Book Management System

A sleek, modern web application for managing books and book categories, inspired by premium web novel platforms. Built with Next.js, React, and Prisma (SQLite).

## Features & Specifications

This application fulfills the following core requirements:

1. **Book Categories Management**
   - Create, update, and delete book categories.
   - View a complete list of all categories (`/categories`).

2. **Books Management**
   - Create, update, and delete books.
   - Each book requires a Title, Author, Publication Date, Publisher, Number of Pages, and Category.
   - View a complete list of books (`/books`) in a responsive, stylized grid layout.

3. **Advanced Filtering**
   - **By Category**: Filter the book list by selecting a specific category.
   - **By Text Search**: A single search bar that simultaneously queries the book's Title, Author, and Publisher.
   - **By Publication Date**: Filter books using "From" and "To" publication date ranges.

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React, Vanilla CSS Modules (custom premium design system)
- **Backend:** Next.js Route Handlers (API)
- **Database:** SQLite managed via Prisma ORM
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   Ensure you have a `.env` file with your database URL:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
   Run Prisma migrations to create the SQLite database:
   ```bash
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to start managing your library.
