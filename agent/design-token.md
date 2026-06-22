# Design System — CodeTrack

> Design tokens and component patterns extracted from Figma Make (Register, AdminDashboard, UserDashboard).
> Last updated: 2026-06-21

---

## Table of Contents

1. [Brand Palette](#1-brand-palette)
2. [Semantic Color Roles](#2-semantic-color-roles)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Shadows](#6-shadows)
7. [Gradients](#7-gradients)
8. [Chart Colors](#8-chart-colors)
9. [Badges & Status Colors](#9-badges--status-colors)
10. [Component Pattern Library](#10-component-pattern-library)
11. [Interaction States](#11-interaction-states)
12. [Icon Usage](#12-icon-usage)

---

## 1. Brand Palette

These are the **primitive** colour values. Always reference them through their semantic role (Section 2), not by hex value directly, unless you are defining a token in `index.css`.

| Token | Hex | Tailwind Equivalent | Usage |
|---|---|---|---|
| `--color-brand-600` | `#4f39f6` | `indigo-600` | Primary actions, active states, links |
| `--color-brand-700` | `#4338ca` | `indigo-700` | Hover state for primary buttons |
| `--color-brand-900` | `#312E81` | `indigo-900` | Admin topbar background |
| `--color-base-white` | `#FFFFFF` | `white` | Cards, navbars, sidebars |
| `--color-base-bg` | `#F9FAFB` | `gray-50` | Page backgrounds |
| `--color-input-bg` | `#f3f3f5` | — | Input field background |
| `--color-border-lt` | `rgba(0,0,0,0.1)` | `border-black/10` | Subtle borders |

---

## 2. Semantic Color Roles

These tokens map primitive colours to functional roles. Use these classes directly in components — never hardcode hex values.

### Foreground (Text)

| Role | Class | Value | Used For |
|---|---|---|---|
| Primary | `text-foreground` | `#111827` / `gray-900` | Headings, primary content |
| Secondary | `text-muted-foreground` | `#697282` / `gray-500` | Hints, captions, secondary info |
| On Primary | `text-primary-foreground` | `white` | Text on `bg-primary` backgrounds |
| Body | `text-gray-700` | `#354152` | Form labels, body paragraphs |
| Placeholder | `text-gray-400` | `#717182` / `gray-400` | Input placeholders |

### Background

| Role | Class | Used For |
|---|---|---|
| Page | `bg-muted` / `bg-gray-50` | All pages |
| Card | `bg-card` / `bg-white` | Cards, Navbar, Sidebar |
| Primary | `bg-primary` / `bg-indigo-600` | CTAs, active states |
| Input | `bg-muted` / `bg-[#f3f3f5]` | Input fields |
| Brand Hover | `hover:bg-primary/95` or `hover:bg-indigo-700` | Button hover |

### Border

| Role | Class | Value |
|---|---|---|
| Subtle | `border-border` / `border-black/10` | `rgba(0,0,0,0.1)` |
| Strong | `border-gray-200` | `#E5E7EB` |

### Semantic Feedback Colors

| Status | Role | Badge Class | Background Class | Text Class |
|---|---|---|---|---|
| Success | Positive | `bg-green-500 text-white` | `bg-green-50` | `text-green-600` / `text-green-900` |
| Warning | Pending | `bg-amber-500 text-white` | `bg-amber-50` | `text-amber-500` / `text-amber-900` |
| Error | Critical | `bg-red-500 text-white` | `bg-red-50` | `text-red-600` / `text-red-500` |
| Info | Informational | `bg-blue-500 text-white` | `bg-blue-50` | `text-blue-600` / `text-blue-900` |

> **⚠️ Usage constraint:** Green, amber, red, and blue backgrounds should serve **semantic purposes only** — status badges, validation, alerts, and data deletion. Avoid using them for decorative/stylistic purposes.

---

## 3. Typography

### Typeface

```css
font-family: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
```

Imported via `@fontsource-variable/geist`.

### Type Scale

| Name | Size | Class | Usage |
|---|---|---|---|
| Caption | 0.75rem (12px) | `text-xs` | Badges, timestamps, hints, metadata |
| Body Small | 0.875rem (14px) | `text-sm` | Body text, labels, table content |
| Body | 1rem (16px) | `text-base` | Paragraphs |
| Card Title | 1.125rem (18px) | `text-lg` | Card titles, section subtitles |
| Section Heading | 1.25rem (20px) | `text-xl` | Section headings |
| Page Heading | 1.5rem (24px) | `text-2xl` | Page section headings |
| Stat Number | 1.875rem (30px) | `text-3xl` | Dashboard stats, page headings |
| Welcome Heading | 2.25rem (36px) | `text-4xl` | User dashboard welcome |
| KPI Number | 3rem (48px) | `text-5xl` | Admin dashboard KPI numbers |

### Font Weights

| Weight | Class | Usage |
|---|---|---|
| 400 (Normal) | `font-normal` | Form labels, body text |
| 500 (Medium) | `font-medium` | Buttons, nav links, card titles |
| 600 (Semibold) | `font-semibold` | Stat values, prices, badge text |
| 700 (Bold) | `font-bold` | Main headings |

### Line Heights

| Context | Class | Rule |
|---|---|---|
| Headings (H1/H2) | `leading-tight` | Tight tracking for large type |
| Body paragraphs | `leading-relaxed` | Comfortable reading rhythm |
| Prose max-width | `max-w-prose` (~65ch) | Articles, course descriptions |

### Constraints

| Rule | Standard |
|---|---|
| Minimum readable size | `text-sm` (14px). `text-xs` only for badges, labels, metadata. |
| Paragraph line length | Must not exceed ~75 characters. Use `max-w-prose`. |
| Dynamic text protection | Always use `truncate` or `line-clamp-{N}` for dynamic data (titles, names). |

---

## 4. Spacing & Layout

### Page Container

| Context | Class |
|---|---|
| Public & User pages | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Auth pages | Full-page centred (`max-w-md` card) |
| Admin content | `p-6` (no max-width — fills available space) |

### Section Spacing

| Relationship | Standard |
|---|---|
| Between vertical sections | `gap-y-8` or `gap-y-12` on the wrapper |
| Between sibling elements | `gap-{size}` via Flex/Grid — never manual margins |
| Card padding | `p-5` or `p-7` |

### Admin Panel Layout

```
Topbar:         h-16
Sidebar:        w-[18%], fixed, border-right
Content area:   ml-[18%] (desktop)
Content pad:    p-6
```

### Grid Templates

| Context | Grid |
|---|---|
| Admin KPI cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5` |
| Admin main | `grid-cols-1 lg:grid-cols-[65%_35%]` |
| Admin secondary | `grid-cols-1 md:grid-cols-3` |
| User stats | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| User main | `grid-cols-1 lg:grid-cols-[65%_35%]` |
| Course catalog | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (with sidebar filter) |
| Admin data tables | `grid-cols-1 lg:grid-cols-2` |

### Layout Prohibitions

- ❌ **Absolute positioning** for structural elements — reserved for overlays, modals, and decorative badges only.
- ❌ **Fixed pixel dimensions** on main containers (`w-[300px]`, `h-[500px]`) — use relative units + `max-w-*` constraints.
- ❌ **Manual margins** (`ml-4`, `mt-2`, `mr-4`) for aligning sibling elements — use Flex/Grid `gap-*`.

---

## 5. Border Radius

| Name | Class | Value | Usage |
|---|---|---|---|
| Default | `rounded-lg` | 8px | Buttons, inputs, sidebar items, alerts |
| Card | `rounded-xl` | 12px | Cards, icon boxes, KPI inner |
| Large Card | `rounded-2xl` | 16px | KPI cards (admin, p-7) |
| Full | `rounded-full` | 9999px | Badges, avatars, pills, notification dots |
| Auth Card | `rounded-[14px]` | 14px | Login/Register card container |

---

## 6. Shadows

| Name | Value | Usage |
|---|---|---|
| `shadow-sm` | Default Tailwind | Card default |
| `shadow-md` | Default Tailwind | KPI cards (admin) |
| `shadow-lg` | Default Tailwind | Card hover, dropdowns |
| Auth card shadow | `0px 8px 10px -6px #0000001a, 0px 20px 25px -5px #0000001a` | Login/Register card |
| Primary glow | `0px 10px 20px -10px rgba(79,57,246,0.7)` | Primary icon box |

---

## 7. Gradients

| Context | Gradient |
|---|---|
| Auth page background | `linear-gradient(117deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%)` |
| User welcome header | `linear-gradient(to right, #4f46e5, #7c3aed)` |
| User monthly goals card | `linear-gradient(to bottom right, #4f46e5, #7c3aed)` |
| Admin dashboard header | `linear-gradient(to right, #ffffff, #eef2ff)` |
| KPI — Revenue | `from-white to-green-50` |
| KPI — Users | `from-white to-blue-50` |
| KPI — Courses | `from-white to-indigo-50` |
| KPI — Students | `from-white to-purple-50` |
| KPI — Health | `from-white to-amber-50` |

---

## 8. Chart Colors

| Name | Hex | Tailwind | Data Series |
|---|---|---|---|
| Chart 1 | `#6366F1` | `indigo-500` | Direct traffic, primary series |
| Chart 2 | `#10B981` | `green-500` | Google / revenue line & area |
| Chart 3 | `#F59E0B` | `amber-500` | Social media |
| Chart 4 | `#3B82F6` | `blue-500` | Referral |
| Chart 5 | `#8B5CF6` | `purple-500` | Email |

---

## 9. Badges & Status Colors

### Course Level

| Level | Tailwind Classes |
|---|---|
| Beginner | `bg-green-100 text-green-700` |
| Intermediate | `bg-blue-100 text-blue-700` |
| Advanced | `bg-purple-100 text-purple-700` |

### Transaction Status

| Status | Tailwind Classes |
|---|---|
| Success | `bg-green-500 text-white` |
| Pending | `bg-amber-500 text-white` |
| Failed | `bg-red-500 text-white` |

### Deadline Urgency

| Urgency | Tailwind Classes |
|---|---|
| High | `bg-red-500 text-white` |
| Medium | `bg-amber-500 text-white` |
| Low | `bg-gray-400 text-white` |

### Course Status

| Status | Tailwind Classes |
|---|---|
| Published | `bg-green-500 text-white` |
| Draft | `bg-gray-400 text-white` |

### User Role

| Role | Tailwind Classes |
|---|---|
| Student | `Badge variant="outline"` |
| Instructor | `Badge variant="outline"` |
| Admin | `bg-indigo-500 text-white` |

---

## 10. Component Pattern Library

### Button — Primary

```tsx
<button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
                   text-sm font-medium shadow-sm
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                   focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none
                   transition-colors">
  Label
</button>
```

### Button — Outline (Indigo)

```tsx
<button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50
                   rounded-lg text-sm font-medium
                   focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none
                   transition-colors">
  Label
</button>
```

### Button — Social (Navbar)

```tsx
<button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg
                   text-sm font-medium hover:border-gray-400 hover:bg-gray-50
                   focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none
                   transition-all">
  Login
</button>

<button className="px-6 py-2 bg-indigo-600 text-white rounded-lg
                   text-sm font-medium hover:bg-indigo-700 shadow-sm
                   focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none
                   transition-all">
  Start Free Trial
</button>
```

### Input Field

```tsx
<div className="relative">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
  <input className="w-full h-9 pl-10 pr-3 text-sm
                    bg-muted rounded-lg border border-transparent
                    text-foreground placeholder:text-muted-foreground
                    focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" />
</div>
```

### Sidebar Item (Admin)

```tsx
// Active
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                   text-sm font-medium
                   bg-primary text-primary-foreground
                   focus-visible:ring-2 focus-visible:ring-ring outline-none
                   transition-all">
  <Icon className="w-4 h-4" />
  <span>Label</span>
</button>

// Inactive
<button className="... text-muted-foreground hover:bg-muted hover:text-foreground
                   focus-visible:ring-2 focus-visible:ring-ring outline-none
                   transition-all">
  <Icon className="w-4 h-4" />
  <span>Label</span>
</button>
```

### Navbar

```
Height:       h-[72px]
Background:   bg-white shadow-sm
Text base:    text-gray-600
Text hover:   text-gray-900
Text active:  text-indigo-600
Logo:         Code2 w-8 h-8 text-indigo-600
Avatar:       w-9 h-9 rounded-full bg-indigo-600 text-white
Cart badge:   w-5 h-5 bg-indigo-600 text-white rounded-full text-xs
Notif dot:    w-2 h-2 bg-red-500 rounded-full
Dropdown:     bg-white border border-gray-200 rounded-lg shadow-lg w-56
```

### Alert / Notification Bar

```tsx
// Success
<div className="bg-green-50 border-l-4 border-green-500 text-green-900 p-4 rounded-lg">
  ...
</div>

// Warning
<div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-lg">
  ...
</div>

// Info
<div className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-4 rounded-lg">
  ...
</div>
```

---

## 11. Interaction States

All interactive elements **must** implement these states:

| State | Implementation |
|---|---|
| **Default** | Base styling per component pattern |
| **Hover** | `hover:` variant — colour shift, background change |
| **Focus** | `focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none` — keyboard navigation ring |
| **Active/Pressed** | `active:` variant — darker shade or scale |
| **Disabled** | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` |
| **Loading** | Show spinner (`Loader2` icon with `animate-spin`) + `disabled:opacity-60` |

---

## 12. Icon Usage

| Concern | Standard |
|---|---|
| Library | `lucide-react` — all PascalCase (`User`, `Mail`, `Star`) |
| Input icon color | `text-muted-foreground` |
| Feature box icon color | `text-indigo-600` |
| Social brand icons | Inline SVG (Twitter/X, GitHub, LinkedIn, Instagram — not available in lucide-react) |
| Google logo | Inline SVG (see `LoginPage.tsx` or `RegisterPage.tsx`) |
| GitHub icon | Inline SVG (see `RegisterPage.tsx` or `FeaturesSection.tsx`) |
