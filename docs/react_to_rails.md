# React to Rails Mapping Log (Phlex/RubyUI)

Use this log to keep React/Next components aligned with their Rails/Phlex counterparts. Add an entry per component/page.

## Entry Template
- React component: `<Name>` — route/path: `<path>`
- Purpose: `<what it does>`
- Props/state: `<list>`, defaults, derived values
- Data dependencies: `<APIs/queries/cache keys/params>`
- Phlex equivalent: `<ClassName>` signature and slots/partials
- Turbo/Stimulus: `<behaviors to port>`
- Pagination: `<Pagy usage and page size>`
- Tagging: `<acts-as-taggable-on contexts and filters>`
- Icons: `<rails_icons identifiers required>`
- Tests: controller + view Minitest coverage expectations
