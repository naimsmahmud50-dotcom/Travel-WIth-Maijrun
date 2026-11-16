# Technical Architecture Plan: Admin Login Autofill & Credential Privacy Shield

## 1. System Architecture & Strategy
To prevent browser password managers from automatically injecting credentials into the DOM on initial load, we employ a multi-layered defense-in-depth strategy:

### Layer 1: Passive Decoy Inputs
Aggressive browsers scan the first text and password inputs inside `<form>`. By placing invisible decoy inputs (`tabindex="-1" aria-hidden="true" style="opacity: 0; position: absolute; height: 0; width: 0; z-index: -1;"`), any naive autofill agent targets the decoys, leaving the real inputs untouched.

### Layer 2: ReadOnly Mount Shield
Modern browsers will NOT auto-fill inputs marked with `readOnly`.
- In React (`app/admin/page.tsx`): Start state `isShielded = true` (or initial `readOnly={true}`).
- On `onFocus`, `onMouseDown`, or `onTouchStart`, remove `readOnly` so the user can type seamlessly without any lag.
- In static HTML (`admin.html`): Inputs start with `readonly onfocus="this.removeAttribute('readonly')" onmousedown="this.removeAttribute('readonly')"`.

### Layer 3: Autocomplete Attributes Hardening
- `<form autocomplete="off">`
- Gmail input: `autoComplete="off" data-lpignore="true"`
- Password input: `autoComplete="new-password" data-lpignore="true"`

### Layer 4: Dark Luxury CSS Autofill Override
Add global CSS styling for `input:-webkit-autofill` to guarantee that if a browser ever injects styles, the background remains `#061410` (obsidian emerald) and text remains `#ffffff` with caret color `#D4AF37`, preventing the bright blue/white browser default box.

```css
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px rgba(6, 20, 16, 0.95) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #D4AF37 !important;
  transition: background-color 5000s ease-in-out 0s;
}
```

---

## 2. File Modification Scope
1. `app/admin/page.tsx`:
   - Add decoy hidden inputs.
   - Add `readOnly` mount shield with `onFocus` / `onMouseDown` unlock.
   - Update `autoComplete="off"` and `autoComplete="new-password"`.
   - Add inline or scoped autofill CSS style tag.
2. `admin.html`:
   - Add decoy hidden inputs.
   - Add `readonly` mount shield with `onfocus` unlock.
   - Add `autocomplete="off"` and `autocomplete="new-password"`.
   - Add autofill CSS style in `<head>`.
3. `test/inquiry-flow.test.ts` or new test in `test/admin-autofill.test.ts`:
   - Verify presence of autofill shield attributes in both `app/admin/page.tsx` and `admin.html`.
