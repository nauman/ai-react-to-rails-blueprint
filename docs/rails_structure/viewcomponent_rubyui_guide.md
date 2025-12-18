# ViewComponent + RubyUI Integration Guide

## Architecture Decision

We use **ViewComponent with ERB** as the primary component framework because:
1. ERB is familiar to all skill levels on the team
2. Better AI agent compatibility than Phlex Ruby DSL
3. Atomic design + partials achieve same encapsulation as Phlex
4. Prevents mistakes from direct component rendering in controllers

**RubyUI (Phlex-based) is retained** for pre-built UI primitives where it provides value.

## Component Hierarchy

```
Application
  └── Layout (ERB)
        └── View (ERB)
              └── ViewComponent (custom logic + ERB template)
                    ├── RubyUI components (Phlex, pre-built)
                    └── Other ViewComponents (nested)
```

## When to Use RubyUI vs ViewComponent

### Always Use RubyUI For:

| Component | Usage |
|-----------|-------|
| `RubyUI::Button` | All buttons |
| `RubyUI::Card` | Card containers |
| `RubyUI::Modal` / `RubyUI::Dialog` | Overlays |
| `RubyUI::Input`, `RubyUI::Select`, `RubyUI::Checkbox` | Form controls |
| `RubyUI::Badge` | Status indicators |
| `RubyUI::Avatar` | User images |
| `RubyUI::Dropdown` | Menus |
| `RubyUI::Tabs` | Tab interfaces |
| `RubyUI::Alert` | Notifications |

### Use Custom ViewComponent For:

- Complex composite components (e.g., `UserProfileCard`)
- Business-specific logic (e.g., `OrderSummary`, `FilterPanel`)
- Components not available in RubyUI
- Components needing significant customization beyond RubyUI slots

## ViewComponent Structure

### Base Class

```ruby
# app/components/application_component.rb
class ApplicationComponent < ViewComponent::Base
  # BEM class helper
  # Usage: bem_class("element", "modifier")
  # Returns: "component-name__element--modifier"
  def bem_class(element = nil, modifier = nil)
    base = component_name
    return base unless element

    result = "#{base}__#{element}"
    modifier ? "#{result} #{result}--#{modifier}" : result
  end

  private

  def component_name
    self.class.name
      .underscore
      .gsub("_component", "")
      .dasherize
  end
end
```

### Component Example

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

        <%= render RubyUI::Button.new(
          variant: :outline,
          data: { action: "user-card#message" }
        ) { "Message" } %>
      </div>
    <% end %>
  <% end %>
</div>
```

## Rendering Rules

### Rule 1: Controllers Render Views, Not Components

```ruby
# Controller
def index
  @users = User.all
end
```

```erb
<%# View (app/views/users/index.html.erb) %>
<%= render UserListComponent.new(users: @users) %>
```

### Rule 2: Components Can Render Other Components

```erb
<%# In a ViewComponent template %>
<%= render RubyUI::Button.new(variant: :primary) { "Save" } %>
<%= render AvatarComponent.new(user: user) %>
```

### Rule 3: Use Turbo Frames for Partial Updates

```erb
<%= turbo_frame_tag dom_id(user, :card) do %>
  <%= render UserCardComponent.new(user: user) %>
<% end %>
```

## Testing ViewComponents

```ruby
# test/components/user_card_component_test.rb
require "test_helper"

class UserCardComponentTest < ViewComponent::TestCase
  def setup
    @user = users(:john)
  end

  test "renders user name" do
    render_inline(UserCardComponent.new(user: @user))

    assert_selector ".user-card__name", text: @user.name
  end

  test "renders featured variant" do
    render_inline(UserCardComponent.new(user: @user, variant: :featured))

    assert_selector ".user-card--featured"
  end

  test "renders RubyUI button" do
    render_inline(UserCardComponent.new(user: @user))

    assert_selector "button", text: "View Profile"
  end
end
```

## Slots and Content Areas

ViewComponent supports slots for flexible content:

```ruby
# app/components/card_component.rb
class CardComponent < ApplicationComponent
  renders_one :header
  renders_one :footer
  renders_many :actions

  def initialize(variant: :default)
    @variant = variant
  end
end
```

```erb
<%# app/components/card_component.html.erb %>
<div class="card card--<%= @variant %>">
  <% if header? %>
    <div class="card__header"><%= header %></div>
  <% end %>

  <div class="card__body"><%= content %></div>

  <% if actions? %>
    <div class="card__actions">
      <% actions.each do |action| %>
        <%= action %>
      <% end %>
    </div>
  <% end %>

  <% if footer? %>
    <div class="card__footer"><%= footer %></div>
  <% end %>
</div>
```

```erb
<%# Usage %>
<%= render CardComponent.new(variant: :elevated) do |card| %>
  <% card.with_header do %>
    <h2>Card Title</h2>
  <% end %>

  <p>Card content goes here.</p>

  <% card.with_action do %>
    <%= render RubyUI::Button.new { "Action 1" } %>
  <% end %>

  <% card.with_action do %>
    <%= render RubyUI::Button.new(variant: :outline) { "Action 2" } %>
  <% end %>
<% end %>
```

## Migration Checklist: React to ViewComponent

For each React component:

- [ ] Create ViewComponent class in `app/components/<name>/`
- [ ] Create ERB template with BEM classes
- [ ] Create BEM CSS in `app/assets/stylesheets/components/`
- [ ] Identify RubyUI components to use (buttons, cards, etc.)
- [ ] Create Stimulus controller for interactivity
- [ ] Add component test
- [ ] Update `docs/react_to_rails.md` mapping

## File Organization

```
app/components/
  application_component.rb       # Base class

  # Sidecar pattern (recommended)
  user_card/
    user_card_component.rb
    user_card_component.html.erb

  filter_panel/
    filter_panel_component.rb
    filter_panel_component.html.erb

  # Inline template (for simple components)
  badge_component.rb
```

## Gemfile Setup

```ruby
# Gemfile
gem "view_component"
gem "ruby_ui"  # or "phlex-rails" + "ruby_ui"
gem "rails_icons"
```

## Configuration

```ruby
# config/application.rb
config.view_component.preview_paths << Rails.root.join("test/components/previews")
```

```ruby
# config/initializers/view_component.rb
Rails.application.config.view_component.generate.sidecar = true
Rails.application.config.view_component.generate.stimulus_controller = true
```
