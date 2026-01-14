# Leave Management System — Complete Design & Development Specification

## Overview

A modern, mobile-first leave management application built with React, following **Emotional Minimalism** design principles inspired by Apple iOS and Notion aesthetics. The system enables employees to request time off and managers to approve/decline requests.

---

## Design Philosophy: Emotional Minimalism

### Core Principles
- **Warmth over coldness**: Soft off-white backgrounds instead of stark white
- **Restraint**: Minimal UI elements, generous whitespace
- **Monochromatic palette**: Grayscale with semantic meaning through typography weight, not color
- **Subtle depth**: Light borders and shadows instead of heavy elevation
- **Lowercase typography**: Friendly, approachable tone in labels and buttons
- **Rounded forms**: Pill buttons, rounded cards (24px radius)

### What to Avoid
- Colorful icons or accent colors (except for critical warnings)
- Heavy shadows or 3D effects
- ALL CAPS text (except tiny labels like "SELECTED")
- Dense information layouts
- Generic/corporate UI patterns

---

## Design Tokens

```javascript
const tokens = {
  // Backgrounds
  bgPrimary: '#F6F6F8',      // Page background - warm off-white
  bgCard: '#FFFFFF',          // Card surfaces
  
  // Typography
  textPrimary: '#1C1C1E',     // Headings, primary content
  textSecondary: '#8E8E93',   // Labels, secondary info, icons
  textMuted: '#C7C7CC',       // Placeholders, disabled states
  
  // Interactive
  accent: '#3A3A3C',          // Buttons, selected states (dark gray, not black)
  border: '#E5E5EA',          // Card borders, dividers
  
  // Calendar specific (soft colors)
  calendarSelected: '#7BA3C9', // Muted blue for selected dates
  calendarRange: '#D4E4F1',    // Very light blue for range
  calendarEmpty: '#E8E8EC',    // Faint outline for empty dots
  calendarText: '#B8B8BC',     // Soft gray for date numbers
  
  // Dashboard values (softer than primary)
  valueText: '#636366',        // Stats, balances - visible but not harsh
  
  // Semantic (use sparingly)
  warning: '#A1887F',         // Balance exceeded warnings
  
  // Radii
  cardRadius: '24px',         // Cards, modals
  buttonRadius: '999px',      // Pill buttons
  inputRadius: '12px',        // Input fields
  
  // Typography weights
  bold: 700,
  regular: 400,
};
```

---

## Typography System

| Element | Size | Weight | Color | Case |
|---------|------|--------|-------|------|
| Page titles | 24px | Bold | textPrimary | lowercase |
| Section headers | 14px | Semibold | textPrimary | lowercase |
| Card titles | 10px | Regular | textSecondary | UPPERCASE + tracking |
| Body text | 14px | Regular | textPrimary | Sentence case |
| Labels | 12px | Medium | textSecondary | lowercase |
| Tiny labels | 10px | Regular | textSecondary | UPPERCASE |
| Button text | 14px | Medium | white/textPrimary | lowercase |

---

## Layout Constants

```javascript
const HEADER_HEIGHT = 72;      // Fixed header height
const SIDEBAR_WIDTH = 208;     // w-52 = 208px  
const RIGHT_PANEL_WIDTH = 340; // Right sidebar
```

---

## Responsive Breakpoints

```javascript
const breakpoints = {
  mobile: '< 640px',    // Full-screen modals, single column, off-canvas sidebar
  tablet: '640-1023px', // Collapsible sidebar, 2 columns
  desktop: '≥ 1024px',  // Full 3-column layout
};
```

**useResponsive Hook:**
```typescript
function useResponsive() {
  const [screen, setScreen] = useState('desktop');
  
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width < 640) setScreen('mobile');
      else if (width < 1024) setScreen('tablet');
      else setScreen('desktop');
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);
  
  return {
    isMobile: screen === 'mobile',
    isTablet: screen === 'tablet',
    isDesktop: screen === 'desktop',
    screen,
  };
}
```

---

# DASHBOARD COMPONENTS

## Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (72px fixed)                                         │
│ [≡] [T.] teamflow.   good morning.   [🔍] [🔔] [+ new req] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┬───────────────────────────────┬───────────────┐ │
│ │ SIDEBAR │ MAIN CONTENT                  │ RIGHT PANEL   │ │
│ │ (208px) │ (flexible)                    │ (340px)       │ │
│ │         │                               │               │ │
│ │ □ today │ Week Calendar Strip           │ YOUR BALANCE  │ │
│ │ □ req 2 │ ◄ S M T W [T] F S ►           │ 💼 vacation 12│ │
│ │ □ team  │    january 2026               │ ⏰ sick     5 │ │
│ │ □ hist  │                               │ 👤 personal 3 │ │
│ │         │ ┌─────────────────────────┐   │               │ │
│ │         │ │ team availability.      │   │ PENDING    [2]│ │
│ │         │ │ ○ 6 Avail  ● 2 Leave    │   │ ┌───────────┐ │ │
│ │         │ │ [6][2][2][8] stats      │   │ │ EW Wilson │ │ │
│ │         │ └─────────────────────────┘   │ │ [apr][dec]│ │ │
│ │         │                               │ └───────────┘ │ │
│ │         │ ┌─────────────────────────┐   │               │ │
│ │─────────│ │ team overview    view > │   │ ┌───────────┐ │ │
│ │[👤]Suman│ │ [SC] Sarah Chen   ●     │   │ │ "Quote.." │ │ │
│ │Team Lead│ │ [MJ] Mike Johnson ●     │   │ │ Author    │ │ │
│ │         │ │ [PP] Priya Patel  ○     │   │ │ [☆] [↗]  │ │ │
│ └─────────┘ └─────────────────────────┘   │ └───────────┘ │ │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Header Component

### Visual Structure
```
┌────────────────────────────────────────────────────────────────┐
│ [≡] [T.] teamflow.     good morning.     [🔍___] [🔔] [+ new] │
│          leave management                                      │
└────────────────────────────────────────────────────────────────┘
```

### Responsive Visibility
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hamburger menu (≡) | Hidden | Visible | Visible |
| Logo + Brand text | Full | Full | Logo only |
| Greeting ("good morning.") | Visible | Hidden | Hidden |
| Search bar | Visible | Visible | Hidden |
| Notification bell | Visible | Visible | Visible |
| New request button | Full text | Full text | Icon only (+) |

### Logo Component
```tsx
<div className="flex items-center gap-2">
  {/* Logo badge */}
  <div 
    className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
    style={{ backgroundColor: tokens.accent, borderRadius: '8px' }}
  >
    T.
  </div>
  {/* Brand text - hidden on mobile */}
  <div className={isMobile ? 'hidden' : ''}>
    <h1 className="font-bold text-sm lowercase leading-tight">teamflow.</h1>
    <p className="text-[10px] leading-tight" style={{ color: tokens.textSecondary }}>
      leave management
    </p>
  </div>
</div>
```

### Greeting Logic
```typescript
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'good morning.';
  if (hour < 18) return 'good afternoon.';
  return 'good evening.';
};
```

### Search Input
```tsx
<div className="relative flex items-center">
  <Search 
    className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" 
    style={{ color: tokens.textSecondary }}
    strokeWidth={1.5}
  />
  <input
    type="text"
    placeholder="search..."
    className="w-32 md:w-44 pl-8 pr-3 py-2 text-xs lowercase placeholder:lowercase"
    style={{ 
      backgroundColor: tokens.bgPrimary,
      border: `1px solid ${tokens.border}`,
      borderRadius: tokens.inputRadius,
    }}
  />
</div>
```

### Notification Bell with Badge
```tsx
<button 
  className="w-9 h-9 flex items-center justify-center relative transition-colors hover:bg-gray-50"
  style={{ backgroundColor: tokens.bgPrimary, borderRadius: tokens.inputRadius }}
>
  <Bell className="w-4 h-4" style={{ color: tokens.textSecondary }} strokeWidth={1.5} />
  {/* Notification dot */}
  <span 
    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
    style={{ backgroundColor: tokens.accent }}
  />
</button>
```

### New Request Button
```tsx
<button 
  onClick={() => setIsRequestModalOpen(true)}
  className="flex items-center gap-1.5 px-3 md:px-4 py-2 text-white text-xs font-medium lowercase transition-all active:scale-[0.98]"
  style={{ backgroundColor: tokens.accent, borderRadius: tokens.buttonRadius }}
>
  <Plus className="w-3.5 h-3.5" strokeWidth={2} />
  <span className={isMobile ? 'hidden' : ''}>new request</span>
</button>
```

---

## 2. Sidebar Component

### Visual Structure
```
┌──────────────────┐
│ Navigation       │
│ ┌──────────────┐ │
│ │■ 📅 today    │ │  ← Selected (dark bg)
│ └──────────────┘ │
│ │ ⏰ requests 2│ │  ← Badge count
│ │ 👥 team      │ │
│ │ 📊 history   │ │
│                  │
│ ─────────────────│
│ User Profile     │
│ ┌──────────────┐ │
│ │[👤] Suman   ⚙│ │
│ │    Team Lead │ │
│ └──────────────┘ │
└──────────────────┘
```

### Navigation Items Data
```typescript
const navItems = [
  { id: 'today', icon: Calendar, label: 'today' },
  { id: 'requests', icon: Clock, label: 'requests', badge: 2 },
  { id: 'team', icon: Users, label: 'team' },
  { id: 'history', icon: BarChart3, label: 'history' },
];
```

### Navigation Item Component
```tsx
<button
  onClick={() => {
    setSelectedNav(item.id);
    if (!isDesktop) setSidebarOpen(false); // Auto-close on mobile
  }}
  className="w-full flex items-center gap-2 px-3 py-2.5 transition-all lowercase"
  style={{
    backgroundColor: selectedNav === item.id ? tokens.accent : 'transparent',
    color: selectedNav === item.id ? '#FFFFFF' : tokens.textSecondary,
    borderRadius: '10px',
    fontWeight: selectedNav === item.id ? tokens.bold : tokens.regular,
  }}
>
  <item.icon className="w-4 h-4" strokeWidth={1.5} />
  <span>{item.label}</span>
  {item.badge && (
    <span 
      className="ml-auto text-[10px] font-bold px-1.5 py-0.5"
      style={{
        backgroundColor: selectedNav === item.id ? tokens.bgCard : tokens.accent,
        color: selectedNav === item.id ? tokens.accent : tokens.bgCard,
        borderRadius: tokens.buttonRadius,
      }}
    >
      {item.badge}
    </span>
  )}
</button>
```

### Nav Item States
| State | Background | Text | Font Weight | Badge BG | Badge Text |
|-------|------------|------|-------------|----------|------------|
| Default | transparent | textSecondary | regular | accent | white |
| Selected | accent | white | bold | white | accent |
| Hover | gray-50 | textSecondary | regular | — | — |

### User Profile Section
```tsx
<div className="p-3 mt-auto" style={{ borderTop: `1px solid ${tokens.border}` }}>
  <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
    <div 
      className="w-8 h-8 flex items-center justify-center"
      style={{ backgroundColor: tokens.bgPrimary, borderRadius: tokens.buttonRadius }}
    >
      <User className="w-4 h-4" strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium">Suman</p>
      <p className="text-[10px]" style={{ color: tokens.textSecondary }}>Team Lead</p>
    </div>
    <Settings className="w-3.5 h-3.5" style={{ color: tokens.textSecondary }} strokeWidth={1.5} />
  </div>
</div>
```

### Mobile Sidebar Behavior
```tsx
// Sidebar container with responsive positioning
<aside 
  className={`
    ${isDesktop ? 'relative' : 'fixed left-0 top-0 z-40 h-full pt-[72px]'}
    ${!isDesktop && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
    transition-transform duration-300 flex flex-col
  `}
  style={{ 
    width: SIDEBAR_WIDTH,
    backgroundColor: tokens.bgCard,
    borderRight: `1px solid ${tokens.border}`,
  }}
>

// Backdrop overlay (when sidebar is open on mobile/tablet)
{!isDesktop && sidebarOpen && (
  <div 
    className="fixed inset-0 z-30 backdrop-blur-sm"
    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
    onClick={() => setSidebarOpen(false)}
  />
)}
```

---

## 3. Week Calendar Strip

### Visual Structure
```
     ┌─────────────────────────────────────────┐
  ◄  │  S    M    T    W    T   [F]   S       │  ►
     │ 12   13   14   15   16  [17]  18       │
     └─────────────────────────────────────────┘
                    january 2026
```

### Week Days Data
```typescript
const weekDays = [
  { day: 'Su', date: 12, selected: false },
  { day: 'Mo', date: 13, selected: false },
  { day: 'Tu', date: 14, selected: false },
  { day: 'We', date: 15, selected: false },
  { day: 'Th', date: 16, selected: false },
  { day: 'Fr', date: 17, selected: true },
  { day: 'Sa', date: 18, selected: false },
];
```

### Day Button Component
```tsx
<button
  onClick={() => setSelectedDay(day.date)}
  className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all"
  style={{
    backgroundColor: day.selected ? '#8E8E93' : 'transparent',
  }}
>
  <span 
    className="text-[10px] font-medium uppercase"
    style={{ color: day.selected ? 'rgba(255,255,255,0.6)' : '#858585' }}
  >
    {day.day.charAt(0)}
  </span>
  <span 
    className="text-sm font-semibold"
    style={{ color: day.selected ? '#FFFFFF' : '#B0B0B0' }}
  >
    {day.date}
  </span>
</button>
```

### Day Button States
| State | Background | Day Label Color | Date Number Color |
|-------|------------|-----------------|-------------------|
| Default | transparent | #858585 | #B0B0B0 |
| Selected | #8E8E93 (textSecondary) | rgba(255,255,255,0.6) | #FFFFFF |

### Navigation Arrows
```tsx
<button 
  className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors hover:bg-white/50"
  style={{ color: tokens.textSecondary }}
>
  <ChevronLeft className="w-4 h-4" />
</button>
```

---

## 4. Team Availability Card

### Visual Structure
```
┌─────────────────────────────────────────────┐
│           team availability.                 │
│                                             │
│    (○ 6 Available)    (● 2 On Leave)        │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │  6  │ │  2  │ │  2  │ │  8  │           │
│  │avail│ │leave│ │pend │ │week │           │
│  └─────┘ └─────┘ └─────┘ └─────┘           │
└─────────────────────────────────────────────┘
```

### Card Container
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
    className="text-center text-sm lowercase mb-4"
    style={{ color: tokens.textSecondary }}
  >
    team availability.
  </h3>
  {/* Legend and Stats */}
</div>
```

### Legend Pills
```tsx
<div className="flex items-center justify-center gap-3 mb-4">
  {/* Available - Hollow circle */}
  <div 
    className="flex items-center gap-2 px-4 py-2.5 text-sm"
    style={{ 
      backgroundColor: tokens.bgPrimary,
      borderRadius: tokens.buttonRadius,
    }}
  >
    <div 
      className="w-4 h-4 rounded-full"
      style={{ border: '2px solid #C7C7CC' }}
    />
    <span>6 Available</span>
  </div>
  
  {/* On Leave - Filled circle */}
  <div 
    className="flex items-center gap-2 px-4 py-2.5 text-sm"
    style={{ 
      backgroundColor: tokens.bgPrimary,
      borderRadius: tokens.buttonRadius,
    }}
  >
    <div 
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: '#8E8E93' }}
    />
    <span>2 On Leave</span>
  </div>
</div>
```

### Stats Grid
```tsx
const stats = [
  { value: 6, label: 'available' },
  { value: 2, label: 'on leave' },
  { value: 2, label: 'pending' },
  { value: 8, label: 'this week' },
];

<div className="flex gap-3">
  {stats.map((stat, i) => (
    <div 
      key={i}
      className="flex-1 text-center p-4 rounded-2xl"
      style={{ backgroundColor: tokens.bgPrimary }}
    >
      <p 
        className="text-2xl font-semibold mb-1"
        style={{ color: tokens.valueText }}
      >
        {stat.value}
      </p>
      <p 
        className="text-[10px] lowercase"
        style={{ color: tokens.textSecondary }}
      >
        {stat.label}
      </p>
    </div>
  ))}
</div>
```

---

## 5. Team List Card

### Visual Structure
```
┌─────────────────────────────────────────────┐
│ team overview                    view all → │
├─────────────────────────────────────────────┤
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│   [SC] Sarah Chen      Vacation    Until  ● │  ← On leave (highlighted)
│         Designer                   Jan 20   │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│   [MJ] Mike Johnson    Sick        Until  ● │  ← On leave
│         Developer                  Jan 19   │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                             │
│   [PP] Priya Patel              15 days   ○ │  ← Available
│         Developer                  left     │
│                                             │
│   [AK] Alex Kim                 10 days   ○ │  ← Available
│         DevOps                     left     │
└─────────────────────────────────────────────┘
```

### Team Members Data
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

const teamMembers: TeamMember[] = [
  { name: 'Sarah Chen', initials: 'SC', role: 'Designer', 
    status: 'leave', type: 'Vacation', until: 'Jan 20' },
  { name: 'Mike Johnson', initials: 'MJ', role: 'Developer', 
    status: 'leave', type: 'Sick', until: 'Jan 19' },
  { name: 'Priya Patel', initials: 'PP', role: 'Developer', 
    status: 'available', daysLeft: 15 },
  { name: 'Alex Kim', initials: 'AK', role: 'DevOps', 
    status: 'available', daysLeft: 10 },
  { name: 'Emma Wilson', initials: 'EW', role: 'QA', 
    status: 'available', daysLeft: 14 },
];
```

### Team Member Row Component
```tsx
<div 
  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
  style={{ 
    backgroundColor: member.status === 'leave' ? tokens.bgPrimary : 'transparent',
  }}
>
  {/* Initials Badge */}
  <div 
    className="w-8 h-8 flex items-center justify-center text-xs font-semibold"
    style={{ 
      backgroundColor: member.status === 'leave' ? '#E5E5EA' : tokens.bgPrimary,
      borderRadius: tokens.buttonRadius,
      color: tokens.textSecondary,
    }}
  >
    {member.initials}
  </div>
  
  {/* Name & Role */}
  <div className="flex-1">
    <p className="text-xs font-medium">{member.name}</p>
    <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
      {member.role}
    </p>
  </div>
  
  {/* Status Info */}
  <div className="text-right">
    {member.status === 'leave' ? (
      <>
        <p className="text-[10px] font-medium">{member.type}</p>
        <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
          Until {member.until}
        </p>
      </>
    ) : (
      <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
        {member.daysLeft} days left
      </p>
    )}
  </div>
  
  {/* Status Dot */}
  <div 
    className="w-2 h-2 rounded-full"
    style={{ 
      backgroundColor: member.status === 'leave' 
        ? tokens.textMuted      // Gray for on leave
        : tokens.textSecondary  // Darker for available
    }}
  />
</div>
```

### Row States
| Status | Row Background | Initials BG | Status Dot |
|--------|---------------|-------------|------------|
| On Leave | bgPrimary | #E5E5EA | textMuted (lighter) |
| Available | transparent | bgPrimary | textSecondary (darker) |

---

## 6. Right Panel - Your Balance (Highlights Style)

### Visual Structure
```
┌─────────────────────────────────────┐
│ YOUR BALANCE                        │
│                                     │
│ Sick Leave                      10  │
│ ████████████░░░░                    │
│                                     │
│ Casual                           7  │
│ ██████████░░░░░░                    │
│                                     │
│ Paternity                       14  │
│ ████████████████                    │
│                                     │
│ Marriage                         5  │
│ ████████████████                    │
└─────────────────────────────────────┘
```

### Balance Items Data (Shajgoj - Male Employee)
```typescript
const balanceItems = [
  { label: 'Sick Leave', used: 4, total: 14 },
  { label: 'Casual', used: 3, total: 10 },
  { label: 'Paternity', used: 0, total: 14 },
  { label: 'Marriage', used: 0, total: 5 },
];
```

### Balance Card Component (Highlights Style)
```tsx
<div 
  className="p-5"
  style={{ 
    backgroundColor: tokens.bgCard,
    borderRadius: tokens.cardRadius,
    border: `1px solid ${tokens.border}`,
  }}
>
  {/* Header - Uppercase small caps like other cards */}
  <h3 
    className="text-[10px] uppercase tracking-wider mb-4"
    style={{ color: tokens.textSecondary }}
  >
    Your Balance
  </h3>

  {/* Balance Items with Progress Bars */}
  <div className="space-y-4">
    {balanceItems.map((item, i) => {
      const remaining = item.total - item.used;
      const percentage = (remaining / item.total) * 100;
      return (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <span 
              className="text-xs"
              style={{ color: tokens.textPrimary }}
            >
              {item.label}
            </span>
            <span 
              className="text-xs font-medium"
              style={{ color: tokens.valueText }}
            >
              {remaining}
            </span>
          </div>
          {/* Progress Bar - Thin & Delicate */}
          <div 
            className="w-full rounded-full overflow-hidden"
            style={{ 
              height: '1px',
              backgroundColor: '#E5E5EA',
            }}
          >
            <div 
              className="h-full rounded-full"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: '#B8B8BC',
              }}
            />
          </div>
        </div>
      );
    })}
  </div>
</div>
```

### Progress Bar Styling
| Property | Value | Notes |
|----------|-------|-------|
| Width | w-full | Full container width |
| Height | 1px | Thin, delicate |
| Track color | #E5E5EA | Light gray track |
| Fill color | #B8B8BC | Light gray fill |
| Border radius | rounded-full | Pill shape |

**Design Notes:**
- Inspired by Stoic app's "Highlights" section
- Thin 1px bars feel elegant and minimal
- Single fill color keeps it clean (no conditional logic)
- Progress shows remaining (not used) to emphasize what's available
- Label + value on same row, progress bar below

---

## 7. Right Panel - Pending Requests

### Visual Structure
```
┌─────────────────────────┐
│ PENDING              [2]│
│                         │
│ ┌─────────────────────┐ │
│ │ [EW] Emma Wilson    │ │
│ │ Jan 20-24 • Vacation│ │
│ │                     │ │
│ │ [approve] [decline] │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ [DL] David Liu      │ │
│ │ Jan 22 • Personal   │ │
│ │                     │ │
│ │ [approve] [decline] │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Pending Requests Data
```typescript
interface PendingRequest {
  name: string;
  initials: string;
  dates: string;
  type: string;
  days: number;
}

const pendingRequests: PendingRequest[] = [
  { name: 'Emma Wilson', initials: 'EW', dates: 'Jan 20-24', type: 'Vacation', days: 5 },
  { name: 'David Liu', initials: 'DL', dates: 'Jan 22', type: 'Personal', days: 1 },
];
```

### Pending Request Card
```tsx
<div 
  className="p-3"
  style={{ 
    backgroundColor: tokens.bgPrimary,
    borderRadius: '16px',
  }}
>
  {/* Header */}
  <div className="flex items-center gap-2 mb-3">
    <div 
      className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold"
      style={{ 
        backgroundColor: '#E5E5EA',
        borderRadius: tokens.buttonRadius,
        color: tokens.textSecondary,
      }}
    >
      {req.initials}
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium">{req.name}</p>
      <p className="text-[10px]" style={{ color: tokens.textSecondary }}>
        {req.dates} • {req.type}
      </p>
    </div>
  </div>
  
  {/* Action Buttons */}
  <div className="flex gap-2">
    <button 
      className="flex-1 py-1.5 text-[10px] font-medium text-white lowercase"
      style={{ 
        backgroundColor: tokens.accent,
        borderRadius: '10px',
      }}
    >
      approve
    </button>
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
  </div>
</div>
```

---

## 8. Right Panel - Quote Card

### Visual Structure
```
┌─────────────────────────┐
│                         │
│ "When it comes to luck, │
│ you make your own."     │
│                         │
│ Bruce Springsteen       │
│                         │
│ [☆] [↗]                 │
└─────────────────────────┘
```

### Quote Card Component
```tsx
<div 
  className="p-5 text-white"
  style={{ 
    backgroundColor: tokens.accent,
    borderRadius: tokens.cardRadius,
  }}
>
  <p className="text-xs font-medium leading-relaxed mb-3">
    "When it comes to luck, you make your own."
  </p>
  <p className="text-[10px] opacity-60">Bruce Springsteen</p>
  
  {/* Action Buttons */}
  <div className="flex gap-2 mt-4">
    {[Star, Share2].map((Icon, i) => (
      <button 
        key={i}
        className="w-7 h-7 flex items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    ))}
  </div>
</div>
```

---

## Dashboard State Management

```typescript
export default function LeaveManagementDashboard() {
  // Navigation
  const [selectedNav, setSelectedNav] = useState('today');
  
  // Calendar
  const [selectedDay, setSelectedDay] = useState(17);
  
  // Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Responsive
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // ... component JSX
}
```

---

# MODAL COMPONENTS

## Request Time Off Modal

### 3-Step Flow
```
Step 1: Select Leave Type
    ↓ (tap type)
Step 2: Select Dates
    ↓ (tap "continue")
Step 3: Add Note (optional)
    ↓ (tap "submit request")
[Close Modal + Reset State]
```

### Modal State
```typescript
const [step, setStep] = useState<1 | 2 | 3>(1);
const [selectedLeaveType, setSelectedLeaveType] = useState('casual');
const [selectedStart, setSelectedStart] = useState<Date | null>(null);
const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
const [reason, setReason] = useState('');
```

### Computed Values
```typescript
// Calculate days (inclusive)
const selectedDays = selectedStart && selectedEnd 
  ? Math.abs(Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24))) + 1
  : selectedStart ? 1 : 0;

// Check balance
const currentLeaveType = leaveTypes.find(t => t.id === selectedLeaveType);
const exceedsBalance = selectedDays > currentLeaveType?.available;
```

### Leave Types Data (Shajgoj Limited - Male Employee Example)
```typescript
const leaveTypes = [
  { id: 'sick', label: 'Sick Leave', icon: Thermometer, maxDays: 14, available: 10, note: 'Doctor cert required for 3+ days' },
  { id: 'casual', label: 'Casual Leave', icon: Coffee, maxDays: 10, available: 7, note: 'Max 3 days at a time' },
  { id: 'paternity', label: 'Paternity Leave', icon: Baby, maxDays: 14, available: 14, note: '7 days before + 7 after delivery' },
  { id: 'bereavement', label: 'Bereavement', icon: Flower2, maxDays: 3, available: 3, note: 'Immediate family/relative' },
  { id: 'marriage', label: 'Marriage Leave', icon: Heart, maxDays: 5, available: 5, note: 'Once in employment' },
];
```

### Leave Policy Notes
Each leave type includes a `note` field with key policy rules from Shajgoj Limited's Code of Conduct:
- **Sick**: Requires doctor certificate for absences over 3 consecutive days
- **Casual**: Maximum 3 days at a time (5 in exceptional cases)
- **Paternity**: Split between pre and post delivery; cannot take consecutively
- **Bereavement**: Only for immediate post-death events
- **Marriage**: One-time benefit during employment

### Mobile vs Desktop
| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Container | Full-screen fixed | Centered popup (420px) |
| Backdrop | None (full coverage) | Dark overlay with blur |
| Header | Sticky with border | Inline with content |
| Buttons | Inline centered pills | Inline centered pills |
| Scrollbar | Hidden | Standard |

### Modal Button Pattern
Buttons in modals use centered pill style (NOT full-width blocks):

```tsx
{/* Continue/Submit button - centered pill */}
{selectedDays > 0 && (
  <div className="flex justify-center mt-6">
    <button 
      onClick={handleAction}
      disabled={exceedsBalance}
      className="px-12 py-2.5 rounded-full font-medium text-sm text-white transition-all active:scale-95 disabled:opacity-50"
      style={{ backgroundColor: tokens.accent }}
    >
      continue
    </button>
  </div>
)}
```

**Button Rules:**
- Centered horizontally (`flex justify-center`)
- Compact padding (`px-12 py-2.5`)
- Pill shape (`rounded-full`)
- Press animation (`active:scale-95`)
- No fixed footer - buttons flow with content
- Only show when action is available (e.g., dates selected)

### Mobile Scrollbar Hiding
```tsx
<div 
  className="flex-1 p-4 pb-8"
  style={{
    overflowY: 'auto',
    scrollbarWidth: 'none',      /* Firefox */
    msOverflowStyle: 'none',     /* IE/Edge */
  }}
>
```

---

## DotCalendar Component

### Date Selection Logic
```typescript
const handleDotClick = (date: Date) => {
  if (isPast(date)) return;
  
  if (!selectedStart || (selectedStart && selectedEnd)) {
    // First click OR reset: set start date
    setSelectedStart(date);
    setSelectedEnd(null);
  } else {
    // Second click: set end date
    setSelectedEnd(date);
  }
};
```

### Date States
| State | Background | Text Color |
|-------|------------|------------|
| Default | transparent | #B0B0B0 |
| Selected | #3A3A3C | white |
| In Range | #E8E8EA | textPrimary |
| Today (unselected) | transparent | #3A3A3C (bold) |
| Past | transparent | textMuted (50% opacity) |

---

# ICON USAGE

All icons from **Lucide React**. Always use monochromatic styling:

```tsx
<Icon 
  className="w-4 h-4" 
  style={{ color: tokens.textSecondary }}  // ALWAYS gray
  strokeWidth={1.5} 
/>
```

### Icon Mapping
| Purpose | Icon | Context |
|---------|------|---------|
| Vacation | Plane | Leave type |
| Sick | Thermometer | Leave type |
| Personal | Heart | Leave type |
| Parental | Baby | Leave type |
| Study | GraduationCap | Leave type |
| Today/Calendar | Calendar | Navigation |
| Requests/Time | Clock | Navigation, Balance |
| Team | Users | Navigation |
| History/Stats | BarChart3 | Navigation |
| Work/Vacation | Briefcase | Balance |
| User | User | Profile, Balance |
| Close | X | Modal close |
| Back | ChevronLeft | Navigation |
| Forward | ChevronRight | Navigation |
| Add | Plus | FAB, buttons |
| Search | Search | Header |
| Settings | Settings | User profile |
| Notifications | Bell | Header |
| Favorite | Star | Quote card |
| Share | Share2 | Quote card |

---

# QUICK REFERENCE

```
COLORS              RADII               SPACING
────────────────    ────────────────    ────────────────
bgPrimary: #F6F6F8  cardRadius: 24px    xs:  4px
bgCard:    #FFFFFF  buttonRadius: 999px sm:  8px
textPrim:  #1C1C1E  inputRadius: 12px   md:  16px
textSec:   #8E8E93                      lg:  24px
textMuted: #C7C7CC                      xl:  32px
accent:    #3A3A3C
border:    #E5E5EA

LAYOUT                          ICONS
────────────────────────────    ────────────────
Header:      72px height        Size: 14-20px
Sidebar:     208px width        Stroke: 1.5
Right Panel: 340px width        Color: #8E8E93

TYPOGRAPHY                      BUTTONS
────────────────────────────    ────────────────
Title:  18-24px  bold     lc    Modal CTA: centered pill
Header: 14px     semibold lc    Padding: px-12 py-2.5
Body:   13-14px  regular  Sc    Shape: rounded-full
Label:  12px     medium   lc    Animation: active:scale-95
Tiny:   10px     regular  UC    Card btns: flex-1 py-1.5
Button: 14px     medium   lc    No fixed footers!
```

---

# VERSION

| Version | Changes |
|---------|---------|
| 1.0 | Initial design system |
| 1.1 | Monochromatic icons, 3-step modal |
| 1.2 | Full dashboard documentation |
| 1.3 | Centered pill buttons, hidden scrollbar, no fixed footer |
| 1.4 | Soft calendar colors, smaller dots, Shajgoj policy, lighter week strip, softer values |
| 1.5 | Balance card redesign with progress bars (Stoic Highlights style) |
| 1.6 | 1px progress bars, fill #B8B8BC, track #E5E5EA, uppercase header consistency |
