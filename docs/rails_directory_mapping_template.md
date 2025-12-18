# Rails Directory Mapping Documentation Template

**Purpose:** This document serves as a practical guide for lovable.dev to structure React MVP applications in a manner that aligns closely with Ruby on Rails conventions, simplifying later conversions to Rails. Each section includes clear Rails directory mappings, examples, and best practices.

**Architecture:**
- **ViewComponent + ERB** for custom application components
- **RubyUI (Phlex)** for pre-built UI primitives
- **ITCSS + BEM + Tailwind** for CSS architecture
- **Hotwire (Turbo + Stimulus)** for interactivity

**Template Location:**\
Create and maintain this template at:\
`docs/rails_directory_mapping_template.md`

**Generated Documentation:**\
Based on this template, continually create and update detailed practical documentation in the directory:

`docs/rails_structure/`

---

## 1. Directory Overview

Provide the high-level structure of a typical Rails application:

```bash
my_rails_app/
├── app/
│   ├── assets/
│   │   ├── images/
│   │   └── stylesheets/             # ITCSS structure
│   │       ├── application.css      # Main entry point
│   │       ├── settings/            # Variables, breakpoints
│   │       │   ├── _variables.css
│   │       │   └── _breakpoints.css
│   │       ├── tools/               # Mixins (if preprocessor)
│   │       │   └── _mixins.css
│   │       ├── generic/             # Reset, normalize
│   │       │   └── _reset.css
│   │       ├── elements/            # Base HTML elements
│   │       │   ├── _typography.css
│   │       │   └── _forms.css
│   │       ├── objects/             # Layout patterns
│   │       │   ├── _container.css
│   │       │   └── _grid.css
│   │       ├── components/          # BEM components
│   │       │   ├── _user-card.css
│   │       │   └── _filter-panel.css
│   │       └── utilities/           # Tailwind + helpers
│   │           └── _tailwind.css
│   ├── channels/
│   ├── components/                  # ViewComponent (sidecar pattern)
│   │   ├── application_component.rb
│   │   ├── user_card/
│   │   │   ├── user_card_component.rb
│   │   │   └── user_card_component.html.erb
│   │   └── filter_panel/
│   │       ├── filter_panel_component.rb
│   │       └── filter_panel_component.html.erb
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── concerns/
│   │   └── users_controller.rb
│   ├── helpers/
│   │   └── application_helper.rb
│   ├── javascript/
│   │   ├── controllers/             # Stimulus controllers
│   │   │   ├── application.js
│   │   │   ├── user_card_controller.js
│   │   │   └── filter_panel_controller.js
│   │   └── application.js
│   ├── jobs/
│   ├── mailers/
│   ├── models/
│   │   ├── application_record.rb
│   │   └── user.rb
│   └── views/
│       ├── layouts/
│       │   └── application.html.erb
│       └── users/
│           ├── index.html.erb
│           └── show.html.erb
├── config/
│   ├── initializers/
│   │   ├── view_component.rb
│   │   └── ruby_ui.rb
│   ├── routes.rb
│   └── importmap.rb
├── db/
├── lib/
├── log/
├── public/
├── storage/
├── test/
│   └── components/                  # ViewComponent tests
│       ├── user_card_component_test.rb
│       └── filter_panel_component_test.rb
├── tmp/
├── vendor/
│   └── javascript/
├── .gitignore
├── Gemfile
└── Gemfile.lock
```

---

## 2. Detailed Directory Mapping and Examples

Each section below corresponds to detailed documents you should create and maintain in `docs/rails_structure/`:

### 2.1. Models

(`docs/rails_structure/models.md`)

### 2.2. Views (ViewComponent + RubyUI)

(`docs/rails_structure/views.md`)

Key patterns:
- Use ViewComponent with sidecar ERB templates for custom components
- Use RubyUI for pre-built UI primitives (buttons, cards, modals)
- Render components through views, not directly from controllers

### 2.3. Controllers

(`docs/rails_structure/controllers.md`)

### 2.4. Interactions (Stimulus)

(`docs/rails_structure/stimulus.md`)

### 2.5. API Interactions

(`docs/rails_structure/api_interactions.md`)

### 2.6. Database Schema

Create proper database migrations files and try to replicate rails styles schema.rb of whole supabase database or schema.json

(`docs/rails_structure/database_schema.md`)

### 2.7. Routing

(`docs/rails_structure/routing.md`)

### 2.8. ViewComponent/Hotwire Considerations

(`docs/rails_structure/rails_viewcomponent_hotwire_considerations.md`)

### 2.9. ITCSS + BEM CSS Guide

(`docs/rails_structure/itcss_bem_guide.md`)

### 2.10. ViewComponent + RubyUI Integration

(`docs/rails_structure/viewcomponent_rubyui_guide.md`)

---

## Implementation Instructions for lovable.dev:

When creating React MVP apps, follow these guidelines:

- Maintain visual clarity with structured markdown formatting and clear code blocks.
- Provide detailed code examples for Rails, ViewComponent, RubyUI, and Hotwire implementations.
- Include visual diagrams illustrating data flow clearly.
- Offer detailed examples for Stimulus controllers and interactions.
- Whenever creating React components, include Ruby on Rails equivalent code samples for models, controllers, helpers, and ViewComponents.
- Document BEM class names for each component (`.block`, `.block__element`, `.block--modifier`).
- Follow ITCSS layer structure for CSS organization.

**Outcome:**

Using this template, lovable.dev will:

- Create React MVP applications closely aligned with Rails conventions.
- Facilitate seamless future conversions from React MVP to Rails.
- Have clear, practical documentation to reference Rails conventions and best practices.
- Maintain consistent CSS architecture with ITCSS + BEM.
- Clear and concise rails migrations or schema.rb
