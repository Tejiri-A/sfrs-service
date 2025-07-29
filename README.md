# SFRS Service - Project Proposal Management System

This is a Project Proposal Management System with three user roles: Client, Reviewer, and Approver.

## Database Setup

### Option 1: Using Supabase (Recommended)

1. **Create a Supabase project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Set up your environment variables**:
   - Copy your project URL and anon key from the Supabase dashboard
   - Update the `.env` file:
     ```env
     VITE_SUPABASE_URL=your_project_url_here
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

3. **Run the database schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database/schema.sql`
   - Execute the SQL to create tables and policies

### Option 2: Using Firebase (Future Implementation)

Firebase integration will be added later with the same interface.

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Navigate to `http://localhost:5173`
   - You can create accounts with different roles (client, reviewer, approver)

## User Roles & Workflow

### Client
- Create project proposals with title, description, budget, start/end dates
- View their own proposals
- Edit proposals that have been sent back by reviewers
- Filter proposals by status (waiting for review, waiting for approval, approved, rejected)

### Reviewer
- View all proposals from all clients
- Send proposals back to clients with feedback
- Forward proposals to approvers
- Filter by client, review status, and their own actions

### Approver
- View proposals forwarded by reviewers
- Approve or reject proposals with reasons
- Filter by client, approval status, and their own decisions

## Features

- Role-based authentication and authorization
- Form validation with Zod
- Responsive design with Tailwind CSS
- Real-time updates
- Action history tracking
- Row-level security with Supabase

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── libs/              # Database abstraction and utilities
├── pages/             # Page components
├── schemas/           # Zod validation schemas
└── assets/            # Static assets
```

## Development Notes

- The database abstraction layer allows switching between Supabase and Firebase
- All forms use React Hook Form with Zod validation
- The application uses row-level security for data access control
- Status transitions are enforced at the database level

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
