# MyEnglish.lk Design System

## 🎨 Color System

### Light Mode
```css
Background: #F7F9FB (Soft blue-tinted white)
Foreground: #1E2532 (Charcoal, not pure black)
Primary: #6366F1 (Professional Indigo)
Secondary: #10B981 (Success Green)
Accent: #F59E0B (Warm Orange)
Card: #FFFFFF (Pure white for elevation)
Muted: #EFF3F6 (Light gray-blue)
Border: #DDE4EA (Subtle borders)
```

### Dark Mode
```css
Background: #0A0E1A (Deep blue-gray, not pure black)
Foreground: #E8ECEF (Off-white, not pure white)
Primary: #7C7FF1 (Lighter indigo for contrast)
Secondary: #14C795 (Brighter emerald)
Accent: #F6A723 (Brighter amber)
Card: #0F172A (Elevated slate)
Muted: #1E293B (Secondary background)
Border: #273548 (Subtle dark borders)
```

### WCAG Compliance
- ✅ All text/background combinations meet WCAG AA (4.5:1 minimum)
- ✅ Large text meets AAA (7:1 minimum)
- ✅ Interactive elements have clear focus states
- ✅ Color is not the only means of conveying information

---

## 📏 Spacing Scale (8px base)

```css
--space-1:  4px   (0.25rem)
--space-2:  8px   (0.5rem)  ← Base unit
--space-3:  12px  (0.75rem)
--space-4:  16px  (1rem)
--space-5:  20px  (1.25rem)
--space-6:  24px  (1.5rem)
--space-8:  32px  (2rem)
--space-10: 40px  (2.5rem)
--space-12: 48px  (3rem)
--space-16: 64px  (4rem)
--space-20: 80px  (5rem)
--space-24: 96px  (6rem)
```

### Usage Guidelines
- Use `space-2` (8px) as the minimum gap between elements
- Use `space-4` (16px) for standard padding
- Use `space-6` (24px) for card padding
- Use `space-8` (32px) for section spacing (mobile)
- Use `space-16` (64px) for section spacing (desktop)

---

## 📝 Typography Scale

### Font Sizes
```css
--font-xs:   12px  (0.75rem)   - Captions, labels
--font-sm:   14px  (0.875rem)  - Small text, metadata
--font-base: 16px  (1rem)      - Body text
--font-lg:   18px  (1.125rem)  - Large body, subheadings
--font-xl:   20px  (1.25rem)   - H5
--font-2xl:  24px  (1.5rem)    - H4
--font-3xl:  30px  (1.875rem)  - H3
--font-4xl:  36px  (2.25rem)   - H2
--font-5xl:  48px  (3rem)      - H1
--font-6xl:  60px  (3.75rem)   - Hero headlines
--font-7xl:  72px  (4.5rem)    - Large hero
```

### Line Heights
```css
--line-height-tight:   1.25  - Headings
--line-height-normal:  1.5   - Body text
--line-height-relaxed: 1.75  - Paragraphs, long-form
```

### Letter Spacing
```css
--letter-spacing-tight:  -0.025em  - Large headings
--letter-spacing-normal:  0        - Body text
--letter-spacing-wide:    0.025em  - Small caps, labels
```

### Font Weights
```css
300 - Light
400 - Regular (body text)
500 - Medium (emphasis)
600 - Semibold (subheadings)
700 - Bold (headings)
800 - Extrabold (hero)
900 - Black (large headlines)
```

---

## 🔲 Border Radius

```css
--radius-sm:   8px   (0.5rem)   - Small elements, badges
--radius-md:   12px  (0.75rem)  - Buttons, inputs
--radius-lg:   16px  (1rem)     - Cards, modals
--radius-xl:   24px  (1.5rem)   - Large cards
--radius-2xl:  32px  (2rem)     - Hero sections
--radius-full: 9999px           - Pills, avatars
```

---

## 🌑 Shadows & Elevation

### Light Mode
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
--shadow-md:  0 4px 6px rgba(0,0,0,0.1)
--shadow-lg:  0 10px 15px rgba(0,0,0,0.1)
--shadow-xl:  0 20px 25px rgba(0,0,0,0.1)
--shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
```

### Dark Mode
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.3)
--shadow-md:  0 4px 6px rgba(0,0,0,0.4)
--shadow-lg:  0 10px 15px rgba(0,0,0,0.5)
--shadow-xl:  0 20px 25px rgba(0,0,0,0.6)
--shadow-2xl: 0 25px 50px rgba(0,0,0,0.7)
```

### Elevation Levels
- **Level 0**: Flat elements (no shadow)
- **Level 1**: Subtle elevation (sm) - Inputs, borders
- **Level 2**: Standard cards (md) - Default cards
- **Level 3**: Hover states (lg) - Interactive cards
- **Level 4**: Modals, dropdowns (xl) - Overlays
- **Level 5**: Maximum elevation (2xl) - Tooltips, popovers

---

## 🎯 Component Spacing

### Header/Navbar
```css
Height: 80px (5rem)
Padding: 16px horizontal (space-4)
Logo size: 48px (3rem)
Nav item gap: 8px (space-2)
```

### Cards
```css
Padding: 24px (space-6) mobile
Padding: 32px (space-8) desktop
Border radius: 24px (radius-xl)
Border: 1px solid var(--border)
Gap between cards: 24px (space-6)
```

### Buttons
```css
Small:    padding: 8px 16px   (space-2 space-4)
Default:  padding: 12px 24px  (space-3 space-6)
Large:    padding: 20px 32px  (space-5 space-8)
Border radius: 16px (radius-lg)
Font weight: 600 (semibold)
```

### Sections
```css
Padding vertical (mobile):  48px (space-12)
Padding vertical (tablet):  64px (space-16)
Padding vertical (desktop): 80px (space-20)
Max width: 1280px
```

---

## 🎭 Interaction States

### Transitions
```css
Duration: 250ms
Timing: cubic-bezier(0.4, 0, 0.2, 1)
Properties: background-color, border-color, color, box-shadow, transform
```

### Hover States
```css
Buttons: 
  - Scale: 1.02
  - Shadow: Increase elevation
  - Background: Darken/lighten 5%

Cards:
  - Transform: translateY(-4px)
  - Shadow: elevation-3 → elevation-4
  - Border: Add primary color tint

Links:
  - Color: primary
  - Underline: 2px solid
```

### Focus States
```css
Outline: 2px solid var(--ring)
Outline offset: 2px
Border radius: Inherit from element
```

### Active States
```css
Transform: scale(0.98)
Duration: 100ms
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px  - Small tablets
md:  768px  - Tablets
lg:  1024px - Laptops
xl:  1280px - Desktops
2xl: 1536px - Large screens
```

### Container Widths
```css
< 640px:  100% - 32px padding
640px:    640px
768px:    768px
1024px:   1024px
1280px:   1280px
1536px:   1536px
```

---

## 🎨 Usage Examples

### Hero Section
```tsx
<section className="py-20 md:py-24 lg:py-32 px-4 sm:px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
      Master English
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground mb-12">
      AI-powered learning platform
    </p>
  </div>
</section>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-md hover:shadow-xl transition-all">
    {/* Card content */}
  </div>
</div>
```

### Button Group
```tsx
<div className="flex gap-4">
  <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
    Primary Action
  </button>
  <button className="px-8 py-4 bg-secondary border-2 border-border rounded-lg font-semibold hover:bg-muted transition-all">
    Secondary Action
  </button>
</div>
```

---

## ✅ Design Checklist

### Color Balance
- [ ] No pure white (#FFFFFF) backgrounds in light mode (use #F7F9FB)
- [ ] No pure black (#000000) backgrounds in dark mode (use #0A0E1A)
- [ ] All text meets WCAG AA contrast ratio (4.5:1)
- [ ] Primary color works in both themes
- [ ] Hover states are clearly visible

### Spacing & Alignment
- [ ] All spacing uses 8px base (multiples of 8)
- [ ] Consistent padding on all cards
- [ ] Equal margins between sections
- [ ] Content is visually centered
- [ ] Grid gaps are consistent

### Typography
- [ ] Clear hierarchy (H1 > H2 > H3 > Body)
- [ ] Consistent line heights
- [ ] Proper letter spacing on headings
- [ ] Readable font sizes (minimum 14px)
- [ ] Text baselines aligned

### Interactions
- [ ] Smooth transitions (250ms)
- [ ] Clear hover states
- [ ] Visible focus indicators
- [ ] Consistent active states
- [ ] Icons adapt to theme

### Responsive
- [ ] Mobile-first approach
- [ ] Breakpoints used correctly
- [ ] Touch-friendly targets (44px minimum)
- [ ] Readable on all screen sizes
- [ ] No horizontal scroll

---

## 🚀 Quick Reference

### Most Used Classes
```css
/* Spacing */
gap-4, gap-6, gap-8
p-4, p-6, p-8
py-12, py-16, py-20
mb-4, mb-6, mb-8

/* Typography */
text-sm, text-base, text-lg, text-xl
font-medium, font-semibold, font-bold
text-foreground, text-muted-foreground

/* Layout */
flex, flex-col, items-center, justify-between
grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-3

/* Colors */
bg-background, bg-card, bg-muted
text-foreground, text-primary
border-border

/* Effects */
rounded-lg, rounded-xl, rounded-2xl
shadow-md, shadow-lg, shadow-xl
hover:shadow-xl, hover:-translate-y-1
transition-all
```

---

**Last Updated**: December 30, 2025  
**Version**: 2.0 (Refined Professional Theme)
