# HimalayanLuxe - Project Structure

## Overview
This project follows a professional, modular architecture with clear separation of concerns.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (pagination, buttons, etc.)
│   ├── layout/         # Layout components (Header, Footer, Navigation)
│   └── ui/             # UI primitives (Loader, animations, etc.)
│
├── sections/           # Page sections (Hero, Experience, Services, etc.)
│   ├── HeroSection.tsx
│   ├── ExperienceSection.tsx
│   ├── DestinationsSection.tsx
│   ├── ServicesSection.tsx
│   └── CTASection.tsx
│
├── hooks/              # Custom React hooks
│   └── useSmoothScroll.ts
│
├── data/               # Static data and content
│   ├── philosophies.tsx
│   └── services.ts
│
├── lib/                # Utility functions
│   └── utils.ts
│
├── App.tsx             # Main app component (orchestration only)
├── Silk.tsx            # 3D background component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Architecture Principles

### 1. Separation of Concerns
- **Sections**: Each major page section is a separate component
- **Components**: Reusable UI elements organized by purpose
- **Hooks**: Business logic extracted into custom hooks
- **Data**: Content separated from presentation logic

### 2. Component Organization

#### Sections (`src/sections/`)
Large, page-specific sections that compose the main layout:
- `HeroSection.tsx` - Landing hero with video background
- `ExperienceSection.tsx` - Philosophy carousel
- `DestinationsSection.tsx` - Portfolio showcase
- `ServicesSection.tsx` - Stacked service cards
- `CTASection.tsx` - Call-to-action section

#### Components (`src/components/`)
- `common/` - Shared across multiple sections (SectionPagination)
- `layout/` - App structure (Header, Footer, NavigationOverlay)
- `ui/` - Primitive UI elements (Loader, animations)

#### Hooks (`src/hooks/`)
- `useSmoothScroll.ts` - Manages Lenis smooth scrolling and section navigation

#### Data (`src/data/`)
- `philosophies.tsx` - Philosophy content for Experience section
- `services.ts` - Service offerings data

### 3. Props Flow
- App.tsx manages global state
- State passed down to sections as props
- Refs used for scroll coordination
- Minimal prop drilling through clear interfaces

### 4. File Naming Conventions
- Components: PascalCase (e.g., `HeroSection.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useSmoothScroll.ts`)
- Data: camelCase (e.g., `philosophies.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)

## Key Features

### Smooth Scrolling
Managed by `useSmoothScroll` hook using Lenis library:
- Section-based navigation
- Keyboard support (arrows, page up/down, home/end)
- Touch gesture support
- Internal section scrolling (philosophy carousel, services stack)

### State Management
- Local state in App.tsx for global concerns
- Section-specific state in section components
- Refs for scroll coordination to avoid re-renders

### Styling
- Tailwind CSS for utility-first styling
- Custom CSS classes for complex animations
- Framer Motion for declarative animations

## Adding New Sections

1. Create section component in `src/sections/`
2. Add section ID to `sections` array in App.tsx
3. Import and render in App.tsx
4. Add any required data to `src/data/`
5. Extract complex logic to custom hooks if needed

## Best Practices

- Keep App.tsx minimal - only orchestration
- Extract reusable logic to hooks
- Separate data from components
- Use TypeScript interfaces for props
- Follow existing naming conventions
- Keep components focused and single-purpose
