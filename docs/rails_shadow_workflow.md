# Rails Shadow Workflow (Tool-Agnostic)

Use this checklist to keep a Rails-ready shadow app in sync while building the React/Next MVP. Assumes RubyUI/Phlex for views, Minitest for tests, Pagy for pagination, acts-as-taggable-on for tagging, and rails_icons for iconography.

## 1) Schema-First
- Treat `schema.json` as the source of truth for routes, resources, and content structures.
- After editing `schema.json`, generate or update Rails migrations, Pagy defaults, and tag tables from it.
- Keep `docs/schema.json` in sync with any working copy under `src/db/schema.json` (if present).

## 2) Dual-Track Scaffolding
- For every new React/Next view or page, add in Rails:
  - Route and controller action.
  - Phlex component stub (with RubyUI components where available) and any rails_icons identifiers used in the React view.
  - Optional Stimulus/Turbo notes for behaviors you expect server-side.
  - Minitest files covering the controller action and the Phlex render path.

## 3) Component Mapping Log
- Append an entry to `docs/react_to_rails.md` for each React component:
  - React component name and props/state.
  - Data dependencies (API calls, cache expectations, params).
  - Phlex equivalent signature and slots/partials.
  - Turbo/Stimulus interaction sketch.
  - Pagy usage (if paginated lists) and tagging filters (acts-as-taggable-on).
  - rails_icons references required for visual parity.

## 4) Generators (suggested)
- Create lightweight scripts or templates that, given a route and component name, will:
  - Add to `config/routes.rb`.
  - Create a controller action with Pagy support when listing collections.
  - Create a Phlex component stub that mounts RubyUI parts and uses rails_icons where needed.
  - Add acts-as-taggable-on scopes to models when tags are present in `schema.json`.
  - Emit Minitest skeletons for controller and view.
- Run the generator whenever you add a React view to keep parity automatic.

## 5) Testing Defaults
- Require Minitest coverage for:
  - Controller success and error paths.
  - Pagy pagination boundaries (page 1, last page).
  - Tag filtering (with and without tag params).
  - Rendering of expected rails_icons in the Phlex view.

## 6) Tagging and Pagination Conventions
- Use acts-as-taggable-on on listable models; record expected tag contexts in `schema.json`.
- Default to Pagy for collections; document page size choices in `schema.json` and mirror them in controllers and tests.

## 7) Diagrams and Docs
- Maintain sequence/architecture diagrams under `docs/diagrams/` to show data flow, pagination, and tag filtering.
- Keep `docs/rails_structure/` files updated with the Rails-side intent for each feature.
