# Mobile Responsive Patterns Reference

## Quick Pattern Guide for Result Software

### 1. Responsive Text Sizing
```jsx
// Scales automatically
<h1 className="text-2xl md:text-4xl lg:text-5xl">Heading</h1>
<p className="text-sm md:text-base lg:text-lg">Body text</p>

// Common breakpoints used:
// Mobile: text-sm/text-base
// Tablet (md): text-base/text-lg  
// Desktop (lg): text-lg/text-xl
```

### 2. Mobile Navigation Pattern
```jsx
// Import the component
import MobileMenu from '../components/MobileMenu';

// Use in your dashboard
const [sidebarOpen, setSidebarOpen] = useState(false);

// In JSX:
<div className="flex flex-col md:flex-row h-screen">
  {/* Mobile header with hamburger */}
  <div className="md:hidden flex items-center justify-between bg-slate-900 p-4">
    <h1>App Title</h1>
    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? <X /> : <Menu />}
    </button>
  </div>

  {/* Sidebar with overlay on mobile */}
  <div className={`fixed md:relative w-64 md:w-72 h-screen bg-slate-900 transition-transform ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}>
    {/* Navigation content */}
  </div>

  {/* Main content */}
  <div className="flex-1 overflow-y-auto p-4 md:p-10">
    {/* Page content */}
  </div>
</div>
```

### 3. Responsive Grid
```jsx
// Single column on mobile, multiple on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// With custom column spans
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  <div className="md:col-span-3">Sidebar</div>
  <div className="md:col-span-9">Content</div>
</div>
```

### 4. Responsive Padding & Spacing
```jsx
// Mobile first, then larger screens
<div className="p-4 md:p-8 lg:p-10">
  Padding: 16px (mobile) → 32px (tablet) → 40px (desktop)
</div>

<div className="space-y-2 md:space-y-4 lg:space-y-6">
  Gap between items: 8px → 16px → 24px
</div>

// Icon sizes scale with screen
<Icon size={16} className="md:hidden" /> {/* Mobile only */}
<Icon size={24} className="hidden md:block" /> {/* Desktop only */}
<Icon size={20} /> {/* All sizes */}
```

### 5. Responsive Button/Input Sizing
```jsx
<button className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
  Button Text
</button>

// Touch-friendly minimums on mobile
<input className="h-12 md:h-10 px-4 md:px-3 py-2 md:py-1" />
```

### 6. Responsive Tables
```jsx
// Use ResponsiveTable component
import ResponsiveTable from '../components/ResponsiveTable';

<ResponsiveTable 
  headers={['Name', 'Score', 'Grade']}
  rows={[
    ['John', '85', 'A'],
    ['Jane', '92', 'A+'],
  ]}
/>

// Or manual overflow
<div className="overflow-x-auto -mx-4 md:mx-0">
  <div className="inline-block min-w-full px-4 md:px-0">
    <table>...</table>
  </div>
</div>
```

### 7. Responsive Header/Footer
```jsx
// Flex direction changes
<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>Left content</div>
  <div>Right content</div>
</header>

// Stack on mobile, inline on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 8. Hidden/Visible on Breakpoints
```jsx
{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">Desktop only</div>

{/* Show on mobile, hide on desktop */}
<div className="md:hidden">Mobile only</div>

{/* Show on specific breakpoint */}
<div className="hidden md:flex lg:hidden">Tablet only</div>
```

### 9. Responsive Modal/Dialog
```jsx
import MobileModal from '../components/MobileModal';

<MobileModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  actions={[
    { label: 'Cancel', onClick: () => setShowModal(false) },
    { label: 'Save', onClick: handleSave, className: 'bg-accent-gold text-black' }
  ]}
>
  {/* Modal content */}
</MobileModal>

// Features:
// - Slides up from bottom on mobile
// - Centers on desktop
// - Scrollable content
// - Touch-friendly buttons
```

### 10. Responsive Display Utilities
```jsx
// Display none on mobile
<div className="hidden md:block">...</div>

// Display flex on mobile
<div className="flex md:hidden">...</div>

// Display none on desktop
<div className="md:hidden">...</div>

// Display grid with mobile/desktop variants
<div className="grid md:grid-cols-3 gap-4 md:gap-8">...</div>
```

## Tailwind Breakpoints Used

```
Mobile: < 640px (default, no prefix)
sm:    ≥ 640px
md:    ≥ 768px  (main breakpoint for tablet)
lg:    ≥ 1024px (main breakpoint for desktop)
xl:    ≥ 1280px
2xl:   ≥ 1536px
```

## Common Issues & Solutions

### Issue: Content too narrow on mobile
```jsx
// ❌ Wrong
<div className="w-full max-w-2xl mx-auto px-0">

// ✅ Correct
<div className="w-full max-w-2xl mx-auto px-4 md:px-6">
```

### Issue: Text unreadable on mobile
```jsx
// ❌ Wrong
<h1 className="text-4xl">Heading</h1>

// ✅ Correct
<h1 className="text-2xl md:text-4xl">Heading</h1>
```

### Issue: Buttons hard to tap
```jsx
// ❌ Wrong
<button className="px-2 py-1">Button</button>

// ✅ Correct
<button className="px-4 py-2 md:px-6 md:py-3 h-12 md:h-auto">Button</button>
```

### Issue: Tables overflow awkwardly
```jsx
// ❌ Wrong (no scrolling)
<table className="w-full">...</table>

// ✅ Correct (scrolls on mobile)
<div className="overflow-x-auto">
  <table className="w-full min-w-max">...</table>
</div>
```

### Issue: Sidebar overlaps content
```jsx
// ❌ Wrong (doesn't account for overlay)
<div className="flex">
  <div className="w-72">Sidebar</div>
  <div>Content</div>
</div>

// ✅ Correct (sidebar overlays on mobile)
<div className="flex flex-col md:flex-row">
  <div className="fixed md:relative md:w-72">Sidebar</div>
  <div className="flex-1">Content</div>
</div>
```

## Performance Tips

1. **Use `md:` prefix efficiently**
   - Apply mobile styles first
   - Only override with `md:` where needed

2. **Avoid excessive nesting**
   - Keeps CSS output smaller
   - Easier to maintain

3. **Mobile-first approach**
   - Default styles for mobile
   - Build up for larger screens

4. **Test on real devices**
   - Browser DevTools approximations
   - Real device testing is more accurate

## Accessibility Notes

- Ensure 44×44px minimum touch targets
- Maintain proper heading hierarchy
- Use semantic HTML elements
- Sufficient color contrast ratios
- Keyboard navigation support

## Quick Commands for Testing

```bash
# Start dev server
npm run dev

# Test mobile (open on phone)
# http://<your-machine-ip>:5173

# Use browser DevTools
# Chrome/Edge: Ctrl+Shift+M
# Firefox: Ctrl+Shift+M
# Safari: Cmd+Shift+M
```

---

**Last Updated**: April 2025
**Status**: Ready for mobile development ✅
