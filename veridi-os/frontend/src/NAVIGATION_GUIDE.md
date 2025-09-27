# Veridi OS Navigation Guide

## 🧭 Navigation System Overview

The Veridi OS application features a comprehensive navigation system designed for sustainability professionals to easily access regulatory information, reports, and analytics.

## 📋 Navigation Components

### 1. **Main Navigation Bar**
- **Location**: Top of the page, below header
- **Features**: 
  - Responsive design (desktop/mobile)
  - Dropdown menus for sub-navigation
  - Active state indicators
  - Smooth transitions

### 2. **Breadcrumb Navigation**
- **Location**: Below main navbar
- **Features**:
  - Shows current page hierarchy
  - Clickable navigation links
  - Auto-generated from URL path

### 3. **Header with Notifications**
- **Location**: Top of the page
- **Features**:
  - Brand logo and title
  - Notification center with alerts
  - Unread notification counter

## 🗂️ Navigation Structure

### **Main Sections**

#### 1. **Dashboard** (`/`)
- **Icon**: 📊
- **Description**: Main dashboard with power plant data
- **Features**: Charts, data visualization, summary cards

#### 2. **Regulations** (`/regulations`)
- **Icon**: 📋
- **Description**: Environmental regulations and compliance
- **Sub-sections**:
  - **EU ETS** (`/regulations/eu-ets`) - European Union Emissions Trading System
  - **Carbon Tax** (`/regulations/carbon-tax`) - Carbon tax regulations
  - **Renewable Targets** (`/regulations/renewable-targets`) - Renewable energy targets
  - **Emissions Standards** (`/regulations/emissions-standards`) - Industrial emissions standards

#### 3. **Reports** (`/reports`)
- **Icon**: 📄
- **Description**: Sustainability and compliance reports
- **Sub-sections**:
  - **Compliance Reports** (`/reports/compliance`) - Regulatory compliance reports
  - **Sustainability Reports** (`/reports/sustainability`) - Environmental sustainability reports
  - **Carbon Footprint** (`/reports/carbon-footprint`) - Carbon footprint analysis
  - **Energy Efficiency** (`/reports/energy-efficiency`) - Energy efficiency reports

#### 4. **Analytics** (`/analytics`)
- **Icon**: 📈
- **Description**: Advanced analytics and insights
- **Sub-sections**:
  - **Emission Trends** (`/analytics/trends`) - Historical emission analysis
  - **Forecasting** (`/analytics/forecasting`) - Future emission predictions
  - **Benchmarking** (`/analytics/benchmarking`) - Performance comparison
  - **Alerts & Notifications** (`/analytics/alerts`) - System alerts and notifications

#### 5. **Settings** (`/settings`)
- **Icon**: ⚙️
- **Description**: Application configuration and preferences

## 🔔 Notification System

### **Notification Types**
- **⚠️ Warning**: Urgent compliance deadlines
- **ℹ️ Info**: General information updates
- **✅ Success**: Confirmation of completed actions
- **❌ Error**: System errors or data issues

### **Notification Features**
- Real-time updates
- Unread count indicator
- Mark as read functionality
- Action buttons for quick responses
- Timestamp display

## 📱 Responsive Design

### **Desktop Navigation**
- Horizontal navigation bar
- Hover effects for dropdowns
- Keyboard navigation support
- Active state indicators

### **Mobile Navigation**
- Hamburger menu toggle
- Collapsible navigation
- Touch-friendly interactions
- Swipe gestures support

## 🎨 Visual Design

### **Color Scheme**
- **Primary**: Green (#10b981) - Sustainability theme
- **Secondary**: Blue (#3b82f6) - Information
- **Warning**: Yellow (#f59e0b) - Alerts
- **Error**: Red (#ef4444) - Critical issues
- **Success**: Green (#10b981) - Positive actions

### **Typography**
- **Headers**: Bold, large text for section titles
- **Navigation**: Medium weight for menu items
- **Body**: Regular weight for descriptions
- **Labels**: Small, muted text for metadata

## 🚀 Performance Features

### **Lazy Loading**
- Components load only when needed
- Reduced initial bundle size
- Faster page load times
- Progressive enhancement

### **Caching**
- Route-based code splitting
- Component-level caching
- Optimized re-renders
- Memory management

## 🔧 Technical Implementation

### **Routing**
```typescript
// React Router setup
<Router>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/regulations" element={<RegulationsPage />} />
    <Route path="/regulations/eu-ets" element={<EUETSPage />} />
    // ... more routes
  </Routes>
</Router>
```

### **Navigation State**
```typescript
// Active route detection
const isActive = (href: string) => {
  return location.pathname === href;
};
```

### **Dropdown Management**
```typescript
// Dropdown state management
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
```

## 📊 Analytics Integration

### **Navigation Tracking**
- Page view analytics
- User journey mapping
- Popular sections tracking
- Performance metrics

### **User Behavior**
- Click-through rates
- Time spent on sections
- Navigation patterns
- Feature adoption

## 🛠️ Development Tools

### **Mock Data Toggle**
- Development-only component
- Switch between API and mock data
- API connectivity testing
- Real-time data simulation

### **Error Boundaries**
- Isolated error handling
- Graceful degradation
- User-friendly error messages
- Recovery mechanisms

## 📈 Future Enhancements

### **Planned Features**
1. **Search Navigation**: Global search across all sections
2. **Favorites**: Bookmark frequently used pages
3. **Recent Pages**: Quick access to recently visited
4. **Custom Navigation**: User-customizable menu
5. **Keyboard Shortcuts**: Power user navigation

### **Accessibility Improvements**
1. **Screen Reader Support**: ARIA labels and descriptions
2. **Keyboard Navigation**: Full keyboard accessibility
3. **High Contrast Mode**: Better visibility options
4. **Font Size Controls**: Adjustable text sizing

## 🎯 Best Practices

### **Navigation Design**
- Keep navigation consistent across pages
- Use clear, descriptive labels
- Provide visual feedback for interactions
- Maintain logical information hierarchy

### **User Experience**
- Minimize clicks to reach content
- Provide clear navigation paths
- Use familiar navigation patterns
- Support both mouse and touch interactions

### **Performance**
- Lazy load non-critical components
- Optimize navigation assets
- Use efficient state management
- Minimize re-renders

## 📚 Resources

- [React Router Documentation](https://reactrouter.com/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Navigation Best Practices](https://www.nngroup.com/articles/navigation/)
- [Mobile Navigation Patterns](https://www.smashingmagazine.com/2017/01/navigation-mobile-web/)
