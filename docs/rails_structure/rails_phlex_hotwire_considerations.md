# Rails/Phlex/Hotwire Considerations

- Note patterns to keep render logic in Phlex components and use Turbo Streams for incremental updates.
- Prefer RubyUI components where available; fall back to custom Phlex components mirroring React behavior.
- Document any streaming needs (server-initiated updates) and how icons should be sourced via rails_icons.
- Capture accessibility expectations carried over from the React UI.
