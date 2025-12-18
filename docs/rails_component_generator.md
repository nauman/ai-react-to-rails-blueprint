# Rails Component Generator

Automates a Rails shadow layer from React/Next TypeScript components. Generates **ViewComponent** classes with ERB templates, BEM-structured CSS, Stimulus controllers, and ActiveRecord models.

Script: `scripts/generate_rails_components.js` (runs with Node).

## Architecture

The generator produces Rails artifacts following this architecture:

| Layer | Technology | Purpose |
|-------|------------|---------|
| Custom Components | ViewComponent + ERB | Business logic, app-specific UI |
| UI Primitives | RubyUI (Phlex) | Pre-built components (used within ViewComponents) |
| Styling | ITCSS + BEM + Tailwind | CSS architecture |
| Interactivity | Stimulus | Client-side behavior |

## Usage

```bash
# Generate all components
node scripts/generate_rails_components.js --all

# Generate a specific component
node scripts/generate_rails_components.js --component=FilterChip

# Generate only models from TypeScript interfaces
node scripts/generate_rails_components.js --models-only

# Preview output without writing files
node scripts/generate_rails_components.js --dry-run --component=FilterChip

# Append mapping to docs/react_to_rails.md
node scripts/generate_rails_components.js --component=FilterChip --update-docs
```

## Inputs & Outputs

**Inputs:**
- React components from `src/components/app/*.tsx`
- TypeScript interfaces from `src/types/index.ts`

**Outputs (ITCSS-structured):**

```
rails_generated/
  app/
    components/                    # ViewComponent (sidecar pattern)
      <snake_name>/
        <snake_name>_component.rb      # Ruby class
        <snake_name>_component.html.erb # ERB template
    assets/
      stylesheets/
        components/                # ITCSS components layer
          _<kebab-name>.css        # BEM-structured CSS
    javascript/
      controllers/                 # Stimulus controllers
        <kebab-name>_controller.js
    models/                        # ActiveRecord models
      <snake_name>.rb
```

## Templates

Custom templates can be placed in `scripts/templates/`:
- `view_component.rb.template` - ViewComponent class
- `view_component.html.erb.template` - ERB template
- `view_component.css.template` - BEM CSS
- `stimulus_controller.js.template` - Stimulus controller
- `model.rb.template` - ActiveRecord model

If missing, built-in fallbacks are used.

## Generated Code Features

### ViewComponent Ruby Class
- Inherits from `ApplicationComponent`
- `attr_reader` for all props
- `initialize` with named parameters
- BEM block helper method
- Comments suggesting RubyUI integration points

### ERB Template
- BEM-structured root element (`<div class="component-name">`)
- Stimulus controller data attribute
- Placeholder for React JSX conversion
- Comments for RubyUI component usage

### BEM CSS
- ITCSS layer comment: `/* ITCSS Layer: components */`
- Block named after component (kebab-case)
- Element and modifier placeholders
- Comments for Tailwind integration

### Stimulus Controller
- Values from React state
- Targets for child components
- Action methods from React handlers

## What the Analyzer Infers

**From React Components:**
- Component name, props, state
- Event handlers (click, change, submit, etc.)
- Custom hooks
- Child components
- Lucide-react icons
- Tailwind classes

**From TypeScript Interfaces:**
- Model associations (`belongs_to` via `*_id` fields, `has_many` for arrays)
- Validations (presence, email, URL format)

## RubyUI Integration Notes

Generated components include comments suggesting RubyUI usage:

```erb
<%# Use RubyUI components where available: %>
<%= render RubyUI::Card.new { ... } %>
<%= render RubyUI::Button.new(variant: :primary) { "Click" } %>
```

Review generated code and replace custom implementations with RubyUI where appropriate.

## BEM Naming Convention

The generator automatically creates BEM-structured CSS:

```css
.filter-chip { }           /* Block */
.filter-chip__label { }    /* Element */
.filter-chip--active { }   /* Modifier */
```

## Notes

- Paths are validated; missing inputs raise clear errors.
- Generated code is a starting point—review before shipping.
- No migrations are generated; add them manually or extend templates.
- Always render components through partials, not directly from controllers.
