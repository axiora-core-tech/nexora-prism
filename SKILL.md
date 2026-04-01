# Nexora Prism — UI/UX Design Skills

> Reference this file before creating, editing, or reviewing ANY component in Nexora Prism.
> It is the single source of truth for all visual and interaction decisions.
> For architecture, data models, and page specifications, see DESIGN_DOCUMENT.md.

---

## 1. Design Tokens — Always Use These

Never hardcode colors. Always reference `var(--p-*)` tokens or their utility classes.

### Text Classes (use these, not `text-white` or raw rgba)

| Class | Token | Usage |
|-------|-------|-------|
| `p-text-hi` | `--p-text-hi` | Headlines, primary text, large numbers |
| `p-text-body` | `--p-text-body` | Body copy, readable paragraphs |
| `p-text-mid` | `--p-text-mid` | Secondary labels, supporting info |
| `p-text-lo` | `--p-text-lo` | Section markers, overlines |
| `p-text-dim` | `--p-text-dim` | Hints, tertiary context, serif italic accent |
| `p-text-ghost` | `--p-text-ghost` | Ghost text, timestamps, barely visible labels |
| `p-text-whisper` | `--p-text-whisper` | Background watermarks, decorative text |

Inline style form: `style={{ color: 'var(--p-text-hi)' }}`

### Background Classes

| Class | Usage |
|-------|-------|
| `p-bg` | Page background |
| `p-bg-card` | Card surfaces |
| `p-bg-card-2` | Elevated card |
| `p-bg-surface` | Modals, popovers, tooltips |
| `p-bg-pill` | Small pill/tag backgrounds |
| `p-bg-input` | Form inputs |

Inline: `style={{ background: 'var(--p-bg-card)' }}`

### Border Classes

| Class | Opacity | Usage |
|-------|---------|-------|
| `p-border` | 5% | Default |
| `p-border-mid` | 10% | Hover state |
| `p-border-hi` | 20% | Active/selected |
| `p-border-emp` | 30% | Emphasised |

Inline: `style={{ border: '1px solid var(--p-border)' }}`

### Accent Colors (for dimension-specific elements)

| Color | Hex (dark) | Dimension / Use |
|-------|-----------|-----------------|
| Rose | `#f43f5e` | Output/Performance, critical status |
| Emerald | `#10b981` | Growth/Learning, positive states, on-track |
| Amber | `#f59e0b` | Motivation, warnings, watch status |
| Purple | `#c084fc` | Wellbeing, reviews, performance trend |
| Cyan | `#38bdf8` | Return/ROI, interactive elements, links, completed status |
| Orange | `#fb923c` | Risk/Attrition (dimension 6 only) |

Each accent has three tiers used as hex suffixes:
- Background: `${color}06` to `${color}12` (6–12% opacity)
- Border: `${color}12` to `${color}25` (12–25% opacity)
- Text: `${color}` (full), or `${color}cc` for slightly dimmed

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| On track / Healthy | Emerald | `#10b981` |
| Watch / At risk | Amber | `#f59e0b` |
| Critical / Off track | Rose | `#f43f5e` |
| Completed / Info | Cyan | `#38bdf8` |

### Score Colour Thresholds

Apply consistently across all components:

```
Score ≥ 90 → emerald    ROI ≥ 200% → emerald    Risk: High → rose + pulse-ring
Score ≥ 80 → cyan       ROI ≥ 150% → cyan       Risk: Medium → amber
Score ≥ 65 → amber      ROI ≥ 110% → amber      Risk: Low → emerald
Score < 65 → rose       ROI < 110% → rose
```

### Chart Tokens

Use `var(--p-chart-*)` for all chart elements:
- Grid: `var(--p-chart-grid)` — faint lines
- Axes: `var(--p-chart-axis)` — label text
- Track: `var(--p-chart-track)` — bar background
- Cursor: `var(--p-chart-cursor)` — hover region fill

---

## 2. Typography Rules

### Fonts

| Font | Use | Never Use For |
|------|-----|---------------|
| **Outfit** | All UI text, body copy, headings | Data values, code |
| **Cormorant Garamond** | ONLY for editorial italic accents in hero titles | Body text, labels |
| **Space Mono** | ALL data values, labels, timestamps, tags, badges, numbers | Paragraphs, long sentences |
| **Inter** | Landing page body copy only | App shell |

### Sizes

- **Minimum:** 10px anywhere, no exceptions
- **Labels/Tags:** `text-[11px] font-mono uppercase tracking-[0.2em]`
- **Body:** `text-sm` (14px) or `text-base` (16px)
- **Card titles:** `text-lg` or `text-xl`
- **Section headers:** `text-xl font-light`
- **Hero titles:** `.hero-title` class → `clamp(2.5rem, 8vw, 9rem)`
- **Data numbers:** `font-mono tabular-nums` + dimension color

### Key Patterns

**Section markers:**
```jsx
<p className="text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost">
  Label text
</p>
```

**With icon prefix:**
```jsx
<p className="text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost flex items-center gap-2">
  <Icon size={10} style={{ color: accent }} /> Label text
</p>
```

**Stat values:**
```jsx
<span className="font-mono text-2xl" style={{ color: accent }}>
  87<span className="text-[10px] p-text-dim">pt</span>
</span>
```

**Hero stat cluster:**
```jsx
<div className="text-right">
  <p className="text-[11px] uppercase tracking-[0.15em] mb-2 p-text-lo">Label</p>
  <p className="text-3xl font-light" style={{ color: accent }}>{value}</p>
</div>
```

**Insight badges:**
```jsx
<span className="text-[11px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
  style={{ background: `${color}12`, color }}>
  {type}
</span>
```

### The Serif Italic Accent Pattern

Every page hero title pairs a light sans word with an italic serif word:
```jsx
<h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
  Word <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Accent</span>
</h1>
```
The serif word is always the poetic/conceptual word. Examples: "The *Spectrum*", "Your *Team*", "Global *Models*", "Orbital *Presence*", "The *Race*".

---

## 3. Component Patterns

### Page Hero Structure

```jsx
<motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}}
  transition={{duration:0.8, ease:[0.16,1,0.3,1]}}
  className="mb-12 md:mb-16 border-b pb-10"
  style={{borderColor:'var(--p-border)'}}>
  
  {/* Back button — omit on Spectrum (it's home) */}
  <button onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group"
    style={{color:'var(--p-text-dim)'}}>
    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/> Back
  </button>
  
  {/* Section marker */}
  <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
     style={{color:'var(--p-text-lo)'}}>
    <IconName size={14} style={{color: accent}}/> Section description
  </p>
  
  {/* Title */}
  <h1 className="hero-title font-light" style={{color:'var(--p-text-hi)'}}>
    Word <span className="italic font-serif" style={{color:'var(--p-text-dim)'}}>Accent</span>
  </h1>
</motion.div>
```

### Card Pattern

```jsx
<div className="rounded-[2rem] p-6 md:p-8 relative overflow-hidden"
  style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
  {/* Optional ambient glow — NEVER use box-shadow */}
  <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
    style={{background:`rgba(accent, 0.06)`}}/>
  
  {/* Card header */}
  <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold 
      flex items-center gap-4 border-b p-border-mid pb-4 mb-6">
    <Icon size={12} style={{color: accent}}/> Card Title
  </h3>
  
  {/* Content */}
</div>
```

For standard-size cards use `rounded-2xl`. For small cards use `rounded-xl`.

### Insight/Action Card Pattern

```jsx
<div className="rounded-xl p-4 group transition-all duration-300 hover:scale-[1.005]"
  style={{
    background: `${color}06`,
    border: `1px solid ${color}12`,
    cursor: empId ? 'pointer' : 'default'
  }}>
  <div className="flex items-start gap-3">
    <Icon size={12} className="flex-shrink-0 mt-0.5" style={{color}}/>
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded mb-1.5 inline-block"
        style={{background:`${color}12`, color}}>
        {type}
      </span>
      <p className="text-sm font-light leading-snug mb-1" style={{color:'var(--p-text-hi)'}}>{title}</p>
      <p className="text-xs leading-relaxed" style={{color:'var(--p-text-dim)'}}>{detail}</p>
      {/* Action recommendation */}
      <div className="flex items-start gap-1.5 p-2 rounded-lg mt-2"
        style={{background:`${color}06`}}>
        <Lightbulb size={10} className="flex-shrink-0 mt-0.5" style={{color}}/>
        <p className="text-xs leading-relaxed" style={{color:`${color}cc`}}>{action}</p>
      </div>
    </div>
    {empId && <ChevronRight size={12} className="p-text-ghost group-hover:p-text-mid"/>}
  </div>
</div>
```

### Tab Selector Pattern

**Primary tabs (pill style):**
```jsx
<div className="flex gap-1 p-1 p-bg-card rounded-xl border p-border w-fit mb-8 flex-wrap">
  {tabs.map(tab => (
    <button key={tab.id} onClick={() => setActive(tab.id)}
      className={`px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
        active === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
      }`}>
      {tab.label}
    </button>
  ))}
</div>
```

**Sub-tabs (accent-coloured with icons):**
```jsx
<div className="flex gap-2 flex-wrap">
  {items.map(s => (
    <button key={s.id} onClick={() => setActive(s.id)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
      style={{
        background: active === s.id ? `${accent}12` : 'var(--p-bg-card)',
        border: `1px solid ${active === s.id ? accent+'25' : 'var(--p-border)'}`,
        color: active === s.id ? accent : 'var(--p-text-dim)'
      }}>
      <s.icon size={13}/><span className="text-xs font-light">{s.label}</span>
    </button>
  ))}
</div>
```

### Employee Avatar Pattern

```jsx
<img src={emp.avatar} alt={emp.name}
  className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 
             transition-all duration-500 flex-shrink-0"
  loading="lazy" decoding="async"/>
```

- Always `grayscale` default, `group-hover:grayscale-0` (except landing hero: `loading="eager"`)
- Always `loading="lazy" decoding="async"` and `object-cover rounded-full`
- Sizes: `w-6 h-6` (tiny, inline), `w-7 h-7` (scatter/list), `w-8 h-8` (table), `w-10 h-10` (card standard), `w-12 h-12` (profile/detail)
- Stacked: `-space-x-2`, descending `z-index`, `border-2` matching background

### Employee Link/Row Pattern

```jsx
<NavLink to={`/app/employee/${emp.id}`}
  className="flex items-center gap-4 py-3.5 group transition-colors hover:bg-white/[0.02] rounded-lg px-2 -mx-2"
  style={{borderBottom:'1px solid var(--p-border)'}}>
  <img src={emp.avatar} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-light" style={{color:'var(--p-text-hi)'}}>{emp.name}</p>
    <p className="text-xs" style={{color:'var(--p-text-dim)'}}>{emp.role}</p>
  </div>
  <span className="font-mono text-sm" style={{color: accent}}>{value}</span>
  <ArrowUpRight size={10} className="p-text-ghost group-hover:p-text-mid transition-colors"/>
</NavLink>
```

### Risk Indicator Pattern

```jsx
<div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${
  risk === 'High' ? 'bg-rose-500 text-rose-500' :
  risk === 'Medium' ? 'bg-amber-500 text-amber-500' : 
  'bg-emerald-500 text-emerald-500'
}`} />
```

For High risk, add `pulse-ring` class for animated pulsing.

### Empty State Pattern

Always use the branded `<EmptyState>` component. Never show bare "No data" text.

```jsx
import { EmptyState } from './ui/EmptyState';
// Variants: 'tasks', 'reviews', 'no-results', 'no-data', 'kpis', 'attendance', 'leaderboard'
<EmptyState variant="tasks" action={{ label: 'Create first task', onClick: handleCreate }} />
```

Each variant has a custom geometric SVG mark, on-brand headline, descriptive body, optional CTA.

### Expandable Row Pattern

```jsx
<div className="border-b select-none cursor-pointer" style={{borderColor:'var(--p-border)'}}
  onClick={() => toggle()}>
  <div className="flex items-center gap-4 px-6 md:px-12 lg:px-24 py-7">
    {/* Always-visible summary row */}
  </div>
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}}
        exit={{height:0, opacity:0}}
        transition={{duration:0.5, ease:[0.16,1,0.3,1]}}
        className="overflow-hidden">
        {/* Expanded detail */}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

---

## 4. Animation Rules

### Easing

| Easing | Value | Usage |
|--------|-------|-------|
| Primary | `[0.16, 1, 0.3, 1]` | Nearly everything — fast in, slow out |
| Spring | `{type:'spring', damping:25, stiffness:200}` | Layout animations (Leaderboard race, Dock) |
| Exit | `[0.4, 0, 1, 1]` | Faster, no overshoot — exit transitions |

### Entrance Timing

| Element | Duration | Delay |
|---------|----------|-------|
| Page hero | 0.8s | 0 |
| Content sections | 0.6–0.7s | 0.1–0.2s sequentially |
| List items | 0.3–0.5s | `index * 0.05` (max 0.5s total stagger) |
| Charts/visualizations | 1.0s+ | 0.3s |
| Scroll-triggered | 0.5–0.7s | Use `whileInView` with `viewport={{once:true}}` |

### AnimatePresence Rules

- Always wrap conditional renders in `<AnimatePresence>`
- Use `mode="wait"` for tab content switches (content that swaps)
- Omit `mode` for content that overlays
- Exit animations faster than entrances (0.2s vs 0.4s)
- Exit direction: opposite of entrance (enter from bottom → exit to top)

### Motion Value Restrictions

Do NOT animate these without strong justification:
- `filter: blur()` — GPU-expensive, only on route transitions
- `scale` — sparingly, range 0.94–1.06 max
- `rotate` — almost never (exception: Dock chevron 180°)

### Route Transition Animations

Handled by `Layout.tsx` — don't implement manually:
- Lateral: slide ±60px + 2px blur
- Dive: scale 0.94 + 6px blur
- Surface: scale 1.06 + 4px blur (reverse)
- Fade: y ±16px + 3px blur

---

## 5. Chart & Visualization Rules

### When to Use What

| Type | Use For |
|------|---------|
| **Hand-crafted SVG** | Novel interactions (magnetic, scatter, radar, orbital, prism) |
| **Recharts** | Standard charts (area, composed, bar, radar) where interactivity isn't the focus |
| **Canvas** | Only for high-frequency animation (waveform with `requestAnimationFrame`) |

### SVG Chart Conventions

- ViewBox-based responsive: `width="100%" viewBox="0 0 W H" preserveAspectRatio="xMidYMid meet"`
- Default viewBox widths: 600–700px
- Minimum font: `fontSize={10}` in SVG
- Font family: `fontFamily="'Space Mono',monospace"` for ALL SVG text
- Grid lines: `stroke="var(--p-chart-grid)"` or `rgba(255,255,255,0.03)`
- Axis labels: `fill="var(--p-chart-axis)"` or `rgba(255,255,255,0.2)`, brighter on hover
- Data colors: MUST match dimension accent color, never arbitrary

### Recharts Configuration

```jsx
<CartesianGrid strokeDasharray="3 3" stroke="var(--p-chart-grid)" vertical={false} />
<XAxis axisLine={false} tickLine={false} tick={{fill:'var(--p-chart-axis)', fontSize:10}} />
<Tooltip content={<CustomTooltip/>} />
```

### Tooltip Pattern (recharts)

```jsx
const CustomTooltip = ({active, payload, label}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-bg-surface border p-border-mid rounded-xl p-3 text-xs">
      <p className="p-text-lo mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{background: p.stroke || p.fill}}/>
          <span className="p-text-mid">{p.name}:</span>
          <span className="text-white font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 6. Responsive Rules

### Page Layout

- Always use `.page-wrap` for page containers (handles max-width, fluid padding, safe areas)
- For full-bleed sections (dimension rows, team constellation): use `px-6 md:px-12 lg:px-24` directly
- Bottom padding: `pb-32` minimum for dock clearance (or `.dock-clearance` class)

### Grid Patterns

| Type | Classes |
|------|---------|
| 2-column | `grid grid-cols-1 md:grid-cols-2 gap-3` |
| 3-column | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4` |
| 4-column | `grid grid-cols-2 md:grid-cols-4 gap-3` |
| Responsive-4 | `.grid-responsive-4` (1 → 2 → 4 across breakpoints) |

Always start with `grid-cols-1` or `grid-cols-2` for mobile.

### Breakpoint Behaviour

| Breakpoint | Changes |
|------------|---------|
| < 640px | Single column. Constellation snap-start. Dock labels hidden. Stats stack. |
| 768px | Hero → row. 2-col grids. |
| 1024px | 3-col cards. Full dimension row details. |
| 1280px | Employee detail splits 40/60. |
| 1920px+ | `page-wrap` → 1760px. Dock 1.3×. Gaps increase. |

### Touch Devices

- `@media (pointer: coarse)` restores native cursor, replaces `crosshair` with `pointer`
- Hover-dependent interactions must have tap fallbacks
- Constellation cards: `snap-x snap-mandatory`
- Floating nav dots hidden on touch

---

## 7. Light Mode Compliance

### Rules

1. NEVER use `text-white` class — use `p-text-hi` or `style={{color:'var(--p-text-hi)'}}`
2. NEVER hardcode `rgba(255,255,255,...)` for text — use token variables
3. SVG text on guaranteed-dark surfaces (Prism orbital, constellation card overlays) may use `fill="white"`
4. The `.prism-light .text-white` CSS override catches remaining Tailwind classes as a safety net
5. All new components must use `var(--p-*)` tokens for every color
6. Background accents: warm off-white `#f2f0eb`, not pure white
7. Accent colours are deepened in light mode (handled by token redefinition)

### Testing

Before shipping any component, mentally test: **"If the background were `#f2f0eb`, would every text element be readable?"**

---

## 8. Insight & Intelligence Pattern

### Insight Structure

```typescript
interface Insight {
  type: 'critical' | 'watch' | 'opportunity';
  title: string;       // Short, actionable headline
  detail: string;      // 1-2 sentences of context
  action: string;      // Specific recommended action
  color: string;       // Rose / Amber / Emerald
  icon: ComponentType; // Flame / Eye / Sparkles
  empId?: string;      // Links to employee if relevant
  empIds?: string[];   // For collective patterns
}
```

### Spectrum Detection Patterns

- **Burnout corridor:** performanceScore > 85 AND welfareScore < 65 (originally <70)
- **Flight risk:** attritionRiskPercentage > 50 AND roi > 150
- **Scaling past role:** learningProgress > performanceScore + 5 AND motivationScore > 75
- **Motivation decoupling:** motivationScore < 60 AND performanceScore > 70

### Attendance Detection Patterns (7 algorithms)

- **Consecutive absences:** 2+ consecutive absent days → critical
- **High absence count:** 3+ absences, no consecutive → watch
- **Heavy WFH ratio:** >50% remote of working days → watch
- **Monday/Friday pattern:** 3+ Mon/Fri with absence/leave/WFH → watch
- **Mass bunking:** 2+ employees absent/leave same date → critical
- **WFH surge:** 3+ employees remote same date → watch
- **Org-wide low presence:** avg presence < 85% → watch

### Rules

- Sort by severity: critical → watch → opportunity
- Max display: 4–6 cards
- Each card includes: type badge, icon, narrative, detail, action recommendation (with Lightbulb icon)
- Clickable if linked to employee (`empId`)

---

## 9. Landing Page Patterns

The landing page uses a different design language from the app shell. It is darker (`#010101` vs `#030303`), bolder, and uses cinematic effects not present in the app.

### Visual Layer Stack

1. Base: `bg-[#010101]` (NOT `--p-bg`)
2. Noise texture: SVG `feTurbulence` (fractalNoise, baseFrequency 0.95, 4 octaves), 5% opacity, `mix-blend-overlay`
3. Designer grid: 12-col desktop / 4-col mobile, `border-l border-white`, 3% opacity
4. Radial vignette: `radial-gradient(circle_at_center, transparent_40%, rgba(1,1,1,0.8)_120%)`
5. Registration marks: 4 corner brackets (`border-t-2 border-l-2` etc.), `border-white/50`
6. Custom cursor (landing-specific, separate from app cursor)

### Landing Typography

- Hero title: `text-[4rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] font-bold tracking-tighter leading-[0.85]`
- Gradient text: `bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-rose-200`
- Section titles: `text-4xl sm:text-6xl lg:text-[7rem] font-light tracking-tighter`
- Body: Inter, `text-lg text-zinc-300 font-light`
- Labels: `text-[10px] font-mono tracking-[0.2em] uppercase`

### Loader Pattern

2s duration, 20ms intervals. Gradient percentage (indigo→rose, Space Mono). 2px progress bar with glow. "Calibrating Core" label with `ping` animation. Exploding ring transition (10vw→150vw). Once per session (`sessionStorage` key `prism_intro_seen`).

### Stacking Sticky Cards

Each feature card is `sticky top-0`. Parent has `scrollYProgress`. Cards scale down as scroll progresses: `targetScale = 1 - (n - i) * 0.05`. Offset via `top: calc(-5vh + ${i * 30}px)`. Content (5/12) + parallax image (7/12). HUD overlay: center reticle (crosshair), data stream labels (mono 9px). RotateX tilt ±5° driven by scroll.

### SVG Journey Path

`min-height: 220vh`. Sinuous SVG path via `<path>` with cubic Béziers. Dashed guide at 10% opacity. Animated gradient stroke (indigo→purple→rose) via `pathLength` motion value tied to `scrollYProgress`. Milestones at 9%/43%/77%. Diamond-shaped dots with gradient fill + blur glow. Glassmorphic cards: `bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl`. Registration marks on card corners.

### Landing Buttons

- Primary CTA: `bg-white text-black font-bold`, `hover:scale-[1.05]`, gradient overlay on hover, `active:scale-[0.98]`
- Secondary CTA: `border-2 border-white/30`, `hover:border-indigo-400 hover:bg-indigo-500/20`, `bg-black/40 backdrop-blur-md`

### Massive Typography Footer

"PRISM" at `text-[18vw]`, `bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-900`, `mix-blend-difference`. Non-interactive (`pointer-events-none select-none`).

---

## 10. Naming Conventions

### Page Titles (hero)

Format: `Word <span italic serif dim>Accent</span>`

Existing examples: "The *Spectrum*", "Your *Team*", "Global *Models*", "Orbital *Presence*", "The *Race*", "Capital *Dynamics*"

The serif word is always the evocative/conceptual word, never the functional one.

### Section Labels

Format: `text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost`

Examples: "Cross-dimensional patterns", "Department Vectors", "Simulation Lab", "Temporal Breakdown", "Pattern detection — individual & collective"

### Interaction Names

Use evocative names, not generic:

| ✅ Use | ❌ Don't use |
|--------|-------------|
| Correlation Engine | What-If Sliders |
| Signal Scatter | Scatter Plot |
| Temporal Rewind | Time Slider |
| Ghost Horizon | Forecast Chart |
| Magnetic Trajectory | ROI Line Chart |
| The Race | Rankings Table |
| Neural Pathways | Learning Modules |
| Bio-Rhythms | Wellbeing Metrics |
| Temporal Grid | Calendar View |

New features MUST follow this pattern. See DESIGN_DOCUMENT.md §10 for full glossary.

### Attendance Vocabulary

| Prism Term | Meaning |
|------------|---------|
| In Orbit | Present (in office) |
| Remote | Work from home |
| Dark | Absent (unexplained) |
| Standby | Weekend |
| Protocol | Leave type ("PTO Protocol", "Sick Protocol") |

---

## 11. Do NOT Do List

- Do NOT use `box-shadow` — use `blur-[60-120px]` ambient blobs instead
- Do NOT use pie charts or donut charts
- Do NOT use 3D perspective on charts
- Do NOT use emoji in UI (exception: 👑 in Leaderboard race winner)
- Do NOT use `text-white` class — use `p-text-hi`
- Do NOT hardcode hex colors for text/borders — use `--p-*` tokens
- Do NOT use fonts below 10px
- Do NOT use recharts for novel interactions — hand-craft SVG
- Do NOT create separate pages for content that can be a tab within Spectrum
- Do NOT use `cursor: default` — the app uses custom cursor with `cursor: none`
- Do NOT put explanatory text inside SVG charts — keep labels minimal, explain in surrounding prose
- Do NOT use `position: fixed` for anything except the Dock
- Do NOT add a sidebar or top navigation bar — the Dock is the only nav
- Do NOT use `overflow: scroll` — always hide scrollbars with `scrollbarWidth: 'none'`
- Do NOT display employee photos without the grayscale-to-colour hover pattern
- Do NOT use unicode bullets (`•`, `→`) in data labels — use Lucide icons
- Do NOT animate with `setInterval` — use Motion or CSS `@keyframes`
- Do NOT hardcode dark mode colours without a `.prism-light` override
- Do NOT forget bottom padding for dock clearance (`pb-32` minimum)
- Do NOT show bare "No data" strings — use `<EmptyState>`

---

## 12. Adding a New Page: Checklist

1. Create `src/app/components/YourPage.tsx` with a named export
2. Add lazy import + route in `routes.tsx` (wrap with `withSuspense`)
3. If authenticated, nest under the `/app` layout route
4. Add route to `depthMap` and `posMap` in `Layout.tsx` for transition animations
5. Use `.page-wrap` as the root container
6. Add hero section: back button → overline (icon + label) → serif italic title → stats → border-bottom
7. Animate entrance: hero at delay 0, first section 0.1, second 0.2
8. Add a dock entry if primary navigation (edit `Dock.tsx` primary or feature nav)
9. Add an `EmptyState` variant in `EmptyState.tsx` if the page can have zero data
10. Use evocative naming (see §10) for the page title and all section labels
11. Ensure all images: `loading="lazy" decoding="async"`, grayscale pattern
12. Ensure all data values: `font-mono` + dimension colour
13. Ensure all colours use `var(--p-*)` tokens — test light mode
14. Test: dark mode, light mode, mobile (320px), tablet, desktop, TV (1920px)
15. Add `pb-32` minimum at page bottom for dock clearance

---

*This file is the single source of truth for Prism's UI/UX conventions. Reference it before building any new feature.*
