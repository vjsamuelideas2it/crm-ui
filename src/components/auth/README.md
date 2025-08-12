# 🔐 Authentication Components

This directory contains the complete authentication system for the CRM application, including login and signup pages with form validation, API integration, and consistent styling.

## 📋 Overview

The authentication system provides:
- ✅ **LoginPage**: User authentication with email/password
- ✅ **SignupPage**: User registration with role selection
- ✅ **AuthContext**: In-memory token and user state management
- ✅ **AuthService**: API integration with backend endpoints
- ✅ **Responsive Design**: Mobile-first, card-based layout
- ✅ **Form Validation**: Real-time validation with error states
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Toast Notifications**: Success and error messages

## 🏗️ Architecture

```
src/
├── contexts/
│   └── AuthContext.tsx          # In-memory auth state management
├── services/
│   └── authService.ts           # API calls to backend
├── pages/
│   ├── LoginPage.tsx           # Login form component
│   └── SignupPage.tsx          # Signup form component
├── styles/
│   └── pages/
│       └── _auth.scss          # Authentication page styles
└── demo/
    └── AuthDemo.tsx           # Integration example
```

## 🚀 Quick Start

### 1. Install Dependencies

The following dependencies are required:
```bash
npm install react-hook-form react-hot-toast
```

### 2. Import Styles

Ensure `_auth.scss` is imported in your main stylesheet:
```scss
// src/styles/main.scss
@use 'pages/auth';
```

### 3. Setup AuthProvider

Wrap your app with the AuthProvider:
```tsx
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
```

### 4. Use Authentication Pages

```tsx
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// In your router
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
</Routes>
```

## 📖 API Documentation

### AuthContext

#### useAuth Hook
```tsx
const { user, token, login, logout, isAuthenticated } = useAuth();
```

**Methods:**
- `login(user, token)`: Store user data and token in memory
- `logout()`: Clear user data and token
- `isAuthenticated`: Boolean indicating auth status

### AuthService

#### Login
```tsx
const response = await authService.login({
  email: "user@example.com",
  password: "password123"
});
```

#### Signup
```tsx
const response = await authService.signup({
  name: "John Doe",
  email: "john@example.com", 
  password: "password123",
  role_id: 2
});
```

## 🎨 Component Features

### LoginPage

**Form Fields:**
- `email` - Required, email validation
- `password` - Required, min 6 characters

**Features:**
- Real-time validation with React Hook Form
- Loading state with spinner animation
- Error handling with toast notifications
- Link to signup page
- Responsive card layout

**API Integration:**
- POST `/api/auth/login`
- Handles 401 errors with appropriate messages
- Stores token in memory on success

### SignupPage

**Form Fields:**
- `name` - Required, 2-100 characters
- `email` - Required, unique, email validation
- `password` - Required, min 6 characters
- `role_id` - Dropdown (1=Admin, 2=User)

**Features:**
- Role selection dropdown
- Field-specific error handling
- Email uniqueness validation
- Password strength hints
- Link to login page

**API Integration:**
- POST `/api/auth/signup`
- Handles 409 (email exists) errors
- Handles 400 (invalid role) errors
- Stores token in memory on success

## 🎯 Error Handling

### Login Errors
- **401 Unauthorized**: Invalid credentials
- **Network Error**: Connection issues
- **Generic Error**: Fallback error message

### Signup Errors
- **409 Conflict**: Email already exists (toast)
- **400 Bad Request**: Invalid role (field error)
- **Network Error**: Connection issues
- **Generic Error**: Fallback error message

## 🎨 Styling System

### Design Tokens
The auth components use the existing design system:

```scss
// Colors
$primary-600: #2563eb;    // Primary buttons
$red-600: #dc2626;        // Error states
$green-600: #16a34a;      // Success states
$gray-600: #4b5563;       // Text colors

// Spacing
$spacing-4: 1rem;         // Standard spacing
$spacing-6: 1.5rem;       // Card padding

// Typography
$font-size-base: 1rem;    // Body text
$font-size-lg: 1.125rem;  // Headings
```

### CSS Classes
```scss
.auth-page          // Full-screen container with gradient
.auth-card          // Card component with shadow
.auth-form          // Form container with spacing
.form-input         // Input styling with focus states
.form-error         // Error message styling
.submit-btn         // Primary button with loading states
```

## 🔧 Configuration

### Backend API URL
Update the API base URL in `authService.ts`:
```tsx
const API_BASE_URL = 'http://localhost:3001/api';
```

### Role Options
Modify role options in `SignupPage.tsx`:
```tsx
const ROLE_OPTIONS = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'User' },
  { value: 3, label: 'Manager' }, // Add new roles
];
```

### Toast Configuration
Customize toast notifications:
```tsx
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      borderRadius: '0.5rem',
      fontWeight: '500',
    },
  }}
/>
```

## 🛡️ Security Features

### In-Memory Storage
- Tokens stored in React state (not localStorage)
- Tokens cleared on browser refresh
- No persistent storage for enhanced security

### Form Validation
- Client-side validation with React Hook Form
- Server-side validation with backend API
- Real-time feedback on form errors

### Password Requirements
- Minimum 6 characters
- No maximum limit (backend enforced)
- Secure transmission to backend

## 🧪 Testing

### Manual Testing
1. Start backend: `npm run dev` (in app-api)
2. Start frontend: `npm run dev` (in app-ui)
3. Navigate to `/login` or `/signup`
4. Test form validation and API integration

### Test Cases
- [ ] Valid login with existing user
- [ ] Invalid login with wrong credentials
- [ ] Signup with new email
- [ ] Signup with existing email (409 error)
- [ ] Form validation errors
- [ ] Loading states during API calls
- [ ] Toast notifications for success/error

## 🚀 Integration Example

See `demo/AuthDemo.tsx` for a complete integration example with React Router and protected routes.

## 📱 Responsive Design

The authentication pages are fully responsive:
- **Mobile**: Single column, full-width card
- **Tablet**: Centered card with max-width
- **Desktop**: Centered card with shadows and gradients

## 🎯 Next Steps

1. **Routing**: Integrate with React Router for navigation
2. **Protected Routes**: Add route guards for authenticated pages
3. **Remember Me**: Add persistent login option
4. **Password Reset**: Implement forgot password flow
5. **Social Login**: Add OAuth providers (Google, GitHub)
6. **2FA**: Implement two-factor authentication

## 🤝 Contributing

When adding new authentication features:
1. Follow the existing design system
2. Use React Hook Form for form management
3. Add proper TypeScript types
4. Include error handling and loading states
5. Update this documentation 