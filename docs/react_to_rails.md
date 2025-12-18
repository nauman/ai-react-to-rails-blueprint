# React to Rails Mapping Log (ViewComponent + RubyUI)

Use this log to keep React/Next components aligned with their Rails/ViewComponent counterparts. Add an entry per component/page.

## Entry Template

```markdown
## ComponentName

- **React component:** `<Name>` — route/path: `<path>`
- **Purpose:** `<what it does>`
- **Props/state:** `<list>`, defaults, derived values
- **Data dependencies:** `<APIs/queries/cache keys/params>`
- **ViewComponent:**
  - Class: `<ComponentName>Component`
  - Location: `app/components/<snake_name>/<snake_name>_component.rb`
  - Template: `app/components/<snake_name>/<snake_name>_component.html.erb`
- **RubyUI components used:** `<list of RubyUI::* components to embed>`
- **BEM block:** `<kebab-case-block-name>`
- **BEM CSS:** `app/assets/stylesheets/components/_<kebab-name>.css`
- **Stimulus controller:** `<controller-name>_controller.js`
- **Turbo/Streams:** `<behaviors to port>`
- **Pagination:** `<Pagy usage and page size>`
- **Tagging:** `<acts-as-taggable-on contexts and filters>`
- **Icons:** `<rails_icons identifiers required>`
- **Tests:** controller + ViewComponent Minitest coverage
```

---

## Entries

<!-- Add component entries below -->
