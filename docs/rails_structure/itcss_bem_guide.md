# ITCSS + BEM + Tailwind CSS Architecture

## Overview

This project uses a layered CSS architecture combining:
- **ITCSS** (Inverted Triangle CSS) for file organization
- **BEM** (Block Element Modifier) for component naming
- **Tailwind** as the utility layer

## Why This Combination?

| Methodology | Purpose | Benefit |
|-------------|---------|---------|
| ITCSS | File organization | Predictable specificity, easy maintenance |
| BEM | Naming convention | Clear component boundaries, no conflicts |
| Tailwind | Utility classes | Rapid prototyping, consistent spacing/colors |

## ITCSS Layer Structure

Organize stylesheets from generic to specific:

```
app/assets/stylesheets/
  application.css              # Main entry point
  settings/                    # Layer 1: Variables
    _variables.css             # CSS custom properties
    _breakpoints.css           # Responsive breakpoints
    _colors.css                # Color palette
  tools/                       # Layer 2: Mixins (if using preprocessor)
    _mixins.css
  generic/                     # Layer 3: Reset/Normalize
    _reset.css
    _box-sizing.css
  elements/                    # Layer 4: Base HTML elements
    _typography.css
    _links.css
    _forms.css
    _tables.css
  objects/                     # Layer 5: Layout patterns (no cosmetics)
    _container.css
    _grid.css
    _media.css
  components/                  # Layer 6: BEM components
    _user-card.css
    _filter-panel.css
    _navigation.css
  utilities/                   # Layer 7: Overrides, Tailwind
    _tailwind.css              # @import 'tailwindcss/utilities'
    _visibility.css
    _spacing.css
```

## application.css Import Order

```css
/* ITCSS: Ordered from generic to specific */

/* 1. Settings */
@import "settings/variables";
@import "settings/breakpoints";
@import "settings/colors";

/* 2. Tools */
@import "tools/mixins";

/* 3. Generic */
@import "generic/reset";
@import "generic/box-sizing";

/* 4. Elements */
@import "elements/typography";
@import "elements/links";
@import "elements/forms";

/* 5. Objects */
@import "objects/container";
@import "objects/grid";

/* 6. Components */
@import "components/user-card";
@import "components/filter-panel";

/* 7. Utilities (Tailwind last for override capability) */
@import "tailwindcss/utilities";
@import "utilities/visibility";
```

## BEM Naming Convention

### Block
The standalone component name in kebab-case:
```css
.user-card { }
.filter-panel { }
.navigation-menu { }
```

### Element
A part of the block, denoted by `__`:
```css
.user-card__avatar { }
.user-card__name { }
.user-card__bio { }
.filter-panel__input { }
.filter-panel__button { }
```

### Modifier
A variant or state, denoted by `--`:
```css
.user-card--featured { }
.user-card--compact { }
.user-card__name--highlighted { }
.filter-panel--collapsed { }
```

## BEM + Tailwind Integration

Use BEM for structural/semantic styles, Tailwind for utilities:

```erb
<div class="user-card user-card--featured p-4 rounded-lg shadow-md">
  <img class="user-card__avatar w-16 h-16 rounded-full" src="..." />
  <h3 class="user-card__name text-lg font-semibold"><%= user.name %></h3>
  <p class="user-card__bio text-gray-600 mt-2"><%= user.bio %></p>
</div>
```

**Guidelines:**
- BEM classes define component structure and identity
- Tailwind classes handle spacing, colors, responsive behavior
- Avoid duplicating Tailwind utilities in BEM (use one or the other)

## Component CSS Template

```css
/* Source: React component UserCard */
/* ITCSS Layer: components */
/* BEM Block: user-card */

.user-card {
  /* Block base styles */
  display: flex;
  flex-direction: column;
}

/* Elements */
.user-card__avatar {
  /* Avatar-specific styles not covered by Tailwind */
}

.user-card__name {
  /* Name element styles */
}

.user-card__bio {
  /* Bio element styles */
}

/* Modifiers */
.user-card--featured {
  border-left: 4px solid var(--color-primary);
}

.user-card--compact {
  flex-direction: row;
}

.user-card--compact .user-card__avatar {
  /* Nested modifier for element */
  width: 2rem;
  height: 2rem;
}
```

## Mapping React className to BEM

| React Pattern | BEM Equivalent |
|---------------|----------------|
| `className="UserCard"` | `.user-card` |
| `className="UserCard-avatar"` | `.user-card__avatar` |
| `className={cn("UserCard", featured && "featured")}` | `.user-card.user-card--featured` |
| `className="text-lg font-bold"` | Keep as Tailwind utilities |

## File Naming

- ITCSS partials use underscore prefix: `_user-card.css`
- File name matches BEM block: `_filter-panel.css`
- One component per file

## Settings Layer Example

```css
/* app/assets/stylesheets/settings/_variables.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-danger: #ef4444;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;

  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
}
```

## Objects Layer Example

```css
/* app/assets/stylesheets/objects/_container.css */
.o-container {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--spacing-md);
}

.o-container--narrow {
  max-width: 800px;
}

.o-container--wide {
  max-width: 1400px;
}
```

## Common Patterns

### State Classes
Use BEM modifiers for states:
```css
.user-card--loading { }
.user-card--error { }
.user-card--selected { }
```

### Responsive Modifiers
```css
@media (min-width: 768px) {
  .user-card--horizontal {
    flex-direction: row;
  }
}
```

### JavaScript Hook Classes
Prefix with `js-` for JavaScript-only classes:
```html
<div class="user-card js-user-card" data-controller="user-card">
```

## Best Practices

1. **One block per file** - Easy to find and maintain
2. **Flat selectors** - Avoid nesting beyond `.block__element`
3. **Modifier on block** - `.block--modifier`, not `.block .modifier`
4. **No ID selectors** - Use classes only
5. **Tailwind for utilities** - Don't recreate spacing/color utilities in BEM
6. **Document source** - Comment which React component the CSS mirrors
