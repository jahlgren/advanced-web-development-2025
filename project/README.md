# Time Tracking App

This is a time tracking application where users can register, sign in, create projects, and track time spent across different categories within each project.

## Features

- User Registration & Authentication
- Create and Manage Projects
- Track Time Logs with Categories
- View Time Stats per Project

## Requirements

- Node.js (v18 or higher recommended)
- PostgreSQL Database

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jahlgren/advanced-web-development-2025.git
cd advanced-web-development-2025/project
```

### 2. Install Dependencies

You can install the project dependencies using:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project. Below is a sample configuration:

```bash
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydatabase
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=https://auth.yourapp.com
```

* **DATABASE_URL:** Your Postgres database connection URL. Replace myuser, mypassword, and mydatabase with your actual database credentials.

* **BETTER_AUTH_SECRET:** Secret key for authentication.

* **BETTER_AUTH_URL:** The URL to your application.

### 4. Setting Up PostgreSQL

You can also spin up a local PostgreSQL container using Docker:

```bash
docker run --name postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```

This will create a local PostgreSQL container running on `localhost:5432`. Replace `myuser`, `mypassword`, and `mydatabase` with your preferred values.

To connect to this Docker PostgreSQL container using psql:

```bash
docker exec -it postgres psql -U myuser -d mydatabase
```

### 5. Run Migrations

The project uses [Drizzle ORM](https://orm.drizzle.team) for managing database migrations.

Before you start the application, you need to run the migrations to set up the database schema.

To run the migrations, use:

```bash
npx drizzle-kit migrate
```

This will apply the latest migrations and set up the tables for your project.

**Note:** You will need to run this command when first setting up the project and whenever there are new migrations.

### 6. Running the Development Server

Once everything is set up, you can start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000. Open this URL in your browser.
