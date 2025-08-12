# SCSS Design System Documentation

## 📁 Structure Overview

```
src/styles/
├── main.scss              # Main entry point - imports all styles
├── _variables.scss         # Complete design system variables
├── _mixins.scss           # Comprehensive mixin library
├── README.md              # This documentation
├── base/
│   ├── _global.scss       # Global styles, resets, utility classes
│   ├── _typography.scss   # Typography styles and text elements
│   └── _forms.scss        # Form element styles
├── components/
│   ├── _layout.scss       # Main layout wrapper
│   ├── _sidebar.scss      # Navigation sidebar
│   ├── _topbar.scss       # Top navigation bar
│   ├── _buttons.scss      # Button variants
│   ├── _badges.scss       # Status badges
│   └── _cards.scss        # Card components
└── pages/
    ├── _dashboard.scss    # Dashboard page styles
    ├── _customers.scss    # Customer management page
    ├── _leads.scss        # Lead management page
    └── _settings.scss     # Settings page styles
```

## 🎨 Design System Variables

### Color Palette

#### Primary Colors (Blue)
- `$primary-50` to `$primary-950` - Complete blue spectrum
- Primary brand color for buttons, links, and active states

#### Semantic Colors
- **Success**: `$color-success` (Green) - For positive actions and states
- **Warning**: `$color-warning` (Yellow) - For caution and attention
- **Error**: `$color-error` (Red) - For errors and destructive actions  
- **Info**: `$color-info` (Blue) - For informational content

#### Gray Scale
- `$gray-50` to `$gray-950` - Complete neutral color spectrum
- Used for text, borders, backgrounds, and subtle UI elements

### Typography

#### Font Families
- `$font-family-base` - Inter font stack for UI text
- `$font-family-mono` - Monospace font stack for code

#### Font Sizes
- `$font-size-xs` (12px) to `$font-size-5xl` (48px)
- Semantic sizing scale for consistent typography

#### Font Weights
- `$font-weight-thin` (100) to `$font-weight-black` (900)
- Complete weight spectrum for typography hierarchy

### Spacing System

#### Base Spacing
- `$spacing-0` to `$spacing-32` - Consistent spacing scale
- Based on 0.25rem (4px) increments for pixel-perfect alignment

#### Component Spacing
- `$component-padding-sm/md/lg` - Standardized component padding
- `$button-padding-x/y` - Button-specific spacing
- `$card-padding` - Card content padding

### Responsive Breakpoints

- `$breakpoint-xs` (0px) - Extra small devices
- `$breakpoint-sm` (640px) - Small devices (mobile)
- `$breakpoint-md` (768px) - Medium devices (tablet)
- `$breakpoint-lg` (1024px) - Large devices (desktop)
- `$breakpoint-xl` (1280px) - Extra large devices
- `$breakpoint-2xl` (1536px) - 2X large devices

## 🔧 Mixin Library

### Responsive Mixins

```scss
@include media-sm { /* Styles for sm and up */ }
@include media-md { /* Styles for md and up */ }
@include media-lg { /* Styles for lg and up */ }

@include media-max-md { /* Styles for below md */ }
@include media-between($breakpoint-sm, $breakpoint-lg) { /* Between breakpoints */ }
```

### Layout Mixins

```scss
@include flex-center;        // Center content with flexbox
@include flex-between;       // Space between with flexbox
@include flex-column;        // Vertical flex layout
@include container;          // Responsive container
```

### Typography Mixins

```scss
@include heading-1;          // Large page heading
@include heading-2;          // Section heading
@include body-text;          // Standard body text
@include text-truncate;      // Single line with ellipsis
@include text-clamp(3);      // Multi-line clamp
```

### Button Mixins

```scss
@include button-primary;     // Primary action button
@include button-secondary;   // Secondary button
@include button-ghost;       // Transparent button
@include button-danger;      // Destructive action
@include button-size-sm;     // Small button size
@include button-size-lg;     // Large button size
```

### Form Mixins

```scss
@include form-input;         // Standard input styling
@include form-label;         // Form label styling
@include form-error;         // Error message styling
```

### Card Mixins

```scss
@include card;               // Basic card container
@include card-hover;         // Card with hover effect
@include card-header;        // Card header section
@include card-body;          // Card content area
```

### Badge Mixins

```scss
@include badge-success;      // Success status badge
@include badge-warning;      // Warning status badge
@include badge-danger;       // Error status badge
@include badge-info;         // Info status badge
```

### Utility Mixins

```scss
@include visually-hidden;    // Hide from visual but keep for screen readers
@include focus-ring;         // Accessible focus styling
@include hover-lift;         // Subtle hover elevation
@include aspect-ratio(16, 9); // Maintain aspect ratio
```

## 🎯 Usage Guidelines

### 1. Import Order
Always import in this order in `main.scss`:
1. Variables
2. Mixins  
3. Base styles
4. Components
5. Pages

### 2. Naming Conventions

#### BEM Methodology
Use Block Element Modifier (BEM) for CSS classes:
```scss
.component {}                    // Block
.component__element {}           // Element
.component__element--modifier {} // Modifier
```

#### Variable Naming
- **Colors**: `$color-purpose-shade` (e.g., `$primary-600`)
- **Spacing**: `$spacing-size` (e.g., `$spacing-4`)
- **Components**: `$component-property` (e.g., `$button-padding-x`)

### 3. Responsive Design

Use mobile-first approach with min-width media queries:
```scss
.component {
  // Mobile styles (default)
  padding: $spacing-4;
  
  @include media-md {
    // Tablet and up
    padding: $spacing-6;
  }
  
  @include media-lg {
    // Desktop and up
    padding: $spacing-8;
  }
}
```

### 4. Component Organization

Each component should:
- Live in its own SCSS file
- Use BEM naming convention
- Leverage design system variables
- Include responsive variations
- Have hover/focus states

### 5. Color Usage

#### Semantic Colors
```scss
// Use semantic aliases for meaning
.success-message {
  color: $color-success;
  background-color: $color-success-light;
}

.error-message {
  color: $color-error;
  background-color: $color-error-light;
}
```

#### Text Colors
```scss
// Primary text
color: $gray-900;

// Secondary text  
color: $gray-600;

// Muted text
color: $gray-500;

// Disabled text
color: $gray-400;
```

## 🚀 Extending the System

### Adding New Components

1. Create new file in `components/` directory
2. Use existing variables and mixins
3. Follow BEM naming convention
4. Add import to `main.scss`

### Adding New Variables

1. Add to appropriate section in `_variables.scss`
2. Follow existing naming convention
3. Use existing values as reference points
4. Document purpose with comments

### Adding New Mixins

1. Add to appropriate section in `_mixins.scss`
2. Make mixins flexible with parameters
3. Include responsive variations if needed
4. Document usage with examples

## 🎨 Color Palette Reference

### Primary (Blue)
- 50: #eff6ff (lightest)
- 500: #3b82f6 (base)  
- 900: #1e3a8a (darkest)

### Success (Green)
- 100: #dcfce7 (light bg)
- 600: #16a34a (base)
- 800: #166534 (dark text)

### Warning (Yellow)
- 100: #fef3c7 (light bg)
- 500: #f59e0b (base)
- 800: #92400e (dark text)

### Error (Red)
- 100: #fee2e2 (light bg)
- 600: #dc2626 (base)
- 800: #991b1b (dark text)

This design system provides a solid foundation for building consistent, maintainable, and scalable UI components. 