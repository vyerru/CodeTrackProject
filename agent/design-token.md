# Design Tokens — CodeTrack

Semua nilai berikut diekstrak langsung dari kode Figma Make (Register, AdminDashboard, UserDashboard).

---

## Colors

### Primary
| Tailwind Class | Value | Penggunaan |
|---|---|---|
| `bg-indigo-600` / `text-indigo-600` | `#4f39f6` | Button primary, link, active state, icon |
| `bg-indigo-700` / `text-indigo-700` | `#4338ca` | Hover state button primary |
| `bg-indigo-900` / `text-indigo-900` | `#312E81` | Admin topbar background |

### Semantic
| Tailwind Class | Value | Penggunaan |
|---|---|---|
| `bg-green-500` / `text-green-600` | `#10B981` | Badge success, revenue chart line, trend up |
| `bg-amber-500` / `text-amber-500` | `#F59E0B` | Badge pending, warning alert border |
| `bg-red-500` / `text-red-600` | `#EF4444` | Badge failed, notif dot, urgent badge |
| `bg-blue-500` / `text-blue-600` | `#3B82F6` | Badge info, referral chart, forecast text |

### Backgrounds
| Tailwind Class | Value | Penggunaan |
|---|---|---|
| `bg-gray-50` | `#F9FAFB` | Semua halaman |
| `bg-white` | `#FFFFFF` | Card, navbar, sidebar |
| `bg-[#f3f3f5]` | `#f3f3f5` | Input field background |

### Text
| Tailwind Class | Value | Penggunaan |
|---|---|---|
| `text-gray-900` | `#111827` | Heading, konten utama |
| `text-gray-700` | `#354152` | Form label |
| `text-gray-600` | `#495565` | Body paragraph |
| `text-gray-500` | `#697282` | Hint, caption, secondary info |
| `text-gray-400` | `#717182` | Input placeholder |

### Border
| Tailwind Class | Value |
|---|---|
| `border-black/10` | `rgba(0,0,0,0.1)` |

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

| Nama | Value | Tailwind | Penggunaan |
|---|---|---|---|
| Chart 1 | `#6366F1` | `text-indigo-500` | Direct traffic, primary chart |
| Chart 2 | `#10B981` | `text-green-500` | Google/revenue line & area |
| Chart 3 | `#F59E0B` | `text-amber-500` | Social media |
| Chart 4 | `#3B82F6` | `text-blue-500` | Referral |
| Chart 5 | `#8B5CF6` | `text-purple-500` | Email |

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
bg-indigo-600 hover:bg-indigo-700
text-white rounded-lg
shadow-[0px_10px_20px_-10px_rgba(79,57,246,0.7)]
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

---

## Navbar

```
Height:         h-[72px]
Background:     bg-white shadow-sm
Text default:   text-gray-600
Text hover:     text-gray-900
Text active:    text-indigo-600
Logo:           Code2 w-8 h-8 text-indigo-600
Button Login:   px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg
                hover:border-gray-400 hover:bg-gray-50
Button Trial:   px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-sm
                hover:bg-indigo-700
Avatar:         w-9 h-9 rounded-full bg-indigo-600 text-white
Cart badge:     w-5 h-5 bg-indigo-600 text-white rounded-full text-xs
Notif dot:      w-2 h-2 bg-red-500 rounded-full
Dropdown:       bg-white border border-gray-200 rounded-lg shadow-lg w-56
```

---

## Icons

- Library: `lucide-react` — semua icon PascalCase (e.g. `User`, `Mail`, `Star`)
- **Social brand icons** (Twitter, GitHub, LinkedIn, Instagram): tidak tersedia di lucide-react versi ini — gunakan inline SVG (lihat `Footer.tsx`)
- **GitHub icon** (non-social): gunakan inline SVG (lihat `RegisterPage.tsx` atau `FeaturesSection.tsx`)
- Google logo: inline SVG (lihat `RegisterPage.tsx`)
- Icon colors: default `text-gray-400` untuk input icons, `text-indigo-600` untuk feature boxes

## 1. Page Layout Structure (Layout & Struktur Laman)
- **Container Utama:** Semua halaman utama WAJIB dibungkus dengan `<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`. Dilarang menempelkan konten mentah ke tepi layar.
- **Section Spacing:** Jarak antar *section* vertikal WAJIB menggunakan `gap-y-8` atau `gap-y-12` dari level halaman/pembungkus luar. Dilarang menggunakan margin-top/bottom tebakan.
- **Absolute Positioning Ban:** Dilarang keras menggunakan `absolute` untuk mengatur elemen struktural. `absolute` hanya untuk dekorasi kecil, *badge*, atau modal.

## 2. Color Hierarchy & Semantic Strictness (Color)
- **Warna Aksi Khusus:** Sukses (`bg-green-*`/`text-green-*`), Peringatan (`bg-amber-*`/`text-amber-*`), dan Bahaya (`bg-red-*`/`text-red-*`) HANYA BOLEH untuk status transaksi, validasi, atau penghapusan data. Dilarang untuk dekorasi.
- **Contrast & Legibility:** Teks di atas warna utama (`bg-indigo-600`) wajib `text-white`.
- **Muted Elements:** Teks sekunder (tanggal, deskripsi mikro) WAJIB menggunakan `text-gray-500` untuk membedakannya dari data utama (judul, harga `text-gray-900`).

## 3. Typography Constraints (Tipografi)
- **Minimum Size Limit:** Ukuran dasar keterbacaan adalah `text-sm`. Jangan gunakan `text-xs` untuk teks yang harus dibaca panjang, HANYA gunakan `text-xs` untuk *badge*, label *input*, atau metadata kecil.
- **Line Length:** Lebar paragraf (terutama di fitur Artikel/Deskripsi Kursus) TIDAK BOLEH melebihi 75 karakter. WAJIB dibatasi dengan utilitas `max-w-prose`.
- **Leading (Line Height):** Teks paragraf dinamis wajib `leading-relaxed`. Judul (H1/H2) wajib `leading-tight`.

## 4. Interaction States (Wajib)
- **Focus Visible:** Elemen interaktif harus memiliki `focus-visible:ring-2` untuk navigasi *keyboard*.
- **Disabled State:** Harus memiliki `opacity-50 cursor-not-allowed pointer-events-none`.