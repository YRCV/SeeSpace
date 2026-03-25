# SeeSpace - AI Coding Agent Guide

## Project Overview

SeeSpace is a React Native mobile app (Expo SDK 55) helping students find free classrooms. Uses TypeScript strict mode, Expo Router file-based routing, and React Navigation 7.

**Tech Stack**: React Native 0.83 / React 19, Expo Router 55, TypeScript (strict), React Native Reanimated 4.2, Lucide icons

## Development Commands

All commands run from `frontend/` directory:

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm start              # Start Expo
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # Web browser

# Code quality
npm run lint           # Run ESLint (expo lint)
npx tsc --noEmit       # TypeScript type check

# Project management
npm run reset-project  # Reset to blank Expo template
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** in tsconfig.json
- Path alias: `@/*` maps to `frontend/` root
- Always define explicit interfaces for component props
- Destructuring props in function parameters is required

### Imports

Order: 1) React 2) External libraries 3) Internal imports (@/...)
- Use double quotes for imports: `import { X } from "react-native";`
- Use single quotes for strings within code

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ClassroomCard`, `ThemedView` |
| Hooks | camelCase with `use` prefix | `useColorScheme`, `useSearch` |
| Context | PascalCase with `Context` suffix | `SearchContext`, `FavoritesContext` |
| Functions | camelCase | `startOpenTransition`, `registerMeasurement` |
| Types/Interfaces | PascalCase | `ClassroomCardProps`, `SearchContextType` |
| Constants | camelCase or SCREAMING_SNAKE | `Colors`, `MAX_RETRIES` |
| CSS properties | camelCase | `flexDirection`, `borderRadius` |

### Component Structure

```typescript
// 1. Imports
import React from "react";
import { StyleSheet, View } from "react-native";
import { SomeComponent } from "@/components/SomeComponent";

// 2. Props interface
interface ComponentProps {
  id: string;
  name: string;
  onPress: () => void;
}

// 3. Component definition with destructured props
export function Component({ id, name, onPress }: ComponentProps) {
  // 4. Hooks first
  const [state, setState] = React.useState(false);
  
  // 5. Derived values / callbacks
  const handleClick = React.useCallback(() => {
    onPress();
  }, [onPress]);

  // 6. Return JSX with StyleSheet.create for styles
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

### Error Handling

- Use early returns for null/undefined checks
- Never leave console.log in production code
- Wrap async operations in try/catch when appropriate
- Provide fallback values where types allow

### Styling

- Use `StyleSheet.create()` for all styles (required)
- Use color constants from `@/constants/theme` (Colors.light/dark)
- Use `Platform.select()` for platform-specific values
- Prefer `boxShadow` string over `elevation` for cross-platform consistency

## Project Structure

```
frontend/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx   # Tab bar config
│   │   ├── index.tsx     # Home screen
│   │   ├── buildings.tsx # Buildings list
│   │   └── favorites.tsx # User favorites
│   ├── classroom/[id].tsx # Classroom detail
│   └── _layout.tsx       # Root layout
├── components/            # Reusable UI components
├── constants/             # Theme, data, config
├── context/               # React Context providers
├── hooks/                 # Custom hooks
└── utils/                 # Utility functions
```

## Data Interfaces

```typescript
interface Classroom {
  id: string;
  name: string;
  building: string;
  status: "free" | "occupied";
  distance?: string;
  isFavorite?: boolean;
}

interface Building {
  id: string;
  name: string;
  rooms: Classroom[];
}
```

## Testing

**No test framework configured yet.** For future tests:
- Use Jest with React Native Testing Library
- Place tests alongside components: `Component.test.tsx`
- Run single test: `npx jest path/to/test.test.tsx`

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#d64045` | Brand, selected tabs |
| Secondary | `#2a2b2a` | Dark backgrounds, text |
| Tertiary | `#dcdcdd` | Light backgrounds |
| Free | `#4CAF50` | Free room status |
| Occupied | `#F44336` | Occupied room status |
