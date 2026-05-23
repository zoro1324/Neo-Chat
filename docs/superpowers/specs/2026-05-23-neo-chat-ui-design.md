# Neo-Chat UI Redesign Spec (Landing-to-Chat Transition)

Date: 2026-05-23

## Summary
Create a premium ChatGPT-inspired UI with a cinematic landing-to-chat morph. The landing state showcases a Spline hero and a centered input. On the first message, the interface smoothly transitions into a chat layout with sidebar, message thread, and docked input. Motion is driven by `motion/react` with shared layout IDs to avoid hard switches.

## Goals
- Split-screen layout with a glassmorphism sidebar and a cinematic hero state.
- Smooth, 1-1.5s landing-to-chat morph triggered by the first user message.
- Keep the sidebar present in both states while the main area transitions.
- Support server-backed message flow using `VITE_API_URL`.
- Tailwind-only styling, clean TypeScript types, and responsive layout.

## Non-Goals
- Real-time streaming or multi-turn backend logic beyond basic request/response.
- Persisting chat history between sessions.
- Full auth, user management, or settings pages.

## Visual Direction
- Very dark gradient background: #050816 to #0B1020.
- Soft glow accents, subtle reflections, and low-contrast glass panels.
- Premium AI product aesthetic with gentle motion and glassmorphism.
- Use Lucide icons (no emoji).

## Information Architecture
- Sidebar: New Chat, Chats, Explore GPTs, Library, Settings, user profile.
- Main area: Landing state with centered hero + hint + input.
- Chat state: message timeline, input docked to bottom, assistant and user bubbles.

## Component Plan
- `Sidebar`: glassmorphism container, stacked nav, profile at bottom.
- `SplineHero`: lazy-loaded Spline scene with skeleton loader and float animation.
- `ChatInput`: shared layout ID for morphing from centered input to docked input.
- `MessageBubble`: role-based alignment and style.
- `LandingView`: hero, hint, centered input layout.
- `ChatView`: message list, assistant response, auto-scroll.
- `AnimatedLayout`: holds `LayoutGroup`, controls transition timing and shared IDs.
- `useChat`: state + send logic, first-message transition trigger.

## State Model
- `messages: Message[]`
- `draft: string`
- `isSending: boolean`
- `hasStarted: boolean` (true after first send)

## Data Flow
1. User types in `ChatInput`.
2. On send, `useChat` validates input and sets `isSending`.
3. POST to `${VITE_API_URL}/send` with `{ message }`.
4. Append user message, then assistant response: "Server received: ...".
5. If first message, toggle `hasStarted` to trigger morph.

## Transition Design (Approach A)
- Use shared `layoutId` on hero container and input to morph positions.
- `SplineHero` scales down and fades with a spring.
- Main container shifts upward using `layout` props.
- Messages stagger in with `opacity` and `y` offsets.
- Input docks to bottom using shared layout ID.
- Total duration: ~1.0 to 1.5s with spring easing.

## Animation Guidelines
- Background gradient: slow drifting animation.
- Input glow on focus (shadow + border).
- Hero: gentle float with subtle parallax.
- Staggered list for messages (100-140ms per item).
- Use `AnimatePresence` for crossfades and `LayoutGroup` for layout morphing.

## Responsive Behavior
- Desktop: full sidebar + centered main content.
- Tablet: sidebar shrinks to icon rail, main content keeps padding.
- Mobile: sidebar becomes top icon bar or collapses; input remains sticky.
- Messages use max width and wrap safely.

## Accessibility
- Focus-visible styles for inputs and buttons.
- Sufficient color contrast for text and icons.
- Keyboard-friendly send (Enter to send, Shift+Enter for newline).

## Performance
- Lazy-load Spline with `React.lazy` and a skeleton placeholder.
- Avoid re-rendering the Spline scene after transition.
- Use memoized motion variants where possible.

## Error Handling
- If `VITE_API_URL` missing, show a friendly error message in the thread.
- If request fails, append a fallback assistant message.

## Testing Strategy
- Unit test `useChat` for message flow and first-message toggle.
- UI smoke test for layout transitions.
- Manual test: mobile layout, focus glow, and smooth morph timing.

## Open Questions
- None.
