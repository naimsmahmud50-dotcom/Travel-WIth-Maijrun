import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Admin Autofill Shield: app/admin/page.tsx contract', () => {
  const code = fs.readFileSync(path.resolve('app/admin/page.tsx'), 'utf-8');

  // Form autocomplete is off
  assert.ok(code.includes('autoComplete="off"'), 'Form must specify autoComplete="off"');

  // Invisible decoy inputs present
  assert.ok(code.includes('name="decoy_user"'), 'Must have decoy user input');
  assert.ok(code.includes('name="decoy_pass"'), 'Must have decoy password input');

  // ReadOnly mount shield with unlock listeners
  assert.ok(code.includes('readOnly={!inputsUnlocked}'), 'Inputs must have readOnly mount shield');
  assert.ok(code.includes('setInputsUnlocked(true)'), 'Must have unlock trigger on user interaction');

  // Hardened autocomplete attributes
  assert.ok(code.includes('data-lpignore="true"'), 'Must prevent third-party password managers from aggressive autofill');
  assert.ok(code.includes('autoComplete="new-password"'), 'Password must use new-password attribute');

  // Masked dots and active nullifier
  assert.ok(code.includes('mask-password-dots'), 'Must use custom text security mask to prevent Chrome password manager injection');
  assert.ok(code.includes('wipeAutofill'), 'Must have active autofill nullifier on mount');

  // Ensure placeholders are clean and no credentials leaked
  assert.ok(code.includes('placeholder="Gmail"'), 'Must have placeholder Gmail');
  assert.ok(code.includes('placeholder="Password"'), 'Must have placeholder Password');
  assert.ok(!code.includes('placeholder="naimsmahmud50@gmail.com'), 'Must not leak private email as placeholder');
});

test('Admin Autofill Shield: admin.html contract', () => {
  const html = fs.readFileSync(path.resolve('admin.html'), 'utf-8');

  assert.ok(html.includes('autocomplete="off"'), 'admin.html must specify autocomplete="off"');
  assert.ok(html.includes('name="decoy_user"'), 'admin.html must have decoy user input');
  assert.ok(html.includes('name="decoy_pass"'), 'admin.html must have decoy password input');
  assert.ok(html.includes('readonly onfocus="this.removeAttribute(\'readonly\')"'), 'admin.html must have readonly mount shield with onfocus unlock');
  assert.ok(html.includes('placeholder="Gmail"'), 'admin.html must have placeholder Gmail');
  assert.ok(html.includes('placeholder="Password"'), 'admin.html must have placeholder Password');
  assert.ok(html.includes('mask-password-dots'), 'admin.html must have mask-password-dots');
  assert.ok(html.includes('enforceWipeAutofill'), 'admin.html must have enforceWipeAutofill');
  assert.ok(html.includes('-webkit-autofill'), 'admin.html must have -webkit-autofill CSS override');
});

test('Admin Autofill Shield: CSS dark luxury styling', () => {
  const css = fs.readFileSync(path.resolve('app/globals.css'), 'utf-8');
  assert.ok(css.includes('-webkit-autofill'), 'globals.css must have -webkit-autofill override');
  assert.ok(css.includes('-webkit-box-shadow'), 'globals.css must have box-shadow inset override');
});
