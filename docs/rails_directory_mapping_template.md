# Rails Directory Mapping Documentation Template

**Purpose:** This document serves as a practical guide for lovable.dev to structure React MVP applications in a manner that aligns closely with Ruby on Rails conventions, simplifying later conversions to Rails. Each section includes clear Rails directory mappings, examples, and best practices.

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
│   ├── channels/
│   ├── components/
│   │   ├── application_component.rb
│   │   └── ui/
│   │       └── button.rb
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── concerns/
│   │   └── pages_controller.rb
│   ├── helpers/
│   │   └── application_helper.rb
│   ├── javascript/
│   │   ├── controllers/
│   │   │   └── hello_controller.js
│   │   └── application.js
│   ├── jobs/
│   ├── mailers/
│   ├── models/
│   │   ├── application_record.rb
│   │   ├── post.rb
│   │   └── user.rb
│   └── views/
│       ├── layouts/
│       │   └── application_view.rb
│       └── pages/
│           ├── home_view.rb
│           └── about_view.rb
├── config/
│   ├── initializers/
│   │   ├── devise.rb
│   │   ├── phlex.rb
│   │   └── rails_admin.rb
│   ├── routes.rb
│   └── importmap.rb
├── db/
├── lib/
├── log/
├── public/
├── storage/
├── test/ OR spec/
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

### 2.2. Views (Phlex)

(`docs/rails_structure/views.md`)

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

### 2.8. Rails/Phlex/Hotwire Considerations

(`docs/rails_structure/rails_phlex_hotwire_considerations.md`)

---

## Implementation Instructions for lovable.dev:

When creating React MVP apps, follow these guidelines:

- Maintain visual clarity with structured markdown formatting and clear code blocks.
- Provide detailed code examples for Rails, Phlex, and Hotwire implementations.
- Include visual diagrams illustrating data flow clearly.
- Offer detailed examples for Stimulus controllers and interactions.
- Whenever creating React components, include Ruby on Rails equivalent code samples for models, controllers, helpers, and views.

**Outcome:**

Using this template, lovable.dev will:

- Create React MVP applications closely aligned with Rails conventions.
- Facilitate seamless future conversions from React MVP to Rails.
- Have clear, practical documentation to reference Rails conventions and best practices.
- Clear and concise rails migrations or schema.rb
