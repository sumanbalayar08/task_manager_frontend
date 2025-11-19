# Task Manager Frontend

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. This frontend application provides a clean and intuitive interface for managing daily tasks with authentication, CRUD operations, and real-time updates.

## ✨ Features

- **User Authentication**: Secure sign-up and sign-in functionality
- **Task Management**: Create, read, update, and delete tasks
- **Modern UI**: Clean, responsive design using Tailwind CSS and Radix UI components
- **Form Validation**: Client-side validation with React Hook Form and Zod schemas
- **Data Fetching**: Efficient data management with TanStack Query
- **Type Safety**: Full TypeScript support with strict typing
- **Component Library**: Reusable UI components with consistent design
- **Hot Reload**: Fast development experience with Vite
- **Code Quality**: ESLint configuration for maintainable code

## 🛠️ Tech Stack

### Core Technologies

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Utility class merging

### Data Management

- **TanStack Query** - Server state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Routing & Navigation

- **React Router DOM v7** - Client-side routing

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking and compilation

## 📁 Project Structure

```
src/
├── api/                 # API layer and HTTP configuration
│   ├── axios.ts         # Axios instance with interceptors
│   └── tasks/           # Task-related API calls
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── hero/           # Hero section components
│   ├── modal/          # Modal components
│   ├── table/          # Table components
│   └── ui/             # Base UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Home.tsx        # Main task management page
│   ├── SignInPage.tsx  # Sign-in page
│   └── SignUpPage.tsx  # Sign-up page
├── providers/          # App-level providers
├── types/              # TypeScript type definitions
├── validation_schemas/ # Zod validation schemas
└── constants/          # Application constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API server running on `http://localhost:5000`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sumanbalayar08/task_manager_frontend
   cd task_manager_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   Make sure your backend API is running on the specified URL.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🔧 Configuration

### Environment Variables

| Variable       | Description                  | Default                 |
| -------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL for the backend API | `http://localhost:5000` |

### API Integration

The frontend expects the following API endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/me` - Get current user
- `GET /api/logout` - Logout user
- `GET /api/tasks` - Fetch user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

## 🎨 UI Components

### Authentication

- Sign-up form with validation
- Sign-in form with error handling
- Protected routes with authentication guards

### Task Management

- Task creation form with validation
- Task editing with inline updates
- Task deletion with confirmation modal
- Task listing with sorting and filtering
- Responsive table design

### UI Elements

- Custom modal components
- Form inputs with validation states
- Loading states and skeletons
- Toast notifications for user feedback
- No-data states with helpful messages

## 📝 Data Models

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

## 🔐 Authentication Flow

1. **Sign Up**: New users can create an account with name, email, and password
2. **Sign In**: Existing users authenticate with email and password
3. **Token Management**: JWT tokens are stored and used for API requests
4. **Auto-logout**: Users are automatically logged out on token expiration
5. **Protected Routes**: Authentication required for task management features

## 🎯 Key Features Explained

### Form Validation

- Client-side validation using Zod schemas
- Real-time validation feedback
- Custom error messages
- Form state management with React Hook Form

### Data Fetching

- Optimistic updates for better UX
- Automatic refetching on window focus
- Error handling with retry mechanisms
- Loading states for better perceived performance

### Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Accessible components following ARIA guidelines

## 🐛 Development Tips

### Code Quality

- Run `npm run lint` before committing changes
- Follow TypeScript strict mode guidelines
- Use provided UI components for consistency
- Maintain proper component separation of concerns

### Debugging

- Check browser console for API errors
- Verify backend API is running and accessible
- Ensure environment variables are correctly set
- Use React Developer Tools for component inspection

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory, ready for deployment to any static hosting service.

### Environment Setup for Production

Make sure to set the correct `VITE_API_URL` environment variable pointing to your production backend API.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- Vite for the fast development experience
