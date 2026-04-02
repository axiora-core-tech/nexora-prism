# Nexora Prism — UI/UX Design Skills

> Reference this file before creating, editing, or reviewing ANY component in Nexora Prism.
> It is the single source of truth for all visual and interaction decisions.
> For architecture and data models: see DESIGN_DOCUMENT.md.
> For v3 AI platform specs, prompts, and build plan: see PRODUCT_ARCHITECTURE_v3.md.

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

### Border Classes

| Class | Opacity | Usage |
|-------|---------|-------|
| `p-border` | 5% | Default |
| `p-border-mid` | 10% | Hover state |
| `p-border-hi` | 20% | Active/selected |
| `p-border-emp` | 30% | Emphasised |

### Accent Colors (for dimension-specific elements)

| Color | Hex (dark) | Dimension / Use |
|-------|-----------|-----------------|
| Rose | `#f43f5e` | Output/Performance, critical status |
| Emerald | `#10b981` | Growth/Learning, positive states, on-track |
| Amber | `#f59e0b` | Motivation, warnings, watch status |
| Purple | `#c084fc` | Wellbeing, reviews, performance trend |
| Cyan | `#38bdf8` | Return/ROI, interactive elements, links, completed status |
| Orange | `#fb923c` | Risk/Attrition (dimension 6 only) |

Each accent has three tiers (hex suffix): Background `06`–`12`, Border `12`–`25`, Text full or `cc`.

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| On track / Healthy | Emerald | `#10b981` |
| Watch / At risk | Amber | `#f59e0b` |
| Critical / Off track | Rose | `#f43f5e` |
| Completed / Info | Cyan | `#38bdf8` |

### Score Colour Thresholds

```
Score ≥ 90 → emerald    ROI ≥ 200% → emerald    Risk: High → rose + pulse-ring
Score ≥ 80 → cyan       ROI ≥ 150% → cyan       Risk: Medium → amber
Score ≥ 65 → amber      ROI ≥ 110% → amber      Risk: Low → emerald
Score < 65 → rose       ROI < 110% → rose
```

### Chart Tokens

Use `var(--p-chart-*)` for all chart elements: `--p-chart-grid`, `--p-chart-axis`, `--p-chart-track`, `--p-chart-cursor`.

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
<p className="text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost">Label text</p>
```

**Stat values:**
```jsx
<span className="font-mono text-2xl" style={{ color: accent }}>
  87<span className="text-[10px] p-text-dim">pt</span>
</span>
```

**Insight badges:**
```jsx
<span className="text-[11px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
  style={{ background: `${color}12`, color }}>
  {type}
</span>
```

### The Serif Italic Accent Pattern

```jsx
<h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
  Word <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Accent</span>
</h1>
```
The serif word is always the poetic/conceptual word. Examples: "The *Spectrum*", "Your *Team*", "The *Race*", "Orbital *Presence*", "The *Meridian*", "Signal *Synthesis*".

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

### Insight/Action Card Pattern

```jsx
<div className="rounded-xl p-4 group transition-all duration-300 hover:scale-[1.005]"
  style={{ background: `${color}06`, border: `1px solid ${color}12` }}>
  <div className="flex items-start gap-3">
    <Icon size={12} className="flex-shrink-0 mt-0.5" style={{color}}/>
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded mb-1.5 inline-block"
        style={{background:`${color}12`, color}}>{type}</span>
      <p className="text-sm font-light leading-snug mb-1" style={{color:'var(--p-text-hi)'}}>{title}</p>
      <p className="text-xs leading-relaxed" style={{color:'var(--p-text-dim)'}}>{detail}</p>
      <div className="flex items-start gap-1.5 p-2 rounded-lg mt-2"
        style={{background:`${color}06`}}>
        <Lightbulb size={10} className="flex-shrink-0 mt-0.5" style={{color}}/>
        <p className="text-xs leading-relaxed" style={{color:`${color}cc`}}>{action}</p>
      </div>
    </div>
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
      }`}>{tab.label}</button>
  ))}
</div>
```

**Sub-tabs (accent-coloured with icons):**
```jsx
<button className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
  style={{
    background: active === s.id ? `${accent}12` : 'var(--p-bg-card)',
    border: `1px solid ${active === s.id ? accent+'25' : 'var(--p-border)'}`,
    color: active === s.id ? accent : 'var(--p-text-dim)'
  }}>
  <s.icon size={13}/><span className="text-xs font-light">{s.label}</span>
</button>
```

### Employee Avatar Pattern

```jsx
<img src={emp.avatar} alt={emp.name}
  className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 
             transition-all duration-500 flex-shrink-0"
  loading="lazy" decoding="async"/>
```
- Always `grayscale` + `group-hover:grayscale-0`. Always `loading="lazy" decoding="async"`.
- Sizes: `w-6` tiny, `w-7` scatter, `w-8` table, `w-10` card, `w-12` profile.

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
</NavLink>
```

### Risk Indicator + Expandable Row

*(Unchanged from current patterns — see existing implementations.)*

### Empty State Pattern

Always use `<EmptyState>`. Never show bare "No data" text.

**Existing variants (7):** `tasks`, `reviews`, `no-results`, `no-data`, `kpis`, `attendance`, `leaderboard`

**v3 planned variants (5):**
- `genesis` — "No vision uploaded yet. Share your business plan to begin."
- `meridian` — "No roadmap active. Complete Genesis to generate your Meridian."
- `checkpoint` — "All clear. No items pending approval."
- `synthesis` — "No reports generated yet. Choose a template or describe what you need."
- `luminary` — "No conversations yet. Start your first standup to begin building your Echo Trail."

Each variant gets a custom geometric SVG mark, on-brand headline, body text, and optional CTA.

---

## 4. v3 Component Patterns — Luminary & AI Features

### Luminary Floating Button

```jsx
<button className="fixed bottom-24 right-6 z-50 group"
  onClick={openLuminary}>
  <div className="w-14 h-14 rounded-full flex items-center justify-center
    bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
    border border-cyan-400/20 backdrop-blur-xl
    group-hover:border-cyan-400/40 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
    transition-all duration-500">
    <LuminaryIcon size={22}/>
  </div>
  {/* Pulse dot when pending standup */}
  {hasPending && <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-amber-500 pulse-ring"/>}
</button>
```

### HUD Context Panel (Luminary)

Floating panels at screen edges during Luminary conversations:

```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: staggerIndex * 0.08, type: 'spring', damping: 25 }}
  className="absolute left-6 top-1/4 w-56 rounded-2xl p-4 backdrop-blur-xl"
  style={{
    background: 'var(--p-bg-card)',
    border: '1px solid var(--p-border)',
    boxShadow: 'none' // NEVER box-shadow — use blur blobs
  }}>
  <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost mb-3">
    Active tasks
  </h4>
  {/* Task list */}
</motion.div>
```

### Conversation Message Card (Luminary)

Floating card style for hybrid transcript:

```jsx
{/* Luminary message */}
<motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}
  className="max-w-md rounded-2xl p-4 ml-4"
  style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
  <div className="flex items-center gap-2 mb-2">
    <img src={avatarThumb} className="w-5 h-5 rounded-full"/>
    <span className="text-[11px] font-mono p-text-ghost">{managerName}</span>
  </div>
  <p className="text-sm p-text-body leading-relaxed">{message}</p>
</motion.div>

{/* Employee message */}
<motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}
  className="max-w-md rounded-2xl p-4 mr-4 ml-auto"
  style={{background:'var(--p-cyan-lo)', border:'1px solid var(--p-cyan-border)'}}>
  <p className="text-sm p-text-body leading-relaxed">{message}</p>
  {audioUrl && <VoiceWaveform url={audioUrl}/>}
</motion.div>
```

### Task Action Card (in-conversation creation)

When Luminary creates a task during conversation:

```jsx
<motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}
  className="max-w-sm rounded-xl p-4 mx-auto my-2 border-l-2"
  style={{
    background: 'var(--p-bg-card)',
    border: '1px solid var(--p-border)',
    borderLeftColor: '#38bdf8'
  }}>
  <div className="flex items-center gap-2 mb-2">
    <Sparkles size={10} style={{color:'#38bdf8'}}/>
    <span className="text-[11px] font-mono uppercase tracking-[0.15em]" style={{color:'#38bdf8'}}>
      Task created
    </span>
  </div>
  <p className="text-sm p-text-hi font-light mb-1">{taskTitle}</p>
  <p className="text-xs p-text-dim mb-3">{taskDescription}</p>
  <div className="flex gap-2">
    <button className="text-xs font-mono px-3 py-1 rounded-lg"
      style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981'}}>
      Confirm
    </button>
    <button className="text-xs font-mono px-3 py-1 rounded-lg"
      style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)', color:'var(--p-text-dim)'}}>
      Modify
    </button>
  </div>
</motion.div>
```

### Echo Trail (conversation timeline dots)

```jsx
<div className="flex items-center gap-1 py-4">
  {standups.map((s, i) => (
    <div key={i} className="group relative">
      <div className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all group-hover:scale-150 ${
        s.status === 'completed' && s.sentiment === 'positive' ? 'bg-emerald-500' :
        s.status === 'completed' && s.sentiment === 'concerned' ? 'bg-amber-500' :
        s.status === 'missed' ? 'bg-rose-500' : 'bg-white/10'
      }`}/>
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="p-bg-surface border p-border-mid rounded-lg p-2 text-[11px] font-mono whitespace-nowrap">
          <span className="p-text-lo">{s.date}</span>
          <span className="ml-2" style={{color: sentimentColor}}>{s.topTopic}</span>
        </div>
      </div>
    </div>
  ))}
</div>
```

### AI Source Badge (Tasks)

Fading badge on AI-generated tasks:

```jsx
{task.source !== 'manual' && !task.accepted && (
  <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full
    bg-cyan-500/8 text-cyan-400 border border-cyan-400/15 transition-opacity"
    style={{ opacity: task.accepted ? 0 : 1 }}>
    AI suggested
  </span>
)}
{/* Non-editable source field always in task detail, regardless of badge */}
<span className="text-[10px] font-mono p-text-ghost">
  Source: {task.source}
</span>
```

### VoiceInput Component

```jsx
<div className="flex items-center gap-3 p-3 rounded-2xl"
  style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
  
  {/* Mic button — hold to talk or toggle */}
  <button
    onMouseDown={startRecording} onMouseUp={stopRecording}
    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
      isRecording 
        ? 'bg-rose-500/15 border border-rose-400/30 text-rose-400 scale-110' 
        : 'p-bg-card-2 border p-border-mid p-text-dim hover:p-text-hi'
    }`}>
    <Mic size={18} />
    {isRecording && <div className="absolute inset-0 rounded-full pulse-ring text-rose-400"/>}
  </button>
  
  {/* Live transcript — word-by-word as employee speaks */}
  <div className="flex-1 min-h-[40px]">
    {isRecording ? (
      <p className="text-sm p-text-body animate-pulse">{liveTranscript}<span className="text-cyan-400">|</span></p>
    ) : (
      <p className="text-sm p-text-ghost">Hold to speak or type below…</p>
    )}
  </div>
  
  {/* Mode toggle */}
  <button onClick={toggleMode}
    className="text-[11px] font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg p-text-dim hover:p-text-hi"
    style={{ border: '1px solid var(--p-border)' }}>
    {mode === 'voice' ? 'Text' : 'Voice'}
  </button>
</div>
```

### NotificationBell Component

```jsx
<button className="relative p-2 rounded-full p-text-dim hover:p-text-hi transition-colors"
  onClick={toggleNotificationPanel}>
  <Bell size={18} />
  {unreadCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full 
      bg-rose-500 text-white text-[10px] font-mono flex items-center justify-center px-1">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</button>

{/* Notification panel — slides down from bell position */}
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl p-2"
      style={{ background: 'var(--p-surface)', border: '1px solid var(--p-border-mid)', scrollbarWidth: 'none' }}>
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] p-text-ghost px-3 py-2">
        Notifications
      </p>
      {notifications.map(n => (
        <div key={n.id} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:p-bg-card transition-colors cursor-pointer"
          style={{ borderBottom: '1px solid var(--p-border)' }}>
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-cyan-400' : 'bg-transparent'}`}/>
          <div className="flex-1 min-w-0">
            <p className="text-sm p-text-body leading-snug">{n.title}</p>
            <p className="text-[11px] font-mono p-text-ghost mt-1">{n.timestamp}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 5. Animation Rules

### Easing

| Easing | Value | Usage |
|--------|-------|-------|
| Primary | `[0.16, 1, 0.3, 1]` | Nearly everything |
| Spring | `{type:'spring', damping:25, stiffness:200}` | Layout (The Race, Dock) |
| Exit | `[0.4, 0, 1, 1]` | Faster, no overshoot |

### Entrance Timing

| Element | Duration | Delay |
|---------|----------|-------|
| Page hero | 0.8s | 0 |
| Content sections | 0.6–0.7s | 0.1–0.2s sequentially |
| List items | 0.3–0.5s | `index * 0.05` (max 0.5s total) |
| Charts | 1.0s+ | 0.3s |
| Scroll-triggered | — | `whileInView` + `viewport={{once:true}}` |
| Dawn Sequence (Luminary) | 2.2s total | 5 stages, see §5.1 |

### AnimatePresence Rules

- Wrap conditional renders in `<AnimatePresence>`
- `mode="wait"` for tab switches
- Exit faster than entrance (0.2s vs 0.4s)
- Exit direction: opposite of entrance

### Dawn Sequence — Luminary Entry Animation

5 choreographed stages, ~2.2s total. **Must feel warm, welcoming, human.**

| Stage | Time | What Happens | Emotion |
|-------|------|-------------|---------|
| 1: The Breath | 0–400ms | Prism UI scales to 0.96, blurs 8px, fades to 40%. Dock sinks. | Making space |
| 2: The Warmth | 300–800ms | Warm radial gradient blooms (amber/rose 3%). Two Prism rings pulse outward then dissolve. | Lamp turning on |
| 3: The Presence | 700–1400ms | Avatar materialises: opacity 0→1, scale 0.92→1.0, y +30→0. Light sweep across face. Idle animation begins. | Someone just looked up |
| 4: The Greeting | 1200–1800ms | Avatar speaks contextual greeting. Text card appears. Voice plays. | First words |
| 5: The Room Forms | 1600–2200ms | HUD panels glide in (spring, stagger 80ms). Mic input area fades in with pulse. | Ready to talk |

**Exit:** Reverse 5→1 in 0.8s (3× faster). Quick, not ceremonial.

---

## 6. Chart & Visualization Rules

### When to Use What

| Type | Use For |
|------|---------|
| **Hand-crafted SVG** | Novel interactions (Magnetic, Scatter, Radar, Orbital, Echo Trail) |
| **Recharts** | Standard charts (area, composed, bar, radar) |
| **Canvas** | High-frequency animation only (waveform) |

### SVG Chart Conventions

- ViewBox: `width="100%" viewBox="0 0 W H" preserveAspectRatio="xMidYMid meet"`
- Min font: `fontSize={10}`. Font: `fontFamily="'Space Mono',monospace"`
- Grid: `stroke="var(--p-chart-grid)"`. Axis: `fill="var(--p-chart-axis)"`
- Data colours: dimension accent, never arbitrary

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

## 7. Responsive Rules

### Page Layout

- `.page-wrap` for containers. Full-bleed: `px-6 md:px-12 lg:px-24`.
- Bottom padding: `pb-32` minimum for dock. Luminary overlay: full-screen, no dock visible.

### Grid Patterns

| Type | Classes |
|------|---------|
| 2-column | `grid grid-cols-1 md:grid-cols-2 gap-3` |
| 3-column | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4` |
| 4-column | `grid grid-cols-2 md:grid-cols-4 gap-3` |

### Breakpoint Behaviour

| Breakpoint | Changes |
|------------|---------|
| < 640px | Single column. Dock labels hidden. Luminary: full-screen only. |
| 768px | Hero → row. 2-col grids. |
| 1024px | 3-col cards. Full dimension rows. |
| 1280px | Employee detail 40/60 split. |
| 1920px+ | `page-wrap` 1760px. Dock 1.3×. |

### Touch Devices

`@media (pointer: coarse)`: native cursor restored, `crosshair` → `pointer`, floating nav hidden. Constellation: `snap-x snap-mandatory`.

---

## 8. Light Mode Compliance

1. NEVER use `text-white` — use `p-text-hi` or `style={{color:'var(--p-text-hi)'}}`
2. NEVER hardcode `rgba(255,255,255,...)` for text
3. SVG on guaranteed-dark surfaces (Prism orbital, constellation cards) may use `fill="white"`
4. `.prism-light .text-white` CSS override catches remaining Tailwind classes
5. All new components must use `var(--p-*)` tokens
6. Luminary: Dawn Sequence warm gradient uses hardcoded amber/rose (intentional — always dark background)

**Test:** "If the background were `#f2f0eb`, would every text element be readable?"

---

## 9. Insight & Intelligence Pattern

### Insight Structure

```typescript
interface Insight {
  type: 'critical' | 'watch' | 'opportunity';
  title: string; detail: string; action: string;
  color: string; icon: ComponentType;
  empId?: string; empIds?: string[];
}
```

### Spectrum Illuminations (v3: AI-generated)

Same card layout as current Intelligence section. Content AI-generated by Claude. Richer, contextual, references trends over time. Can now reference Luminary standup data, task completion, and Meridian progress.

Detection patterns: burnout corridor (perf>85 + welfare<65), flight risk (attrition>50 + roi>150), scaling past role (learn>perf+5 + motiv>75), motivation decoupling (motiv<60 + perf>70).

### Attendance Patterns (7 algorithms)

Consecutive absences, high absence count, heavy WFH, Monday/Friday, mass bunking, WFH surge, org-wide low presence. v3 adds: missed standup streak, low standup engagement (integrated into same panel).

Sort by severity: critical → watch → opportunity. Max 4–6 cards.

---

## 10. Landing Page Patterns

The landing page uses a different design language. Darker (`#010101`), bolder, cinematic.

### Visual Layer Stack

1. `bg-[#010101]` (NOT `--p-bg`)
2. Noise: SVG fractalNoise, 5% opacity, `mix-blend-overlay`
3. Grid: 12-col / 4-col, 3% opacity
4. Vignette: `radial-gradient(circle, transparent_40%, rgba(1,1,1,0.8)_120%)`
5. Registration marks: corner brackets, `border-white/50`

### Landing Typography

Hero: `text-[4rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] font-bold tracking-tighter`.
Gradient: `bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-rose-200`.
Body: Inter, `text-lg text-zinc-300 font-light`.

### Key Patterns

- **Loader:** 2s counter, indigo→rose gradient, exploding ring. Once per session.
- **Sticky cards:** `sticky top-0`, scale `1 - (n-i)*0.05`, HUD reticle, RotateX ±5°.
- **SVG journey:** 220vh, `pathLength` on scroll, 3 milestone nodes, glassmorphic cards.
- **Footer:** "PRISM" 18vw, `mix-blend-difference`.

---

## 11. Naming Conventions

### The Prism Naming Universe

All names draw from: **optics, light, signal processing, navigation, space/physics.**

#### v3 Screen Names

| Name | Route | Meaning |
|------|-------|---------|
| **Genesis** | `/app/onboard` | The origin of all signals |
| **Meridian** | `/app/roadmap` | The guiding reference line |
| **Luminary** | Floating overlay | A source of light that inspires |
| **Checkpoint** | `/app/approvals` | Verified before moving forward |
| **Synthesis** | `/app/reports` | Combining signals into unified output |
| **Calibration** | `/app/admin` | Tuning the instrument |

#### v3 Section / Feature Names

| Name | Location | Meaning |
|------|----------|---------|
| **Illuminations** | Spectrum | Light revealing hidden patterns (AI insight cards) |
| **Meridian Pulse** | Spectrum | Heartbeat of the roadmap |
| **Echo Trail** | Employee Detail | Echoes of past conversations (timeline) |
| **Work Stream** | Employee Detail | Flow of work through a person (task pipeline) |
| **Meridian Alignment** | The Race | How aligned work is to the roadmap (AI metric) |
| **Dawn Sequence** | Luminary | Entry animation — light filling the room |

#### Existing Names (unchanged)

The Spectrum, The Prism, Constellation, The Race, Orbital Presence, 360° Resonance, Telemetry, Neural Pathways, Bio-Rhythms, Capital Matrix, Impact Nodes, In Orbit, Dark, Standby, Protocol, Burnout Corridor, Flight Risk, Threshold Transition.

#### Page Title Pattern

`Word <span italic serif dim>Accent</span>`

| Screen | Title |
|--------|-------|
| Spectrum | "The *Spectrum*" |
| Team | "Your *Team*" |
| The Race | "The *Race*" |
| Orbital Presence | "Orbital *Presence*" |
| 360° Resonance | "Signal *Resonance*" |
| Genesis | "The *Genesis*" |
| Meridian | "The *Meridian*" |
| Checkpoint | "Signal *Checkpoint*" |
| Synthesis | "Signal *Synthesis*" |
| Calibration | "System *Calibration*" |

#### Naming Rules for New Features

| ✅ Use | ❌ Don't use |
|--------|-------------|
| Genesis | Setup Wizard |
| Meridian | Roadmap Page |
| Luminary | AI Chat Bot |
| Checkpoint | Approval Queue |
| Synthesis | Report Builder |
| Calibration | Admin Settings |
| Illuminations | AI Insights Panel |
| Dawn Sequence | Loading Animation |
| Echo Trail | Chat History |
| Meridian Alignment | Roadmap Score |

Test: "Would this name feel native next to Spectrum, Luminary, and Meridian?"

---

## 12. Do NOT Do List

**Visual system:**
- Do NOT use `box-shadow` — use `blur-[60-120px]` ambient blobs
- Do NOT use pie charts or donut charts
- Do NOT use 3D perspective on charts
- Do NOT use emoji in UI (exception: 👑 in The Race winner)
- Do NOT use `text-white` class — use `p-text-hi`
- Do NOT hardcode hex colors for text/borders — use `--p-*` tokens
- Do NOT use fonts below 10px
- Do NOT use recharts for novel interactions — hand-craft SVG
- Do NOT display employee photos without the grayscale-to-colour hover pattern
- Do NOT hardcode dark mode colours without a `.prism-light` override

**Layout and navigation:**
- Do NOT create separate pages for content that can be a tab within Spectrum
- Do NOT add a sidebar or top navigation bar — the Dock is the only nav
- Do NOT use `position: fixed` for anything except the Dock and Luminary button
- Do NOT use `cursor: default` — the app uses custom cursor with `cursor: none`
- Do NOT use `overflow: scroll` — hide scrollbars with `scrollbarWidth: 'none'`
- Do NOT forget bottom padding for dock clearance (`pb-32` minimum)

**Animation:**
- Do NOT animate with `setInterval` — use Motion or CSS `@keyframes`
- Do NOT put explanatory text inside SVG charts
- Do NOT use unicode bullets in data labels — use Lucide icons

**UI cohesion (CRITICAL for v3 screens):**
- Do NOT use list views or table rows — always use card-based layouts (`rounded-[2rem]`, `p-bg-card`)
- Do NOT show checkboxes — use shift-click/long-press multi-select with floating action pill
- Do NOT use dashed-border upload zones — use Prism card with animated pulse border
- Do NOT use dropdown selectors — use pill buttons, radio cards, or slider controls
- Do NOT use horizontal tab bars with 5+ tabs — use scroll-spy dot sidebar (like Employee Detail)
- Do NOT render documents in white backgrounds — use Prism-styled dark viewer (`p-bg-card-2`)
- Do NOT use standard Gantt/PM visualizations — reimagine with Prism's signal/light metaphors (but keep a true linear time axis for date readability)
- Do NOT show bare form fields — wrap each form group in a Prism card with section marker header
- Do NOT skip hero sections on new pages — every page needs: overline + serif italic title + stats + border-bottom
- Do NOT show bare "No data" strings — use `<EmptyState>` with page-specific variant
- Do NOT use generic names for features — use Prism vocabulary (see §11)
- Do NOT call Luminary "chatbot" or "AI assistant" — it's a Luminary, a source of light

**Two disclosure models** (choose based on screen purpose):
- **Analytics disclosure** (Spectrum, Employee Detail, The Race, KPIs): hover→reveal. Information hidden by default, revealed on interaction. Quiet by default, rich on exploration.
- **Operations disclosure / focus-dim** (Checkpoint, Tasks active view): ALL actions visible on every card by default. On hover: focused card stays full opacity, ALL OTHER cards dim to 60%. This creates focus without hiding — speed of action over visual quietness.
- Do NOT mix models on the same screen. Pick one based on whether the screen is for understanding (analytics) or acting (operations).

**The cohesion test:** Before shipping any new screen, ask: "If I screenshot this next to Spectrum, would someone know it's the same product?" If no → redesign using the patterns above.

---

## 13. Adding a New Page: Checklist

1. Create `src/app/components/YourPage.tsx` with a named export
2. Add lazy import + route in `routes.tsx` (wrap with `withSuspense`)
3. If authenticated, nest under the `/app` layout route
4. Add route to `depthMap` and `posMap` in `Layout.tsx` for transition animations
5. Use `.page-wrap` as the root container
6. Add hero section: back button → overline (icon + label) → serif italic title → stats → border-bottom
7. Animate entrance: hero at delay 0, first section 0.1, second 0.2
8. Add a dock entry if primary navigation (edit `Dock.tsx` primary or feature nav)
9. Add an `EmptyState` variant in `EmptyState.tsx` if the page can have zero data
10. **Name the page using Prism vocabulary** (see §11). No generic names.
11. Ensure all images: `loading="lazy" decoding="async"`, grayscale pattern
12. Ensure all data values: `font-mono` + dimension colour
13. Ensure all colours use `var(--p-*)` tokens — test light mode
14. Test: dark mode, light mode, mobile (320px), tablet, desktop, TV (1920px)
15. Add `pb-32` minimum at page bottom for dock clearance
16. **If the page interacts with Luminary:** ensure conversation context is passed correctly
17. **If the page has role-based content:** check PRODUCT_ARCHITECTURE_v3.md §4 permission matrix

---

*This file is the single source of truth for Prism's UI/UX conventions.*
*For architecture: DESIGN_DOCUMENT.md. For v3 AI specs: PRODUCT_ARCHITECTURE_v3.md.*
