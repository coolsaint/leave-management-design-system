# Leave Management System — Design Research

A comprehensive design system and prototype for a modern, mobile-first leave management application built with React. Follows **Emotional Minimalism** design principles inspired by Apple iOS and Stoic app aesthetics.

![Design System](https://img.shields.io/badge/Design_System-v2.1-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

---

## 📁 Project Structure

```
leave-management-design-system/
├── README.md                           # This file
├── index.html                          # Vite entry point
├── package.json                        # Dependencies and scripts
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
├── docs/
│   ├── DESIGN_SPEC.md                  # Complete design specification
│   ├── CLAUDE_CODE_PROMPT.md           # AI agent prompt for development
│   └── CONVENTIONS.md                  # Code conventions and patterns
├── src/
│   ├── main.tsx                        # React entry point
│   └── leave-modal.tsx                 # Working React prototype (v2.1)
├── policy/
│   └── shajgoj-leave-policy.md         # Leave policy reference (Shajgoj Ltd)
└── assets/
    └── (design inspiration images)
```

---

## 🎨 Design Philosophy: Emotional Minimalism

### Core Principles
- **Warmth over coldness** — Soft off-white backgrounds instead of stark white
- **Restraint** — Minimal UI elements, generous whitespace
- **Monochromatic palette** — Grayscale with semantic meaning through typography weight
- **Subtle depth** — Light borders and shadows instead of heavy elevation
- **Lowercase typography** — Friendly, approachable tone
- **Rounded forms** — Pill buttons, rounded cards (24px radius)

### What to Avoid
- Colorful icons or accent colors
- Heavy shadows or 3D effects
- ALL CAPS text (except tiny labels)
- Dense information layouts

---

## 🎯 Design Tokens

```javascript
const tokens = {
  // Backgrounds
  bgPrimary: '#F6F6F8',      // Page background
  bgCard: '#FFFFFF',          // Card surfaces
  
  // Typography
  textPrimary: '#1C1C1E',     // Headings
  textSecondary: '#8E8E93',   // Labels, icons
  textMuted: '#C7C7CC',       // Placeholders
  valueText: '#636366',       // Stats, balances
  
  // Interactive
  accent: '#3A3A3C',          // Buttons
  border: '#E5E5EA',          // Dividers
  
  // Calendar (soft colors)
  calendarSelected: '#7BA3C9', // Selected dates
  calendarRange: '#D4E4F1',    // Date range
  calendarEmpty: '#E8E8EC',    // Empty dots
  calendarText: '#B8B8BC',     // Date numbers
  
  // Radii
  cardRadius: '24px',
  buttonRadius: '999px',       // Pill shape
  inputRadius: '12px',
};
```

---

## 📱 Features

### Dashboard Components
- **Header** — Greeting, search, notifications, new request button
- **Sidebar** — Navigation with badges
- **Week Calendar Strip** — Horizontal date selector
- **Stats Cards** — Available, on leave, pending, this week
- **Team List** — Member avatars with status
- **Balance Card** — Progress bars showing leave remaining
- **Pending Requests** — Approve/decline actions

### Request Modal (3-Step Flow)
1. **Select Leave Type** — List with availability
2. **Select Dates** — Dot calendar (mobile) / Month calendar (desktop)
3. **Add Note** — Optional reason textarea

### Leave Types (Shajgoj Policy)
| Type | Days/Year | Past Dates | Key Rule |
|------|-----------|------------|----------|
| Sick | 14 | ✅ 7 days | Doctor cert for 3+ days |
| Casual | 10 | ❌ | Max 3 days at a time |
| Paternity | 14 | ✅ 90 days | 7 before + 7 after delivery |
| Bereavement | 3 | ✅ 7 days | Immediate post-death only |
| Marriage | 5 | ❌ | Once in employment |

---

## 🚀 Getting Started

### Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

### Use with Claude Code
1. Read `docs/CLAUDE_CODE_PROMPT.md` for the AI agent prompt
2. Follow `docs/CONVENTIONS.md` for code patterns
3. Reference `docs/DESIGN_SPEC.md` for complete specifications

---

## 📋 Version History

| Version | Changes |
|---------|---------|
| 1.0 | Initial design system |
| 1.1 | Monochromatic icons, 3-step modal |
| 1.2 | Full dashboard documentation |
| 1.3 | Centered pill buttons, hidden scrollbar |
| 1.4 | Soft calendar colors, Shajgoj policy |
| 1.5 | Balance card with progress bars |
| 1.6 | 1px progress bars, uppercase header consistency |
| 1.7 | Bug fixes (undefined variable), past date selection logic by leave type |
| 1.8 | DotCalendar redesign with card styling and legend capsules |
| 1.9 | Leave type badge integrated into summary card |
| 2.0 | Border refinement (2px → 1.5px) |
| 2.1 | Unified 1px border system throughout calendar |

---

## 🎨 Design Inspiration

- **Stoic App** — Soft colors, thin progress bars, highlights section
- **Apple iOS** — Rounded forms, subtle animations, warm grays
- **Notion** — Clean typography, minimal chrome

---

## 📄 License

This design research is for internal use. Feel free to adapt for your projects.

---

## 🤝 Contributing

1. Review the design spec before making changes
2. Follow the established token system
3. Maintain the monochromatic aesthetic
4. Test on both mobile and desktop viewports

---

*Built with ❤️ using Claude AI*
