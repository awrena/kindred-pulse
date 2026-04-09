# Design System Document: Radiant Connection

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Radiant Living Room."** 

Digital social spaces often feel like cold, infinite grids or sterile office hallways. This system rejects that clinical approach in favor of a warm, editorial, and deeply human experience. We achieve a "custom" feel by breaking away from the rigid constraints of standard container-based UI. Instead of boxes inside boxes, we use **organic layering, intentional asymmetry, and tonal depth** to create a space that feels spontaneous and alive—like a well-curated scrapbook or a sun-drenched physical community space.

To move beyond the "template" look, we prioritize breathing room (white space) over structural lines and use aggressive rounding to soften the digital edge. Every interaction should feel like a soft haptic "thrum" rather than a mechanical click.

---

## 2. Colors & Surface Philosophy
The palette moves away from "Corporate Blue" into a spectrum of sun-soaked earth tones and vibrant botanical accents.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or containers. Boundaries must be established through:
1.  **Background Shifts:** Placing a `surface_container_low` card on a `surface` background.
2.  **Tonal Transitions:** Using subtle shifts in the Material surface tiers to imply hierarchy.
3.  **Negative Space:** Using the spacing scale to create distinct visual groups.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials. 
*   **Base:** `surface` (#fff8f1) is our canvas.
*   **Secondary Contexts:** Use `surface_container_low` for large content areas (like a feed background).
*   **Interactive Elements:** Use `surface_container_highest` for cards or elements that need to "pop" toward the user.
*   **Nesting:** When nesting a comment within a post, do not use a line. Change the background of the comment to `surface_container_high` to "inset" it into the post.

### The "Glass & Gradient" Rule
To add soul to the UI:
*   **Glassmorphism:** Use semi-transparent versions of `surface` with a `backdrop-blur` (20px+) for floating navigation bars or reaction overlays.
*   **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#a04223) to `primary_container` (#ffad94) at a 135-degree angle. This provides a "lit from within" glow.

---

## 3. Typography: The Editorial Voice
We use typography to bridge the gap between "App" and "Magazine."

*   **Display & Headlines:** `plusJakartaSans`. This typeface is our personality driver. Use `display-lg` and `headline-lg` with tight letter-spacing (-2%) to create an authoritative yet friendly editorial look.
*   **Body & Labels:** `beVietnamPro`. This provides a modern, clean counter-balance. It’s highly legible for long-form community stories.

**Hierarchy Tip:** Never center-align more than three lines of text. Use left-alignment for body copy to maintain a professional editorial flow, but feel free to use oversized Display type for spontaneous "shout-outs" or community milestones.

---

## 4. Elevation & Depth
In this design system, shadows are light, and depth is felt, not seen.

*   **The Layering Principle:** Avoid the "floating shadow" look for everything. Use **Tonal Layering** first. A `surface_container_lowest` card on a `surface_dim` background creates a natural lift that feels sophisticated and architectural.
*   **Ambient Shadows:** When an element must float (e.g., a "Create Post" FAB), use a shadow tinted with the `on_surface` color at 5% opacity, with a blur value of at least 40px. 
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline_variant` at 15% opacity. Never use 100% opaque strokes.
*   **Organic Shapes:** Avoid perfect circles for everything. Use a "squircle" or a `24px` to `48px` corner radius to maintain the "Warm & Human" personality.

---

## 5. Components

### Buttons & Interaction
*   **Primary Button:** Uses the signature `primary` gradient with `24px` (md) rounding. Height should be a minimum of `48px` to feel "chunky" and tactile.
*   **Secondary Button:** No background. Uses `surface_container_high` with `on_surface` text.
*   **Reaction Chips:** These are the heart of the "lively" vibe. Use `tertiary_container` (yellow) or `secondary_container` (mint). On tap, they should scale up 10% momentarily (spring animation).

### Cards & Feed Items
*   **The Content Card:** Strictly forbidden to use divider lines. Use `surface_container` for the card body. Elements inside (like user headers) are separated by `24px` of vertical white space.
*   **Images:** All images must have at least a `24px` (md) corner radius. For a "spontaneous" look, occasionally use the `xl` (3rem) radius on alternating feed images.

### Inputs & Fields
*   **The "Soft" Input:** Text fields should use `surface_container_highest` as their background color. On focus, the background shifts to `surface_container_lowest` with a subtle `primary` ghost-border.

### Community Specifics
*   **The "Vibe" Bar:** A floating bottom-sheet using glassmorphism (`surface` at 80% opacity + blur) that houses quick-reactions and community shortcuts.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** It’s okay if a profile header is slightly offset or if a "Reaction" float-over overlaps the edge of an image. It feels spontaneous.
*   **Use Warmth:** Always lean toward `surface` (cream) rather than pure `#ffffff`. Pure white should only be used for the "Highest" surface tier to create a highlight effect.
*   **Prioritize Motion:** Use spring physics for all transitions (stiffness: 300, damping: 20).

### Don't:
*   **Don't use "Default" Shadows:** Avoid the muddy grey shadows typical of standard UI kits.
*   **Don't use Grids for Everything:** Allow some elements to break the margin (like a wide-format image in a post) to create an editorial rhythm.
*   **Don't use 1px Lines:** If you feel the urge to draw a line, add 16px of white space instead. If you still need a line, use a background color change.

---

## 7. Token Summary Reference

| Category | Token | Value | Intent |
| :--- | :--- | :--- | :--- |
| **Corner** | `radius-md` | `1.5rem (24px)` | Standard cards/buttons. |
| **Corner** | `radius-xl` | `3rem (48px)` | Hero elements/large containers. |
| **Color** | `background` | `#fff8f1` | The warm, paper-like canvas. |
| **Color** | `primary` | `#a04223` | Active, energetic human connection. |
| **Color** | `secondary` | `#006b64` | Community and growth (Soft Mint). |
| **Type** | `display-lg` | `3.5rem` | Bold, editorial statements. |
| **Shadow** | `ambient-sm` | `0 10px 40px` | 5% opacity, tinted with #393222. |