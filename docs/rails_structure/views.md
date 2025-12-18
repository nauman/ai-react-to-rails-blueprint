# Rails Views (ViewComponent + RubyUI Strategy)

## Architecture Overview

This project uses a **hybrid approach** for view components:

| Layer | Technology | Purpose |
|-------|------------|---------|
| Custom Components | ViewComponent + ERB | Business logic, app-specific UI |
| UI Primitives | RubyUI (Phlex) | Buttons, Cards, Modals, Forms |
| Styling | ITCSS + BEM + Tailwind | CSS architecture |

## When to Use What

### Use RubyUI (Phlex) For:
- Buttons (`RubyUI::Button`)
- Cards (`RubyUI::Card`)
- Modals/Dialogs (`RubyUI::Modal`, `RubyUI::Dialog`)
- Form controls (`RubyUI::Input`, `RubyUI::Select`, `RubyUI::Checkbox`)
- Badges (`RubyUI::Badge`)
- Avatars (`RubyUI::Avatar`)
- Dropdowns (`RubyUI::Dropdown`)
- Tabs (`RubyUI::Tabs`)
- Alerts (`RubyUI::Alert`)
- Any component RubyUI provides out-of-the-box

### Use ViewComponent + ERB For:
- Custom business logic components (e.g., `UserProfileCard`, `OrderSummary`)
- Complex composite components
- Application-specific layouts
- Components not available in RubyUI
- Components needing significant customization beyond RubyUI slots

## Component Structure (Sidecar Pattern)

```
app/components/
  application_component.rb          # Base class
  user_card/
    user_card_component.rb          # Ruby logic
    user_card_component.html.erb    # ERB template
  filter_panel/
    filter_panel_component.rb
    filter_panel_component.html.erb
```

## Rendering Pattern: Always Use Partials

**IMPORTANT:** Components should be rendered through views/partials, not directly from controllers.

```ruby
# CORRECT: Controller renders a view, view uses component
class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    # render :show (implicit)
  end
end
```

```erb
<%# app/views/users/show.html.erb %>
<%= render UserCardComponent.new(user: @user) %>
```

```ruby
# AVOID: Direct component rendering from controller
class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    render UserCardComponent.new(user: @user)  # Don't do this
  end
end
```

## Example ViewComponent

### Ruby Class

```ruby
# app/components/user_card/user_card_component.rb
class UserCardComponent < ApplicationComponent
  attr_reader :user, :variant

  def initialize(user:, variant: :default)
    @user = user
    @variant = variant
  end

  def featured?
    variant == :featured
  end

  def card_classes
    classes = ["user-card"]
    classes << "user-card--featured" if featured?
    classes.join(" ")
  end
end
```

### ERB Template with RubyUI

```erb
<%# app/components/user_card/user_card_component.html.erb %>
<div class="<%= card_classes %>" data-controller="user-card">
  <%= render RubyUI::Card.new do |card| %>
    <% card.with_header do %>
      <div class="user-card__header">
        <%= render RubyUI::Avatar.new(src: user.avatar_url, alt: user.name) %>
        <h3 class="user-card__name"><%= user.name %></h3>
      </div>
    <% end %>

    <% card.with_content do %>
      <p class="user-card__bio"><%= user.bio %></p>

      <div class="user-card__tags">
        <% user.skills.each do |skill| %>
          <%= render RubyUI::Badge.new(variant: :secondary) { skill } %>
        <% end %>
      </div>
    <% end %>

    <% card.with_footer do %>
      <div class="user-card__actions">
        <%= render RubyUI::Button.new(
          variant: :primary,
          data: { action: "user-card#viewProfile" }
        ) { "View Profile" } %>
      </div>
    <% end %>
  <% end %>
</div>
```

### BEM CSS

```css
/* app/assets/stylesheets/components/_user-card.css */
/* ITCSS Layer: components */
/* BEM Block: user-card */

.user-card {
  /* Block base styles */
}

.user-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-card__name {
  /* Name styles */
}

.user-card__bio {
  /* Bio styles */
}

.user-card__tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-card__actions {
  display: flex;
  gap: 0.5rem;
}

/* Modifiers */
.user-card--featured {
  border-left: 4px solid var(--color-primary);
}
```

## Documentation Template

For each React component, document:

- **React component:** `<Name>` - route/path: `<path>`
- **Purpose:** `<what it does>`
- **Props/state:** `<list>`, defaults, derived values
- **ViewComponent:** `<ComponentName>Component` with slots/variants
- **RubyUI components used:** `<list of RubyUI::* components>`
- **BEM block name:** `<kebab-case-name>`
- **Stimulus controller:** `<controller-name>_controller.js`
- **Turbo integration:** `<frames/streams needed>`
- **Pagination:** `<Pagy usage>`
- **Tagging:** `<acts-as-taggable-on contexts>`
- **Icons:** `<rails_icons identifiers>`

## Turbo Frame Integration

```erb
<%= turbo_frame_tag dom_id(user, :card) do %>
  <%= render UserCardComponent.new(user: user) %>
<% end %>
```

## Icons

Use `rails_icons` gem for icon rendering:

```erb
<%= icon("heroicons", "user", class: "user-card__icon") %>
```
