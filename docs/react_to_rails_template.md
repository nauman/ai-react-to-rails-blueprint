# React SPA to Rails/ViewComponent/Hotwire Component Mapping Template

**Purpose:** This document provides a structured approach for lovable.dev to translate and map React single-page applications (SPAs) effectively into a Ruby on Rails application using ViewComponent (with RubyUI for UI primitives) and Hotwire for dynamic, interactive user experiences. The goal is to clearly document component structures, data flows, and state management strategies, enabling efficient and accurate Rails implementations.

**Architecture:**
- **ViewComponent + ERB** for custom application components
- **RubyUI (Phlex)** for pre-built UI primitives (buttons, cards, modals)
- **ITCSS + BEM + Tailwind** for CSS architecture
- **Hotwire (Turbo + Stimulus)** for interactivity

Please create this document as `docs/react_to_rails_prompt.md` in the root folder. Additionally, continually update and maintain a separate, practical document as `docs/react_to_rails.md` based on this template for specific React SPA to Rails mappings.

## Expected Outcome:

By following this template, lovable.dev will have a comprehensive reference document to:

- Understand React component structures and their functionalities.
- Clearly map each React component to equivalent Rails/ViewComponent + RubyUI components.
- Identify and manage state, data flow, and API interactions effectively.
- Design accurate Rails database schemas and migrations.
- Utilize Hotwire effectively to replicate dynamic interactions from React SPAs.
- Apply consistent ITCSS + BEM CSS architecture.

## Sections:

**1. Overview of the React SPA:**

- **1.1. Application Goal:** (Clearly describe the application's main objective.)
- **1.2. Key Features:** (List essential functionalities, highlighting interactions users rely on.)
- **1.3. High-Level Component Structure:** (Outline major components and their purposes.)

**2. Detailed Breakdown of React Components and Functionality:**

For each major React component:

- **2.X. Component Name:** (Clearly name each significant component.)
  - **2.X.1. Purpose:** (Define the primary role clearly.)
  - **2.X.2. Props/Input Data:** (Detail props comprehensively, including types.)
  - **2.X.3. Internal State:** (Explain internal state and its role.)
  - **2.X.4. Rendering Logic:** (Describe rendering conditions clearly.)
  - **2.X.5. User Interactions:** (Detail user interactions, events, and outcomes.)
  - **2.X.6. Data Dependencies:** (Highlight external dependencies clearly.)
  - **2.X.7. Potential ViewComponent/RubyUI Equivalent:**
    - ViewComponent class and ERB template location
    - RubyUI components to use (buttons, cards, etc.)
    - BEM block name and CSS file location
    - Stimulus controller requirements

**3. Data Flow and State Management:**

- **3.1. Overall Data Flow:** (Clarify data movement clearly; diagrams strongly recommended.)
- **3.2. Key Data Entities and Lifecycle:** (Detail lifecycle stages of critical data clearly.)
- **3.3. State Management Implementation:** (Clearly explain state management method.)
- **3.4. How Data is Passed to Components:** (Clearly describe data propagation methods.)

**4. API Interactions (if any):**

- **4.1. List of API Endpoints:** (Clearly listed for easy reference.)
- **4.2. For Each Endpoint:**
  - **URL:**
  - **Method:**
  - **Request Body Structure:**
  - **Response Structure:**
  - **Purpose:**
  - **Components Involved:**

**5. Database Schema (if applicable):**

- **5.1. Existing Database Schema:** (Clearly describe current database structure; ERD diagrams strongly recommended.)
- **5.2. Proposed Rails Database Schema:** (Suggest clear and concise Rails-compatible schema.)
- **5.3. Potential Rails Migrations:** (Provide clear examples of necessary migrations.)

**6. Routing in the React SPA:**

- **6.1. Routing Library Used:** (Clearly indicate library used.)
- **6.2. List of Routes and Corresponding Components:** (Clearly map routes to components.)
- **6.3. Navigation Mechanisms:** (Clearly describe how navigation is handled.)

**7. Considerations for Rails/ViewComponent/Hotwire Implementation:**

- **7.1. ViewComponent Mapping:**
  - Map React components to ViewComponent classes
  - Identify which RubyUI primitives to use (buttons, cards, modals, form controls)
  - Define BEM block names and CSS structure
- **7.2. Hotwire Integration Strategy:** (Clearly explain dynamic interaction strategies.)
- **7.3. Server-Side Data Handling:** (Clearly outline data handling methods.)
- **7.4. Form Handling in Rails:** (Clearly detail form handling and interactions.)
- **7.5. State Management in Rails/Hotwire:** (Clearly describe Rails state management approaches.)
- **7.6. CSS Architecture:**
  - ITCSS layer organization
  - BEM naming for components
  - Tailwind utility integration

**8. Diagramming Guidance**

To enhance clarity and aid Rails migration, use text-based diagrams where possible. Prioritize Mermaid.js and plain-text before using image formats.

Preferred formats (in order):

1. **Mermaid.js**
2. **Plain-text diagrams**
3. **PNG/SVG** (only if visualization cannot be expressed in code)

Store diagrams and image assets in the following locations:

- `docs/diagrams/architecture/` – Component-to-Rails system mapping
- `docs/diagrams/sequences/` – User interaction and state flow diagrams
- `docs/diagrams/database/` – ERD or domain model diagrams
- `docs/images/` – Any referenced PNG/SVG assets used within markdown files
- `docs/icons/` – Standalone reusable SVG icons
- `docs/images/urls.md` – Central list of externally hosted image URLs used in documentation

To embed diagrams or assets in documentation:

```markdown
![Description](../diagrams/<type>/<diagram-name>.svg)
```

Include visual diagrams to clarify interactions or data flows:

- **High-Level Architecture Diagrams:** Clearly map React components to their Rails/Phlex counterparts.
- **Sequence Diagrams:** Illustrate user interactions, API requests, state updates, and component responses.
- **Database and Domain Diagrams:** Use Entity-Relationship (ERD) diagrams to depict database structures clearly.

## Glossary

| Term             | Meaning                                                    |
| ---------------- | ---------------------------------------------------------- |
| **ViewComponent**| Ruby gem for building reusable view components with ERB    |
| **RubyUI**       | Pre-built UI component library built on Phlex              |
| **Phlex**        | Ruby DSL for creating HTML components (used by RubyUI)     |
| **ITCSS**        | Inverted Triangle CSS - architecture for organizing styles |
| **BEM**          | Block Element Modifier - CSS naming convention             |
| **Hotwire**      | Rails library for dynamic partial page updates             |
| **Stimulus**     | JavaScript controller framework within Hotwire             |
| **Turbo Frame**  | Container for dynamically updating HTML fragments          |
| **Turbo Stream** | Server-driven DOM updates via WebSockets or HTTP           |
| **Sidecar**      | ViewComponent pattern: `.rb` and `.html.erb` in same dir   |
| **ERD**          | Entity-Relationship Diagram                                |
