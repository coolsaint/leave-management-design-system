# Claude Code Agent Prompt — Leave Management System

You are working on a **Leave Management Application** built with React and TypeScript. The application follows **Emotional Minimalism** design principles—a warm, monochromatic, Apple-inspired aesthetic.

## Project Context

This is a mobile-first leave management system where:
- Employees request time off through a multi-step modal
- Managers approve/decline requests
- Team calendars show who's on leave
- Balances track available days per leave type

## Design System Rules (CRITICAL)

### Color Palette — MONOCHROMATIC ONLY
```javascript
const tokens = {
  bgPrimary: '#F6F6F8',     // Page background
  bgCard: '#FFFFFF',         // Cards
  textPrimary: '#1C1C1E',    // Primary text
  textSecondary: '#8E8E93',  // Secondary text, ALL icons
  textMuted: '#C7C7CC',      // Disabled, placeholders
  accent: '#3A3A3C',         // Buttons, selections
  border: '#E5E5EA',         // Borders
  valueText: '#636366',      // Stats, balances (softer than primary)
  
  // Soft calendar colors
  calendarSelected: '#7BA3C9', // Muted blue for selected dates
  calendarRange: '#D4E4F1',    // Very light blue for range
  calendarEmpty: '#E8E8EC',    // Faint outline for empty dots
  calendarText: '#B8B8BC',     // Soft gray for date numbers
};
```

**NEVER use:**
- Blue (#007AFF)
- Red (#FF3B30)
- Green (#34C759)
- Purple (#AF52DE)
- Any other colorful accents

### Typography Rules
- **Headings**: lowercase ("select dates." not "Select Dates")
- **Buttons**: lowercase ("continue" not "Continue")
- **Tiny labels**: UPPERCASE with letter-spacing ("SELECTED", "YOUR BALANCE")
- **No emoji** in UI text

### Border Radius
- Cards/Modals: 24px (`tokens.cardRadius`)
- Buttons: 999px (`tokens.buttonRadius`) — pill shape
- Inputs: 12px (`tokens.inputRadius`)

### Icons
- Library: Lucide React
- Size: w-4 h-4 or w-5 h-5
- Color: `tokens.textSecondary` (gray, NEVER colorful)
- Stroke: 1.5

---

## Dashboard Architecture

### Layout Constants
```javascript
const HEADER_HEIGHT = 72;
const SIDEBAR_WIDTH = 208;
const RIGHT_PANEL_WIDTH = 340;
```

### Dashboard State
```typescript
const [selectedNav, setSelectedNav] = useState('today');
const [selectedDay, setSelectedDay] = useState(17);
const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
const { isMobile, isTablet, isDesktop } = useResponsive();
```

### Dashboard Components

**1. Header**
- Logo badge + brand text
- Time-based greeting ("good morning.")
- Search bar (hidden on mobile)
- Notification bell with dot
- "new request" button

**2. Sidebar (208px)**
- Navigation items: today, requests (with badge), team, history
- Selected state: dark background, white text
- User profile section at bottom
- Off-canvas drawer on mobile/tablet

**3. Main Content**
- Week calendar strip with day selection
- Team availability card with stats grid
- Team list with member status

**4. Right Panel (340px)**
- Your Balance card (sick, casual, paternity, marriage - Shajgoj policy)
- Pending Requests with approve/decline buttons
- Inspirational quote card
- Hidden on mobile (content moves to main)

---

## Component Architecture

### RequestTimeOffModal — 3-Step Flow

```
Step 1: Select Leave Type
  └─→ List of leave types with availability
  └─→ Tap advances to Step 2

Step 2: Select Dates  
  └─→ DotCalendar component
  └─→ Shows selected range + day count
  └─→ "continue" button advances to Step 3

Step 3: Add Note
  └─→ Optional textarea
  └─→ Shows summary badge
  └─→ "submit request" button completes flow
```

### State Structure
```typescript
// Modal state
const [step, setStep] = useState<1 | 2 | 3>(1);
const [selectedLeaveType, setSelectedLeaveType] = useState('casual');
const [selectedStart, setSelectedStart] = useState<Date | null>(null);
const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
const [reason, setReason] = useState('');

// Computed
const selectedDays = selectedStart && selectedEnd 
  ? Math.abs(Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24))) + 1
  : selectedStart ? 1 : 0;
```

### Calendar Selection Logic
```typescript
const handleDateClick = (date: Date) => {
  if (isPast(date)) return;
  
  if (!selectedStart || (selectedStart && selectedEnd)) {
    // First click or reset: set start
    setSelectedStart(date);
    setSelectedEnd(null);
  } else {
    // Second click: set end
    setSelectedEnd(date);
  }
};
```

## File Locations

- Main component: `leave-modal-fixed.tsx`
- Design tokens: Defined at top of file
- Leave types config: `leaveTypes` array
- Navigation items: `navItems` array
- Team members: `teamMembers` array
- Pending requests: `pendingRequests` array

## Dashboard Data Structures

### Navigation Items
```typescript
const navItems = [
  { id: 'today', icon: Calendar, label: 'today' },
  { id: 'requests', icon: Clock, label: 'requests', badge: 2 },
  { id: 'team', icon: Users, label: 'team' },
  { id: 'history', icon: BarChart3, label: 'history' },
];
```

### Team Members
```typescript
interface TeamMember {
  name: string;
  initials: string;
  role: string;
  status: 'available' | 'leave';
  type?: string;      // Leave type if on leave
  until?: string;     // Return date if on leave  
  daysLeft?: number;  // Days remaining if available
}

const teamMembers = [
  { name: 'Sarah Chen', initials: 'SC', role: 'Designer', 
    status: 'leave', type: 'Vacation', until: 'Jan 20' },
  { name: 'Priya Patel', initials: 'PP', role: 'Developer', 
    status: 'available', daysLeft: 15 },
];
```

### Pending Requests
```typescript
interface PendingRequest {
  name: string;
  initials: string;
  dates: string;
  type: string;
  days: number;
}

const pendingRequests = [
  { name: 'Emma Wilson', initials: 'EW', dates: 'Jan 20-24', type: 'Vacation', days: 5 },
];
```

### Week Days (Calendar Strip)
```typescript
const weekDays = [
  { day: 'Su', date: 12, selected: false },
  { day: 'Mo', date: 13, selected: false },
  // ... 
  { day: 'Fr', date: 17, selected: true },
  { day: 'Sa', date: 18, selected: false },
];
```

### Stats Grid
```typescript
const stats = [
  { value: 6, label: 'available' },
  { value: 2, label: 'on leave' },
  { value: 2, label: 'pending' },
  { value: 8, label: 'this week' },
];
```

## Leave Policy Reference (Shajgoj Limited)

The application is configured for Shajgoj Limited's leave policy. Current leave types for a **male employee**:

| Leave Type | Days/Year | Key Rule |
|------------|-----------|----------|
| Sick | 14 | Doctor cert for 3+ days |
| Casual | 10 | Max 3 days at a time |
| Paternity | 14 | 7 before + 7 after delivery |
| Bereavement | 3 | Immediate post-death only |
| Marriage | 5 | Once in employment |

For female employees, replace Paternity with Maternity (4 months, twice in employment).

## Common Tasks

### Adding a New Leave Type
```typescript
// Add to leaveTypes array with note field for policy hints
{ 
  id: 'study', 
  label: 'Study Leave', 
  icon: GraduationCap, 
  maxDays: 10, 
  available: 10,
  note: 'Submit documents 15 days prior' // Optional policy hint
}
```

### Adding a New Navigation Item
```typescript
// Add to navItems array
{ id: 'settings', icon: Settings, label: 'settings' }
// Optionally with badge:
{ id: 'alerts', icon: Bell, label: 'alerts', badge: 3 }
```

### Adding a New Balance Type
```typescript
// In the balance items array (Right Panel) - with progress bar
{ label: 'Sick Leave', used: 4, total: 14 }

// Progress bar styling:
// - Height: 2px
// - Track: #E5E5EA
// - Fill: #B8B8BC
```

### Balance Card Progress Bar
```tsx
<div 
  className="w-full rounded-full overflow-hidden"
  style={{ height: '1px', backgroundColor: '#E5E5EA' }}
>
  <div 
    className="h-full rounded-full"
    style={{ 
      width: `${(remaining / total) * 100}%`,
      backgroundColor: '#B8B8BC',
    }}
  />
</div>
```

### Modifying Modal Steps
1. Update header title logic: `step === 1 ? '...' : step === 2 ? '...' : '...'`
2. Update content conditional rendering
3. Update footer button logic

### Styling a New Card
```tsx
<div
  className="p-5"
  style={{
    backgroundColor: tokens.bgCard,
    borderRadius: tokens.cardRadius,
    border: `1px solid ${tokens.border}`,
  }}
>
  <h3 
    className="text-[10px] uppercase tracking-wider mb-4"
    style={{ color: tokens.textSecondary }}
  >
    SECTION TITLE
  </h3>
  {/* Content */}
</div>
```

### Styling a Team Member Row
```tsx
<div 
  className="flex items-center gap-3 p-3 rounded-xl"
  style={{ 
    backgroundColor: isOnLeave ? tokens.bgPrimary : 'transparent',
  }}
>
  {/* Initials badge */}
  <div 
    className="w-8 h-8 flex items-center justify-center text-xs font-semibold"
    style={{ 
      backgroundColor: isOnLeave ? '#E5E5EA' : tokens.bgPrimary,
      borderRadius: tokens.buttonRadius,
      color: tokens.textSecondary,
    }}
  >
    {initials}
  </div>
  {/* Name, role, status */}
</div>
```

### Styling Action Buttons (Approve/Decline in Cards)
```tsx
{/* Primary action - dark */}
<button 
  className="flex-1 py-1.5 text-[10px] font-medium text-white lowercase"
  style={{ backgroundColor: tokens.accent, borderRadius: '10px' }}
>
  approve
</button>

{/* Secondary action - outlined */}
<button 
  className="flex-1 py-1.5 text-[10px] font-medium lowercase"
  style={{ 
    backgroundColor: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: '10px',
  }}
>
  decline
</button>
```

### Styling Primary CTA Buttons (Modal Continue/Submit)
```tsx
{/* Centered pill button - used in modals */}
<div className="flex justify-center mt-6">
  <button 
    onClick={handleAction}
    disabled={isDisabled}
    className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95 disabled:opacity-50"
    style={{ backgroundColor: tokens.accent }}
  >
    continue
  </button>
</div>
```

**Button Rules:**
- Modal CTAs: Centered, pill-shaped, compact (`px-12 py-2.5`)
- Card actions: Full-width within card, smaller (`py-1.5`)
- Always lowercase text
- Press animation: `active:scale-95`
- Never use fixed footers for buttons

## Code Style Preferences

### Tailwind + Inline Styles
- Use Tailwind for: spacing, flex, grid, text sizes
- Use inline styles for: colors from tokens, dynamic values

### Component Pattern
```tsx
function ComponentName({ prop1, prop2 }: Props) {
  // State
  const [state, setState] = useState(initial);
  
  // Computed values
  const computed = useMemo(() => ..., [deps]);
  
  // Handlers
  const handleAction = () => { ... };
  
  // Render
  return (
    <div style={{ backgroundColor: tokens.bgCard }}>
      ...
    </div>
  );
}
```

## Responsive Breakpoints

```typescript
const useResponsive = () => {
  // mobile: < 640px
  // tablet: 640-1023px  
  // desktop: ≥ 1024px
  
  return { isMobile, isTablet, isDesktop };
};
```

### Mobile Adaptations
- Modals become full-screen
- Single column layout
- Larger touch targets (min 44px)

## Testing Checklist

When making changes, verify:
- [ ] No hardcoded colors outside tokens
- [ ] All text follows case conventions
- [ ] Icons use textSecondary color
- [ ] Modal navigation works both directions
- [ ] Responsive at mobile/tablet/desktop
- [ ] Buttons have disabled states
- [ ] Date selection calculates days correctly

## Common Pitfalls to Avoid

1. **Using colorful icons** — Always `color: tokens.textSecondary`
2. **Capitalizing button text** — Use lowercase: "submit request"
3. **Forgetting step 3** — Note section is a separate step, not inline
4. **Hardcoding px values for colors** — Use tokens object
5. **Missing back navigation** — Each step needs back button except step 1

## Quick Fixes

### Icon too colorful?
```tsx
// ❌ Wrong
<Icon style={{ color: '#007AFF' }} />

// ✅ Correct  
<Icon style={{ color: tokens.textSecondary }} />
```

### Button not pill-shaped?
```tsx
// ❌ Wrong
style={{ borderRadius: '12px' }}

// ✅ Correct
style={{ borderRadius: tokens.buttonRadius }} // 999px
```

### Text capitalized?
```tsx
// ❌ Wrong
<button>Submit Request</button>

// ✅ Correct
<button>submit request</button>
```

---

## Integration Notes

### Odoo Backend Connection (Future)
- API base URL will be configured via environment variable
- Authentication via session token from Odoo
- Leave types will be fetched from Odoo HR module
- Employee data synced from Odoo contacts

### Data Flow
```
Odoo HR Module
     ↓
REST API (/api/leave-requests)
     ↓
React Frontend (this app)
     ↓
Local State + UI
```

---

When working on this project, always prioritize:
1. **Design consistency** — Match existing patterns exactly
2. **Mobile-first** — Test on 375px viewport
3. **Monochromatic** — No colorful accents
4. **User flow** — 3 clear steps for requests
