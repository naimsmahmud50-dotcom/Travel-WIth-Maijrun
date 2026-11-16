# Feature Specification: Admin Login Autofill & Credential Privacy Shield

## 1. Context & User Story
### User Story
As Mahmud Hasan (Founder & Executive Concierge Director),
I want the `/admin` login gateway to NEVER automatically display my private Gmail address or saved password upon opening the page,
So that my private credentials remain strictly confidential and no observer or accidental screen share can ever see my email or password pre-filled.

---

## 2. Problem Statement & Root Cause
### Observation
When visiting `https://travel-w-ith-maijrun-alpha.vercel.app/admin` in a browser that has previously saved credentials:
1. The browser's native Password Manager (Google Password Manager / Edge / Safari / Keychain) inspects the DOM for standard login fields (`autoComplete="username"` and `autoComplete="current-password"`).
2. The browser automatically injects the stored email (`naimsmahmud50@gmail.com`) and password (`••••••••••••••`) on initial page load.
3. The inputs turn bright light-blue / white due to default browser `:-webkit-autofill` styling.
4. The user perceived this as the website exposing their private credentials to anyone who visits the URL.

### Desired Outcome
1. **Zero Passive Auto-fill**: When `/admin` is opened, the input fields must be 100% empty. No pre-filled email, no pre-filled password dots.
2. **Confidential Inputs**: Clear luxury placeholders (`Gmail` and `Password`) without any pre-existing text or credentials.
3. **No Ugly Autofill Styling**: The inputs must maintain the dark luxury emerald/obsidian aesthetic with gold borders (`#D4AF37`) and never glitch into browser default white/blue.
4. **Smooth Manual Entry**: Authorized administrators can type, paste, or deliberately select their credentials whenever they want.

---

## 3. Functional Requirements
* **FR-1**: On page load, `adminIdentifier` and `adminPassword` must initialize as empty strings `""`.
* **FR-2**: Both `app/admin/page.tsx` and `admin.html` must implement passive autofill traps (e.g. decoy hidden fields, `readOnly` mount shield with immediate touch/focus unlock, `autoComplete="off"` and `autoComplete="new-password"`).
* **FR-3**: Both interfaces must apply CSS `-webkit-autofill` suppression to prevent browser light-blue styling overrides.
* **FR-4**: Normal form submission, password visibility toggle, rate limiting, and API authentication (`/api/admin/login`) must continue to operate flawlessly.

---

## 4. Acceptance Criteria
* **AC-1**: When the admin page is loaded, the Gmail input is empty and displays placeholder "Gmail".
* **AC-2**: When the admin page is loaded, the Password input is empty and displays placeholder "Password".
* **AC-3**: Chrome, Edge, and Safari password managers do not inject credentials automatically upon page load.
* **AC-4**: Typing or clicking into the inputs allows effortless manual entry and password visibility toggling.
* **AC-5**: All 8 test suites pass with 100% success rate.
