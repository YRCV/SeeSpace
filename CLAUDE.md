# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SeeSpace is a React Native mobile application built with Expo SDK 55 that helps students find free classroom spaces on campus. It uses TypeScript with strict mode and file-based routing via Expo Router.

## Development Commands

All commands should be run from the `frontend/` directory:

```bash
# Start development server
npm start

# Run on specific platforms
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser

# Code quality
npm run lint       # Run ESLint

# Reset project to blank template
npm run reset-project
```

## Architecture

### File-Based Routing (Expo Router)

The app uses Expo Router with file-based routing. Route files are in `frontend/app/`:

- `app/_layout.tsx` - Root layout with ThemeProvider, GestureHandlerRootView, SafeAreaProvider, and ClassroomOpenTransitionProvider
- `app/(tabs)/` - Tab navigation group with three screens:
  - `buildings.tsx` - Building exploration list
  - `index.tsx` - Home screen (nearby free rooms)
  - `favorites.tsx` - Saved/starred classrooms
- `app/(tabs)/_layout.tsx` - Tab bar configuration using Material Top Tabs positioned at bottom
- `app/classroom/[id].tsx` - Dynamic route for classroom detail view
- `app/modal.tsx` - Modal presentation screen

The app uses Material Top Tabs (`@react-navigation/material-top-tabs`) with tab bar positioned at the bottom. Swipe navigation is enabled between tabs.

### State Management

The app uses React Context for global state:

- **SearchContext** (`frontend/context/SearchContext.tsx`) - Global search query state shared between FloatingSearchBar and tab screens
- **ClassroomOpenTransitionContext** - Manages animation state for classroom detail transitions

Local state uses `useState` for component-specific data.

### Theme System

Colors are defined in `frontend/constants/theme.ts`:

- **Primary**: `#d64045` (Red)
- **Secondary**: `#2a2b2a` (Dark Charcoal)
- **Tertiary**: `#dcdcdd` (Light Gray)

Status colors:
- Free: Green (`#4CAF50`)
- Occupied: Red (`#F44336`)

The app supports both light and dark modes via `useColorScheme` hook and `Colors` constants.

### Path Aliases

The `@/*` path alias maps to the root directory (configured in `tsconfig.json`).

## Key Conventions

- Components use PascalCase, functions use camelCase
- Props interfaces are defined inline in component parameters
- Styles are defined using `StyleSheet.create()`
- Platform-specific font stacks are configured in `constants/theme.ts`
- Icons come from `@expo/vector-icons` and `@react-native-vector-icons/lucide`

## Data Structure

Classroom and building data is stored in `frontend/constants/data.ts` with TypeScript interfaces:

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

Current data is mock/static - no backend API integration exists yet.
