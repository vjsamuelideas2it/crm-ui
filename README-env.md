# Environment Configuration

## Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update the values in `.env` as needed for your environment:

## Environment Variables

### Required Variables

- **VITE_API_BASE_URL**: The base URL for your API server
  - Default: `http://localhost:3001/api`
  - Production example: `https://your-api-domain.com/api`

- **VITE_AUTH_TOKEN_KEY**: localStorage key for storing auth token
  - Default: `crm_auth_token`

- **VITE_AUTH_USER_KEY**: localStorage key for storing user data
  - Default: `crm_auth_user`

### Optional Variables

- **VITE_NODE_ENV**: Application environment
  - Default: `development`
  - Options: `development`, `production`

## Usage

The environment variables are automatically loaded by Vite and can be accessed through the centralized config file at `src/config/env.ts`.

## Notes

- All frontend environment variables must be prefixed with `VITE_` to be accessible in the browser
- Changes to `.env` require restarting the development server
- The `.env` file is ignored by git for security 