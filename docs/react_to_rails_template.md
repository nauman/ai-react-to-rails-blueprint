# React SPA to Rails/Phlex/Hotwire Component Mapping Template

**Purpose:** This document provides a structured approach for lovable.dev to translate and map React single-page applications (SPAs) effectively into a Ruby on Rails application using Phlex components (via RubyUI) and Hotwire for dynamic, interactive user experiences. The goal is to clearly document component structures, data flows, and state management strategies, enabling efficient and accurate Rails implementations.

Please create this document as `docs/react_to_rails_template.md` in the root folder. Additionally, continually update and maintain a separate, practical document as `docs/react_to_rails.md` based on this template for specific React SPA to Rails mappings.

## Expected Outcome:

By following this template, lovable.dev will have a comprehensive reference document to:

- Understand React component structures and their functionalities.
- Clearly map each React component to equivalent Rails/Phlex components.
- Identify and manage state, data flow, and API interactions effectively.
- Design accurate Rails database schemas and migrations.
- Utilize Hotwire effectively to replicate dynamic interactions from React SPAs.

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
  - **2.X.7. Potential Phlex/RubyUI Equivalent:** (Suggest Phlex components clearly and practically.)

**3. Data Flow and State Management:**

- **3.1. Overall Data Flow:** (Clarify data movement clearly; diagrams helpful.)
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

- **5.1. Existing Database Schema:** (Clearly describe current database structure.)
- **5.2. Proposed Rails Database Schema:** (Suggest clear and concise Rails-compatible schema.)
- **5.3. Potential Rails Migrations:** (Provide clear examples of necessary migrations.)

**6. Routing in the React SPA:**

- **6.1. Routing Library Used:** (Clearly indicate library used.)
- **6.2. List of Routes and Corresponding Components:** (Clearly map routes to components.)
- **6.3. Navigation Mechanisms:** (Clearly describe how navigation is handled.)

**7. Considerations for Rails/Phlex/Hotwire Implementation:**

- **7.1. Potential Phlex Component Mapping:** (Clearly map React components to Phlex.)
- **7.2. Hotwire Integration Strategy:** (Clearly explain dynamic interaction strategies.)
- **7.3. Server-Side Data Handling:** (Clearly outline data handling methods.)
- **7.4. Form Handling in Rails:** (Clearly detail form handling and interactions.)
- **7.5. State Management in Rails/Hotwire:** (Clearly describe Rails state management approaches.)

