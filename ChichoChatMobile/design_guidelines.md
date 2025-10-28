# Chicho AI - Mobile Chat Application Design Guidelines

## Design Approach
**Selected Framework:** Material Design principles with inspiration from leading AI chat interfaces (ChatGPT, Claude, Gemini)

**Justification:** This is a utility-focused conversational interface where efficiency, clarity, and mobile usability are paramount. Material Design provides excellent mobile patterns while maintaining the clean, conversation-focused aesthetic users expect from AI chat applications.

## Core Design Elements

### A. Typography
**Primary Font:** 'Inter' or 'Roboto' via Google Fonts
- App Title/Branding: 600 weight, 1.5rem (mobile), 1.75rem (desktop)
- User Messages: 400 weight, 0.95rem
- AI Messages: 400 weight, 0.95rem
- Input Placeholder: 400 weight, 0.9rem
- Timestamps/Metadata: 400 weight, 0.75rem with reduced opacity

**Hierarchy Focus:** Maintain consistent readability across message types with subtle weight variations only in headers.

### B. Layout System
**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, and 8 for consistency
- Container padding: p-4 (mobile), p-6 (desktop)
- Message spacing: gap-4 between messages
- Input area padding: p-3
- Header/Footer heights: h-16 (mobile), h-20 (desktop)

**Grid Structure:**
- Single column chat layout: max-w-4xl centered
- Full viewport height: h-screen with flex column
- Message container: flex-1 with overflow-scroll
- Fixed input area: sticky bottom positioning

### C. Component Library

**Header Component:**
- Fixed top positioning with backdrop blur effect
- "Chicho AI" branding centered or left-aligned
- Optional menu icon (mobile: top-right for settings/clear chat)
- Subtle bottom border for definition
- z-index layering above messages

**Message Bubbles:**
- User Messages:
  - Aligned right with ml-auto
  - Rounded corners (rounded-2xl with rounded-br-sm for tail effect)
  - Max-width: max-w-[85%] for readability
  - Padding: px-4 py-3
  
- AI Messages (Chicho AI):
  - Aligned left with mr-auto
  - Rounded corners (rounded-2xl with rounded-bl-sm for tail effect)
  - Max-width: max-w-[85%]
  - Padding: px-4 py-3
  - Small "Chicho AI" label above first message or avatar icon

**Input Area:**
- Fixed bottom positioning with backdrop blur
- Flex container with textarea and send button
- Textarea: flex-1, rounded-full, min-h-12, max-h-32 with auto-resize
- Send button: Circular (w-10 h-10), positioned right, icon-only
- Shadow elevation above messages
- Padding: p-4 for thumb-friendly spacing

**Loading Indicator:**
- Typing animation: Three animated dots in AI message bubble style
- Positioned where next AI message will appear
- Subtle pulse or bounce animation

**Empty State:**
- Centered vertically in message area
- "Chicho AI" brand mark or icon (large, 4rem)
- Welcome message: "Hi! I'm Chicho AI. Ask me anything."
- Suggested starter prompts (optional): 3-4 pill-shaped suggestions

### D. Mobile-Specific Optimizations

**Touch Targets:**
- Minimum 44px height for all interactive elements
- Send button: 48px diameter minimum
- Input area: 56px minimum height when collapsed

**Responsive Behaviors:**
- Viewport units: Use dvh (dynamic viewport height) for mobile browser chrome handling
- Input focus: Smoothly expand textarea, keep send button visible
- Keyboard handling: Messages scroll to keep latest visible above keyboard
- Safe areas: Respect notch/home indicator with safe-area-inset padding

**Gesture Considerations:**
- Scroll momentum for natural message browsing
- Pull-to-refresh disabled to prevent accidental triggers
- Long-press on messages: Copy text functionality

### E. Interaction Patterns

**Message Submission:**
- Enter key: Send message (desktop)
- Shift+Enter: New line (desktop)
- Send button: Always available, clear visual state (enabled/disabled)
- Immediate user message display, followed by loading indicator

**Auto-Scroll:**
- Smooth scroll to bottom on new messages
- Maintain scroll position when viewing history
- "Scroll to bottom" FAB when user scrolls up (appears after threshold)

**Visual Feedback:**
- Input focus: Subtle ring or border emphasis
- Send button: Scale transform on press (scale-95)
- Message appearance: Gentle fade-in + slide-up animation (200ms)
- Loading dots: Staggered bounce animation

### F. Accessibility
- Semantic HTML: <header>, <main>, <form> for input
- ARIA labels: "Send message" button, "Chat messages" container
- Focus management: Trap in input area, clear focus rings
- Screen reader announcements for new AI messages
- Sufficient contrast ratios (4.5:1 minimum for text)

## Critical Implementation Notes

**No Images Required:** This is a pure chat interface - no hero section, no decorative imagery. Focus entirely on conversation clarity.

**Mobile-First Imperative:** Design for 360px width minimum, scale up gracefully to desktop (max-w-4xl container).

**Performance Priorities:**
- Virtualize message list for long conversations (100+ messages)
- Debounce textarea auto-resize calculations
- Lazy load message timestamps (show on hover/tap)

**Distinctive Branding:**
- Use "Chicho AI" consistently in header and AI message attribution
- Consider subtle animated brand mark in empty state
- Maintain personality through friendly microcopy ("Thinking...", "Chicho AI is typing...")

This design prioritizes conversation clarity, mobile usability, and instant responsiveness - creating a professional AI chat experience with custom "Chicho AI" branding that feels familiar yet distinct.