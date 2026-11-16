import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isHoneypotTriggered,
  checkPublicRateLimit,
  clearPublicRateLimits,
} from '../lib/security.ts';

test('Security Engine: sanitizeText neutralizes XSS and controls length', () => {
  // Strips script tags
  const maliciousScript = '<script>alert("hacked")</script>Hello World';
  assert.equal(sanitizeText(maliciousScript), 'Hello World');

  // Strips iframe tags
  const maliciousIframe = '<iframe src="javascript:evil()"></iframe>VIP Client';
  assert.equal(sanitizeText(maliciousIframe), 'VIP Client');

  // Strips angle brackets
  const rawTags = '<b>Bold</b> & <test>';
  assert.equal(sanitizeText(rawTags), 'Bold &');

  // Enforces max length bound
  const longText = 'A'.repeat(500);
  assert.equal(sanitizeText(longText, 100).length, 100);

  // Removes null bytes and control chars
  const nullBytes = 'User\x00Name\x1F';
  assert.equal(sanitizeText(nullBytes), 'UserName');
});

test('Security Engine: isValidEmail enforces RFC validation and blocks injection', () => {
  assert.equal(isValidEmail('naimsmahmud50@gmail.com'), true);
  assert.equal(isValidEmail('concierge@travelwithmaijrun.com'), true);
  assert.equal(isValidEmail('client.vip+service@domain.co.uk'), true);

  // Invalid formats
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('@missinguser.com'), false);
  assert.equal(isValidEmail('missingdomain@'), false);
  assert.equal(isValidEmail(''), false);

  // Header injection attempts (CRLF)
  assert.equal(isValidEmail('test@domain.com\r\nBcc: victim@domain.com'), false);
  assert.equal(isValidEmail('test@domain.com\nEvil-Header: 1'), false);

  // Excessively long email
  assert.equal(isValidEmail(`${'a'.repeat(160)}@domain.com`), false);
});

test('Security Engine: isValidPhone validates international phone formats', () => {
  assert.equal(isValidPhone('+880 1767-850859'), true);
  assert.equal(isValidPhone('+44 20 7946 0991'), true);
  assert.equal(isValidPhone('+971 4 123 4567'), true);
  assert.equal(isValidPhone('01767850859'), true);

  // Invalid phones
  assert.equal(isValidPhone('123'), false); // Too short
  assert.equal(isValidPhone('call-me-now-please'), false); // Alphabetic
  assert.equal(isValidPhone('+880\n1767850859'), false); // CRLF
});

test('Security Engine: isHoneypotTriggered catches spam bots', () => {
  // Legitimate user payload (honeypot fields empty or omitted)
  const legitPayload = { name: 'Mahmud Hasan', email: 'test@domain.com', phone: '+8801767850859' };
  assert.equal(isHoneypotTriggered(legitPayload), false);

  // Bot payloads
  assert.equal(isHoneypotTriggered({ ...legitPayload, website: 'http://spam-link.ru' }), true);
  assert.equal(isHoneypotTriggered({ ...legitPayload, url: 'http://bot-net.com' }), true);
  assert.equal(isHoneypotTriggered({ ...legitPayload, fax_number: '123456789' }), true);
  assert.equal(isHoneypotTriggered({ ...legitPayload, bot_token: 'auto_fill' }), true);
});

test('Security Engine: checkPublicRateLimit enforces sliding window DoS protection', () => {
  clearPublicRateLimits();
  const testIp = '192.168.1.100';
  const endpoint = 'test-endpoint';

  // First 5 requests should pass
  for (let i = 0; i < 5; i++) {
    const res = checkPublicRateLimit(testIp, endpoint, 5, 60000);
    assert.equal(res.allowed, true);
  }

  // 6th request must be blocked with retry-after
  const blockedRes = checkPublicRateLimit(testIp, endpoint, 5, 60000);
  assert.equal(blockedRes.allowed, false);
  assert.ok(blockedRes.retryAfterSeconds > 0);
  clearPublicRateLimits();
});

test('Security Headers: next.config.js contains OWASP Top 10 response headers', () => {
  const configContent = fs.readFileSync(path.resolve('next.config.js'), 'utf-8');

  assert.ok(configContent.includes('X-Frame-Options'), 'Must define X-Frame-Options');
  assert.ok(configContent.includes('DENY'), 'X-Frame-Options must be DENY to prevent clickjacking');
  assert.ok(configContent.includes('X-Content-Type-Options'), 'Must define X-Content-Type-Options');
  assert.ok(configContent.includes('nosniff'), 'Must enforce nosniff');
  assert.ok(configContent.includes('Strict-Transport-Security'), 'Must define HSTS');
  assert.ok(configContent.includes('Content-Security-Policy'), 'Must define CSP');
});

test('Security Headers: server.js contains OWASP Top 10 response headers', () => {
  const serverContent = fs.readFileSync(path.resolve('server.js'), 'utf-8');

  assert.ok(serverContent.includes("res.setHeader('X-Frame-Options', 'DENY')"), 'server.js must define X-Frame-Options');
  assert.ok(serverContent.includes("res.setHeader('X-Content-Type-Options', 'nosniff')"), 'server.js must define nosniff');
  assert.ok(serverContent.includes("res.setHeader('Strict-Transport-Security'"), 'server.js must define HSTS');
});
