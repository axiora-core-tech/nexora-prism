export const employees = [
  {
    id: "e1",
    name: "Alex Mercer",
    role: "Senior Frontend Engineer",
    department: "Core Architecture",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NzI5NDAzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    performanceScore: 92,
    attritionRisk: "Low",
    attritionRiskPercentage: 12,
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
        reviewer: "Sarah Chen", relation: "Peer", date: "Nov 2025",
        scores: { communication: 92, technical: 96, leadership: 85, collaboration: 90, innovation: 95 },
        strengths: "Alex consistently delivers exceptional architecture. His React 19 migration plan was incredibly thorough.",
        improvements: "Could delegate more to junior engineers to free up bandwidth.",
        overall: 92
      },
      {
        reviewer: "Priya Sharma", relation: "Manager", date: "Nov 2025",
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
      { peer: "Sarah Chen", connection: "Strong", sentiment: 92, nodes: 15 },
      { peer: "Marcus Johnson", connection: "Moderate", sentiment: 78, nodes: 8 },
      { peer: "Priya Sharma", connection: "Weak", sentiment: 85, nodes: 3 }
    ],
    equipment: ["MacBook Pro M3 Max", "Studio Display", "Herman Miller Embody", "Keychron K2"]
  },
  {
    id: "e2",
    name: "Sarah Chen",
    role: "Product Designer",
    department: "User Experience",
    stage: "Onboarding",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc3MjkwNTEzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    performanceScore: 88,
    attritionRisk: "Low",
    attritionRiskPercentage: 18,
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
        reviewer: "Alex Mercer", relation: "Peer", date: "Nov 2025",
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
      { peer: "Alex Mercer", connection: "Strong", sentiment: 94, nodes: 15 },
      { peer: "Priya Sharma", connection: "Moderate", sentiment: 82, nodes: 9 }
    ],
    equipment: ["MacBook Pro M3", "Wacom Cintiq", "iPad Pro"]
  },
  {
    id: "e3",
    name: "Marcus Johnson",
    role: "Backend Developer",
    department: "Data Infrastructure",
    stage: "Established",
    avatar: "https://images.unsplash.com/photo-1758876204244-930299843f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzcyOTYxNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    performanceScore: 72,
    attritionRisk: "High",
    attritionRiskPercentage: 78,
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
        reviewer: "Alex Mercer", relation: "Peer", date: "Nov 2025",
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
      { peer: "Alex Mercer", connection: "Moderate", sentiment: 70, nodes: 8 },
      { peer: "Priya Sharma", connection: "Weak", sentiment: 60, nodes: 2 }
    ],
    equipment: ["Dell XPS 15", "UltraWide Monitor"]
  },
  {
    id: "e4",
    name: "Priya Sharma",
    role: "Marketing Manager",
    department: "Growth",
    stage: "Transitioning",
    avatar: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3NzI5NjQwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    performanceScore: 85,
    attritionRisk: "Medium",
    attritionRiskPercentage: 45,
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
        reviewer: "Sarah Chen", relation: "Peer", date: "Nov 2025",
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
      { peer: "Sarah Chen", connection: "Moderate", sentiment: 88, nodes: 9 },
      { peer: "Marcus Johnson", connection: "Weak", sentiment: 55, nodes: 2 }
    ],
    equipment: ["MacBook Air M2", "AirPods Pro"]
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
  { id: 1, type: "warning", message: "Marcus Johnson has missed 2 consecutive timesheets. Attrition risk increased to 78%.", user: "Marcus Johnson" },
  { id: 2, type: "success", message: "Sarah Chen completed 'Enterprise Design Systems' LMS module. Promotion probability +5%.", user: "Sarah Chen" },
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
