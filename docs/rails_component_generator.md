# Rails Component Generator

Automates a Rails shadow layer from React/Next TypeScript components. Generates Phlex (RubyUI) components, Stimulus controllers, and ActiveRecord models, with optional doc updates.

Script: `scripts/generate_rails_components.js` (runs with Node).

## Usage
- All components: `node scripts/generate_rails_components.js --all`
- One component: `node scripts/generate_rails_components.js --component=FilterChip`
- Models only (from `src/types/index.ts`): `node scripts/generate_rails_components.js --models-only`
- Preview only: `node scripts/generate_rails_components.js --dry-run --component=FilterChip`
- Append mapping doc: add `--update-docs` to also append to `docs/react_to_rails.md`

## Inputs & Outputs
- Reads components from `src/components/app/*.tsx`
- Reads TS interfaces from `src/types/index.ts`
- Outputs to `rails_generated/`:
  - `views/app/<component>.rb` (Phlex)
  - `javascript/controllers/<component>_controller.js` (Stimulus)
  - `models/<model>.rb` (ActiveRecord) when using `--models-only`
- Appends mapping entries to `docs/react_to_rails.md` when `--update-docs` is set.

## Templates
- Looks for templates under `scripts/templates/`:
  - `phlex_component.rb.template`
  - `stimulus_controller.js.template`
  - `model.rb.template`
- If missing, built-in fallbacks are used.

## What the analyzer infers
- Component name, props, state, handlers, custom hooks, child components, lucide-react icons, Tailwind classes.
- Model associations (simple `belongs_to` via *_id fields; `has_many` for array fields), validations (presence, email, URL).

## Notes
- Paths are validated; missing inputs raise clear errors.
- Generated code is a starting point—review before shipping.
- No migrations are generated; add them manually or extend templates.
