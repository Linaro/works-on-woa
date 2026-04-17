# Works on WoA Website — Comprehensive Test Report
**Site:** https://publish.worksonwoa.com/  
**Date:** April 13, 2026  
**Testing Standard:** Microsoft Accessibility Standard (MAS), WCAG 2.1 AA, Microsoft Well-Architected Framework, OWASP  

---

## Executive Summary

| Category | Score | Verdict |
|----------|-------|---------|
| **Performance** | 71/100 | ⚠️ Needs Improvement |
| **Accessibility** | 89/100 | ⚠️ Needs Improvement (MAS requires AA compliance) |
| **Best Practices** | 100/100 | ✅ Pass |
| **SEO** | 92/100 | ⚠️ Needs Improvement |
| **Security Headers** | 0/10 | 🔴 Critical — All missing |
| **Privacy/Legal** | Present | ✅ Pass |

---

## 1. ACCESSIBILITY (MAS / WCAG 2.1 Level AA)

MAS requires WCAG 2.1 Level AA conformance for all public-facing Microsoft web properties. The site scores **89/100** — below the expected 100% compliance baseline.

### 1.1 FAILURES (Blocking MAS Compliance)

#### 🔴 ARIA Attributes Don't Match Roles
**Severity: High | WCAG 4.1.2**
- The search input uses `aria-expanded` and `aria-haspopup="listbox"` which are not permitted on a plain `<input type="text">` element.
- **Element:** `<input placeholder="Search apps and games" aria-expanded="false" aria-haspopup="listbox">`
- **Fix:** Use `role="combobox"` on the input, or wrap in a combobox pattern. Alternatively, remove `aria-expanded` and `aria-haspopup` if the input doesn't function as a combobox.

#### 🔴 Color Contrast Insufficient
**Severity: High | WCAG 1.4.3 (Level AA requires 4.5:1 for normal text, 3:1 for large text)**
- Multiple elements in the footer and section headers using `text-[var(--color-text-tertiary)]` fail contrast checks.
- Affected areas:
  - Footer section headings (`<h5>` elements for PRODUCT, LEARN, COMMUNITY, MICROSOFT)
  - Footer copyright text and cookie links
  - Privacy/Terms links in footer
  - Category labels and tertiary text throughout
- **Fix:** Ensure all `--color-text-tertiary` CSS variable resolves to a color with at least 4.5:1 contrast ratio against its background. Audit the dark theme palette specifically.

#### 🔴 Heading Order Not Sequential
**Severity: Medium | WCAG 1.3.1**
- Footer headings jump to `<h5>` without preceding `<h2>`, `<h3>`, `<h4>` in the content hierarchy.
- This breaks screen reader navigation expectations.
- **Fix:** Use semantic heading structure (h1→h2→h3) or use `<div>` with `role="heading" aria-level="X"` for footer headings, or simply use styled `<p>` or `<span>` elements instead.

### 1.2 PASSING AUDITS (Positive Findings)
- ✅ Image elements have `[alt]` attributes
- ✅ Links have discernible names
- ✅ Buttons have accessible names
- ✅ Document has a `<title>` element
- ✅ `<html>` has valid `[lang]` attribute
- ✅ Document has a main landmark
- ✅ Skip to content link present
- ✅ No `aria-hidden` on `<body>`
- ✅ ARIA IDs are unique
- ✅ No viewport zoom disabled
- ✅ Touch targets have sufficient size

---

## 2. PERFORMANCE

Score: **71/100** — Below the 90+ target for public Microsoft properties.

### 2.1 Core Web Vitals

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| **FCP** (First Contentful Paint) | 4.6 s | < 1.8 s | 🔴 Fail |
| **LCP** (Largest Contentful Paint) | 4.8 s | < 2.5 s | 🔴 Fail |
| **TBT** (Total Blocking Time) | 30 ms | < 200 ms | ✅ Pass |
| **CLS** (Cumulative Layout Shift) | 0 | < 0.1 | ✅ Pass |
| **Speed Index** | 4.9 s | < 3.4 s | 🔴 Fail |
| **TTI** (Time to Interactive) | 4.9 s | < 3.8 s | 🔴 Fail |

### 2.2 Root Causes
1. **Large JavaScript Bundle:** Single `index-B4HwhZRh.js` bundle (SPA architecture) — likely includes all routes and data. Source map exceeds 2.6M columns, indicating very large bundle.
2. **No Code Splitting:** All route code shipped upfront rather than lazy-loaded per-page.
3. **Cache Policy:** `Cache-Control: no-store, must-revalidate, no-cache, max-age=0` — effectively disabling all caching. This forces full re-download on every visit.
4. **SPA First-Load Penalty:** As a React/Vite SPA, content requires JS execution before first paint. No SSR/SSG pre-rendering detected.

### 2.3 Recommendations
- Implement code splitting / lazy loading for routes (apps, games, publishers, learn pages)
- Enable asset caching with proper `Cache-Control` headers (immutable hashed assets can be cached for 1 year)
- Consider SSR/SSG for initial page load (e.g., via Next.js or Astro)
- Implement `<link rel="preload">` for critical CSS/fonts
- Use progressive image loading for app icons

---

## 3. SEO

Score: **92/100**

### 3.1 FAILURES

#### 🔴 robots.txt Is Invalid / Missing
**Severity: High**
- Requesting `/robots.txt` returns the HTML application shell (`<!doctype html>`) instead of a valid robots.txt file.
- The SPA catch-all routing serves the index.html for all unknown paths, including `/robots.txt`.
- This means search engine crawlers cannot understand the site's crawling rules.
- **Fix:** Deploy a proper `robots.txt` file at the root. Example:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://publish.worksonwoa.com/sitemap.xml
  ```

#### 🔴 sitemap.xml Missing
- `/sitemap.xml` also serves the HTML shell — no XML sitemap exists.
- With 6,255 apps, 1,697 games, and 246 publishers, a sitemap is critical for search indexing.
- **Fix:** Generate and deploy a sitemap.xml listing all pages including:
  - Homepage, /apps, /games, /publishers
  - All individual learn pages
  - /faq
  - Paginated app/game/publisher listing pages

### 3.2 PASSING AUDITS
- ✅ Document has a meta description
- ✅ Page has successful HTTP status code
- ✅ HTTPS in use
- ✅ Links have descriptive text
- ✅ Links are crawlable
- ✅ Valid `hreflang`
- ✅ Valid `rel=canonical`
- ✅ Page title present

---

## 4. SECURITY

### 4.1 HTTP Security Headers — 🔴 ALL MISSING

This is the most critical finding. **Zero security headers** are present.

| Header | Status | Risk |
|--------|--------|------|
| **Content-Security-Policy** | 🔴 Missing | XSS vulnerability — no CSP enforcement mode |
| **Strict-Transport-Security** | 🔴 Missing | Downgrade attacks possible |
| **X-Content-Type-Options** | 🔴 Missing | MIME-sniffing attacks |
| **X-Frame-Options** | 🔴 Missing | Clickjacking vulnerability |
| **Referrer-Policy** | 🔴 Missing | Information leakage |
| **Permissions-Policy** | 🔴 Missing | Feature abuse risk |
| **Cross-Origin-Opener-Policy** | 🔴 Missing | Cross-origin attacks |
| **Cross-Origin-Resource-Policy** | 🔴 Missing | Resource theft |
| **Cross-Origin-Embedder-Policy** | 🔴 Missing | Spectre-type attacks |

### 4.2 Infrastructure Exposure
- **Server header** reveals: `AmazonS3` — specific server technology exposed
- **Hosting:** CloudFront CDN (via `X-Cache: RefreshHit from cloudfront`)
- **Encryption:** AES256 server-side encryption (`x-amz-server-side-encryption`)
- HTTPS is enforced (positive)

### 4.3 Required Fixes (Per Microsoft Secure Foundation Initiative)

Add CloudFront Response Headers Policy with:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:;
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
```

---

## 5. UI/UX & BRANDING

### 5.1 Consistent Navigation ✅
- Navigation structure is consistent across all pages
- Footer links to Privacy, Terms of Use, Microsoft.com are present
- "Skip to content" link present

### 5.2 Content Quality ✅
- Well-written, professional copy across all pages
- Clear value propositions on each page
- FAQ section with expandable answers

### 5.3 Issues Found

#### ⚠️ Footer Duplication
- Privacy link appears twice in the footer (once in MICROSOFT section, once at bottom bar)
- Terms link also duplicated

#### ⚠️ "EN" Language Selector
- Language dropdown shows "EN" but functionality/available languages unclear from the markup
- If no other languages are supported, the selector should be hidden

#### ⚠️ Copyright Year
- Shows "© 2026 Microsoft" — verify this is correct and auto-updating

#### ⚠️ Data Freshness Concerns
- Apps page shows "Last Updated: Mar 1, 2026" for the majority of entries — suggesting bulk import rather than individual verification dates
- Games page shows entries from "Mar 31, 2024" — nearly 2 years old, raising data accuracy concerns

### 5.4 Site Architecture ✅
Pages verified and returning 200:
- `/` (Homepage)
- `/apps` (6,255 apps)
- `/games` (1,697 games)
- `/publishers` (246 publishers)
- `/faq`
- `/learn/getting-started`
- `/learn/prism`
- `/learn/windows-on-arm`

---

## 6. PRIVACY & LEGAL COMPLIANCE

### 6.1 Required Elements
- ✅ Privacy link → https://privacy.microsoft.com
- ✅ Terms of Use link → https://www.microsoft.com/en-us/legal/terms-of-use
- ✅ Cookies consent mechanism referenced
- ✅ Microsoft.com link present

### 6.2 Cookie Consent
- Cookie banner appears to be present (footer "Cookies" link)
- Need to verify the cookie consent mechanism meets GDPR/regional requirements in browser testing

---

## 7. FUNCTIONAL TESTING OBSERVATIONS

### 7.1 Search Functionality
- Search input present on homepage with typeahead behavior (ARIA combobox pattern attempted but incorrectly implemented)

### 7.2 Filtering & Pagination
- Apps/Games pages support filtering by Category, Compatibility, Type, Publisher, Last Updated
- Pagination present (24 items per page, Previous/Next + page numbers)
- 6,255 apps = ~261 pages; 1,697 games = ~71 pages

### 7.3 Data Integrity Observations
- Some games marked "No" compatibility (e.g., "360 Game manager", "A Way Out") — these correctly show status
- Mix of verification sources: "Community Verified" vs "Verified by Developer"

---

## 8. PRIORITY REMEDIATION PLAN

### P0 — Critical (Fix Immediately)
1. **Add all security headers** via CloudFront Response Headers Policy
2. **Deploy valid `robots.txt`** file
3. **Fix ARIA role mismatches** on search input

### P1 — High (Fix This Sprint)
4. **Fix color contrast** for footer and tertiary text elements
5. **Deploy `sitemap.xml`** for proper search indexing
6. **Fix heading hierarchy** (h5 in footer without h2-h4)
7. **Enable caching** for static assets (JS/CSS/images with content hashes)

### P2 — Medium (Next Sprint)
8. **Improve page load performance** — code splitting, lazy loading
9. **Consider SSR/SSG** for better FCP/LCP
10. **Remove duplicate footer links**

### P3 — Low (Backlog)
11. Review data freshness — 2024 game entries may need reverification
12. Language selector UX review
13. Structured data (schema.org) for richer search results

---

## Test Tools Used
- Google Lighthouse 13.1.0 (headless Chrome)
- PowerShell `Invoke-WebRequest` (header analysis)
- Manual content review via web fetch
- Microsoft WorkIQ (standards retrieval)

## Standards Referenced
- Microsoft Accessibility Standard (MAS) — based on WCAG 2.1, EN 301 549, Section 508
- Microsoft Azure Well-Architected Framework — testing & operational excellence
- Microsoft Secure Foundation Initiative — security baseline
- OWASP Top 10 — web security
- Google Core Web Vitals — performance thresholds
