export const employees = [
  {
    id: "e1",
    name: "Arjun Sharma",
    role: "Senior Frontend Engineer",
    department: "Core Architecture",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 92,
    attritionRisk: "Low",
    attritionRiskPercentage: 12,
    trend: "up",
    learningProgress: 85,
    recentFeedback: "Excellent architecture presentation that set the new standard.",
    nextPromotionEligibility: "2 Months",
    skills: ["React", "Architecture", "Mentoring", "WebGL", "Three.js"],
    revenueContribution: 320000,
    costInvestment: 160000,
    roi: 200,
    motivationScore: 88,
    welfareScore: 92,
    engagementLevel: "Hyper-Engaged",
    dailyPerformance: [
      { day: 'Mon', score: 95, hours: 8.5 },
      { day: 'Tue', score: 90, hours: 8.0 },
      { day: 'Wed', score: 85, hours: 7.5 },
      { day: 'Thu', score: 96, hours: 9.0 },
      { day: 'Fri', score: 92, hours: 8.0 },
    ],
    timesheets: [
      { week: 'W1', hoursLogged: 42, utilizationRate: 95, billable: 38 },
      { week: 'W2', hoursLogged: 40, utilizationRate: 90, billable: 36 },
      { week: 'W3', hoursLogged: 45, utilizationRate: 100, billable: 42 },
      { week: 'W4', hoursLogged: 41, utilizationRate: 92, billable: 38 },
    ],
    workLogFeedback: [
      { date: '12-Oct', comment: 'Shipped quantum UI component ahead of schedule.', sentiment: 'positive' },
      { date: '15-Oct', comment: 'Pair programming session was highly effective.', sentiment: 'positive' },
      { date: '18-Oct', comment: 'Minor regression in build step, quickly resolved.', sentiment: 'neutral' },
    ],
    projectedPromotions: [{ role: "Principal Engineer", timeframe: "Q3 2026", probability: 85 }],
    lmsModules: [
      { id: "l1", title: "Advanced Framer Motion", status: "completed", progress: 100, score: 98, date: "15-Sep" },
      { id: "l2", title: "Neural Net UIs", status: "in_progress", progress: 65, score: null, date: "Ongoing" },
      { id: "l3", title: "Leadership Communication II", status: "enrolled", progress: 0, score: null, date: "Upcoming" }
    ],
    okrs: [
      { objective: "Migrate entire UI to React 19", progress: 85, status: "on_track", weight: "High" },
      { objective: "Reduce bundle size by 40%", progress: 100, status: "completed", weight: "Critical" },
      { objective: "Mentor 3 junior developers", progress: 50, status: "at_risk", weight: "Medium" }
    ],
    kpis: [
      { name: "Code Review Turnaround", target: 24, current: 18, unit: "hrs", trend: "up", weight: 25 },
      { name: "Sprint Velocity", target: 42, current: 47, unit: "pts", trend: "up", weight: 30 },
      { name: "Bug Escape Rate", target: 2, current: 1.2, unit: "%", trend: "up", weight: 20 },
      { name: "Doc Coverage", target: 90, current: 87, unit: "%", trend: "stable", weight: 15 },
      { name: "Mentorship Hours", target: 8, current: 4, unit: "hrs/mo", trend: "down", weight: 10 },
    ],
    reviews360: [
      {
        reviewer: "Neha Gupta", relation: "Peer", date: "Nov 2025",
        scores: { communication: 92, technical: 96, leadership: 85, collaboration: 90, innovation: 95 },
        strengths: "Alex consistently delivers exceptional architecture. His React 19 migration plan was incredibly thorough.",
        improvements: "Could delegate more to junior engineers to free up bandwidth.",
        overall: 92
      },
      {
        reviewer: "Kavya Reddy", relation: "Manager", date: "Nov 2025",
        scores: { communication: 90, technical: 98, leadership: 88, collaboration: 85, innovation: 96 },
        strengths: "Alex is our strongest technical contributor. The bundle optimization saved us $40K/yr in infra costs.",
        improvements: "Mentorship OKR needs attention. Schedule regular 1:1s with juniors.",
        overall: 91
      }
    ],
    attendance: {
      present: 21, wfh: 3, leave: 1, absent: 0,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "09:05", checkOut: "18:30" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "present", checkIn: "09:15", checkOut: "18:45" },
        { date: "2025-11-05", type: "wfh", checkIn: "09:30", checkOut: "19:00" },
        { date: "2025-11-06", type: "present", checkIn: "08:55", checkOut: "18:20" },
        { date: "2025-11-07", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-08", type: "present", checkIn: "09:10", checkOut: "18:40" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "wfh", checkIn: "09:30", checkOut: "17:30" },
        { date: "2025-11-12", type: "present", checkIn: "09:00", checkOut: "18:30" },
        { date: "2025-11-13", type: "leave", leaveType: "casual" },
        { date: "2025-11-14", type: "present", checkIn: "09:20", checkOut: "18:50" },
        { date: "2025-11-15", type: "present", checkIn: "09:00", checkOut: "18:00" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 40000, value: 72000, roi: 180 },
      { quarter: "Q2 2025", investment: 40000, value: 88000, roi: 220 },
      { quarter: "Q3 2025", investment: 40000, value: 80000, roi: 200 },
      { quarter: "Q4 2025", investment: 40000, value: 80000, roi: 200 },
    ],
    compensation: { base: 150000, bonus: 30000, equityVested: 120000, equityUnvested: 240000, nextVestDate: "15-Nov-2026", wellnessStipend: 1500, utilizedStipend: 800 },
    leaveBalance: { ptoTotal: 25, ptoUsed: 12, sickTotal: 10, sickUsed: 2, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 28, cognitiveLoad: 65, burnoutProbability: 14, sleepQuality: 88, focusBlocksAvg: 4.2 },
    peerReviews: [
      { peer: "Neha Gupta", connection: "Strong", sentiment: 92, nodes: 15 },
      { peer: "Vikram Singh", connection: "Moderate", sentiment: 78, nodes: 8 },
      { peer: "Kavya Reddy", connection: "Weak", sentiment: 85, nodes: 3 }
    ],
    equipment: ["MacBook Pro M3 Max", "Studio Display", "Herman Miller Embody", "Keychron K2"]
  },
  {
    id: "e2",
    name: "Neha Gupta",
    role: "Product Designer",
    department: "User Experience",
    stage: "Onboarding",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 88,
    attritionRisk: "Low",
    attritionRiskPercentage: 18,
    trend: "up",
    learningProgress: 60,
    recentFeedback: "Adapting well to design systems and showing great initiative.",
    nextPromotionEligibility: "1 Year",
    skills: ["Figma", "User Research", "Prototyping", "Spline"],
    revenueContribution: 180000,
    costInvestment: 130000,
    roi: 138,
    motivationScore: 95,
    welfareScore: 85,
    engagementLevel: "Highly Engaged",
    dailyPerformance: [
      { day: 'Mon', score: 85, hours: 8.0 }, { day: 'Tue', score: 88, hours: 8.0 },
      { day: 'Wed', score: 90, hours: 8.5 }, { day: 'Thu', score: 85, hours: 7.5 },
      { day: 'Fri', score: 92, hours: 8.0 },
    ],
    timesheets: [
      { week: 'W1', hoursLogged: 40, utilizationRate: 85, billable: 30 },
      { week: 'W2', hoursLogged: 38, utilizationRate: 80, billable: 28 },
      { week: 'W3', hoursLogged: 42, utilizationRate: 90, billable: 34 },
      { week: 'W4', hoursLogged: 40, utilizationRate: 85, billable: 32 },
    ],
    workLogFeedback: [
      { date: '01-Nov', comment: 'Great wireframes for new onboarding flow.', sentiment: 'positive' },
      { date: '05-Nov', comment: 'Needs more context on edge cases in UI.', sentiment: 'neutral' },
    ],
    projectedPromotions: [{ role: "Senior Product Designer", timeframe: "Q1 2027", probability: 70 }],
    lmsModules: [
      { id: "l4", title: "Enterprise Design Systems", status: "completed", progress: 100, score: 95, date: "01-Oct" },
      { id: "l5", title: "Accessibility (WCAG 2.2)", status: "in_progress", progress: 45, score: null, date: "Ongoing" }
    ],
    okrs: [
      { objective: "Establish Design Token sync pipeline", progress: 60, status: "on_track", weight: "High" },
      { objective: "Conduct 15 user interviews for Q4", progress: 80, status: "on_track", weight: "Medium" }
    ],
    kpis: [
      { name: "Design Cycle Time", target: 5, current: 4.2, unit: "days", trend: "up", weight: 30 },
      { name: "User Test Score", target: 8.0, current: 8.4, unit: "/10", trend: "up", weight: 35 },
      { name: "Figma Handoff Quality", target: 95, current: 91, unit: "%", trend: "stable", weight: 20 },
      { name: "Research Sessions", target: 15, current: 12, unit: "sessions", trend: "up", weight: 15 },
    ],
    reviews360: [
      {
        reviewer: "Arjun Sharma", relation: "Peer", date: "Nov 2025",
        scores: { communication: 94, technical: 88, leadership: 78, collaboration: 95, innovation: 92 },
        strengths: "Sarah's visual thinking has elevated every product we've shipped. Her onboarding flow redesign increased activation by 23%.",
        improvements: "Should document design decisions more rigorously for future reference.",
        overall: 89
      }
    ],
    attendance: {
      present: 20, wfh: 4, leave: 1, absent: 0,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "09:30", checkOut: "18:00" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "wfh", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-05", type: "present", checkIn: "09:15", checkOut: "18:30" },
        { date: "2025-11-06", type: "present", checkIn: "09:00", checkOut: "17:45" },
        { date: "2025-11-07", type: "wfh", checkIn: "09:30", checkOut: "18:00" },
        { date: "2025-11-08", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-12", type: "leave", leaveType: "planned" },
        { date: "2025-11-13", type: "present", checkIn: "09:10", checkOut: "18:20" },
        { date: "2025-11-14", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-15", type: "wfh", checkIn: "09:00", checkOut: "17:30" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 32500, value: 38000, roi: 117 },
      { quarter: "Q2 2025", investment: 32500, value: 46000, roi: 142 },
      { quarter: "Q3 2025", investment: 32500, value: 48000, roi: 148 },
      { quarter: "Q4 2025", investment: 32500, value: 48000, roi: 148 },
    ],
    compensation: { base: 120000, bonus: 10000, equityVested: 0, equityUnvested: 80000, nextVestDate: "10-Oct-2027", wellnessStipend: 1500, utilizedStipend: 1500 },
    leaveBalance: { ptoTotal: 25, ptoUsed: 5, sickTotal: 10, sickUsed: 1, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 42, cognitiveLoad: 78, burnoutProbability: 25, sleepQuality: 75, focusBlocksAvg: 3.5 },
    peerReviews: [
      { peer: "Arjun Sharma", connection: "Strong", sentiment: 94, nodes: 15 },
      { peer: "Kavya Reddy", connection: "Moderate", sentiment: 82, nodes: 9 }
    ],
    equipment: ["MacBook Pro M3", "Wacom Cintiq", "iPad Pro"]
  },
  {
    id: "e3",
    name: "Vikram Singh",
    role: "Backend Developer",
    department: "Data Infrastructure",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 72,
    attritionRisk: "High",
    attritionRiskPercentage: 78,
    trend: "down",
    learningProgress: 45,
    recentFeedback: "Missed deadlines on recent microservice integration. Intervention needed.",
    nextPromotionEligibility: "8 Months",
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
    revenueContribution: 150000,
    costInvestment: 145000,
    roi: 103,
    motivationScore: 42,
    welfareScore: 55,
    engagementLevel: "Disengaged",
    dailyPerformance: [
      { day: 'Mon', score: 70, hours: 7.0 }, { day: 'Tue', score: 65, hours: 6.5 },
      { day: 'Wed', score: 75, hours: 8.0 }, { day: 'Thu', score: 60, hours: 6.0 },
      { day: 'Fri', score: 80, hours: 8.5 },
    ],
    timesheets: [
      { week: 'W1', hoursLogged: 36, utilizationRate: 75, billable: 25 },
      { week: 'W2', hoursLogged: 32, utilizationRate: 65, billable: 20 },
      { week: 'W3', hoursLogged: 38, utilizationRate: 80, billable: 30 },
      { week: 'W4', hoursLogged: 40, utilizationRate: 85, billable: 35 },
    ],
    workLogFeedback: [
      { date: '10-Oct', comment: 'Microservice API documentation incomplete.', sentiment: 'negative' },
      { date: '14-Oct', comment: 'Fixed critical database deadlocks.', sentiment: 'positive' },
      { date: '20-Oct', comment: 'Absent for sprint planning.', sentiment: 'negative' },
    ],
    projectedPromotions: [{ role: "Engineering Manager", timeframe: "Q4 2026", probability: 30 }],
    lmsModules: [
      { id: "l6", title: "Advanced AWS Security", status: "enrolled", progress: 10, score: null, date: "Overdue" }
    ],
    okrs: [
      { objective: "Migrate auth service to zero-trust architecture", progress: 30, status: "off_track", weight: "Critical" },
      { objective: "Reduce API latency by 200ms", progress: 75, status: "on_track", weight: "High" }
    ],
    kpis: [
      { name: "API Response Time", target: 200, current: 185, unit: "ms", trend: "up", weight: 30 },
      { name: "Uptime SLA", target: 99.9, current: 98.7, unit: "%", trend: "down", weight: 40 },
      { name: "PR Merge Rate", target: 5, current: 3.2, unit: "/wk", trend: "down", weight: 20 },
      { name: "Incident Response", target: 15, current: 28, unit: "min", trend: "down", weight: 10 },
    ],
    reviews360: [
      {
        reviewer: "Arjun Sharma", relation: "Peer", date: "Nov 2025",
        scores: { communication: 65, technical: 80, leadership: 55, collaboration: 60, innovation: 70 },
        strengths: "Deep knowledge of distributed systems. The database deadlock fix was impressive.",
        improvements: "Needs to improve communication and attend all sprint ceremonies. Documentation is lacking.",
        overall: 66
      }
    ],
    attendance: {
      present: 15, wfh: 2, leave: 3, absent: 5,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "10:15", checkOut: "17:30" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "absent" },
        { date: "2025-11-05", type: "present", checkIn: "09:45", checkOut: "17:00" },
        { date: "2025-11-06", type: "present", checkIn: "10:00", checkOut: "17:30" },
        { date: "2025-11-07", type: "leave", leaveType: "sick" },
        { date: "2025-11-08", type: "leave", leaveType: "sick" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "absent" },
        { date: "2025-11-12", type: "wfh", checkIn: "11:00", checkOut: "17:00" },
        { date: "2025-11-13", type: "absent" },
        { date: "2025-11-14", type: "present", checkIn: "09:30", checkOut: "17:30" },
        { date: "2025-11-15", type: "leave", leaveType: "sick" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 36250, value: 40000, roi: 110 },
      { quarter: "Q2 2025", investment: 36250, value: 38000, roi: 105 },
      { quarter: "Q3 2025", investment: 36250, value: 36000, roi: 99 },
      { quarter: "Q4 2025", investment: 36250, value: 36000, roi: 99 },
    ],
    compensation: { base: 135000, bonus: 5000, equityVested: 60000, equityUnvested: 20000, nextVestDate: "01-Jan-2027", wellnessStipend: 1500, utilizedStipend: 0 },
    leaveBalance: { ptoTotal: 20, ptoUsed: 19, sickTotal: 10, sickUsed: 8, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 85, cognitiveLoad: 92, burnoutProbability: 88, sleepQuality: 45, focusBlocksAvg: 1.2 },
    peerReviews: [
      { peer: "Arjun Sharma", connection: "Moderate", sentiment: 70, nodes: 8 },
      { peer: "Kavya Reddy", connection: "Weak", sentiment: 60, nodes: 2 }
    ],
    equipment: ["Dell XPS 15", "UltraWide Monitor"]
  },
  {
    id: "e4",
    name: "Kavya Reddy",
    role: "Marketing Manager",
    department: "Growth",
    stage: "Transitioning",
    avatar: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 85,
    attritionRisk: "Medium",
    attritionRiskPercentage: 45,
    trend: "up",
    learningProgress: 90,
    recentFeedback: "Great campaign results but needs better cross-team communication cadence.",
    nextPromotionEligibility: "6 Months",
    skills: ["Campaign Strategy", "SEO", "Analytics", "Copywriting", "CRM"],
    revenueContribution: 450000,
    costInvestment: 120000,
    roi: 375,
    motivationScore: 78,
    welfareScore: 80,
    engagementLevel: "Engaged",
    dailyPerformance: [
      { day: 'Mon', score: 85, hours: 8.0 }, { day: 'Tue', score: 82, hours: 7.5 },
      { day: 'Wed', score: 88, hours: 8.5 }, { day: 'Thu', score: 85, hours: 8.0 },
      { day: 'Fri', score: 86, hours: 8.0 },
    ],
    timesheets: [
      { week: 'W1', hoursLogged: 40, utilizationRate: 90, billable: 0 },
      { week: 'W2', hoursLogged: 42, utilizationRate: 95, billable: 0 },
      { week: 'W3', hoursLogged: 38, utilizationRate: 85, billable: 0 },
      { week: 'W4', hoursLogged: 40, utilizationRate: 90, billable: 0 },
    ],
    workLogFeedback: [
      { date: '02-Nov', comment: 'Q4 SEO Campaign yielding excellent organic traffic.', sentiment: 'positive' },
      { date: '08-Nov', comment: 'Siloed communication with sales team noted.', sentiment: 'negative' },
    ],
    projectedPromotions: [{ role: "Director of Marketing", timeframe: "Q2 2026", probability: 65 }],
    lmsModules: [
      { id: "l7", title: "Predictive Analytics for Growth", status: "completed", progress: 100, score: 92, date: "12-Aug" },
      { id: "l8", title: "Cross-Functional Leadership", status: "in_progress", progress: 20, score: null, date: "Ongoing" }
    ],
    okrs: [
      { objective: "Increase Organic Traffic by 35%", progress: 95, status: "on_track", weight: "Critical" },
      { objective: "Launch 3 joint campaigns with Sales", progress: 20, status: "at_risk", weight: "High" }
    ],
    kpis: [
      { name: "Lead Generation", target: 500, current: 612, unit: "leads/mo", trend: "up", weight: 35 },
      { name: "CAC", target: 120, current: 98, unit: "$", trend: "up", weight: 25 },
      { name: "Campaign ROI", target: 350, current: 375, unit: "%", trend: "up", weight: 30 },
      { name: "Cross-team Syncs", target: 8, current: 3, unit: "/mo", trend: "down", weight: 10 },
    ],
    reviews360: [
      {
        reviewer: "Neha Gupta", relation: "Peer", date: "Nov 2025",
        scores: { communication: 80, technical: 85, leadership: 82, collaboration: 75, innovation: 88 },
        strengths: "Priya's campaigns consistently exceed revenue targets. The SEO strategy was brilliant.",
        improvements: "Needs to improve collaboration cadence with adjacent teams.",
        overall: 82
      }
    ],
    attendance: {
      present: 19, wfh: 5, leave: 1, absent: 0,
      calendar: [
        { date: "2025-11-01", type: "wfh", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "present", checkIn: "09:00", checkOut: "18:30" },
        { date: "2025-11-05", type: "wfh", checkIn: "09:30", checkOut: "19:00" },
        { date: "2025-11-06", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-07", type: "present", checkIn: "09:00", checkOut: "18:30" },
        { date: "2025-11-08", type: "leave", leaveType: "casual" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-12", type: "wfh", checkIn: "09:30", checkOut: "18:30" },
        { date: "2025-11-13", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-14", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-15", type: "wfh", checkIn: "09:00", checkOut: "17:30" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 30000, value: 95000, roi: 317 },
      { quarter: "Q2 2025", investment: 30000, value: 110000, roi: 367 },
      { quarter: "Q3 2025", investment: 30000, value: 120000, roi: 400 },
      { quarter: "Q4 2025", investment: 30000, value: 125000, roi: 417 },
    ],
    compensation: { base: 110000, bonus: 25000, equityVested: 30000, equityUnvested: 40000, nextVestDate: "15-May-2026", wellnessStipend: 1500, utilizedStipend: 500 },
    leaveBalance: { ptoTotal: 25, ptoUsed: 15, sickTotal: 10, sickUsed: 4, sabbaticalEligible: true },
    bioRhythm: { stressIndex: 58, cognitiveLoad: 72, burnoutProbability: 40, sleepQuality: 68, focusBlocksAvg: 2.8 },
    peerReviews: [
      { peer: "Neha Gupta", connection: "Moderate", sentiment: 88, nodes: 9 },
      { peer: "Vikram Singh", connection: "Weak", sentiment: 55, nodes: 2 }
    ],
    equipment: ["MacBook Air M2", "AirPods Pro"]
  },

  // ── e5 ─────────────────────────────────────────────────────────────────────
  {
    id: "e5",
    name: "Rohan Mehta",
    role: "Product Manager",
    department: "Product",
    stage: "Rising Star",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 87,
    attritionRisk: "Low",
    attritionRiskPercentage: 15,
    trend: "stable",
    learningProgress: 72,
    recentFeedback: "Shipped the roadmap overhaul two sprints ahead of schedule.",
    nextPromotionEligibility: "6 Months",
    skills: ["Roadmapping", "Stakeholder Mgmt", "SQL", "Figma", "OKRs"],
    revenueContribution: 280000,
    costInvestment: 145000,
    roi: 193,
    motivationScore: 91,
    welfareScore: 84,
    engagementLevel: "Engaged",
    dailyPerformance: [
      { day: "Mon", score: 88, hours: 8.0 },
      { day: "Tue", score: 85, hours: 8.5 },
      { day: "Wed", score: 90, hours: 7.5 },
      { day: "Thu", score: 86, hours: 9.0 },
      { day: "Fri", score: 87, hours: 8.0 },
    ],
    timesheets: [
      { week: "W1", hoursLogged: 40, utilizationRate: 90, billable: 36 },
      { week: "W2", hoursLogged: 42, utilizationRate: 95, billable: 38 },
      { week: "W3", hoursLogged: 38, utilizationRate: 88, billable: 34 },
      { week: "W4", hoursLogged: 41, utilizationRate: 92, billable: 37 },
    ],
    workLogFeedback: [
      { date: "03-Nov", comment: "Stakeholder alignment session resulted in 3 new feature approvals.", sentiment: "positive" },
      { date: "10-Nov", comment: "Discovery sprint yielded actionable user insights.", sentiment: "positive" },
    ],
    projectedPromotions: [{ role: "Senior PM", timeframe: "Q4 2026", probability: 72 }],
    lmsModules: [
      { id: "l1", title: "Product Strategy Fundamentals", status: "completed", progress: 100, score: 91, date: "20-Oct" },
      { id: "l2", title: "Data-Driven Product Management", status: "in_progress", progress: 55, score: null, date: "Ongoing" },
    ],
    okrs: [
      { objective: "Launch v2 onboarding flow", progress: 90, status: "on_track", weight: "High" },
      { objective: "Reduce churn by 15%", progress: 60, status: "at_risk", weight: "Critical" },
      { objective: "Define 2026 product roadmap", progress: 100, status: "completed", weight: "High" },
    ],
    kpis: [
      { name: "Feature Adoption Rate", target: 60, current: 64, unit: "%", trend: "up", weight: 30 },
      { name: "Sprint Goal Achievement", target: 90, current: 86, unit: "%", trend: "stable", weight: 25 },
      { name: "Stakeholder NPS", target: 75, current: 80, unit: "", trend: "up", weight: 25 },
      { name: "Time-to-Ship", target: 14, current: 11, unit: "days", trend: "up", weight: 20 },
    ],
    reviews360: [
      {
        reviewer: "Arjun Sharma", relation: "Peer", date: "Nov 2025",
        scores: { communication: 90, technical: 72, leadership: 85, collaboration: 88, innovation: 82 },
        strengths: "Jordan has a rare ability to align engineering and design toward a shared vision.",
        improvements: "Could deepen technical understanding to reduce back-and-forth on feasibility.",
        overall: 84
      }
    ],
    attendance: {
      present: 20, wfh: 4, leave: 0, absent: 1,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "08:45", checkOut: "18:00" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-05", type: "wfh",     checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-06", type: "present", checkIn: "08:55", checkOut: "18:30" },
        { date: "2025-11-07", type: "absent" },
        { date: "2025-11-08", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "wfh",     checkIn: "09:30", checkOut: "18:00" },
        { date: "2025-11-12", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-13", type: "present", checkIn: "09:00", checkOut: "17:45" },
        { date: "2025-11-14", type: "wfh",     checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-15", type: "present", checkIn: "09:00", checkOut: "18:00" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 35000, value: 68000, roi: 194 },
      { quarter: "Q2 2025", investment: 35000, value: 72000, roi: 206 },
      { quarter: "Q3 2025", investment: 36000, value: 78000, roi: 217 },
      { quarter: "Q4 2025", investment: 36000, value: 80000, roi: 222 },
    ],
    compensation: { base: 120000, bonus: 20000, equityVested: 15000, equityUnvested: 30000, nextVestDate: "01-Mar-2026", wellnessStipend: 1200, utilizedStipend: 900 },
    leaveBalance: { ptoTotal: 20, ptoUsed: 5, sickTotal: 10, sickUsed: 1, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 44, cognitiveLoad: 62, burnoutProbability: 28, sleepQuality: 78, focusBlocksAvg: 3.2 },
    peerReviews: [
      { peer: "Neha Gupta", connection: "Strong", sentiment: 92, nodes: 14 },
      { peer: "Kavya Reddy", connection: "Moderate", sentiment: 79, nodes: 7 },
    ],
    equipment: ["MacBook Pro M3", "Dell 4K Monitor", "Logitech MX Keys"]
  },

  // ── e6 ─────────────────────────────────────────────────────────────────────
  {
    id: "e6",
    name: "Aditya Kumar",
    role: "Data Engineer",
    department: "Data Infrastructure",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 79,
    attritionRisk: "Medium",
    attritionRiskPercentage: 52,
    trend: "down",
    learningProgress: 60,
    recentFeedback: "Pipeline reliability has improved significantly, though documentation lags.",
    nextPromotionEligibility: "12 Months",
    skills: ["Python", "Spark", "dbt", "Airflow", "Snowflake"],
    revenueContribution: 195000,
    costInvestment: 130000,
    roi: 150,
    motivationScore: 68,
    welfareScore: 71,
    engagementLevel: "Moderately Engaged",
    dailyPerformance: [
      { day: "Mon", score: 80, hours: 8.0 },
      { day: "Tue", score: 76, hours: 7.5 },
      { day: "Wed", score: 82, hours: 8.5 },
      { day: "Thu", score: 77, hours: 7.0 },
      { day: "Fri", score: 78, hours: 8.0 },
    ],
    timesheets: [
      { week: "W1", hoursLogged: 38, utilizationRate: 84, billable: 32 },
      { week: "W2", hoursLogged: 40, utilizationRate: 88, billable: 35 },
      { week: "W3", hoursLogged: 37, utilizationRate: 82, billable: 30 },
      { week: "W4", hoursLogged: 39, utilizationRate: 86, billable: 33 },
    ],
    workLogFeedback: [
      { date: "05-Nov", comment: "Refactored ingestion layer — 30% latency reduction.", sentiment: "positive" },
      { date: "12-Nov", comment: "Documentation backlog still unresolved from last sprint.", sentiment: "neutral" },
    ],
    projectedPromotions: [{ role: "Senior Data Engineer", timeframe: "Q2 2027", probability: 55 }],
    lmsModules: [
      { id: "l1", title: "Advanced dbt Patterns", status: "in_progress", progress: 40, score: null, date: "Ongoing" },
      { id: "l2", title: "Data Mesh Architecture", status: "enrolled", progress: 0, score: null, date: "Upcoming" },
    ],
    okrs: [
      { objective: "Achieve 99.9% pipeline uptime", progress: 96, status: "on_track", weight: "Critical" },
      { objective: "Migrate legacy ETL to dbt", progress: 45, status: "at_risk", weight: "High" },
      { objective: "Document all data contracts", progress: 20, status: "off_track", weight: "Medium" },
    ],
    kpis: [
      { name: "Pipeline Uptime", target: 99.9, current: 99.6, unit: "%", trend: "up", weight: 35 },
      { name: "Data Freshness SLA", target: 95, current: 88, unit: "%", trend: "down", weight: 30 },
      { name: "Incident Response Time", target: 30, current: 45, unit: "min", trend: "down", weight: 20 },
      { name: "Doc Coverage", target: 80, current: 35, unit: "%", trend: "stable", weight: 15 },
    ],
    reviews360: [
      {
        reviewer: "Vikram Singh", relation: "Peer", date: "Nov 2025",
        scores: { communication: 65, technical: 88, leadership: 60, collaboration: 70, innovation: 75 },
        strengths: "Deep expertise in distributed systems. Consistently solves the hard infra problems.",
        improvements: "Communication cadence with stakeholders needs improvement. Goes dark mid-sprint.",
        overall: 72
      }
    ],
    attendance: {
      present: 17, wfh: 5, leave: 2, absent: 1,
      calendar: [
        { date: "2025-11-01", type: "wfh",     checkIn: "09:30", checkOut: "18:00" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "present", checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-05", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-06", type: "wfh",     checkIn: "10:00", checkOut: "18:30" },
        { date: "2025-11-07", type: "leave",   leaveType: "sick" },
        { date: "2025-11-08", type: "leave",   leaveType: "sick" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-12", type: "absent" },
        { date: "2025-11-13", type: "present", checkIn: "09:15", checkOut: "18:00" },
        { date: "2025-11-14", type: "wfh",     checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-15", type: "present", checkIn: "09:00", checkOut: "18:00" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 32000, value: 48000, roi: 150 },
      { quarter: "Q2 2025", investment: 32000, value: 50000, roi: 156 },
      { quarter: "Q3 2025", investment: 33000, value: 52000, roi: 158 },
      { quarter: "Q4 2025", investment: 33000, value: 49000, roi: 148 },
    ],
    compensation: { base: 115000, bonus: 10000, equityVested: 8000, equityUnvested: 22000, nextVestDate: "01-Aug-2026", wellnessStipend: 1200, utilizedStipend: 200 },
    leaveBalance: { ptoTotal: 20, ptoUsed: 12, sickTotal: 10, sickUsed: 5, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 68, cognitiveLoad: 80, burnoutProbability: 58, sleepQuality: 60, focusBlocksAvg: 2.1 },
    peerReviews: [
      { peer: "Arjun Sharma", connection: "Weak", sentiment: 62, nodes: 3 },
      { peer: "Rohan Mehta",  connection: "Moderate", sentiment: 71, nodes: 6 },
    ],
    equipment: ["MacBook Pro M2", "Samsung 34\" Ultrawide"]
  },

  // ── e7 ─────────────────────────────────────────────────────────────────────
  {
    id: "e7",
    name: "Ananya Reddy",
    role: "UX Researcher",
    department: "User Experience",
    stage: "Growing",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 83,
    attritionRisk: "Low",
    attritionRiskPercentage: 18,
    trend: "up",
    learningProgress: 78,
    recentFeedback: "User research synthesis on checkout flow directly shaped the Q3 redesign.",
    nextPromotionEligibility: "9 Months",
    skills: ["User Interviews", "Usability Testing", "Figma", "Dovetail", "Survey Design"],
    revenueContribution: 165000,
    costInvestment: 105000,
    roi: 157,
    motivationScore: 85,
    welfareScore: 89,
    engagementLevel: "Engaged",
    dailyPerformance: [
      { day: "Mon", score: 84, hours: 7.5 },
      { day: "Tue", score: 82, hours: 8.0 },
      { day: "Wed", score: 86, hours: 8.0 },
      { day: "Thu", score: 80, hours: 7.5 },
      { day: "Fri", score: 83, hours: 7.0 },
    ],
    timesheets: [
      { week: "W1", hoursLogged: 37, utilizationRate: 86, billable: 32 },
      { week: "W2", hoursLogged: 38, utilizationRate: 88, billable: 34 },
      { week: "W3", hoursLogged: 36, utilizationRate: 84, billable: 31 },
      { week: "W4", hoursLogged: 38, utilizationRate: 87, billable: 33 },
    ],
    workLogFeedback: [
      { date: "07-Nov", comment: "Delivered research synthesis deck — 12 actionable insights adopted by product.", sentiment: "positive" },
      { date: "14-Nov", comment: "Moderated 8 usability sessions this week, above target.", sentiment: "positive" },
    ],
    projectedPromotions: [{ role: "Senior UX Researcher", timeframe: "Q1 2027", probability: 68 }],
    lmsModules: [
      { id: "l1", title: "Mixed Methods Research", status: "completed", progress: 100, score: 89, date: "01-Oct" },
      { id: "l2", title: "Quantitative UX Analysis", status: "in_progress", progress: 70, score: null, date: "Ongoing" },
    ],
    okrs: [
      { objective: "Conduct 40 user interviews this quarter", progress: 80, status: "on_track", weight: "High" },
      { objective: "Build shared research repository", progress: 55, status: "on_track", weight: "Medium" },
      { objective: "Define UX metrics framework", progress: 100, status: "completed", weight: "High" },
    ],
    kpis: [
      { name: "Research Sessions / Month", target: 12, current: 14, unit: "", trend: "up", weight: 30 },
      { name: "Insight Adoption Rate", target: 70, current: 75, unit: "%", trend: "up", weight: 30 },
      { name: "Time to Insight", target: 5, current: 6, unit: "days", trend: "stable", weight: 20 },
      { name: "Stakeholder Satisfaction", target: 80, current: 85, unit: "%", trend: "up", weight: 20 },
    ],
    reviews360: [
      {
        reviewer: "Neha Gupta", relation: "Peer", date: "Nov 2025",
        scores: { communication: 88, technical: 76, leadership: 78, collaboration: 90, innovation: 84 },
        strengths: "Aisha's research brings the user's voice into every design decision. Invaluable.",
        improvements: "Could present findings more concisely in exec-level readouts.",
        overall: 83
      }
    ],
    attendance: {
      present: 18, wfh: 6, leave: 1, absent: 0,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "wfh",     checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-05", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-06", type: "wfh",     checkIn: "09:30", checkOut: "17:30" },
        { date: "2025-11-07", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-08", type: "leave",   leaveType: "personal" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "present", checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-12", type: "wfh",     checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-13", type: "present", checkIn: "09:00", checkOut: "17:30" },
        { date: "2025-11-14", type: "wfh",     checkIn: "09:30", checkOut: "18:00" },
        { date: "2025-11-15", type: "present", checkIn: "09:00", checkOut: "17:30" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 25000, value: 40000, roi: 160 },
      { quarter: "Q2 2025", investment: 25000, value: 42000, roi: 168 },
      { quarter: "Q3 2025", investment: 26000, value: 44000, roi: 169 },
      { quarter: "Q4 2025", investment: 26000, value: 46000, roi: 177 },
    ],
    compensation: { base: 95000, bonus: 12000, equityVested: 6000, equityUnvested: 18000, nextVestDate: "01-Jun-2026", wellnessStipend: 1200, utilizedStipend: 1100 },
    leaveBalance: { ptoTotal: 20, ptoUsed: 7, sickTotal: 10, sickUsed: 0, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 38, cognitiveLoad: 55, burnoutProbability: 22, sleepQuality: 82, focusBlocksAvg: 3.8 },
    peerReviews: [
      { peer: "Neha Gupta",  connection: "Strong",   sentiment: 94, nodes: 15 },
      { peer: "Rohan Mehta",  connection: "Strong",   sentiment: 88, nodes: 12 },
    ],
    equipment: ["MacBook Air M2", "iPad Pro", "Apple Pencil"]
  },

  // ── e8 ─────────────────────────────────────────────────────────────────────
  {
    id: "e8",
    name: "Karan Patel",
    role: "DevOps Engineer",
    department: "Core Architecture",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=1080&auto=format&fit=crop",
    performanceScore: 76,
    attritionRisk: "High",
    attritionRiskPercentage: 71,
    trend: "down",
    learningProgress: 45,
    recentFeedback: "CI/CD pipeline is rock solid but Ryan has declined two 1-on-1s this month.",
    nextPromotionEligibility: "18 Months",
    skills: ["Kubernetes", "Terraform", "AWS", "GitHub Actions", "Prometheus"],
    revenueContribution: 210000,
    costInvestment: 140000,
    roi: 150,
    motivationScore: 55,
    welfareScore: 60,
    engagementLevel: "Disengaged",
    dailyPerformance: [
      { day: "Mon", score: 78, hours: 7.5 },
      { day: "Tue", score: 74, hours: 7.0 },
      { day: "Wed", score: 80, hours: 8.0 },
      { day: "Thu", score: 72, hours: 7.0 },
      { day: "Fri", score: 75, hours: 6.5 },
    ],
    timesheets: [
      { week: "W1", hoursLogged: 36, utilizationRate: 80, billable: 28 },
      { week: "W2", hoursLogged: 34, utilizationRate: 76, billable: 26 },
      { week: "W3", hoursLogged: 38, utilizationRate: 84, billable: 30 },
      { week: "W4", hoursLogged: 35, utilizationRate: 78, billable: 27 },
    ],
    workLogFeedback: [
      { date: "06-Nov", comment: "Deployment pipeline now averages 4.2 min — 40% faster than last quarter.", sentiment: "positive" },
      { date: "13-Nov", comment: "Missed sprint planning. On-call rotation may be causing burnout.", sentiment: "neutral" },
    ],
    projectedPromotions: [{ role: "Senior DevOps Engineer", timeframe: "Q3 2027", probability: 40 }],
    lmsModules: [
      { id: "l1", title: "FinOps Fundamentals", status: "enrolled", progress: 0, score: null, date: "Upcoming" },
      { id: "l2", title: "Platform Engineering", status: "enrolled", progress: 0, score: null, date: "Upcoming" },
    ],
    okrs: [
      { objective: "Achieve zero-downtime deployments", progress: 100, status: "completed", weight: "Critical" },
      { objective: "Reduce infra costs by 20%", progress: 30, status: "at_risk", weight: "High" },
      { objective: "Complete Kubernetes certification", progress: 10, status: "off_track", weight: "Medium" },
    ],
    kpis: [
      { name: "Deployment Frequency", target: 10, current: 12, unit: "/wk", trend: "up", weight: 30 },
      { name: "MTTR", target: 30, current: 48, unit: "min", trend: "down", weight: 30 },
      { name: "Change Failure Rate", target: 5, current: 8, unit: "%", trend: "stable", weight: 20 },
      { name: "Infra Cost per Deploy", target: 12, current: 18, unit: "$", trend: "stable", weight: 20 },
    ],
    reviews360: [
      {
        reviewer: "Arjun Sharma", relation: "Peer", date: "Nov 2025",
        scores: { communication: 58, technical: 90, leadership: 52, collaboration: 60, innovation: 70 },
        strengths: "Undeniably the most skilled infrastructure engineer on the team. Systems are bulletproof.",
        improvements: "Disengagement is visible in meetings. Needs support — this is a retention risk.",
        overall: 66
      }
    ],
    attendance: {
      present: 15, wfh: 6, leave: 0, absent: 4,
      calendar: [
        { date: "2025-11-01", type: "present", checkIn: "09:30", checkOut: "17:30" },
        { date: "2025-11-02", type: "weekend" }, { date: "2025-11-03", type: "weekend" },
        { date: "2025-11-04", type: "absent" },
        { date: "2025-11-05", type: "wfh",     checkIn: "10:00", checkOut: "17:00" },
        { date: "2025-11-06", type: "present", checkIn: "09:30", checkOut: "17:30" },
        { date: "2025-11-07", type: "absent" },
        { date: "2025-11-08", type: "present", checkIn: "09:00", checkOut: "18:00" },
        { date: "2025-11-09", type: "weekend" }, { date: "2025-11-10", type: "weekend" },
        { date: "2025-11-11", type: "wfh",     checkIn: "10:30", checkOut: "17:30" },
        { date: "2025-11-12", type: "absent" },
        { date: "2025-11-13", type: "present", checkIn: "09:30", checkOut: "17:00" },
        { date: "2025-11-14", type: "absent" },
        { date: "2025-11-15", type: "present", checkIn: "10:00", checkOut: "17:30" },
      ]
    },
    roiQuarterly: [
      { quarter: "Q1 2025", investment: 34000, value: 52000, roi: 153 },
      { quarter: "Q2 2025", investment: 34000, value: 55000, roi: 162 },
      { quarter: "Q3 2025", investment: 35000, value: 50000, roi: 143 },
      { quarter: "Q4 2025", investment: 35000, value: 48000, roi: 137 },
    ],
    compensation: { base: 118000, bonus: 8000, equityVested: 10000, equityUnvested: 20000, nextVestDate: "15-Oct-2026", wellnessStipend: 1200, utilizedStipend: 0 },
    leaveBalance: { ptoTotal: 20, ptoUsed: 3, sickTotal: 10, sickUsed: 2, sabbaticalEligible: false },
    bioRhythm: { stressIndex: 82, cognitiveLoad: 88, burnoutProbability: 74, sleepQuality: 48, focusBlocksAvg: 1.4 },
    peerReviews: [
      { peer: "Arjun Sharma",  connection: "Weak",     sentiment: 58, nodes: 2 },
      { peer: "Aditya Kumar", connection: "Moderate", sentiment: 65, nodes: 5 },
    ],
    equipment: ["MacBook Pro M3 Max", "Mechanical Keyboard", "3× External Monitors"]
  }
];

export const performanceData = [
  { month: "Jan", avgScore: 82, target: 85 },
  { month: "Feb", avgScore: 84, target: 85 },
  { month: "Mar", avgScore: 88, target: 85 },
  { month: "Apr", avgScore: 86, target: 85 },
  { month: "May", avgScore: 89, target: 85 },
  { month: "Jun", avgScore: 91, target: 85 },
];

export const globalRevenueForecast = [
  { month: "Jan", actual: 1.2, projected: 1.2, cost: 0.8 },
  { month: "Feb", actual: 1.4, projected: 1.3, cost: 0.8 },
  { month: "Mar", actual: 1.5, projected: 1.5, cost: 0.85 },
  { month: "Apr", actual: 1.8, projected: 1.6, cost: 0.9 },
  { month: "May", actual: 1.9, projected: 1.8, cost: 0.9 },
  { month: "Jun", actual: null, projected: 2.1, cost: 0.95 },
  { month: "Jul", actual: null, projected: 2.3, cost: 0.95 },
];

export const taskQualityData = [
  { name: 'Excellent', value: 45, fill: '#10b981' },
  { name: 'Good', value: 35, fill: '#3b82f6' },
  { name: 'Needs Improvement', value: 20, fill: '#f59e0b' },
];

export const globalLearningData = [
  { domain: 'Engineering', completed: 420, active: 180 },
  { domain: 'Design', completed: 150, active: 90 },
  { domain: 'Leadership', completed: 310, active: 220 },
  { domain: 'Compliance', completed: 890, active: 40 },
];

export const alerts = [
  { id: 1, type: "warning", message: "Vikram Singh has missed 2 consecutive timesheets. Attrition risk increased to 78%.", user: "Vikram Singh" },
  { id: 2, type: "success", message: "Neha Gupta completed 'Enterprise Design Systems' LMS module. Promotion probability +5%.", user: "Neha Gupta" },
  { id: 3, type: "info", message: "Q2 Opinion Survey results are ready for review. Global welfare score: 84%.", user: "System" },
  { id: 4, type: "success", message: "Team ROI exceeded Q1 targets by 14%. Output scaling.", user: "System" },
  { id: 5, type: "warning", message: "Global Burnout Probability detected at 42% in Engineering. Recommend forced PTO.", user: "System" },
];

export const orgROIData = [
  { month: "Jan", totalInvestment: 1.8, totalValue: 3.8, roi: 211 },
  { month: "Feb", totalInvestment: 1.85, totalValue: 4.1, roi: 222 },
  { month: "Mar", totalInvestment: 1.9, totalValue: 4.5, roi: 237 },
  { month: "Apr", totalInvestment: 1.88, totalValue: 4.8, roi: 255 },
  { month: "May", totalInvestment: 1.95, totalValue: 5.1, roi: 261 },
  { month: "Jun", totalInvestment: 2.0, totalValue: 5.6, roi: 280 },
];

export const departmentROI = [
  { department: "Core Architecture", investment: 480000, value: 960000, roi: 200, headcount: 3 },
  { department: "User Experience", investment: 260000, value: 360000, roi: 138, headcount: 2 },
  { department: "Data Infrastructure", investment: 290000, value: 300000, roi: 103, headcount: 2 },
  { department: "Growth", investment: 120000, value: 450000, roi: 375, headcount: 1 },
];

export const globalKPIData = {
  avgPerformance: 84.2,
  totalROI: 246,
  attritionRisk: 12,
  learningCompletion: 68,
  burnoutIndex: 38,
  engagementScore: 78,
};

// ═══════════════════════════════════════════════════════════════════════
// V3 ENTITIES — AI COO Platform Data
// ═══════════════════════════════════════════════════════════════════════

export const companyConfig = {
  id: 'c1',
  name: 'Nexora',
  privacyLevel: 'layered' as const,
  conversationMemoryDays: 30 as 7 | 30 | 90 | -1,
  annualRevenueTarget: 3200000,
  departmentBudgets: [
    { departmentId: 'core-arch', budget: 800000 },
    { departmentId: 'ux', budget: 600000 },
    { departmentId: 'data-infra', budget: 700000 },
    { departmentId: 'growth', budget: 500000 },
  ],
  financialDataSource: 'manual' as const,
  standupReminderTime: '09:00',
  standupTimezone: 'Asia/Kolkata',
  missedStandupEscalationHours: 4,
  // Sanctum persona
  personaName: 'Luminary',
  personaTone: 'balanced' as const,
  personaVoice: 'mentor' as const,
  personaLength: 'adaptive' as const,
  personaTraits: ['empathetic', 'analytical', 'encouraging'],
  personaGreeting: 'Welcome to The Sanctum. I\'m here to help you grow.',
};

export const visionDocument = {
  id: 'v1',
  uploadedAt: '2026-01-15T10:00:00Z',
  rawText: 'We are building an AI-powered workforce management platform that transforms how CEOs run their companies. Our goal is to make every operational decision data-driven while keeping the human element at the centre.',
  mission: 'Empower every CEO with an AI Chief Operating Officer',
  problemStatements: [
    'CEOs spend 60% of time on operational oversight instead of strategy',
    'Employee performance data is siloed across 5+ tools',
    'Performance reviews are subjective and delayed by months',
  ],
  revenueTargets: [
    { period: 'Q1 2026', target: 600000 },
    { period: 'Q2 2026', target: 800000 },
    { period: 'Q3 2026', target: 900000 },
    { period: 'Q4 2026', target: 900000 },
  ],
  resources: { money: 2000000, headcount: 8, timeMonths: 12 },
  targetAudience: 'CEOs of 10-50 person companies',
  techApproach: 'React SPA with Anthropic Claude API for AI capabilities',
  constraints: ['No external funding', 'Remote-first team', 'Ship MVP in 6 months'],
};

export const roadmap = {
  id: 'r1',
  visionId: 'v1',
  status: 'active' as const,
  milestones: [
    { id: 'm1', title: 'Authentication System', description: 'Complete auth with SSO and role-based access', departmentId: 'core-arch',
      startDate: '2026-01-20', targetDate: '2026-03-15', status: 'completed' as const, progress: 100,
      okrs: [{ id: 'okr1', title: 'Implement OAuth2 + RBAC', target: 100, current: 100, unit: '%' }],
      dependencies: [] },
    { id: 'm2', title: 'Design System v2', description: 'Component library refresh with Prism tokens', departmentId: 'ux',
      startDate: '2026-02-01', targetDate: '2026-04-01', status: 'completed' as const, progress: 100,
      okrs: [{ id: 'okr2', title: 'Ship 40 UI components', target: 40, current: 40, unit: 'components' }],
      dependencies: ['m1'] },
    { id: 'm3', title: 'API Gateway', description: 'Rate limiting, caching, auth proxy for all services', departmentId: 'core-arch',
      startDate: '2026-03-20', targetDate: '2026-05-10', status: 'in_progress' as const, progress: 65,
      okrs: [{ id: 'okr3', title: 'Achieve <100ms p95 latency', target: 100, current: 65, unit: '%' }],
      dependencies: ['m1'] },
    { id: 'm4', title: 'User Research Phase 2', description: 'Enterprise customer interviews and usability testing', departmentId: 'growth',
      startDate: '2026-03-01', targetDate: '2026-05-25', status: 'in_progress' as const, progress: 40,
      okrs: [{ id: 'okr4', title: 'Complete 25 enterprise interviews', target: 25, current: 10, unit: 'interviews' }],
      dependencies: [] },
    { id: 'm5', title: 'Beta Launch', description: 'Invite-only beta with 10 companies, monitoring + feedback loop', departmentId: 'growth',
      startDate: '2026-05-15', targetDate: '2026-06-30', status: 'not_started' as const, progress: 0,
      okrs: [{ id: 'okr5', title: 'Onboard 10 beta companies', target: 10, current: 0, unit: 'companies' }],
      dependencies: ['m3', 'm4'] },
    { id: 'm6', title: 'Scale Infrastructure', description: 'Multi-tenant architecture, CDN, monitoring stack', departmentId: 'data-infra',
      startDate: '2026-05-20', targetDate: '2026-07-15', status: 'not_started' as const, progress: 0,
      okrs: [{ id: 'okr6', title: 'Support 100 concurrent orgs', target: 100, current: 0, unit: 'orgs' }],
      dependencies: ['m3'] },
    { id: 'm7', title: 'GA Release', description: 'Public launch with self-serve onboarding and billing', departmentId: 'growth',
      startDate: '2026-07-01', targetDate: '2026-08-30', status: 'not_started' as const, progress: 0,
      okrs: [{ id: 'okr7', title: 'Achieve 50 paying customers', target: 50, current: 0, unit: 'customers' }],
      dependencies: ['m5', 'm6'] },
  ],
  risks: [
    { id: 'rk1', title: 'Beta feedback may require scope change', severity: 'medium' as const, mitigation: 'Build modular — any component can be swapped independently' },
    { id: 'rk2', title: 'Infrastructure costs at scale unpredictable', severity: 'high' as const, mitigation: 'Usage-based pricing model, aggressive caching, cost alerts at thresholds' },
    { id: 'rk3', title: 'Key engineer burnout risk', severity: 'medium' as const, mitigation: 'Monitor wellbeing scores, enforce PTO, hire backup for critical path' },
  ],
  gaps: [
    { id: 'g1', type: 'skill' as const, title: 'No dedicated DevOps engineer', suggestion: 'Hire or contract DevOps for Scale Infrastructure milestone' },
    { id: 'g2', type: 'resource' as const, title: 'Marketing budget insufficient for GA', suggestion: 'Reallocate $50K from engineering tooling budget' },
  ],
};

// 14 days of standup conversations for employee e1 (Arjun)
const _genConvDate = (daysAgo: number) => {
  const d = new Date('2026-03-31');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const conversations = [
  { id: 'conv-1', employeeId: 'e1', date: _genConvDate(0), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-1a', role: 'ai_manager' as const, content: 'Good morning Arjun. How is the API gateway caching layer progressing?', timestamp: `${_genConvDate(0)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-1b', role: 'employee' as const, content: 'Caching layer is done and deployed to staging. Running load tests now — looking good so far, p95 is under 80ms.', timestamp: `${_genConvDate(0)}T09:02:00Z`, isPrivate: false },
      { id: 'msg-1c', role: 'ai_manager' as const, content: 'Excellent progress. Any blockers for moving to production?', timestamp: `${_genConvDate(0)}T09:02:30Z`, isPrivate: false },
      { id: 'msg-1d', role: 'employee' as const, content: 'Need final sign-off from the security review. Should have it by end of day.', timestamp: `${_genConvDate(0)}T09:03:00Z`, isPrivate: false },
    ],
    aiSummary: 'Caching layer deployed to staging. Load tests show p95 under 80ms. Awaiting security review sign-off.',
    sentiment: 'positive' as const, topicsDiscussed: ['API gateway', 'caching', 'load testing', 'security review'],
    actionItems: [{ description: 'Follow up on security review sign-off' }],
    blockers: ['Security review pending'], wins: ['Caching layer completed, p95 under 80ms'], hasPrivateContent: false, privateMessageIds: [] },
  { id: 'conv-2', employeeId: 'e1', date: _genConvDate(1), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-2a', role: 'ai_manager' as const, content: 'Morning Arjun. What are you working on today?', timestamp: `${_genConvDate(1)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-2b', role: 'employee' as const, content: 'Finishing up the rate limiter integration tests. Hit a tricky edge case with concurrent requests but I think I have a fix.', timestamp: `${_genConvDate(1)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Working on rate limiter integration tests. Edge case with concurrency being resolved.',
    sentiment: 'neutral' as const, topicsDiscussed: ['rate limiter', 'integration tests'],
    actionItems: [], blockers: [], wins: [], hasPrivateContent: false, privateMessageIds: [] },
  { id: 'conv-3', employeeId: 'e1', date: _genConvDate(2), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-3a', role: 'ai_manager' as const, content: 'Hi Arjun. How did the rate limiter edge case go?', timestamp: `${_genConvDate(2)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-3b', role: 'employee' as const, content: 'Fixed it. The issue was a race condition in the token bucket. All tests green now.', timestamp: `${_genConvDate(2)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Rate limiter edge case fixed — race condition in token bucket resolved. All tests passing.',
    sentiment: 'positive' as const, topicsDiscussed: ['rate limiter', 'bug fix'],
    actionItems: [], blockers: [], wins: ['Race condition bug fixed'], hasPrivateContent: false, privateMessageIds: [] },
  // Missed day (weekend)
  { id: 'conv-4', employeeId: 'e1', date: _genConvDate(5), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-4a', role: 'ai_manager' as const, content: 'Welcome back, Arjun. How was the weekend? Ready for the week?', timestamp: `${_genConvDate(5)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-4b', role: 'employee' as const, content: 'Good weekend. Starting on the auth proxy module today. Should take about 3 days.', timestamp: `${_genConvDate(5)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Starting auth proxy module. Estimated 3-day effort.',
    sentiment: 'positive' as const, topicsDiscussed: ['auth proxy'],
    actionItems: [{ description: 'Complete auth proxy module by Wednesday' }], blockers: [], wins: [], hasPrivateContent: false, privateMessageIds: [] },
  { id: 'conv-5', employeeId: 'e1', date: _genConvDate(6), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-5a', role: 'ai_manager' as const, content: 'How is the auth proxy coming along?', timestamp: `${_genConvDate(6)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-5b', role: 'employee' as const, content: 'Slower than expected. The JWT validation library has a bug with RS256. I might need to write a custom validator.', timestamp: `${_genConvDate(6)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Auth proxy slower than expected due to JWT library bug. May need custom validator.',
    sentiment: 'concerned' as const, topicsDiscussed: ['auth proxy', 'JWT', 'library bug'],
    actionItems: [{ description: 'Evaluate custom JWT validator vs library patch' }], blockers: ['JWT library RS256 bug'], wins: [], hasPrivateContent: false, privateMessageIds: [] },
  // Missed standup day
  { id: 'conv-6', employeeId: 'e1', date: _genConvDate(8), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-6a', role: 'ai_manager' as const, content: 'Hi Arjun, I noticed you missed standup yesterday. Everything okay?', timestamp: `${_genConvDate(8)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-6b', role: 'employee' as const, content: 'Yeah, sorry — had a dentist appointment. Auth proxy is done though! Custom validator works great.', timestamp: `${_genConvDate(8)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Missed yesterday (dentist). Auth proxy completed with custom JWT validator.',
    sentiment: 'positive' as const, topicsDiscussed: ['auth proxy', 'missed standup'],
    actionItems: [], blockers: [], wins: ['Auth proxy completed with custom validator'], hasPrivateContent: false, privateMessageIds: [] },
  { id: 'conv-7', employeeId: 'e1', date: _genConvDate(9), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-7a', role: 'ai_manager' as const, content: 'Good morning. What is the focus for today?', timestamp: `${_genConvDate(9)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-7b', role: 'employee' as const, content: 'Starting on the caching layer now. Redis cluster is ready — Ravi set it up yesterday.', timestamp: `${_genConvDate(9)}T09:02:00Z`, isPrivate: false },
    ],
    aiSummary: 'Starting caching layer. Redis cluster provisioned by Ravi.',
    sentiment: 'positive' as const, topicsDiscussed: ['caching layer', 'Redis'],
    actionItems: [], blockers: [], wins: ['Redis cluster ready'], hasPrivateContent: false, privateMessageIds: [] },
  { id: 'conv-8', employeeId: 'e1', date: _genConvDate(10), type: 'daily_standup' as const,
    messages: [
      { id: 'msg-8a', role: 'ai_manager' as const, content: 'How is the caching implementation going?', timestamp: `${_genConvDate(10)}T09:01:00Z`, isPrivate: false },
      { id: 'msg-8b', role: 'employee' as const, content: 'Good progress. Cache invalidation strategy is trickier than I thought but I have a solid approach now.', timestamp: `${_genConvDate(10)}T09:02:00Z`, isPrivate: false },
      { id: 'msg-8c', role: 'employee' as const, content: 'Also, I have been feeling a bit overwhelmed with the timeline. Can we talk about priorities?', timestamp: `${_genConvDate(10)}T09:03:00Z`, isPrivate: true },
    ],
    aiSummary: 'Caching progressing. Cache invalidation strategy solidified. Employee expressed feeling overwhelmed with timeline.',
    sentiment: 'concerned' as const, topicsDiscussed: ['caching', 'cache invalidation', 'workload'],
    actionItems: [{ description: 'Review priority list with manager' }], blockers: [], wins: ['Cache invalidation strategy defined'], hasPrivateContent: true, privateMessageIds: ['msg-8c'] },
];

export const conversationExtracts = [
  { employeeId: 'e1', extractedAt: '2026-03-31',
    ongoingBlockers: ['Security review sign-off pending'],
    commitmentsMade: ['API gateway caching layer delivery', 'Auth proxy module delivery'],
    winsNoted: ['Rate limiter completed', 'Custom JWT validator built', 'p95 latency under 80ms'],
    concernsRaised: ['Feeling overwhelmed with timeline'],
    keyTopics: ['API gateway', 'caching', 'auth proxy', 'infrastructure'],
    sentimentTrend: 'stable' as const },
  { employeeId: 'e2', extractedAt: '2026-03-31',
    ongoingBlockers: [],
    commitmentsMade: ['Design system v2 components'],
    winsNoted: ['All 40 components shipped on time'],
    concernsRaised: [],
    keyTopics: ['design system', 'UI components'],
    sentimentTrend: 'improving' as const },
];

// Pending approvals for Checkpoint
export const pendingApprovals = [
  { id: 'ap1', type: 'task_assignment' as const, title: 'API Refactor — Cache Layer', employeeId: 'e1', employeeName: 'Arjun Mehta',
    department: 'Core Architecture', priority: 'high' as const, createdAt: '2026-03-28', deadline: '2026-04-15',
    source: 'ai_roadmap' as const, milestoneTitle: 'API Gateway',
    botRecommendation: 'Approve — aligns with Arjun\'s current workstream and skill profile. Capacity check: 72% utilized.',
    status: 'pending' as const },
  { id: 'ap2', type: 'deadline_extension' as const, title: 'User Research Report — 3 day extension', employeeId: 'e4', employeeName: 'Priya Sharma',
    department: 'Growth', priority: 'medium' as const, createdAt: '2026-03-30', deadline: '2026-04-08',
    source: 'negotiation' as const, milestoneTitle: 'User Research Phase 2',
    botRecommendation: 'Approve — minimal milestone impact, 5-day buffer remains. Employee cited scheduling conflicts with enterprise interviews.',
    status: 'pending' as const },
  { id: 'ap3', type: 'task_assignment' as const, title: 'CDN Configuration for Static Assets', employeeId: 'e3', employeeName: 'Ravi Krishnan',
    department: 'Data Infrastructure', priority: 'medium' as const, createdAt: '2026-03-29', deadline: '2026-04-20',
    source: 'ai_roadmap' as const, milestoneTitle: 'Scale Infrastructure',
    botRecommendation: 'Approve — Ravi has infrastructure expertise. Note: this starts before milestone official start date as a pre-requisite.',
    status: 'pending' as const },
  { id: 'ap4', type: 'scope_change' as const, title: 'Reduce OAuth scope to Google+GitHub only', employeeId: 'e1', employeeName: 'Arjun Mehta',
    department: 'Core Architecture', priority: 'low' as const, createdAt: '2026-03-27', deadline: '2026-04-10',
    source: 'negotiation' as const, milestoneTitle: 'Authentication System',
    botRecommendation: 'Consider — removing SAML reduces effort by ~2 weeks but limits enterprise readiness. Suggest deferring SAML to post-beta instead of removing.',
    status: 'pending' as const },
  { id: 'ap5', type: 'task_assignment' as const, title: 'Write Beta Onboarding Email Sequence', employeeId: 'e5', employeeName: 'Anika Desai',
    department: 'Growth', priority: 'high' as const, createdAt: '2026-03-30', deadline: '2026-04-12',
    source: 'ai_roadmap' as const, milestoneTitle: 'Beta Launch',
    botRecommendation: 'Approve — Anika has content writing strengths. Task directly supports beta milestone.',
    status: 'pending' as const },
];

// Generated reports for Synthesis
export const generatedReports = [
  { id: 'rpt1', type: 'board_summary' as const, title: 'Q1 2026 Board Summary', generatedAt: '2026-03-31T14:00:00Z', generatedBy: 'CEO' },
  { id: 'rpt2', type: 'department_review' as const, title: 'Core Architecture — March Review', generatedAt: '2026-03-28T10:00:00Z', generatedBy: 'CEO' },
  { id: 'rpt3', type: 'attrition_risk' as const, title: 'Attrition Risk Assessment — Q1', generatedAt: '2026-03-25T16:00:00Z', generatedBy: 'CEO' },
];

// Avatar configurations
export const avatarConfigs = [
  { id: 'av1', managerId: 'mgr1', departmentId: 'core-arch', photoUrl: '', animatedAvatarId: '',
    voiceType: 'prism' as const, clonedVoiceId: '',
    adaptiveRules: { highPerformer: 'Direct, ambitious, growth-oriented', steadyPerformer: 'Encouraging, supportive', underperformer: 'Patient, structured, milestone-focused', newEmployee: 'Warm, welcoming, explanatory' } },
];

// Execution Velocity
export const executionVelocity = {
  score: 73,
  trend: [
    { quarter: 'Q3 2025', score: 58 },
    { quarter: 'Q4 2025', score: 65 },
    { quarter: 'Q1 2026', score: 71 },
    { quarter: 'Current', score: 73 },
  ],
  subScores: {
    milestoneCompletion: 82,
    taskVelocity: 71,
    standupEngagement: 78,
    blockerResolution: 61,
  },
  revenueEstimate: 2336000,
  narrative: 'Engineering is 2 weeks ahead on the auth milestone, but marketing\'s content roadmap is 40% behind plan. The sales pipeline gap in Q2 OKRs is the largest risk to the revenue target. Recommendation: reallocate 1 headcount from engineering to marketing for 3 weeks.',
};

// User accounts — maps login email to roles and employee records
export const userAccounts = [
  { email: 'ceo@nexora.com',   name: 'Vikram Patel',   availableRoles: ['ceo'] as const,                          defaultRole: 'ceo' as const,             employeeId: null },
  { email: 'arjun@nexora.com', name: 'Arjun Sharma',   availableRoles: ['manager', 'employee'] as const,          defaultRole: 'manager' as const,         employeeId: 'e1' },
  { email: 'priya@nexora.com', name: 'Priya Sharma',   availableRoles: ['department_head', 'manager'] as const,   defaultRole: 'department_head' as const, employeeId: 'e4' },
  { email: 'ravi@nexora.com',  name: 'Ravi Krishnan',  availableRoles: ['employee'] as const,                     defaultRole: 'employee' as const,        employeeId: 'e3' },
  { email: 'neha@nexora.com',  name: 'Neha Gupta',     availableRoles: ['employee'] as const,                     defaultRole: 'employee' as const,        employeeId: 'e2' },
  { email: 'demo@nexora.com',  name: 'Demo User',      availableRoles: ['ceo', 'department_head', 'manager', 'employee'] as const, defaultRole: 'ceo' as const, employeeId: 'e1' },
];
