import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../auth/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Terminal, Bell, Shield, Users, BarChart2, RefreshCw, ChevronRight, Check, AlertTriangle, Zap, Moon, Sun, Globe, Lock, Eye, Sliders, LogOut } from 'lucide-react';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full border transition-all duration-300 ${on ? 'bg-white/20 border-white/30' : 'bg-white/5 border-white/10'}`}
    >
      <motion.div
        layout
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-[3px] w-[18px] h-[18px] rounded-full transition-colors duration-300 ${on ? 'bg-white' : 'bg-white/30'}`}
      />
    </button>
  );
}

function SelectInput({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/30 transition-colors"
    >
      {options.map(o => <option key={o} value={o} className="bg-[#111]">{o}</option>)}
    </select>
  );
}

const navItems = [
  { id: 'performance', icon: BarChart2, label: 'Performance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'team', icon: Users, label: 'Team Rules' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'integrations', icon: Globe, label: 'Integrations' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
];

type Section = 'performance' | 'notifications' | 'team' | 'security' | 'integrations' | 'terminal';

export function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('performance');
  const [saved, setSaved] = useState(false);
  const [terminalLog, setTerminalLog] = useState<{cmd: string; out: string}[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SETTINGS_KEY = 'prism_settings';
  const savedSettings = (() => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; }
  })();

  // Performance settings
  const [perf, setPerf] = useState({
    liveStreaming: true,
    predictiveAnalytics: true,
    burnoutAlerts: true,
    attritionML: true,
    reviewCycle: 'Quarterly',
    kpiWeighting: 'Balanced',
    ratingScale: '100-point',
    benchmarkMode: 'Internal',
    ...(savedSettings.perf || {}),
  });

  // Notification settings
  const [notifs, setNotifs] = useState({
    attritionThreshold: 60,
    burnoutThreshold: 70,
    missedTimesheets: true,
    kpiMisses: true,
    promotionEligible: true,
    weeklyDigest: true,
    slackIntegration: false,
    emailAlerts: true,
    channels: 'Email',
    ...(savedSettings.notifs || {}),
  });

  // Team settings
  const [team, setTeam] = useState({
    selfReviewEnabled: true,
    peerReviewAnonymous: true,
    managerOverride: true,
    goalCascading: true,
    kpiVisibility: 'Managers',
    salaryVisibility: 'HR Only',
    maxOKRsPerEmployee: '5',
  });

  // Security
  const [sec, setSec] = useState({
    twoFA: true,
    ssoEnabled: false,
    auditLog: true,
    sessionTimeout: '8 hours',
    dataRetention: '24 months',
    exportControl: true,
  });

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ perf, notifs, team, sec }));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const settingRow = (label: string, desc: string, control: React.ReactNode) => (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-white/80 text-base font-light">{label}</p>
        <p className="text-white/30 text-sm mt-0.5">{desc}</p>
      </div>
      <div className="flex-shrink-0 ml-6">{control}</div>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <SettingsIcon size={14} className="text-white/40" /> System Configuration
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Core <span className="text-white/30 italic font-serif">Parameters</span>
          </h1>
        </div>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-8 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 text-sm font-light ${
            saved ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                <Check size={14} /> Saved
              </motion.div>
            ) : (
              <motion.div key="save" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                <RefreshCw size={14} /> Save Changes
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="md:w-56 flex-shrink-0">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                data-cursor={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-light transition-all text-left ${
                  activeSection === item.id
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={14} />
                {item.label}
                {activeSection === item.id && <ChevronRight size={12} className="ml-auto text-white/40" />}
              </button>
            ))}
          </div>

          {/* Account info + logout — always visible at bottom of sidebar */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            {user && (
              <p className="text-sm font-mono text-white/25 uppercase tracking-widest px-4 mb-3 truncate">
                {user.email}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-light text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all text-left"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
              {/* PERFORMANCE */}
              {activeSection === 'performance' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">Telemetry Engine</h2>

                  <div className="space-y-0 mb-8">
                    {settingRow('Live Data Streaming', 'Continuous real-time update of employee vectors', <Toggle on={perf.liveStreaming} onChange={v => setPerf(p => ({ ...p, liveStreaming: v }))} />)}
                    {settingRow('Predictive Analytics', 'AI-driven attrition and burnout risk forecasting', <Toggle on={perf.predictiveAnalytics} onChange={v => setPerf(p => ({ ...p, predictiveAnalytics: v }))} />)}
                    {settingRow('Burnout Intervention Alerts', 'Flag employees at critical stress/cognitive load thresholds', <Toggle on={perf.burnoutAlerts} onChange={v => setPerf(p => ({ ...p, burnoutAlerts: v }))} />)}
                    {settingRow('ML-Based Attrition Scoring', 'Machine learning model refreshes attrition risk weekly', <Toggle on={perf.attritionML} onChange={v => setPerf(p => ({ ...p, attritionML: v }))} />)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    {[
                      { label: 'Review Cycle', key: 'reviewCycle', opts: ['Monthly', 'Quarterly', 'Bi-Annual', 'Annual'] },
                      { label: 'KPI Weighting', key: 'kpiWeighting', opts: ['Balanced', 'Revenue-Heavy', 'Quality-Heavy', 'Custom'] },
                      { label: 'Rating Scale', key: 'ratingScale', opts: ['100-point', '10-point', '5-star', 'A-F Grade'] },
                      { label: 'Benchmark Mode', key: 'benchmarkMode', opts: ['Internal', 'Industry', 'Custom Cohort'] },
                    ].map(({ label, key, opts }) => (
                      <div key={key}>
                        <p className="text-white/50 text-sm uppercase tracking-[0.12em] mb-2">{label}</p>
                        <SelectInput
                          value={(perf as any)[key]}
                          options={opts}
                          onChange={v => setPerf(p => ({ ...p, [key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">Alert Feed</h2>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { label: 'Attrition Alert Threshold', key: 'attritionThreshold', unit: '%', min: 30, max: 90 },
                      { label: 'Burnout Alert Threshold', key: 'burnoutThreshold', unit: '%', min: 30, max: 95 },
                    ].map(({ label, key, unit, min, max }) => (
                      <div key={key} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-5">
                        <p className="text-white/40 text-sm uppercase tracking-[0.12em] mb-3">{label}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl font-light text-white">{(notifs as any)[key]}<span className="text-lg text-white/30">{unit}</span></span>
                        </div>
                        <input
                          type="range" min={min} max={max}
                          value={(notifs as any)[key]}
                          onChange={e => setNotifs(n => ({ ...n, [key]: parseInt(e.target.value) }))}
                          className="w-full accent-amber-400"
                        />
                        <div className="flex justify-between text-sm font-mono text-white/20 mt-1">
                          <span>{min}%</span><span>{max}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-0 mb-8">
                    {settingRow('Missed Timesheet Alerts', 'Notify when an employee misses 2+ consecutive timesheets', <Toggle on={notifs.missedTimesheets} onChange={v => setNotifs(n => ({ ...n, missedTimesheets: v }))} />)}
                    {settingRow('KPI Miss Notifications', 'Alert managers when KPIs fall below target for 2+ weeks', <Toggle on={notifs.kpiMisses} onChange={v => setNotifs(n => ({ ...n, kpiMisses: v }))} />)}
                    {settingRow('Promotion Eligibility Pings', 'Notify HR when an employee enters promotion window', <Toggle on={notifs.promotionEligible} onChange={v => setNotifs(n => ({ ...n, promotionEligible: v }))} />)}
                    {settingRow('Weekly Digest', 'Summary of all performance signals every Monday', <Toggle on={notifs.weeklyDigest} onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))} />)}
                    {settingRow('Slack Integration', 'Push critical alerts to configured Slack channels', <Toggle on={notifs.slackIntegration} onChange={v => setNotifs(n => ({ ...n, slackIntegration: v }))} />)}
                    {settingRow('Email Alerts', 'Send alerts to registered HR & manager email addresses', <Toggle on={notifs.emailAlerts} onChange={v => setNotifs(n => ({ ...n, emailAlerts: v }))} />)}
                  </div>
                </div>
              )}

              {/* TEAM */}
              {activeSection === 'team' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">Team Protocol</h2>

                  <div className="space-y-0 mb-8">
                    {settingRow('Self-Reviews', 'Allow employees to submit self-assessments in 360° cycles', <Toggle on={team.selfReviewEnabled} onChange={v => setTeam(t => ({ ...t, selfReviewEnabled: v }))} />)}
                    {settingRow('Anonymous Peer Reviews', 'Reviewers remain anonymous to the subject', <Toggle on={team.peerReviewAnonymous} onChange={v => setTeam(t => ({ ...t, peerReviewAnonymous: v }))} />)}
                    {settingRow('Manager Score Override', 'Managers can adjust final composite score with justification', <Toggle on={team.managerOverride} onChange={v => setTeam(t => ({ ...t, managerOverride: v }))} />)}
                    {settingRow('Goal Cascading', 'Org-level OKRs automatically cascade to team and individual level', <Toggle on={team.goalCascading} onChange={v => setTeam(t => ({ ...t, goalCascading: v }))} />)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    {[
                      { label: 'KPI Visibility', key: 'kpiVisibility', opts: ['Everyone', 'Managers', 'HR Only', 'Private'] },
                      { label: 'Salary Visibility', key: 'salaryVisibility', opts: ['Everyone', 'Managers', 'HR Only'] },
                      { label: 'Max OKRs / Employee', key: 'maxOKRsPerEmployee', opts: ['3', '4', '5', '6', '7', '10'] },
                    ].map(({ label, key, opts }) => (
                      <div key={key}>
                        <p className="text-white/50 text-sm uppercase tracking-[0.12em] mb-2">{label}</p>
                        <SelectInput value={(team as any)[key]} options={opts} onChange={v => setTeam(t => ({ ...t, [key]: v }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">Security Matrix</h2>

                  <div className="space-y-0 mb-8">
                    {settingRow('Two-Factor Authentication', 'Require 2FA for all HR and manager accounts', <Toggle on={sec.twoFA} onChange={v => setSec(s => ({ ...s, twoFA: v }))} />)}
                    {settingRow('SSO / SAML Integration', 'Enable single sign-on via your identity provider', <Toggle on={sec.ssoEnabled} onChange={v => setSec(s => ({ ...s, ssoEnabled: v }))} />)}
                    {settingRow('Audit Log', 'Record all data access and configuration changes', <Toggle on={sec.auditLog} onChange={v => setSec(s => ({ ...s, auditLog: v }))} />)}
                    {settingRow('Export Control', 'Restrict bulk data exports to HR Director only', <Toggle on={sec.exportControl} onChange={v => setSec(s => ({ ...s, exportControl: v }))} />)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    {[
                      { label: 'Session Timeout', key: 'sessionTimeout', opts: ['1 hour', '4 hours', '8 hours', '24 hours'] },
                      { label: 'Data Retention', key: 'dataRetention', opts: ['12 months', '24 months', '36 months', 'Indefinite'] },
                    ].map(({ label, key, opts }) => (
                      <div key={key}>
                        <p className="text-white/50 text-sm uppercase tracking-[0.12em] mb-2">{label}</p>
                        <SelectInput value={(sec as any)[key]} options={opts} onChange={v => setSec(s => ({ ...s, [key]: v }))} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                    <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-400 text-sm font-light">Last Security Scan</p>
                      <p className="text-white/40 text-xs mt-1">Completed Nov 14, 2025 · 0 vulnerabilities detected · Next scan in 14 days</p>
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATIONS */}
              {activeSection === 'integrations' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">Node Links</h2>

                  <div className="space-y-4">
                    {[
                      { name: 'Slack', desc: 'Send alerts and weekly digests to team channels', status: 'disconnected', color: '#e8a629' },
                      { name: 'Jira', desc: 'Sync sprint velocity and task completion into KPI engine', status: 'connected', color: '#0052cc' },
                      { name: 'BambooHR', desc: 'Import headcount, roles, and leave balances automatically', status: 'connected', color: '#73c41d' },
                      { name: 'Greenhouse', desc: 'Track recruiter performance and offer metrics', status: 'disconnected', color: '#24b47e' },
                      { name: 'Workday', desc: 'Sync payroll, equity vest schedules, and compensation data', status: 'connected', color: '#f3622d' },
                      { name: 'Google Workspace', desc: 'Meeting frequency and collaboration signals from calendar', status: 'disconnected', color: '#4285f4' },
                    ].map((intg, i) => (
                      <motion.div
                        key={intg.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: intg.color + '20', color: intg.color }}>
                            {intg.name[0]}
                          </div>
                          <div>
                            <p className="text-white/80 text-sm font-light">{intg.name}</p>
                            <p className="text-white/30 text-xs mt-0.5">{intg.desc}</p>
                          </div>
                        </div>
                        <button className={`px-4 py-2 rounded-xl border text-xs uppercase tracking-widest transition-all ${
                          intg.status === 'connected'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                        }`}>
                          {intg.status === 'connected' ? 'Connected' : 'Connect'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* TERMINAL */}
              {activeSection === 'terminal' && (
                <div>
                  <h2 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">System Override</h2>

                  <div className="bg-black/60 border border-white/10 rounded-2xl p-6 font-mono text-xs space-y-2 mb-6">
                    <p className="text-white/20">// APEX Performance Intelligence v2.4.1</p>
                    <p className="text-white/20">// Kernel: Node 20 · Runtime: Edge · Region: ap-south-1</p>
                    <p className="text-emerald-400 mt-4">apex&gt; status --all</p>
                    <p className="text-white/60">  ● Performance engine    <span className="text-emerald-400">running</span></p>
                    <p className="text-white/60">  ● ML attrition model    <span className="text-emerald-400">running</span></p>
                    <p className="text-white/60">  ● Data pipeline         <span className="text-emerald-400">running</span>  last sync: 4m ago</p>
                    <p className="text-white/60">  ● Burnout detector      <span className="text-amber-400">degraded</span> — model refresh pending</p>
                    <p className="text-white/60">  ● Slack integration     <span className="text-white/30">disconnected</span></p>
                    <p className="text-emerald-400 mt-2">apex&gt; db:stats</p>
                    <p className="text-white/60">  Records: 8 employees · 52 KPIs · 24 OKRs · 8 reviews</p>
                    <p className="text-white/60">  Storage: 2.1 GB / 50 GB</p>
                    <p className="text-emerald-400 mt-2">apex&gt; <span className="animate-pulse">_</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Flush Cache',       icon: RefreshCw, color: '#38bdf8', response: '● Cache cleared. 142 MB freed. Next sync in 60s.' },
                      { label: 'Export All Data',   icon: Globe,     color: '#c084fc', response: '● Export queued. Download link sent to admin email.' },
                      { label: 'Re-run ML Models',  icon: Zap,       color: '#f59e0b', response: '● Attrition & burnout models refreshing. ETA: 3 min.' },
                      { label: 'Purge Audit Log',   icon: Lock,      color: '#f43f5e', response: '⚠ Requires Director confirmation. Request logged.' },
                    ].map(({ label, icon: Icon, color, response }) => (
                      <button
                        key={label}
                        onClick={() => setTerminalLog(prev => [
                          ...prev,
                          { cmd: label.toLowerCase().replace(/ /g, '-'), out: response }
                        ])}
                        className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem] text-sm font-light text-white/50 hover:text-white hover:border-white/15 hover:bg-white/[0.04] transition-all text-left"
                      >
                        <Icon size={14} style={{ color }} />
                        {label}
                      </button>
                    ))}
                  </div>
                  {terminalLog.length > 0 && (
                    <div className="mt-4 bg-black/60 border border-white/10 rounded-2xl p-4 font-mono text-xs space-y-2">
                      {terminalLog.map((entry, i) => (
                        <div key={i}>
                          <p className="text-emerald-400">apex&gt; {entry.cmd}</p>
                          <p className="text-white/60 ml-2">{entry.out}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
