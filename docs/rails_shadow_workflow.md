# Rails Shadow Workflow (Tool-Agnostic)

Use this checklist to keep a Rails-ready shadow app in sync while building the React/Next MVP.

**Architecture:** ViewComponent + ERB for custom components, RubyUI (Phlex) for UI primitives, ITCSS + BEM + Tailwind for styling, Minitest for tests, Pagy for pagination, acts-as-taggable-on for tagging, and rails_icons for iconography.

## 1) Schema-First
- Treat `schema.json` as the source of truth for routes, resources, and content structures.
- After editing `schema.json`, generate or update Rails migrations, Pagy defaults, and tag tables from it.
- Keep `docs/schema.json` in sync with any working copy under `src/db/schema.json` (if present).

## 2) Dual-Track Scaffolding
For every new React/Next view or page, add in Rails:
- Route and controller action.
- **ViewComponent stub** (sidecar pattern: `.rb` + `.html.erb`):
  - Use RubyUI components for UI primitives (buttons, cards, modals).
  - Use BEM naming for custom elements.
  - Include rails_icons identifiers used in the React view.
- **BEM CSS file** in `app/assets/stylesheets/components/`.
- Optional Stimulus/Turbo notes for behaviors you expect server-side.
- Minitest files covering the controller action and ViewComponent render.

## 3) Component Mapping Log
Append an entry to `docs/react_to_rails.md` for each React component:
- React component name and props/state.
- Data dependencies (API calls, cache expectations, params).
- **ViewComponent:** class name, file paths (sidecar), slots/variants.
- **RubyUI components used:** list of `RubyUI::*` components to embed.
- **BEM block name:** kebab-case block identifier.
- Turbo/Stimulus interaction sketch.
- Pagy usage (if paginated lists) and tagging filters (acts-as-taggable-on).
- rails_icons references required for visual parity.

## 4) Generators
Run the generator whenever you add a React view to keep parity automatic:

```bash
# Generate ViewComponent + CSS + Stimulus for a component
node scripts/generate_rails_components.js --component=FilterChip --update-docs

# Generate all components
node scripts/generate_rails_components.js --all
```

The generator creates:
- ViewComponent class (`app/components/<name>/<name>_component.rb`)
- ERB template (`app/components/<name>/<name>_component.html.erb`)
- BEM CSS (`app/assets/stylesheets/components/_<name>.css`)
- Stimulus controller (`app/javascript/controllers/<name>_controller.js`)

See `docs/rails_component_generator.md` for details.

## 5) Testing Defaults
Require Minitest coverage for:
- Controller success and error paths.
- Pagy pagination boundaries (page 1, last page).
- Tag filtering (with and without tag params).
- ViewComponent rendering (assert correct BEM classes, content).
- RubyUI component integration (buttons, cards render correctly).

## 6) Tagging and Pagination Conventions
- Use acts-as-taggable-on on listable models; record expected tag contexts in `schema.json`.
- Default to Pagy for collections; document page size choices in `schema.json` and mirror them in controllers and tests.

## 7) CSS Architecture (ITCSS + BEM)
- Organize stylesheets following ITCSS layers (settings → utilities).
- Name component CSS files with underscore prefix: `_user-card.css`.
- Use BEM naming: `.block`, `.block__element`, `.block--modifier`.
- Use Tailwind for utilities (spacing, colors, responsive).
- See `docs/rails_structure/itcss_bem_guide.md` for details.

## 8) Rendering Pattern
**Important:** Always render components through views/partials, not directly from controllers.

```ruby
# Correct: Controller renders view, view renders component
class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    # render :show (implicit)
  end
end

# app/views/users/show.html.erb
<%= render UserCardComponent.new(user: @user) %>
```

## 9) Diagrams and Docs
- Maintain sequence/architecture diagrams under `docs/diagrams/` to show data flow, pagination, and tag filtering.
- Keep `docs/rails_structure/` files updated with the Rails-side intent for each feature.
