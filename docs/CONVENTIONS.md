# Project Conventions

## Code Style

### TypeScript
- Use functional components with hooks
- Prefer `const` over `let`
- Use explicit return types for functions
- Interface names: PascalCase
- Variable names: camelCase

### React Patterns
```tsx
// ✅ Preferred pattern
function ComponentName({ prop1, prop2 }: Props) {
  const [state, setState] = useState(initial);
  
  const handleAction = () => {
    // logic
  };
  
  return <div>...</div>;
}

// ❌ Avoid class components
class BadComponent extends React.Component { }
```

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `index.ts` or `types.ts`

## Styling Conventions

### Design Tokens (REQUIRED)
Always use tokens from the design system:

```tsx
// ✅ Correct
style={{ backgroundColor: tokens.bgCard }}
style={{ color: tokens.textSecondary }}
style={{ borderRadius: tokens.cardRadius }}

// ❌ Wrong - hardcoded values
style={{ backgroundColor: '#FFFFFF' }}
style={{ color: '#8E8E93' }}
style={{ borderRadius: '24px' }}
```

### Color Rules
| Use Case | Token | Hex |
|----------|-------|-----|
| Page background | `tokens.bgPrimary` | #F6F6F8 |
| Cards | `tokens.bgCard` | #FFFFFF |
| Primary text | `tokens.textPrimary` | #1C1C1E |
| Secondary text | `tokens.textSecondary` | #8E8E93 |
| Disabled/muted | `tokens.textMuted` | #C7C7CC |
| Buttons/accents | `tokens.accent` | #3A3A3C |
| Borders | `tokens.border` | #E5E5EA |

### Forbidden Colors
Never use these in UI (breaks monochromatic theme):
- ❌ `#007AFF` (blue)
- ❌ `#FF3B30` (red)
- ❌ `#34C759` (green)
- ❌ `#AF52DE` (purple)
- ❌ `#FF9500` (orange)

### Tailwind Usage
Use Tailwind for:
- Spacing: `p-4`, `m-2`, `gap-3`
- Flexbox: `flex`, `items-center`, `justify-between`
- Grid: `grid`, `grid-cols-7`
- Text size: `text-sm`, `text-xs`, `text-lg`
- Font weight: `font-medium`, `font-bold`

Use inline styles for:
- Colors (from tokens)
- Dynamic values
- Border radius (from tokens)

### Typography Case Rules
| Element | Case | Example |
|---------|------|---------|
| Page titles | lowercase | "request time off." |
| Section headers | lowercase | "team overview" |
| Buttons | lowercase | "continue" |
| Tiny labels | UPPERCASE | "SELECTED" |
| Body text | Sentence case | "12 of 15 days available" |

## Component Conventions

### Modal Pattern
```tsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal-content">
        {children}
      </div>
    </>
  );
}
```

### Form State Pattern
```tsx
const [formState, setFormState] = useState({
  step: 1,
  field1: '',
  field2: null,
});

// Update single field
setFormState(prev => ({ ...prev, field1: 'value' }));

// Reset
const resetForm = () => setFormState(initialState);
```

### Event Handler Naming
- `handleClick` — Generic click
- `handleSubmit` — Form submission
- `handleClose` — Modal/drawer close
- `handleSelect` — Selection actions
- `handleChange` — Input changes

### Button Patterns

**Modal CTA Buttons (Continue/Submit):**
```tsx
// ✅ Correct - Centered pill button
<div className="flex justify-center mt-6">
  <button 
    onClick={handleAction}
    className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95 disabled:opacity-50"
    style={{ backgroundColor: tokens.accent }}
  >
    continue
  </button>
</div>

// ❌ Wrong - Full-width block button
<button className="w-full py-4 rounded-2xl">
  continue
</button>
```

**Card Action Buttons (Approve/Decline):**
```tsx
<div className="flex gap-2">
  <button 
    className="flex-1 py-1.5 text-[10px] font-medium text-white lowercase"
    style={{ backgroundColor: tokens.accent, borderRadius: '10px' }}
  >
    approve
  </button>
  <button 
    className="flex-1 py-1.5 text-[10px] font-medium lowercase"
    style={{ backgroundColor: tokens.bgCard, border: `1px solid ${tokens.border}`, borderRadius: '10px' }}
  >
    decline
  </button>
</div>
```

**Button Rules:**
- Modal CTAs: Centered, pill-shaped, compact (`px-12 py-2.5`)
- Card actions: Full-width within card, smaller (`py-1.5`)
- Always lowercase text
- Press animation: `active:scale-95`
- Never use fixed footers for modal buttons

## Icon Conventions

### Standard Icon Props
```tsx
<Icon 
  className="w-4 h-4"           // Size
  style={{ color: tokens.textSecondary }}  // Color
  strokeWidth={1.5}              // Weight
/>
```

### Icon Sizes
- Navigation icons: `w-5 h-5`
- Card icons: `w-4 h-4`
- Inline icons: `w-3.5 h-3.5`

## Responsive Design

### Breakpoints
```typescript
mobile:  < 640px   // Single column, full-screen modals
tablet:  640-1023px // Two columns, reduced sidebar
desktop: ≥ 1024px  // Full three-column layout
```

### Mobile-First Approach
Always design for mobile viewport (375px) first, then enhance for larger screens.

## State Management

### Local State
Use `useState` for:
- Component-specific UI state
- Form data
- Modal open/close

### Computed Values
Use inline calculations or `useMemo` for derived state:
```tsx
const selectedDays = useMemo(() => {
  if (!start || !end) return start ? 1 : 0;
  return Math.abs(Math.ceil((end - start) / 86400000)) + 1;
}, [start, end]);
```

## Testing Checklist

Before committing changes:
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Works on mobile viewport (375px)
- [ ] Works on desktop viewport (1440px)
- [ ] All text follows case conventions
- [ ] No hardcoded colors
- [ ] Modal navigation works correctly
- [ ] Button disabled states work

## Git Conventions

### Commit Messages
```
feat: add note step to leave request modal
fix: correct date calculation for single-day selection  
style: update balance icons to monochromatic
refactor: extract calendar into separate component
docs: update design system documentation
```

### Branch Naming
- `feature/description`
- `fix/description`
- `refactor/description`
