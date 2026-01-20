## 2024-05-23 - Keyboard Shortcut Discoverability
**Learning:** Adding keyboard shortcuts (1-4) is invisible without cues. Adding small visual hints (`[1]`) inside the buttons significantly improves discoverability and usability without cluttering the UI on mobile (hidden via CSS).
**Action:** When adding hotkeys, always pair them with a visual indicator, responsive if possible.

## 2024-05-24 - Visual Progress Indicators
**Learning:** Adding a visual progress bar significantly improves user orientation in long processes. It provides immediate feedback and a sense of accomplishment without needing to read text.
**Action:** Always include visual progress indicators for multi-step flows, ensuring they are accessible with `role="progressbar"`.

## 2024-05-24 - Action Button Hints
**Learning:** Users often miss that primary action buttons (like "Check Answer") can be triggered by "Enter". Adding a consistent visual hint (e.g., `↵ Enter`) next to the button text reinforces the keyboard-first workflow established by the option keys.
**Action:** Add visual hints for the "Enter" key on primary action buttons in keyboard-heavy interfaces, ensuring they are `aria-hidden` to avoid screen reader redundancy.
