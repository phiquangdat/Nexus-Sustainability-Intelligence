# Veridi OS Frontend - Sustainability Intelligence Platform

A modern, responsive React frontend for the Nexus Sustainability Intelligence Platform, built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Features

### ✨ Modern Design System
- **Glass morphism** design with backdrop blur effects
- **Dark/Light mode** support with system preference detection
- **Responsive design** optimized for all screen sizes
- **Smooth animations** and micro-interactions
- **Accessible** components with ARIA labels and keyboard navigation

### 🏗️ Architecture
- **Component-based** architecture with reusable UI components
- **Layout system** with Header, Sidebar, Navigation, and Footer
- **Theme management** with React Context and localStorage persistence
- **Performance optimized** with lazy loading and memoization
- **Type-safe** with comprehensive TypeScript interfaces

### 📱 Components

#### Layout Components
- `MainLayout` - Main application layout wrapper
- `Header` - Top navigation with theme toggle and notifications
- `Sidebar` - Collapsible navigation sidebar
- `Navbar` - Horizontal navigation bar
- `Footer` - Application footer with links and information

#### UI Components
- `Button` - Enhanced button with multiple variants and sizes
- `Card` - Flexible card component with glow effects
- `LoadingSpinner` - Accessible loading spinner with multiple variants
- `MetricCard` - Specialized card for displaying metrics
- `Badge` - Status and category badges

#### Chart Components
- `CO2IntensityChart` - CO₂ emissions intensity visualization
- `GenerationMixChart` - Energy generation mix charts
- `NetZeroAlignmentChart` - Net-zero alignment tracking
- `ScatterChart` - Correlation analysis charts

### 🎨 Design System

#### Color Palette
- **Primary**: Green tones for sustainability theme
- **Secondary**: Blue tones for technology and data
- **Accent**: Purple tones for highlights and CTAs
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success, warning, error colors

#### Typography
- **Font Family**: Inter (primary), JetBrains Mono (code)
- **Responsive sizing** with fluid typography
- **Gradient text** effects for headings

#### Spacing & Layout
- **Consistent spacing** using Tailwind's spacing scale
- **Grid system** for responsive layouts
- **Flexbox utilities** for component alignment

### 🔧 Technical Features

#### Performance Optimizations
- **Lazy loading** for route components
- **Memoization** for expensive calculations
- **Code splitting** for smaller bundle sizes
- **Performance monitoring** hooks

#### Accessibility
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management** for modals and dropdowns

#### State Management
- **Redux Toolkit** for global state
- **React Context** for theme management
- **Custom hooks** for data fetching and performance

### 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   ├── common/           # Shared components
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   └── ui/               # Base UI components
├── hooks/
│   ├── useApi/           # API-related hooks
│   ├── useAuth/          # Authentication hooks
│   └── useTheme/         # Theme management
├── pages/                # Route components
├── services/
│   └── api/              # API service functions
├── state/                # Redux store and slices
├── types/
│   ├── interfaces/       # TypeScript interfaces
│   └── api/              # API type definitions
├── utils/
│   ├── constants/        # Application constants
│   └── helpers/          # Utility functions
└── lib/                  # Third-party integrations
```

### 🛠️ Development

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Installation
```bash
npm install
```

#### Development Server
```bash
npm run dev
```

#### Build
```bash
npm run build
```

#### Linting
```bash
npm run lint
```

### 🎯 Usage Examples

#### Using the Theme System
```tsx
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
```

#### Using UI Components
```tsx
import { Button, Card } from './components/ui';

function Dashboard() {
  return (
    <Card padding="lg" glow="green">
      <h2>Dashboard</h2>
      <Button variant="primary" size="lg" icon="📊">
        View Analytics
      </Button>
    </Card>
  );
}
```

#### Performance Monitoring
```tsx
import { usePerformance } from './hooks/usePerformance';

function ExpensiveComponent() {
  const { startRender, endRender } = usePerformance('ExpensiveComponent');
  
  useEffect(() => {
    startRender();
    // Expensive operation
    endRender();
  }, []);
  
  return <div>Content</div>;
}
```

### 🔮 Future Enhancements

- [ ] **PWA support** with service workers
- [ ] **Real-time updates** with WebSocket integration
- [ ] **Advanced animations** with Framer Motion
- [ ] **Internationalization** (i18n) support
- [ ] **Component testing** with Jest and React Testing Library
- [ ] **Storybook** integration for component documentation

### 📄 License

This project is part of the Nexus Sustainability Intelligence Platform.

---

Built with ❤️ by The Nexus Team
