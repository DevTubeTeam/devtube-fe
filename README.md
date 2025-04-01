# DevHub Frontend

DevHub Frontend is a React-based web application built with TypeScript and Vite. It serves as the frontend for the DevTube platform, providing a modern and responsive user interface for managing and interacting with video content.

## Project Structure

The project is organized into the following main directories:

- **`assets/`**: Contains static assets such as images and icons.
  - Example: `react.svg`

- **`components/`**: Houses reusable UI components and feature-specific components.
  - Subdirectories include:
    - `auth/`: Components related to authentication.
    - `channel/`: Components for channel management.
    - `common/`: Shared components used across the application.
    - `guards/`: Route guards for protected pages.
    - `shared/`: Shared utilities or components.
    - `ui/`: UI-specific components.
    - `video/`: Components for video-related features.

- **`configs/`**: Configuration files for the application.
  - Example: `axiosConfig.ts` for Axios HTTP client configuration.

- **`contexts/`**: React context providers for managing global state.
  - Examples:
    - `AuthContext.tsx`: Authentication context.
    - `ResponsiveContext.tsx`: Context for responsive design.
    - `ThemeContext.tsx`: Context for theming.

- **`hoc/`**: Higher-order components (HOCs) for wrapping components with additional functionality.
  - Example: `withResponsive.tsx`

- **`hooks/`**: Custom React hooks for reusable logic.
  - Examples:
    - `useAuth.ts`: Hook for authentication logic.
    - `useBreakpoint.ts`: Hook for responsive breakpoints.
    - `useTheme.ts`: Hook for theme management.

- **`layouts/`**: Layout components for structuring pages.
  - Examples:
    - `AdminLayout.tsx`: Layout for admin pages.
    - `ChannelLayout.tsx`: Layout for channel-related pages.

- **`pages/`**: Contains individual pages of the application.

- **`providers/`**: Providers for wrapping the application with global configurations or services.

- **`routes/`**: Application routing configuration.

- **`services/`**: Service files for API calls and business logic.

- **`types/`**: TypeScript type definitions.

- **`utils/`**: Utility functions and helpers.

## Key Features

- **React + TypeScript**: Leverages the power of TypeScript for type safety and React for building dynamic user interfaces.
- **Vite**: A fast build tool for modern web applications with Hot Module Replacement (HMR).
- **ESLint Integration**: Configured with type-aware lint rules for better code quality.
- **Custom Hooks and Contexts**: Implements reusable hooks and context providers for state management and logic abstraction.
- **Responsive Design**: Built with responsiveness in mind, ensuring compatibility across devices.

## Development Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/devhub-fe.git
   cd devhub-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Linting and Formatting

The project uses ESLint for linting and Prettier for code formatting. To run lint checks:

```bash
npm run lint
# or
yarn lint
```

## Expanding ESLint Configuration

To enable type-aware lint rules, update the ESLint configuration as follows:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Additionally, install and configure React-specific plugins:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Contribution

Contributions are welcome! Please follow the guidelines outlined in the `CONTRIBUTING.md` file.

## License

This project is licensed under the [MIT License](LICENSE).

