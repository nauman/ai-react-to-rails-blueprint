# Context and Instructions for Lovable.dev

---

## Purpose

This document outlines clear instructions and guidelines for managing documentation templates and automation workflows. It ensures effective prototyping of React MVP applications using Lovable.dev, explicitly designed for seamless future transitions to Ruby on Rails.

---

## Directory Structure

Please consistently maintain the following clear and organized documentation structure:

```bash
docs/
├── diagrams/                            # Visual diagrams (prefer Mermaid, fallback PNG/SVG)
│   ├── architecture/                    # High-level architecture diagrams
│   ├── sequences/                       # Interaction flow diagrams
│   └── database/                        # ERD and domain models
├── images/                              # Markdown image assets
│   └── urls.md                          # External image URL registry
├── icons/                               # Inline or reusable SVG icon files
├── context.md                           # This document
├── react_to_rails_prompt.md             # Template: React to Rails mapping
├── rails_directory_mapping_template.md  # Template: Rails directory mapping
├── requirements.md                      # Initial product ideation and requirements
├── schema.json                          # Central schema: routes, content, and data structure
└── rails_structure/
    ├── models.md
    ├── views.md
    ├── controllers.md
    ├── stimulus.md
    ├── api_interactions.md
    ├── database_schema.md
    ├── routing.md
    └── rails_phlex_hotwire_considerations.md
```

---

## Automation Instructions

Whenever content is created or modified, follow these steps:

### 1. Centralized Data Management

- Update `schema.json` located at `src/db/schema.json` with all new content, routes, structures, and associated data.
- Clearly define and document routes, content structures, and related data within `schema.json`.

### 2. Schema Copying

- Always copy the updated `schema.json` from `src/db/schema.json` to:
  ```
  docs/schema.json
  ```
- Maintain a centralized, consistently updated, and version-controlled schema.

> **Note:** Until backend integration (e.g., Supabase) is established, exclusively manage all content, data, and structural information within `schema.json`.

---

## Documentation Instructions

When generating code or documentation, adhere to these guidelines:

- Store actual React MVP code directly in the project's root directory.
- Place conceptual Rails documentation within `docs/rails_structure/`, ensuring it aligns with Rails conventions.
- Clearly document potential Rails/Phlex equivalents for every React component in `docs/rails_structure/views.md`.
- Employ naming conventions in React that intuitively suggest their future Rails counterparts.
- When implementing interactions in React, conceptualize corresponding Stimulus controllers, documenting their logic in `docs/rails_structure/stimulus.md`.
- Map React data handling conceptually to Rails models and controllers, documenting in:
  - `docs/rails_structure/models.md`
  - `docs/rails_structure/controllers.md`

---

## Detailed Documentation Guidelines

For each documentation task:

- Maintain clarity and readability through structured markdown formatting and well-defined code blocks.
- Include conceptual Rails, Phlex, and Hotwire code examples.
- Provide clear visual diagrams illustrating data flows and component interactions.
- Offer detailed conceptual examples and implementations for Stimulus controllers.
- Include Ruby on Rails conceptual code samples for model definitions, controllers, and helpers.

---

## Template Management

- **Do not overwrite** the following templates unless explicitly directed:
  - `docs/react_to_rails_prompt.md`
  - `docs/rails_directory_mapping_template.md`

---

## Expected Outcome

Following these guidelines will enable lovable.dev to:

- Maintain structured, clear, and comprehensive documentation.
- Facilitate smooth transitions from React MVP prototypes to fully developed Rails applications.
- Support effective development practices and collaborative workflows with detailed, practical documentation.

