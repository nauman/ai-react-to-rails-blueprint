# Stimulus/Turbo Behaviors (shadow plan)

## Overview

- List anticipated Stimulus controllers and targets for interactivity mirrored from React.
- Note Turbo Frame/Stream updates tied to pagination, tag filters, or form submissions.
- Capture events and payloads the Rails side should emit or respond to.

## Connecting Stimulus to ViewComponents

Add Stimulus controllers via data attributes in ViewComponent templates:

```erb
<%# app/components/user_card/user_card_component.html.erb %>
<div class="user-card" data-controller="user-card">
  <button data-action="click->user-card#expand">Expand</button>
  <div data-user-card-target="content">
    <%= content %>
  </div>
</div>
```

## Example Stimulus Controller

```javascript
// app/javascript/controllers/user_card_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]
  static values = { expanded: Boolean }

  connect() {
    console.log("UserCard controller connected")
  }

  expand() {
    this.expandedValue = !this.expandedValue
    this.contentTarget.classList.toggle("user-card__content--expanded", this.expandedValue)
  }

  disconnect() {
    console.log("UserCard controller disconnected")
  }
}
```

## Turbo Frame Integration

Wrap components in Turbo Frames for partial updates:

```erb
<%# Lazy-loaded content %>
<%= turbo_frame_tag "user-details", src: user_path(@user), loading: :lazy do %>
  <p>Loading...</p>
<% end %>

<%# In-place updates %>
<%= turbo_frame_tag dom_id(@user, :card) do %>
  <%= render UserCardComponent.new(user: @user) %>
<% end %>
```

## Turbo Stream Actions

For server-pushed updates:

```ruby
# Controller
def update
  @user = User.find(params[:id])
  if @user.update(user_params)
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to @user }
    end
  end
end
```

```erb
<%# app/views/users/update.turbo_stream.erb %>
<%= turbo_stream.replace dom_id(@user, :card) do %>
  <%= render UserCardComponent.new(user: @user) %>
<% end %>
```

## Generator Output

The component generator creates Stimulus controller stubs:

```bash
node scripts/generate_rails_components.js --component=FilterPanel
# Creates: app/javascript/controllers/filter-panel_controller.js
```

## Mapping React Handlers to Stimulus

| React Handler | Stimulus Action |
|---------------|-----------------|
| `onClick` | `data-action="click->controller#method"` |
| `onChange` | `data-action="change->controller#method"` |
| `onSubmit` | `data-action="submit->controller#method"` |
| `onFocus` | `data-action="focus->controller#method"` |
| `onBlur` | `data-action="blur->controller#method"` |

## Common Patterns

### Form Validation
```erb
<%= form_with model: @user, data: { controller: "form-validation" } do |form| %>
  <%= form.text_field :email, data: { action: "blur->form-validation#validate" } %>
<% end %>
```

### Toggle Visibility
```erb
<div data-controller="toggle">
  <button data-action="click->toggle#toggle">Show/Hide</button>
  <div data-toggle-target="content" class="hidden">
    Hidden content
  </div>
</div>
```

### Debounced Search
```erb
<input type="search"
       data-controller="search"
       data-action="input->search#search"
       data-search-url-value="<%= search_path %>"
       placeholder="Search...">
```
