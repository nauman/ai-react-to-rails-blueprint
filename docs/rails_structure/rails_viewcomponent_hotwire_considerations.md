# Rails ViewComponent + RubyUI + Hotwire Considerations

## Architecture Decision

We use **ViewComponent with ERB** as the primary component framework because:

1. **ERB is familiar to all skill levels** - No learning curve for team members
2. **Better AI agent compatibility** - ERB is more widely understood by AI tools than Phlex Ruby DSL
3. **Atomic design + partials achieve same encapsulation** - You get component isolation without a new paradigm
4. **Prevents mistakes from direct rendering** - Encourages proper MVC separation

**RubyUI (Phlex-based) is retained** for pre-built UI primitives where it provides immediate value.

## Component Hierarchy

```
Application
  └── Layout (ERB)
        └── View (ERB)
              └── ViewComponent (custom logic + ERB template)
                    ├── RubyUI components (Phlex, pre-built)
                    └── Other ViewComponents (nested)
```

## Rendering Rules

### Rule 1: Controllers Render Views, Not Components

```ruby
# Controller
class UsersController < ApplicationController
  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end
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

## Hotwire Integration

### Turbo Frames

Wrap components in Turbo Frames for partial page updates:

```erb
<%# app/views/users/index.html.erb %>
<%= turbo_frame_tag "users-list" do %>
  <% @users.each do |user| %>
    <%= turbo_frame_tag dom_id(user) do %>
      <%= render UserCardComponent.new(user: user) %>
    <% end %>
  <% end %>
<% end %>
```

### Turbo Streams

For server-initiated updates:

```ruby
# In controller or background job
Turbo::StreamsChannel.broadcast_replace_to(
  "user_#{user.id}",
  target: dom_id(user, :card),
  partial: "users/card",
  locals: { user: user }
)
```

### Stimulus Controllers

Connect Stimulus controllers to ViewComponents:

```erb
<%# In ViewComponent template %>
<div class="user-card" data-controller="user-card">
  <button data-action="click->user-card#expand">Expand</button>
  <div data-user-card-target="content">
    <%= content %>
  </div>
</div>
```

```javascript
// app/javascript/controllers/user_card_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  expand() {
    this.contentTarget.classList.toggle("expanded")
  }
}
```

## Accessibility

Carry over React accessibility patterns:
- Semantic HTML in ERB templates
- ARIA attributes where needed
- Keyboard navigation via Stimulus
- RubyUI components include built-in a11y

```erb
<%# Accessible button example %>
<%= render RubyUI::Button.new(
  variant: :primary,
  aria: { label: "Save user profile" }
) { "Save" } %>
```

## Icons

Use `rails_icons` gem for icon rendering:

```erb
<%= icon("heroicons", "user", class: "user-card__icon") %>
<%= icon("heroicons", "chevron-down", class: "h-4 w-4") %>
```

## Form Integration

Use ViewComponents with Rails form helpers:

```erb
<%# In ViewComponent template %>
<%= form_with model: user, data: { controller: "form-validation" } do |form| %>
  <div class="form__field">
    <%= render RubyUI::Input.new(
      name: "user[email]",
      type: :email,
      value: user.email,
      placeholder: "Enter email"
    ) %>
  </div>

  <div class="form__actions">
    <%= render RubyUI::Button.new(type: :submit, variant: :primary) { "Save" } %>
  </div>
<% end %>
```

## Pagination with Pagy

Integrate Pagy with ViewComponents:

```ruby
# Controller
class UsersController < ApplicationController
  include Pagy::Backend

  def index
    @pagy, @users = pagy(User.all)
  end
end
```

```erb
<%# View %>
<%= render UserListComponent.new(users: @users, pagy: @pagy) %>
```

```ruby
# ViewComponent
class UserListComponent < ApplicationComponent
  include Pagy::Frontend

  attr_reader :users, :pagy_obj

  def initialize(users:, pagy:)
    @users = users
    @pagy_obj = pagy
  end
end
```

```erb
<%# ViewComponent template %>
<div class="user-list">
  <% users.each do |user| %>
    <%= render UserCardComponent.new(user: user) %>
  <% end %>

  <nav class="user-list__pagination">
    <%== pagy_nav(pagy_obj) %>
  </nav>
</div>
```

## Tag Filtering with acts-as-taggable-on

```ruby
# Model
class User < ApplicationRecord
  acts_as_taggable_on :skills
end
```

```ruby
# Controller
def index
  @users = if params[:tag].present?
    User.tagged_with(params[:tag])
  else
    User.all
  end
end
```

```erb
<%# Filter component %>
<div class="tag-filter" data-controller="tag-filter">
  <% ActsAsTaggableOn::Tag.most_used(10).each do |tag| %>
    <%= link_to tag.name,
      users_path(tag: tag.name),
      class: "tag-filter__tag",
      data: { turbo_frame: "users-list" }
    %>
  <% end %>
</div>
```

## Best Practices Summary

1. **Controllers render views, views render components**
2. **Use RubyUI for primitives** (buttons, cards, inputs)
3. **Use ViewComponent for business logic** (user cards, order summaries)
4. **BEM + Tailwind for styling** (structure + utilities)
5. **Stimulus for interactivity** (avoid inline JavaScript)
6. **Turbo Frames for partial updates** (lazy loading, live updates)
7. **Turbo Streams for broadcasts** (real-time features)
