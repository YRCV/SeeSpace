# SeeSpace - AI Coding Agent Guide

## Project Overview

SeeSpace is a React Native mobile application built with Expo SDK 55 that helps students find free classroom spaces on campus. It uses TypeScript with strict mode and file-based routing via Expo Router.y, building exploration, and favorites management with a clean, intuitive interface.

**Core Features:**
- Search for specific classrooms with fuzzy matching
- Room status indicators (Free/Occupied) with color-coded dots
- Building categorization and exploration
- 2-week calendar view for each classroom
- Swipeable tab navigation (Buildings, Home, Favorites)
- Favorites system for quick access to frequently used rooms

## Technology Stack

- **Framework**: React Native with Expo SDK 55 (React Native 0.83, React 19)
- **Navigation**: Expo Router 55 with React Navigation 7
- **Language**: TypeScript with strict mode enabled
- **UI Components**: Native components with custom styling
- **State Management**: React Context (SearchContext)
- **Animation**: React Native Reanimated 4.2
- **Icons**: Expo Vector Icons + Lucide icons
- **Platform Support**: iOS, Android, Web

## Project Structure

```
frontend/
├── app/                          # Main application routes
│   ├── (tabs)/                   # Tab navigation layout
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home screen (nearby free rooms)
│   │   ├── buildings.tsx        # Buildings exploration
│   │   └── favorites.tsx        # User favorites
│   ├── classroom/                # Classroom detail screens
│   │   └── [id].tsx             # Dynamic classroom view
│   ├── _layout.tsx              # Root layout with providers
│   └── modal.tsx                # Modal screen
├── components/                   # Reusable UI components
│   ├── AppHeader.tsx            # Application header
│   ├── ClassroomCard.tsx        # Room display card
│   ├── FloatingSearchBar.tsx    # Search input component
│   ├── BuildingSection.tsx      # Building group component
│   ├── themed-text.tsx          # Themed text component
│   ├── themed-view.tsx          # Themed view component
│   └── ui/                      # UI utility components
├── constants/                    # App constants and data
│   ├── data.ts                  # Mock building/room data
│   └── theme.ts                 # Color and font definitions
├── context/                      # React contexts
│   └── SearchContext.tsx        # Global search state
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Theme detection
│   └── use-theme-color.ts       # Theme color hook
└── assets/                      # Static assets
    └── images/                   # App icons and images
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser

# Code quality
npm run lint       # Run ESLint

# Project management
npm run reset-project  # Reset to blank template
```

## Code Style Guidelines

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to root directory
- Includes: `**/*.ts`, `**/*.tsx`, `.expo/types/**/*.ts`

### Component Structure

- Functional components with TypeScript interfaces for props
- Consistent naming: PascalCase for components, camelCase for functions
- Destructure props in component parameters
- Use explicit return types for components

### Styling Conventions

- StyleSheet.create() for all styles
- Color constants from theme.ts
- Consistent spacing and typography scales
- Platform-specific font stacks defined

### State Management

- SearchContext for global search state
- Local state with useState for component-specific data
- No external state management libraries

## Key Components

### ClassroomCard

- Displays room name, building, distance, and status
- Color-coded status indicator (green=free, red=occupied)
- Touchable with navigation to detail view
- Consistent shadow and elevation across platforms

### FloatingSearchBar

- Global search component
- Fuzzy matching on room names and buildings
- Context-aware visibility (hidden on favorites tab)
- Positioned above tab bar

### Tab Navigation

- Material Top Tabs with bottom positioning
- Swipe-enabled navigation
- Custom icons and styling
- Three tabs: Buildings, Home, Favorites

## Data Architecture

### Interfaces

```typescript
interface Classroom {
  id: string;
  name: string;
  building: string;
  status: 'free' | 'occupied';
  distance?: string;
  isFavorite?: boolean;
}

interface Building {
  id: string;
  name: string;
  rooms: Classroom[];
}
```

### Current Data

- Mock data in `constants/data.ts`
- Static building and room information
- No backend integration (placeholder for future API)

## Testing Strategy

**Current State**: No custom tests implemented
**Available Tools**:
- ESLint for code quality
- TypeScript for type checking
- Expo development tools

**Recommended Testing Approach**:

- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for navigation flows
- E2E testing with Detox for critical user paths

## Deployment Process

### Development

- Local development with Expo CLI
- Hot reloading and live debugging
- Multi-platform testing

### Production Build

```bash
# iOS
expo build:ios

# Android
expo build:android

# Web
expo build:web
```

### App Store Configuration

- Bundle identifier: `com.seespace.app`
- Adaptive icons configured for Android
- Splash screen with custom branding
- Edge-to-edge enabled for modern Android

## Security Considerations

### Current Implementation

- No user authentication
- No sensitive data storage
- Mock data only

### Future Considerations
- API integration will require secure authentication
- Data encryption for user favorites
- Secure communication with backend services
- Privacy compliance for location data

## Development Workflow

1. **Feature Development**: Create new screens in `app/` directory
2. **Component Creation**: Reusable components in `components/` 
3. **Data Management**: Update interfaces in `constants/data.ts`
4. **Navigation**: Configure routes in `_layout.tsx` files
5. **Testing**: Manual testing with Expo development tools
6. **Code Quality**: Run linting before commits

## Color Scheme

**Primary**: `#d64045` (Red) - Main brand color
**Secondary**: `#2a2b2a` (Dark Charcoal) - Text and backgrounds
**Tertiary**: `#dcdcdd` (Light Gray) - Light backgrounds

**Status Colors**:
- Free: `#4CAF50` (Green)
- Occupied: `#F44336` (Red)

## Platform-Specific Notes

### iOS
- Supports tablet layouts
- System font integration
- Safe area handling with SafeAreaProvider

### Android
- Adaptive icons with multiple densities
- Edge-to-edge display support
- Predictive back gesture disabled

### Web
- Static output configuration
- Responsive design considerations
- Browser compatibility with React Native Web