# Design Tokens — CodeTrack

Semua nilai berikut diekstrak langsung dari kode Figma Make (Register, AdminDashboard, UserDashboard).

---

## Colors

### Primary
| Token | Value | Penggunaan |
|---|---|---|
| `--color-primary` | `#4f39f6` | Button primary, link, active state, icon |
| `--color-primary-dark` | `#4338ca` | Hover state button primary |
| `--color-primary-navy` | `#312E81` | Admin topbar background |

### Semantic
| Token | Value | Penggunaan |
|---|---|---|
| `--color-success` | `#10B981` | Badge success, revenue chart line, trend up |
| `--color-warning` | `#F59E0B` | Badge pending, warning alert border |
| `--color-danger` | `#EF4444` | Badge failed, notif dot, urgent badge |
| `--color-info` | `#3B82F6` | Badge info, referral chart, forecast text |

### Backgrounds
| Token | Value | Penggunaan |
|---|---|---|
| `--color-bg-page` | `#F9FAFB` | `bg-gray-50`, semua halaman |
| `--color-bg-surface` | `#FFFFFF` | Card, navbar, sidebar |
| `--color-bg-input` | `#f3f3f5` | Input field background |

### Text
| Token | Value | Penggunaan |
|---|---|---|
| `--color-text-primary` | `#111827` | Heading, konten utama |
| `--color-text-label` | `#354152` | Form label |
| `--color-text-body` | `#495565` | Body paragraph |
| `--color-text-muted` | `#697282` | Hint, caption, secondary info |
| `--color-text-placeholder` | `#717182` | Input placeholder |

### Border
| Token | Value |
|---|---|
| `--color-border` | `rgba(0,0,0,0.1)` |

---

## Gradients

```css
/* Register page background */
background: linear-gradient(117deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%);

/* User dashboard welcome header */
background: linear-gradient(to right, #4f46e5, #7c3aed);

/* User dashboard monthly goals card */
background: linear-gradient(to bottom right, #4f46e5, #7c3aed);

/* Admin dashboard header */
background: linear-gradient(to right, #ffffff, #eef2ff);

/* Admin KPI cards */
Revenue card:  from-white to-green-50   | icon: bg-green-100  text-green-600
Users card:    from-white to-blue-50    | icon: bg-blue-100   text-blue-600
Courses card:  from-white to-indigo-50  | icon: bg-indigo-100 text-indigo-600
Students card: from-white to-purple-50  | icon: bg-purple-100 text-purple-600
Health card:   from-white to-amber-50   | icon: bg-amber-100  text-amber-600
```

---

## Chart Colors

| Nama | Value | Penggunaan |
|---|---|---|
| `--color-chart-1` | `#6366F1` | Direct traffic, primary chart |
| `--color-chart-2` | `#10B981` | Google/revenue line & area |
| `--color-chart-3` | `#F59E0B` | Social media |
| `--color-chart-4` | `#3B82F6` | Referral |
| `--color-chart-5` | `#8B5CF6` | Email |

---

## Badge Colors

### Course Level
```
Beginner:     bg-green-100 text-green-700
Intermediate: bg-blue-100  text-blue-700
Advanced:     bg-purple-100 text-purple-700
```

### Transaction Status
```
success: bg-green-500 text-white
pending: bg-amber-500 text-white
failed:  bg-red-500   text-white
```

### Deadline Urgency
```
high:   bg-red-500   text-white
medium: bg-amber-500 text-white
low:    bg-gray-400  text-white
```

### User Role
```
student:    Badge variant="outline"
instructor: Badge variant="outline"
admin:      bg-indigo-500 text-white
```

### Course Status
```
Published: bg-green-500 text-white
Draft:     bg-gray-400  text-white
```

---

## Typography

Font: `'Geist Variable'` — import via `@fontsource-variable/geist`

### Font Sizes
```
text-xs:   0.75rem  — badge, timestamp, hint, caption
text-sm:   0.875rem — body text, label, table content
text-base: 1rem     — paragraph
text-lg:   1.125rem — card title, section subtitle
text-xl:   1.25rem  — section heading
text-2xl:  1.5rem   — page section heading
text-3xl:  1.875rem — stat number (user), page heading
text-4xl:  2.25rem  — welcome heading (user dashboard)
text-5xl:  3rem     — KPI number (admin dashboard)
```

### Font Weights
```
font-normal:   form label, body text
font-medium:   button, nav link, card title
font-semibold: stat value, price, badge text
font-bold:     heading utama
```

---

## Border Radius

```
rounded-lg:   button, input, sidebar item, alert
rounded-xl:   card umum, icon box, KPI inner
rounded-2xl:  KPI card admin (p-7)
rounded-full: badge, avatar, pill, notif dot
rounded-[14px]: auth card (Register, Login)
```

---

## Shadows

```
shadow-sm:   card default
shadow-md:   KPI card admin
shadow-lg:   card hover state
shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a]: auth card
--shadow-primary: 0px 10px 20px -10px rgba(79,57,246,0.7)  — icon box primary
```

---

## Layout

### Admin Panel
```
Topbar height:    h-16
Topbar bg:        #312E81
Sidebar width:    w-[18%]  fixed, top-16
Content width:    ml-[18%] w-[82%]
Content padding:  p-6
```

### Public & User Pages
```
Max width:     max-w-7xl mx-auto
Padding x:     px-6
```

### Grid Layouts
```
Admin KPI cards:        grid-cols-5
Admin main content:     grid-cols-[65%_35%]
Admin secondary:        grid-cols-3
Admin data tables:      grid-cols-2
Admin analytics:        grid-cols-3

User stats:             grid-cols-4
User main content:      grid-cols-[65%_35%]
User recommended:       grid-cols-2

Course catalog:         grid-cols-3 (dengan sidebar filter)
Quick actions (admin):  grid-cols-2
```

---

## Component Patterns

### Sidebar Item (Admin)
```tsx
// Active state
bg-indigo-600 text-white border-l-4 border-indigo-800

// Inactive state
text-gray-700 hover:bg-indigo-50
```

### Input Field
```tsx
h-9 rounded-lg border border-transparent
bg-[#f3f3f5] pl-10 pr-3 text-sm
text-[#717182] placeholder:text-[#717182]
focus-visible:ring-0 focus-visible:ring-offset-0
```

### Button Primary
```tsx
bg-[#4f39f6] hover:bg-[#4f39f6]/95
text-white rounded-lg
shadow: 0px 10px 20px -10px rgba(79,57,246,0.7)
```

### Button Outline (indigo)
```tsx
border-indigo-600 text-indigo-600
hover:bg-indigo-50
```

### Alert / Notification Bar
```tsx
success: bg-green-50  border-l-4 border-green-500  text-green-900
warning: bg-amber-50  border-l-4 border-amber-500  text-amber-900
info:    bg-blue-50   border-l-4 border-blue-500   text-blue-900
```

### Quick Action Button (hover effect)
```tsx
// Default
border border-gray-200 rounded-lg

// Hover
hover:bg-indigo-600 hover:text-white hover:border-indigo-600
```