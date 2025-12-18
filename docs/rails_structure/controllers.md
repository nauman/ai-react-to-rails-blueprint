# Rails Controllers (shadow plan)

## Overview

- Define routes/actions per feature and expected params (including pagination and tag filters).
- Note dependencies on Pagy (e.g., `pagy(scope)`), and how tags are applied to queries.
- Document strong params, authorization assumptions, and response formats (HTML, Turbo Stream, JSON as needed).

## Rendering Pattern

**Important:** Controllers should render views, not components directly.

```ruby
# CORRECT: Controller renders view, view renders ViewComponent
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

## Example Controller with Pagy and Tags

```ruby
class UsersController < ApplicationController
  include Pagy::Backend

  def index
    scope = User.all

    # Tag filtering (acts-as-taggable-on)
    scope = scope.tagged_with(params[:tag]) if params[:tag].present?

    # Pagination
    @pagy, @users = pagy(scope, items: 20)

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def show
    @user = User.find(params[:id])
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :bio, skill_list: [])
  end
end
```
