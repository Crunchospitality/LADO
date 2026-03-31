import React, { useState, useEffect } from "react";

// ─── Design Tokens (identical to onboarding.jsx) ───
const tokens = {
  color: {
    primary: "#20324D",
    secondary: "#7BC8A4",
    background: "#FAF7F2",
    surface: "#F1EEE8",
    text: "#20242B",
    accent: "#D9A05B",
    muted: "#667085",
    border: "#E7E3DC",
    success: "#5FAE84",
    info: "#3E7CB1",
    warning: "#C98A3D",
    error: "#C85C5C",
    white: "#FCFBF8",
    deepSlate: "#344054",
    ink: "#111827",
  },
  radius: { sm: 12, md: 16, lg: 20, xl: 24 },
  shadow: {
    card: "0 8px 24px rgba(32,36,43,0.06)",
    modal: "0 18px 48px rgba(32,36,43,0.12)",
    button: "0 2px 8px rgba(32,50,77,0.10)",
    glow: "0 0 0 4px rgba(123,200,164,0.18)",
  },
};

const fontStack = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const headingFont = "'Sora', 'Inter', -apple-system, sans-serif";

// ─── Icons ───
const Icons = {
  User: ({ size = 24, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  TrendingUp: ({ size = 20, color = tokens.color.success }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendingDown: ({ size = 20, color = tokens.color.success }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Search: ({ size = 20, color = tokens.color.accent }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Layers: ({ size = 20, color = tokens.color.accent }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  DollarSign: ({ size = 20, color = tokens.color.accent }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Shield: ({ size = 20, color = tokens.color.secondary }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Calendar: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Check: ({ size = 20, color = tokens.color.success }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  CheckCircle: ({ size = 20, color = tokens.color.success }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ChevronRight: ({ size = 18, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  ChevronDown: ({ size = 18, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  ChevronUp: ({ size = 18, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  ),
  FileText: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Zap: ({ size = 20, color = tokens.color.accent }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Globe: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  Pen: ({ size = 20, color = tokens.color.secondary }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  BarChart: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  Heart: ({ size = 20, color = tokens.color.error }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  MessageCircle: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  ),
  Settings: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  X: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Play: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Star: ({ size = 20, color = tokens.color.accent }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  MapPin: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ExternalLink: ({ size = 18, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/>
    </svg>
  ),
  RefreshCw: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36"/>
    </svg>
  ),
  Upload: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Send: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Plus: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Minus: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  AlertTriangle: ({ size = 20, color = tokens.color.warning }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Home: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Compass: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="12 2 16.5 8.5 12 15 7.5 8.5 12 2"/>
    </svg>
  ),
  Hammer: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 1h-5l-1.5 3m0 7.5l1.5 3h5"/><path d="M3 21l9-9"/>
    </svg>
  ),
  Award: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8 14 12 17 16 14"/><line x1="12" y1="17" x2="12" y2="23"/><line x1="9" y1="23" x2="15" y2="23"/>
    </svg>
  ),
  Lock: ({ size = 20, color = tokens.color.muted }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  TrendingFlat: ({ size = 20, color = tokens.color.info }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="12" x2="3" y2="12"/><polyline points="6 9 3 12 6 15"/>
    </svg>
  ),
};

// ═══════════════════════════════════════
// ─── MOCK DATA ─────────────────────────
// ═══════════════════════════════════════

const MOCK_USER = {
  name: "Tommy",
  ladoName: "Atlas",
  currentJob: "Marketing Manager",
  skills: ["Marketing", "Social Media", "Content Creation"],
  hoursPerWeek: "15",
  budget: "pro",
  monthlyIncome: 5200,
  monthlyExpenses: 3800,
  currentSavings: 9500,
  sideHustleIncome: 1200,
  channel: "telegram",
  joinedDate: "2026-03-28",
};

const MOCK_COACH_MESSAGES = [
  {
    id: 1,
    message: "Based on your week, I reworked your schedule — check it out",
    action: "View",
    timestamp: "1 hour ago",
    icon: Icons.Layers,
  },
  {
    id: 2,
    message: "You're 4 weeks behind your runway target. Here's a 3-step fix.",
    action: "See Plan",
    timestamp: "3 hours ago",
    icon: Icons.AlertTriangle,
  },
  {
    id: 3,
    message: "Your Etsy store content is getting stale. I drafted 5 new posts.",
    action: "Review",
    timestamp: "Yesterday",
    icon: Icons.Zap,
  },
];

const MOCK_QUICK_ACTIONS = [
  { id: 1, label: "Message Atlas", icon: Icons.MessageCircle, color: tokens.color.info },
  { id: 2, label: "My Schedule", icon: Icons.Calendar, color: tokens.color.accent },
  { id: 3, label: "Generate Doc", icon: Icons.FileText, color: tokens.color.secondary },
  { id: 4, label: "Update Numbers", icon: Icons.DollarSign, color: tokens.color.accent },
];

const MOCK_HUSTLES = [
  {
    id: 1,
    name: "AI Etsy Stores",
    startupCost: "$50-200",
    timeToFirstDollar: "2-4 weeks",
    difficulty: 3,
    aiLeverageScore: 92,
    saturation: "High",
    location: "Remote",
  },
  {
    id: 2,
    name: "UGC Content Creation",
    startupCost: "$0-100",
    timeToFirstDollar: "3-6 weeks",
    difficulty: 2,
    aiLeverageScore: 78,
    saturation: "Medium",
    location: "Remote",
  },
  {
    id: 3,
    name: "Local Lead Generation",
    startupCost: "$100-500",
    timeToFirstDollar: "1-3 weeks",
    difficulty: 3,
    aiLeverageScore: 85,
    saturation: "Low",
    location: "Local",
  },
  {
    id: 4,
    name: "Digital Course Flipping",
    startupCost: "$200-1000",
    timeToFirstDollar: "4-8 weeks",
    difficulty: 4,
    aiLeverageScore: 88,
    saturation: "Medium",
    location: "Remote",
  },
];

const MOCK_INFLUENCERS = [
  {
    id: 1,
    name: "Grant Cardone",
    initials: "GC",
    color: "#7BC8A4",
    category: "Real Estate/Sales",
    philosophy: "10X your income through sales mastery",
    followers: "3.2M",
    contentType: "YouTube, Podcast, Social",
  },
  {
    id: 2,
    name: "Alex Hormozi",
    initials: "AH",
    color: "#D9A05B",
    category: "Business Acquisition",
    philosophy: "Buy businesses cheap, scale them up",
    followers: "2.1M",
    contentType: "YouTube, TikTok, Email",
  },
  {
    id: 3,
    name: "Tony Robbins",
    initials: "TR",
    color: "#3E7CB1",
    category: "Mindset/Peak Performance",
    philosophy: "Unlock your potential through psychology",
    followers: "4.8M",
    contentType: "Books, Seminars, Social",
  },
  {
    id: 4,
    name: "Pat Flynn",
    initials: "PF",
    color: "#5FAE84",
    category: "Passive Income",
    philosophy: "Build sustainable passive income streams",
    followers: "1.5M",
    contentType: "Podcast, Blog, YouTube",
  },
];

const MOCK_NEWS = [
  {
    id: 1,
    title: "AI Text-to-Image Tools Drive 340% Growth in Print-on-Demand",
    source: "eCommerce Times",
    date: "Mar 28, 2026",
    summary: "Latest data shows entrepreneurs using AI design tools are scaling POD stores 5x faster. Etsy sellers report 40% higher margins using Midjourney + Printful integration.",
  },
  {
    id: 2,
    title: "UGC Creators Now Earn $2K-5K Per Video",
    source: "Creator Economy Weekly",
    date: "Mar 27, 2026",
    summary: "User-generated content creators in 2026 are commanding premium rates from brands. TikTok creators pivoting to B2B UGC seeing 60% income increase.",
  },
  {
    id: 3,
    title: "Side Income Now Accounts for 23% of U.S. Household Earnings",
    source: "Federal Reserve Report",
    date: "Mar 26, 2026",
    summary: "Record number of Americans building side hustles. Average side income contributor now makes $1,200-3,500/month while maintaining full-time employment.",
  },
];

const MOCK_IDEA_RIVER = [
  {
    id: 1,
    title: "LinkedIn Ghostwriting for Coaches",
    description: "Write viral posts for business coaches at $300-500 each",
    match: 89,
  },
  {
    id: 2,
    title: "Micro-SaaS for Etsy Sellers",
    description: "Build a tool that automates Etsy keyword research",
    match: 76,
  },
  {
    id: 3,
    title: "Agency Management Consulting",
    description: "Help 2-3 person agencies systemize their operations",
    match: 82,
  },
];

const MOCK_SCHEDULE = [
  { day: "Mon", blocks: [{ type: "job", label: "9-to-5", start: 9, end: 17 }, { type: "hustle", label: "Content", start: 19, end: 21 }] },
  { day: "Tue", blocks: [{ type: "job", label: "9-to-5", start: 9, end: 17 }, { type: "hustle", label: "Orders", start: 20, end: 22 }] },
  { day: "Wed", blocks: [{ type: "job", label: "9-to-5", start: 9, end: 17 }, { type: "hustle", label: "Research", start: 18, end: 20 }, { type: "hustle", label: "Content", start: 20, end: 22 }] },
  { day: "Thu", blocks: [{ type: "job", label: "9-to-5", start: 9, end: 17 }, { type: "hustle", label: "Outreach", start: 19, end: 21 }] },
  { day: "Fri", blocks: [{ type: "job", label: "9-to-5", start: 9, end: 17 }] },
  { day: "Sat", blocks: [{ type: "hustle", label: "Deep Work", start: 8, end: 12 }, { type: "hustle", label: "Content", start: 14, end: 17 }] },
  { day: "Sun", blocks: [{ type: "hustle", label: "Planning", start: 10, end: 12 }] },
];

const MOCK_ACTIVE_HUSTLES = [
  {
    id: 1,
    name: "Etsy Print-on-Demand Store",
    status: "Active",
    week: 3,
    progress: 45,
    nextTask: "Upload 5 new designs",
    revenueThisMonth: "$840",
    actions: ["Content", "Outreach", "Orders"],
  },
  {
    id: 2,
    name: "UGC Content Freelancing",
    status: "Planning",
    week: 0,
    progress: 15,
    nextTask: "Record first portfolio video",
    revenueThisMonth: "$0",
    actions: ["Portfolio", "Outreach", "Pitch"],
  },
];

const MOCK_LOCAL_EVENTS = [
  {
    id: 1,
    title: "Miami Entrepreneurs Meetup",
    date: "Mar 15, 2026",
    location: "Miami, FL",
    attendees: "240+",
  },
  {
    id: 2,
    title: "Side Hustle Saturday — Wynwood",
    date: "Apr 2, 2026",
    location: "Wynwood, FL",
    attendees: "180+",
  },
  {
    id: 3,
    title: "E-Commerce Bootcamp",
    date: "Apr 10, 2026",
    location: "Downtown Miami",
    attendees: "320+",
  },
];

const MOCK_CHECKLIST_ITEMS = [
  { id: 1, label: "6 months expenses saved", completed: false, value: "$9,500 / $22,800" },
  { id: 2, label: "Side hustle at 75% salary for 3+ months", completed: false, value: "$1,200 / $3,900/mo" },
  { id: 3, label: "At least 2 income streams active", completed: true, value: "2 streams" },
  { id: 4, label: "Health insurance plan identified", completed: true, value: "Blue Cross" },
  { id: 5, label: "Business formally registered (LLC/DBA)", completed: false, value: "Pending" },
  { id: 6, label: "Emergency client pipeline (3+ leads)", completed: false, value: "2 leads" },
];

const MOCK_WELLNESS_RECOMMENDATIONS = [
  {
    id: 1,
    name: "Zen Yoga Studio",
    category: "Yoga",
    distance: "0.5 mi",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Float Miami",
    category: "Sensory Deprivation",
    distance: "1.2 mi",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mindful Movement",
    category: "Meditation Classes",
    distance: "2 mi",
    rating: 4.7,
  },
];

const MOCK_SUCCESS_STORIES = [
  {
    id: 1,
    name: "Sarah",
    quote: "I quit my accounting job after 8 months with LADO. She now makes $6,200/mo from her Etsy store.",
    timeline: "8 months",
  },
  {
    id: 2,
    name: "Marcus",
    quote: "Went from $0 side income to replacing his $4,500 salary in 11 months.",
    timeline: "11 months",
  },
];

const MOCK_EDUCATION = [
  {
    id: 1,
    title: "How to Read a P&L Statement",
    duration: "12 min",
    summary: "Learn the three sections of a P&L statement and what each metric means for your business. Perfect for first-time business owners.",
  },
  {
    id: 2,
    title: "Getting Your First Business Loan",
    duration: "8 min",
    summary: "Step-by-step guide to preparing for and securing your first small business loan. Covers SBA loans, bank loans, and alternative financing.",
  },
  {
    id: 3,
    title: "Tax Basics for Side Hustlers",
    duration: "15 min",
    summary: "Essential tax concepts for independent contractors. Includes quarterly estimated taxes, deductible expenses, and record-keeping requirements.",
  },
];

const MOCK_TOOLS = [
  {
    id: 1,
    name: "Canva Pro",
    price: "$13/mo",
    category: "Design",
    relevance: "Essential for your Etsy store content",
  },
  {
    id: 2,
    name: "Printful",
    price: "Free + per-order",
    category: "Print-on-Demand",
    relevance: "Best POD integration for Etsy",
  },
  {
    id: 3,
    name: "TubeBuddy",
    price: "$8/mo",
    category: "YouTube SEO",
    relevance: "If you start a YouTube channel",
  },
];

const MOCK_PROFILE_FIELDS = [
  { key: "name", label: "Full Name", value: "Tommy Chen" },
  { key: "job", label: "Current Job", value: "Marketing Manager" },
  { key: "hours", label: "Hustle Hours/Week", value: "15 hours" },
  { key: "salary", label: "Monthly Salary", value: "$5,200" },
  { key: "expenses", label: "Monthly Expenses", value: "$3,800" },
  { key: "savings", label: "Savings (6mo runway)", value: "$9,500" },
  { key: "hustleIncome", label: "Side Hustle Income", value: "$1,200/mo" },
  { key: "agentName", label: "Agent Name", value: "Atlas" },
  { key: "channel", label: "Preferred Channel", value: "Telegram" },
];

const MOCK_UPLOADED_DOCS = [
  { id: 1, name: "Resume_2026.pdf", uploadDate: "Mar 25", learned: "Skills: Marketing, Sales, Content" },
  { id: 2, name: "Business_Ideas_Notes.docx", uploadDate: "Mar 20", learned: "Interested in Etsy & UGC content" },
];

const MOCK_GOAL_CHAT = [
  {
    id: 1,
    type: "agent",
    message: "Tell me about your biggest goal for the next 6 months.",
  },
  {
    id: 2,
    type: "user",
    message: "I want to replace my salary and quit by September.",
  },
  {
    id: 3,
    type: "agent",
    message: "That's 6 months away. Based on your Freedom Number of $3,800/mo and current hustle income of $1,200/mo, you need to 3x your side income. Let's map that out.",
  },
];

// ═══════════════════════════════════════
// ─── SHARED COMPONENTS ────────────────
// ═══════════════════════════════════════

function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: tokens.color.white,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.color.border}`,
        boxShadow: tokens.shadow.card,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = tokens.shadow.modal; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = tokens.shadow.card; e.currentTarget.style.transform = "translateY(0)"; }}}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color = tokens.color.secondary, height = 6, showLabel = false }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div>
      <div style={{ height, borderRadius: height / 2, background: tokens.color.border, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: height / 2, width: `${pct}%`,
          background: pct >= 100 ? tokens.color.success : color,
          transition: "width 0.6s ease",
        }} />
      </div>
      {showLabel && (
        <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginTop: 4 }}>
          {pct}%
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <h2 style={{ fontFamily: headingFont, fontSize: 20, fontWeight: 700, color: tokens.color.text, margin: 0 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Pill({ children, color = tokens.color.success, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 12px", borderRadius: 20,
      background: bg || `${color}12`, border: `1px solid ${color}28`,
      fontFamily: fontStack, fontSize: 12, fontWeight: 600, color,
    }}>
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", size = "md", onClick, style = {}, disabled = false }) {
  const base = {
    fontFamily: fontStack, fontWeight: 600, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: tokens.radius.sm, transition: "all 0.2s", display: "inline-flex",
    alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.5 : 1,
  };
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 16 } };
  const variants = {
    primary: { background: tokens.color.primary, color: "#fff", boxShadow: tokens.shadow.button },
    secondary: { background: tokens.color.surface, color: tokens.color.text, border: `1px solid ${tokens.color.border}` },
    success: { background: tokens.color.success, color: "#fff" },
    ghost: { background: "transparent", color: tokens.color.primary },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
}

// ═══════════════════════════════════════
// ─── DASHBOARD SECTIONS ────────────────
// ═══════════════════════════════════════

function FreedomCommandCenter({ user }) {
  const freedomNumber = user.monthlyExpenses;
  const runwayNeeded = user.monthlyExpenses * 6;
  const salaryTarget = Math.round(user.monthlyIncome * 0.75);
  const runwayPct = user.currentSavings > 0 ? Math.min(Math.round((user.currentSavings / runwayNeeded) * 100), 100) : 0;
  const incomePct = user.sideHustleIncome > 0 ? Math.min(Math.round((user.sideHustleIncome / salaryTarget) * 100), 100) : 0;
  const quitReadyScore = Math.round((runwayPct * 0.4) + (incomePct * 0.6));

  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontFamily: headingFont, fontSize: 32, fontWeight: 700, color: tokens.color.text, margin: "0 0 24px 0" }}>Freedom Command Center</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8 }}>Freedom Number</div>
          <div style={{ fontFamily: headingFont, fontSize: 32, fontWeight: 700, color: tokens.color.primary }}>
            ${freedomNumber.toLocaleString()}
            <span style={{ fontSize: 16, fontWeight: 400, color: tokens.color.muted }}>/mo</span>
          </div>
        </Card>

        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8 }}>Quit-Ready Score</div>
          <svg width="100" height="100" style={{ margin: "0 auto" }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke={tokens.color.border} strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={tokens.color.secondary}
              strokeWidth="3"
              strokeDasharray={`${(quitReadyScore / 100) * 283} 283`}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dasharray 0.6s ease" }}
            />
            <text x="50" y="50" textAnchor="middle" dy="0.3em" style={{ fontFamily: headingFont, fontSize: 20, fontWeight: 700, fill: tokens.color.primary }}>
              {quitReadyScore}%
            </text>
          </svg>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>6-Month Runway</span>
            <span style={{ fontWeight: 600, color: tokens.color.text }}>${user.currentSavings} / ${runwayNeeded}</span>
          </div>
          <ProgressBar value={user.currentSavings} max={runwayNeeded} color={tokens.color.info} />
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>75% Salary Target</span>
            <span style={{ fontWeight: 600, color: tokens.color.text }}>${user.sideHustleIncome} / ${salaryTarget}/mo</span>
          </div>
          <ProgressBar value={user.sideHustleIncome} max={salaryTarget} color={tokens.color.success} />
        </Card>

        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8 }}>Confidence Score</div>
          <div style={{ fontFamily: headingFont, fontSize: 32, fontWeight: 700, color: tokens.color.secondary }}>78%</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}>
            <Icons.TrendingUp size={16} color={tokens.color.success} />
            <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.success }}>+8% this week</span>
          </div>
        </Card>

        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 8 }}>Employer Dependency</div>
          <div style={{ fontFamily: headingFont, fontSize: 32, fontWeight: 700, color: tokens.color.error }}>68%</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}>
            <Icons.TrendingDown size={16} color={tokens.color.success} />
            <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.success }}>-5% this week</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AICoachMessages() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.MessageCircle size={24} color={tokens.color.info} />}
        title="AI Coach Messages"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {MOCK_COACH_MESSAGES.map(msg => (
          <Card key={msg.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <msg.icon size={24} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fontStack, fontSize: 14, color: tokens.color.text, margin: 0, marginBottom: 4, fontWeight: 500 }}>
                  {msg.message}
                </p>
                <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => {}} style={{ width: "100%" }}>
              {msg.action}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Zap size={24} color={tokens.color.accent} />}
        title="Quick Actions"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        {MOCK_QUICK_ACTIONS.map(action => (
          <Card
            key={action.id}
            onClick={() => {}}
            style={{
              padding: 16,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <action.icon size={32} color={action.color} style={{ marginBottom: 8 }} />
            <p style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: tokens.color.text, margin: 0 }}>
              {action.label}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DiscoverHustles() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Compass size={24} color={tokens.color.secondary} />}
        title="Hustle Deep Dives"
      />
      <div style={{ display: "grid", gap: 12 }}>
        {MOCK_HUSTLES.map(hustle => (
          <Card key={hustle.id} style={{ overflow: "hidden" }}>
            <div
              onClick={() => setExpanded(expanded === hustle.id ? null : hustle.id)}
              style={{
                padding: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: expanded === hustle.id ? tokens.color.surface : "transparent",
              }}
            >
              <div>
                <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: 0, marginBottom: 4 }}>
                  {hustle.name}
                </h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Pill color={tokens.color.secondary}>{hustle.location}</Pill>
                  <Pill color={hustle.saturation === "Low" ? tokens.color.success : hustle.saturation === "Medium" ? tokens.color.warning : tokens.color.error}>
                    {hustle.saturation} Saturation
                  </Pill>
                </div>
              </div>
              <Icons.ChevronDown size={20} color={tokens.color.muted} style={{ transition: "transform 0.2s", transform: expanded === hustle.id ? "rotate(180deg)" : "rotate(0)" }} />
            </div>

            {expanded === hustle.id && (
              <div style={{ padding: 16, borderTop: `1px solid ${tokens.color.border}`, backgroundColor: tokens.color.white }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, textTransform: "uppercase", marginBottom: 4 }}>Startup Cost</div>
                    <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: tokens.color.text }}>{hustle.startupCost}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, textTransform: "uppercase", marginBottom: 4 }}>Time to First Dollar</div>
                    <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: tokens.color.text }}>{hustle.timeToFirstDollar}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, textTransform: "uppercase", marginBottom: 4 }}>Difficulty</div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Icons.Star key={i} size={14} color={i < hustle.difficulty ? tokens.color.accent : tokens.color.border} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, textTransform: "uppercase", marginBottom: 4 }}>AI Leverage</div>
                    <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: tokens.color.secondary }}>{hustle.aiLeverageScore}/100</div>
                  </div>
                </div>
                <Button variant="primary" style={{ width: "100%" }} onClick={() => {}}>
                  Launch Checklist <Icons.ExternalLink size={16} />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfluencerProfiles() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.User size={24} color={tokens.color.primary} />}
        title="Influencer Profiles"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {MOCK_INFLUENCERS.map(inf => (
          <Card key={inf.id} style={{ padding: 16, textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: inf.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontFamily: headingFont,
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {inf.initials}
            </div>
            <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 4px 0" }}>
              {inf.name}
            </h3>
            <Pill color={tokens.color.info} style={{ margin: "0 auto 8px" }}>
              {inf.category}
            </Pill>
            <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.muted, margin: "0 0 12px 0" }}>
              {inf.philosophy}
            </p>
            <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.text, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{inf.followers} followers</div>
              <div style={{ color: tokens.color.muted }}>{inf.contentType}</div>
            </div>
            <Button variant="secondary" size="sm" style={{ width: "100%" }} onClick={() => {}}>
              View Profile
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewsAndTrends() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.TrendingUp size={24} color={tokens.color.accent} />}
        title="News & Trends"
      />
      <div style={{ display: "grid", gap: 12 }}>
        {MOCK_NEWS.map(news => (
          <Card key={news.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: 0, flex: 1, marginRight: 12 }}>
                {news.title}
              </h3>
              <span style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, whiteSpace: "nowrap" }}>
                {news.date}
              </span>
            </div>
            <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.accent, fontWeight: 600, marginBottom: 8, display: "block" }}>
              {news.source}
            </span>
            <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.text, margin: 0, lineHeight: 1.5 }}>
              {news.summary}
            </p>
            <Button variant="ghost" size="sm" onClick={() => {}} style={{ marginTop: 12, padding: 0 }}>
              Read More <Icons.ExternalLink size={14} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IdeaRiver() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Zap size={24} color={tokens.color.warning} />}
        title="Idea River"
        action={<Button variant="secondary" size="sm" onClick={() => {}}>
          <Icons.RefreshCw size={14} /> Refresh Ideas
        </Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {MOCK_IDEA_RIVER.map(idea => (
          <Card key={idea.id} style={{ padding: 16 }}>
            <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: "0 0 8px 0" }}>
              {idea.title}
            </h3>
            <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.muted, margin: "0 0 12px 0" }}>
              {idea.description}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Pill color={tokens.color.secondary}>{idea.match}% match</Pill>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                Explore <Icons.ChevronRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Community() {
  return (
    <Card style={{ padding: 24, textAlign: "center", background: `linear-gradient(135deg, ${tokens.color.secondary}15 0%, ${tokens.color.info}15 100%)` }}>
      <h3 style={{ fontFamily: headingFont, fontSize: 20, fontWeight: 700, color: tokens.color.text, margin: 0, marginBottom: 8 }}>
        Join the LADO Club
      </h3>
      <p style={{ fontFamily: fontStack, fontSize: 14, color: tokens.color.muted, margin: "0 0 16px 0" }}>
        Connect with fellow builders, share wins, get feedback
      </p>
      <Button variant="primary" onClick={() => {}}>
        Join Community <Icons.ExternalLink size={16} />
      </Button>
    </Card>
  );
}

function WeeklyPlanner() {
  const totalHustleHours = MOCK_SCHEDULE.reduce((sum, day) => sum + day.blocks.filter(b => b.type === "hustle").reduce((daySum, b) => daySum + (b.end - b.start), 0), 0);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionHeader
          icon={<Icons.Calendar size={24} color={tokens.color.accent} />}
          title="Weekly Planner"
        />
        <Button variant="secondary" size="sm" onClick={() => {}}>
          Repeat Last Week
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Total Hustle Hours This Week</div>
          <div style={{ fontFamily: headingFont, fontSize: 24, fontWeight: 700, color: tokens.color.secondary }}>
            {totalHustleHours}h
          </div>
        </div>
        <Pill color={tokens.color.success}>+2h vs last week</Pill>
      </div>

      <Card style={{ padding: 16, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(7, 140px)`, gap: 12, minWidth: "100%" }}>
          {MOCK_SCHEDULE.map(day => (
            <div key={day.day}>
              <h4 style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 700, color: tokens.color.text, margin: "0 0 8px 0" }}>
                {day.day}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {day.blocks.map((block, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 8,
                      borderRadius: tokens.radius.sm,
                      background: block.type === "job" ? tokens.color.primary : tokens.color.secondary,
                      color: "#fff",
                      fontFamily: fontStack,
                      fontSize: 11,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {block.label}
                    <div style={{ fontSize: 10, opacity: 0.8 }}>{block.start}-{block.end}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ActiveHustles() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Hammer size={24} color={tokens.color.secondary} />}
        title="Projects / Hustles"
      />
      <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
        {MOCK_ACTIVE_HUSTLES.map(hustle => (
          <Card key={hustle.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: 0, marginBottom: 4 }}>
                  {hustle.name}
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <Pill color={hustle.status === "Active" ? tokens.color.success : tokens.color.warning}>
                    {hustle.status}
                  </Pill>
                  <Pill color={tokens.color.info}>Week {hustle.week}</Pill>
                </div>
              </div>
              <span style={{ fontFamily: headingFont, fontSize: 18, fontWeight: 700, color: tokens.color.accent }}>
                {hustle.revenueThisMonth}
              </span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Progress</div>
              <ProgressBar value={hustle.progress} max={100} color={tokens.color.secondary} />
            </div>

            <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${tokens.color.border}` }}>
              <span style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.text, fontWeight: 500 }}>
                Next: {hustle.nextTask}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {hustle.actions.map(action => (
                <Button key={action} variant="secondary" size="sm" onClick={() => {}}>
                  {action}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 16, background: `${tokens.color.info}08` }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Icons.Zap size={20} color={tokens.color.info} style={{ flexShrink: 0 }} />
          <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.text, margin: 0, lineHeight: 1.5 }}>
            <strong>Focus tip:</strong> Growing one hustle to $1K/mo is better than 3 hustles at $100. Stay locked in.
          </p>
        </div>
      </Card>
    </div>
  );
}

function LocalEvents() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.MapPin size={24} color={tokens.color.primary} />}
        title="Local Events"
      />
      <div style={{ display: "grid", gap: 12 }}>
        {MOCK_LOCAL_EVENTS.map(event => (
          <Card key={event.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: 0 }}>
                {event.title}
              </h3>
              <Button variant="secondary" size="sm" onClick={() => {}}>
                RSVP
              </Button>
            </div>
            <div style={{ display: "flex", gap: 16, fontFamily: fontStack, fontSize: 13, color: tokens.color.muted }}>
              <span>📅 {event.date}</span>
              <span>📍 {event.location}</span>
              <span>👥 {event.attendees}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DocumentGenerator() {
  const [selectedHustle, setSelectedHustle] = useState("etsy");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [moatAnswers, setMoatAnswers] = useState({ q1: "", q2: "", q3: "" });

  const docTypes = [
    { id: "pl", label: "P&L Statement" },
    { id: "projection", label: "Revenue Projections" },
    { id: "plan", label: "Business Plan" },
    { id: "branding", label: "Branding Guide" },
    { id: "loan", label: "Loan Package" },
    { id: "tax", label: "Tax Summary" },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.FileText size={24} color={tokens.color.info} />}
        title="Document Generator"
      />

      <Card style={{ padding: 20, marginBottom: 16 }}>
        <label style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 8 }}>
          Select Your Hustle
        </label>
        <select
          value={selectedHustle}
          onChange={e => setSelectedHustle(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontFamily: fontStack,
            fontSize: 14,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: tokens.radius.sm,
            cursor: "pointer",
          }}
        >
          <option value="etsy">Etsy Print-on-Demand Store</option>
          <option value="ugc">UGC Content Freelancing</option>
          <option value="local">Local Lead Generation</option>
          <option value="course">Digital Course Flipping</option>
        </select>
      </Card>

      <Card style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, marginBottom: 12 }}>
          Select Document Type
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
          {docTypes.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              style={{
                padding: 12,
                borderRadius: tokens.radius.sm,
                border: `2px solid ${selectedDoc === doc.id ? tokens.color.primary : tokens.color.border}`,
                background: selectedDoc === doc.id ? `${tokens.color.primary}08` : "transparent",
                fontFamily: fontStack,
                fontSize: 13,
                fontWeight: 600,
                color: selectedDoc === doc.id ? tokens.color.primary : tokens.color.text,
                cursor: "pointer",
              }}
            >
              {doc.label}
            </button>
          ))}
        </div>
      </Card>

      {selectedDoc && (
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 16px 0" }}>
            MOAT Questions
          </h3>
          <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 6 }}>
                What's your MOAT? What makes you different?
              </label>
              <textarea
                value={moatAnswers.q1}
                onChange={e => setMoatAnswers({ ...moatAnswers, q1: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  fontFamily: fontStack,
                  fontSize: 13,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: tokens.radius.sm,
                  minHeight: 80,
                  resize: "vertical",
                }}
                placeholder="Your answer here..."
              />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 6 }}>
                Who is your target customer?
              </label>
              <textarea
                value={moatAnswers.q2}
                onChange={e => setMoatAnswers({ ...moatAnswers, q2: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  fontFamily: fontStack,
                  fontSize: 13,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: tokens.radius.sm,
                  minHeight: 80,
                  resize: "vertical",
                }}
                placeholder="Your answer here..."
              />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 6 }}>
                What's your unfair advantage?
              </label>
              <textarea
                value={moatAnswers.q3}
                onChange={e => setMoatAnswers({ ...moatAnswers, q3: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  fontFamily: fontStack,
                  fontSize: 13,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: tokens.radius.sm,
                  minHeight: 80,
                  resize: "vertical",
                }}
                placeholder="Your answer here..."
              />
            </div>
          </div>
          <Button variant="primary" style={{ width: "100%" }} onClick={() => {}}>
            Generate Document
          </Button>
        </Card>
      )}
    </div>
  );
}

function IncomeExpenseLedger() {
  const entries = [
    { date: "Mar 28", description: "Printful Order Payout", category: "Income", amount: "$420", type: "income" },
    { date: "Mar 27", description: "Etsy Store Fees", category: "Expense", amount: "-$45", type: "expense" },
    { date: "Mar 25", description: "Canva Pro Subscription", category: "Expense", amount: "-$13", type: "expense" },
    { date: "Mar 24", description: "Content Creation Consultation", category: "Income", amount: "$300", type: "income" },
    { date: "Mar 22", description: "Advertising (Facebook)", category: "Expense", amount: "-$75", type: "expense" },
  ];

  const totalIncome = entries.filter(e => e.type === "income").reduce((sum, e) => sum + parseInt(e.amount.replace(/\D/g, "")), 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + parseInt(e.amount.replace(/\D/g, "")), 0);

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.BarChart size={24} color={tokens.color.info} />}
        title="Income & Expense Ledger"
      />
      <Card style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: fontStack,
            fontSize: 13,
          }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${tokens.color.border}`, background: tokens.color.surface }}>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600, color: tokens.color.text }}>Date</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600, color: tokens.color.text }}>Description</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600, color: tokens.color.text }}>Category</th>
                <th style={{ padding: 12, textAlign: "right", fontWeight: 600, color: tokens.color.text }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${tokens.color.border}` }}>
                  <td style={{ padding: 12, color: tokens.color.muted }}>{entry.date}</td>
                  <td style={{ padding: 12, color: tokens.color.text, fontWeight: 500 }}>{entry.description}</td>
                  <td style={{ padding: 12 }}>
                    <Pill color={entry.type === "income" ? tokens.color.success : tokens.color.error}>
                      {entry.category}
                    </Pill>
                  </td>
                  <td style={{
                    padding: 12,
                    textAlign: "right",
                    color: entry.type === "income" ? tokens.color.success : tokens.color.error,
                    fontWeight: 600,
                  }}>
                    {entry.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 12, borderTop: `1px solid ${tokens.color.border}`, background: tokens.color.surface, display: "flex", justifyContent: "space-around", fontWeight: 600, fontFamily: fontStack, fontSize: 13 }}>
          <span style={{ color: tokens.color.success }}>Income: +${totalIncome}</span>
          <span style={{ color: tokens.color.error }}>Expense: -${totalExpense}</span>
          <span style={{ color: tokens.color.text }}>Net: ${totalIncome - totalExpense}</span>
        </div>
      </Card>
      <Card style={{ padding: 12, marginTop: 12 }}>
        <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
          💡 <strong>Tip:</strong> Connect QuickBooks for automatic tracking →
        </span>
      </Card>
    </div>
  );
}

function FinanceEducation() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Play size={24} color={tokens.color.warning} />}
        title="Finance Education"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {MOCK_EDUCATION.map(edu => (
          <Card key={edu.id} style={{ overflow: "hidden" }}>
            <div style={{
              height: 120,
              background: `linear-gradient(135deg, ${tokens.color.info}30 0%, ${tokens.color.secondary}30 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}>
              <Icons.Play size={48} color={tokens.color.info} />
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontFamily: headingFont, fontSize: 14, fontWeight: 700, color: tokens.color.text, margin: "0 0 4px 0" }}>
                {edu.title}
              </h3>
              <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, display: "block", marginBottom: 8 }}>
                {edu.duration}
              </span>
              <p style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.text, margin: 0, lineHeight: 1.4 }}>
                {edu.summary}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Calculators() {
  const [beInputs, setBeInputs] = useState({ costs: 3000, price: 50, units: 100 });
  const [rpInputs, setRpInputs] = useState({ current: 1200, growth: 5 });

  const breakEven = beInputs.price > 0 ? Math.ceil(beInputs.costs / beInputs.price) : 0;
  const projections = [];
  for (let i = 0; i < 6; i++) {
    projections.push({
      month: i + 1,
      value: Math.round(rpInputs.current * Math.pow(1 + rpInputs.growth / 100, i)),
    });
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Calculator size={24} color={tokens.color.accent} />}
        title="Calculators"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 16px 0" }}>
            Break-Even Calculator
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 4 }}>
                Monthly Costs: ${beInputs.costs}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={beInputs.costs}
                onChange={e => setBeInputs({ ...beInputs, costs: parseInt(e.target.value) })}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 4 }}>
                Price per Unit: ${beInputs.price}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={beInputs.price}
                onChange={e => setBeInputs({ ...beInputs, price: parseInt(e.target.value) })}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 4 }}>
                Units/Month: {beInputs.units}
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={beInputs.units}
                onChange={e => setBeInputs({ ...beInputs, units: parseInt(e.target.value) })}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, borderRadius: tokens.radius.sm, background: tokens.color.surface }}>
            <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Break-Even Point</div>
            <div style={{ fontFamily: headingFont, fontSize: 24, fontWeight: 700, color: tokens.color.secondary }}>
              {breakEven} units
            </div>
            <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.text, marginTop: 4 }}>
              At {beInputs.units} units/month, you'll break even in {breakEven > 0 ? Math.ceil(breakEven / beInputs.units) : 0} months
            </div>
          </div>
        </Card>

        <Card style={{ padding: 16 }}>
          <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 16px 0" }}>
            Revenue Projector
          </h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 4 }}>
                Current Monthly: ${rpInputs.current}
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={rpInputs.current}
                onChange={e => setRpInputs({ ...rpInputs, current: parseInt(e.target.value) })}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text, display: "block", marginBottom: 4 }}>
                Monthly Growth: {rpInputs.growth}%
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={rpInputs.growth}
                onChange={e => setRpInputs({ ...rpInputs, growth: parseInt(e.target.value) })}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {projections.map(p => (
              <div key={p.month} style={{ padding: 8, borderRadius: tokens.radius.sm, background: tokens.color.surface, textAlign: "center" }}>
                <div style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted }}>Month {p.month}</div>
                <div style={{ fontFamily: headingFont, fontSize: 14, fontWeight: 700, color: tokens.color.secondary }}>
                  ${p.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function WellnessMetrics() {
  return (
    <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
      <Card style={{ padding: 16, textAlign: "center" }}>
        <Icons.Heart size={32} color={tokens.color.error} style={{ marginBottom: 8 }} />
        <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Burnout Risk</div>
        <Pill color={tokens.color.warning}>Medium</Pill>
      </Card>

      <Card style={{ padding: 16, textAlign: "center" }}>
        <Icons.Clock size={32} color={tokens.color.info} style={{ marginBottom: 8 }} />
        <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Hustle Hours This Week</div>
        <div style={{ fontFamily: headingFont, fontSize: 28, fontWeight: 700, color: tokens.color.info }}>15h</div>
      </Card>

      <Card style={{ padding: 16, textAlign: "center" }}>
        <Icons.DollarSign size={32} color={tokens.color.accent} style={{ marginBottom: 8 }} />
        <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 4 }}>Months to Full Runway</div>
        <div style={{ fontFamily: headingFont, fontSize: 28, fontWeight: 700, color: tokens.color.accent }}>5mo</div>
      </Card>
    </div>
  );
}

function QuitReadyChecklist() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.CheckCircle size={24} color={tokens.color.success} />}
        title="Quit-Ready Checklist"
      />
      <Card style={{ padding: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {MOCK_CHECKLIST_ITEMS.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "start", paddingBottom: 12, borderBottom: `1px solid ${tokens.color.border}` }}>
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                style={{ marginTop: 4, cursor: "pointer" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 500, color: tokens.color.text, textDecoration: item.completed ? "line-through" : "none" }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginTop: 2 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LocalWellness() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Heart size={24} color={tokens.color.error} />}
        title="Local Wellness"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {MOCK_WELLNESS_RECOMMENDATIONS.map(wellness => (
          <Card key={wellness.id} style={{ padding: 16 }}>
            <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: "0 0 4px 0" }}>
              {wellness.name}
            </h3>
            <Pill color={tokens.color.info} style={{ marginBottom: 8 }}>
              {wellness.category}
            </Pill>
            <div style={{ display: "flex", gap: 12, fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, marginBottom: 12 }}>
              <span>📍 {wellness.distance}</span>
              <span>⭐ {wellness.rating}</span>
            </div>
            <Button variant="secondary" style={{ width: "100%" }} onClick={() => {}}>
              Book
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SuccessStories() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.TrendingUp size={24} color={tokens.color.success} />}
        title="Success Stories"
      />
      <div style={{ display: "grid", gap: 16 }}>
        {MOCK_SUCCESS_STORIES.map(story => (
          <Card key={story.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: tokens.color.secondary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: headingFont,
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}>
                {story.name[0]}
              </div>
              <div>
                <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: 0 }}>
                  {story.name}
                </h3>
                <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
                  {story.timeline}
                </span>
              </div>
            </div>
            <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.text, margin: 0, lineHeight: 1.5 }}>
              "{story.quote}"
            </p>
            <Button variant="ghost" size="sm" onClick={() => {}} style={{ marginTop: 12, padding: 0 }}>
              Read Story <Icons.ExternalLink size={14} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CostOptimization() {
  const optimizations = [
    { item: "Car Payment", current: "$480/mo", suggestion: "Refinance could save $85/mo", savings: 85 },
    { item: "Streaming Services", current: "$65/mo", suggestion: "Bundle recommendation: $32/mo", savings: 33 },
    { item: "Phone Plan", current: "$95/mo", suggestion: "MVNO alternative: $35/mo", savings: 60 },
    { item: "Insurance", current: "$220/mo", suggestion: "Shop comparison could save $40/mo", savings: 40 },
  ];
  const totalSavings = optimizations.reduce((sum, o) => sum + o.savings, 0);

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.DollarSign size={24} color={tokens.color.accent} />}
        title="Cost Optimization"
      />
      <Card style={{ padding: 16 }}>
        <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
          {optimizations.map((opt, idx) => (
            <div key={idx} style={{ paddingBottom: 12, borderBottom: idx < optimizations.length - 1 ? `1px solid ${tokens.color.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text }}>
                    {opt.item}
                  </div>
                  <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
                    {opt.current}
                  </div>
                </div>
                <Pill color={tokens.color.success}>Save ${opt.savings}</Pill>
              </div>
              <p style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.text, margin: 0 }}>
                {opt.suggestion}
              </p>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: tokens.radius.sm, background: tokens.color.surface }}>
          <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>Potential Monthly Savings: </span>
          <span style={{ fontFamily: headingFont, fontSize: 18, fontWeight: 700, color: tokens.color.success }}>
            ${totalSavings}
          </span>
        </div>
      </Card>
    </div>
  );
}

function Calculators2() {
  const [leaseInputs, setLeaseInputs] = useState({ price: 30000, leasePayment: 350, leaseTerm: 36, buyPayment: 450, loanTerm: 60, residual: 15000 });
  const [mortgageInputs, setMortgageInputs] = useState({ price: 350000, downPayment: 20, rate: 6.5, term: 30 });

  const leaseCost = leaseInputs.leasePayment * leaseInputs.leaseTerm;
  const buyCost = (leaseInputs.buyPayment * leaseInputs.loanTerm) - leaseInputs.residual;

  const monthlyRate = mortgageInputs.rate / 100 / 12;
  const numPayments = mortgageInputs.term * 12;
  const principal = mortgageInputs.price * (1 - mortgageInputs.downPayment / 100);
  const monthlyPayment = monthlyRate > 0
    ? Math.round((principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1))
    : 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 16px 0" }}>
            Lease vs Buy Calculator
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text }}>Vehicle Price: ${leaseInputs.price.toLocaleString()}</label>
              <input type="range" min="10000" max="100000" step="1000" value={leaseInputs.price} onChange={e => setLeaseInputs({ ...leaseInputs, price: parseInt(e.target.value) })} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text }}>Lease Payment: ${leaseInputs.leasePayment}/mo</label>
              <input type="range" min="200" max="800" step="10" value={leaseInputs.leasePayment} onChange={e => setLeaseInputs({ ...leaseInputs, leasePayment: parseInt(e.target.value) })} style={{ width: "100%" }} />
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, borderRadius: tokens.radius.sm, background: tokens.color.surface }}>
            <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>Total Lease Cost</div>
            <div style={{ fontFamily: headingFont, fontSize: 20, fontWeight: 700, color: tokens.color.secondary }}>
              ${leaseCost.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card style={{ padding: 16 }}>
          <h3 style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.text, margin: "0 0 16px 0" }}>
            Mortgage Calculator
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text }}>Home Price: ${mortgageInputs.price.toLocaleString()}</label>
              <input type="range" min="100000" max="1000000" step="10000" value={mortgageInputs.price} onChange={e => setMortgageInputs({ ...mortgageInputs, price: parseInt(e.target.value) })} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 600, color: tokens.color.text }}>Interest Rate: {mortgageInputs.rate}%</label>
              <input type="range" min="3" max="10" step="0.1" value={mortgageInputs.rate} onChange={e => setMortgageInputs({ ...mortgageInputs, rate: parseFloat(e.target.value) })} style={{ width: "100%" }} />
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, borderRadius: tokens.radius.sm, background: tokens.color.surface }}>
            <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>Monthly Payment</div>
            <div style={{ fontFamily: headingFont, fontSize: 20, fontWeight: 700, color: tokens.color.secondary }}>
              ${monthlyPayment.toLocaleString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ToolEvaluations() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Award size={24} color={tokens.color.secondary} />}
        title="Tool & Product Evaluations"
      />
      <div style={{ display: "grid", gap: 12 }}>
        {MOCK_TOOLS.map(tool => (
          <Card key={tool.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <div>
                <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: 0 }}>
                  {tool.name}
                </h3>
                <Pill color={tokens.color.info} style={{ marginTop: 4 }}>
                  {tool.category}
                </Pill>
              </div>
              <span style={{ fontFamily: headingFont, fontSize: 16, fontWeight: 700, color: tokens.color.accent }}>
                {tool.price}
              </span>
            </div>
            <p style={{ fontFamily: fontStack, fontSize: 13, color: tokens.color.text, margin: 0 }}>
              {tool.relevance}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(MOCK_PROFILE_FIELDS);

  const handleFieldChange = (key, value) => {
    setFields(fields.map(f => f.key === key ? { ...f, value } : f));
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionHeader
          icon={<Icons.User size={24} color={tokens.color.primary} />}
          title="Personal Info"
        />
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {fields.map(field => (
            <div key={field.key}>
              <label style={{ fontFamily: fontStack, fontSize: 11, color: tokens.color.muted, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={field.value}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    fontFamily: fontStack,
                    fontSize: 13,
                    border: `1px solid ${tokens.color.border}`,
                    borderRadius: tokens.radius.sm,
                  }}
                />
              ) : (
                <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: tokens.color.text }}>
                  {field.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KnowledgeBase() {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.Upload size={24} color={tokens.color.info} />}
        title="My Knowledge Base"
      />

      <Card style={{
        padding: 24,
        textAlign: "center",
        border: `2px dashed ${tokens.color.border}`,
        cursor: "pointer",
        marginBottom: 16,
        transition: "all 0.2s",
      }}>
        <Icons.Upload size={40} color={tokens.color.info} style={{ marginBottom: 12 }} />
        <h3 style={{ fontFamily: headingFont, fontSize: 14, fontWeight: 700, color: tokens.color.text, margin: 0, marginBottom: 4 }}>
          Upload documents about yourself
        </h3>
        <p style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, margin: 0 }}>
          Drag & drop or click to upload. Atlas learns from your docs.
        </p>
      </Card>

      <div style={{ display: "grid", gap: 12 }}>
        {MOCK_UPLOADED_DOCS.map(doc => (
          <Card key={doc.id} style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: tokens.color.text, marginBottom: 4 }}>
                {doc.name}
              </div>
              <div style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
                Uploaded {doc.uploadDate}
              </div>
              <Pill color={tokens.color.secondary} style={{ marginTop: 6 }}>
                {doc.learned}
              </Pill>
            </div>
            <button
              onClick={() => {}}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Icons.X size={18} color={tokens.color.muted} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Questionnaires() {
  const questionnaires = [
    { id: 1, title: "About Your Goals", total: 5, completed: 3 },
    { id: 2, title: "Your Work Style", total: 4, completed: 0 },
    { id: 3, title: "Risk Tolerance", total: 6, completed: 0 },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.FileText size={24} color={tokens.color.secondary} />}
        title="Questionnaires"
      />
      <div style={{ display: "grid", gap: 12 }}>
        {questionnaires.map(q => (
          <Card key={q.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <h3 style={{ fontFamily: headingFont, fontSize: 15, fontWeight: 700, color: tokens.color.text, margin: 0 }}>
                {q.title}
              </h3>
              <span style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted }}>
                {q.completed}/{q.total}
              </span>
            </div>
            <ProgressBar value={q.completed} max={q.total} color={tokens.color.secondary} />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {}}
              style={{ marginTop: 12, width: "100%" }}
            >
              {q.completed > 0 ? "Continue" : "Start"} →
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GoalChat() {
  const [messages, setMessages] = useState(MOCK_GOAL_CHAT);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, type: "user", message: input }]);
      setInput("");
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        icon={<Icons.MessageCircle size={24} color={tokens.color.info} />}
        title="Goal Chat with Atlas"
      />

      <Card style={{ padding: 16, height: 400, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}>
              <div style={{
                maxWidth: "70%",
                padding: 12,
                borderRadius: tokens.radius.sm,
                background: msg.type === "user" ? tokens.color.primary : tokens.color.surface,
                color: msg.type === "user" ? "#fff" : tokens.color.text,
                fontFamily: fontStack,
                fontSize: 13,
                lineHeight: 1.5,
              }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSend()}
            placeholder="Message Atlas..."
            style={{
              flex: 1,
              padding: 10,
              fontFamily: fontStack,
              fontSize: 13,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius.sm,
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: 10,
              borderRadius: tokens.radius.sm,
              background: tokens.color.primary,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.Send size={16} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── MAIN COMPONENT ────────────────────
// ═══════════════════════════════════════

export default function LadoDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Icons.Home },
    { id: "discover", label: "Discover", icon: Icons.Compass },
    { id: "build", label: "Build", icon: Icons.Hammer },
    { id: "formalize", label: "Formalize", icon: Icons.FileText },
    { id: "protect", label: "Protect", icon: Icons.Shield },
    { id: "optimize", label: "Optimize", icon: Icons.DollarSign },
    { id: "profile", label: "Profile", icon: Icons.User },
  ];

  return (
    <div style={{ background: tokens.color.background, minHeight: "100vh" }}>
      {/* Sticky Header */}
      <header style={{
        position: "sticky",
        top: 0,
        background: tokens.color.white,
        borderBottom: `1px solid ${tokens.color.border}`,
        zIndex: 100,
        boxShadow: tokens.shadow.card,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <h1 style={{ fontFamily: headingFont, fontSize: 24, fontWeight: 700, color: tokens.color.primary, margin: 0 }}>
              LADO
            </h1>
            <nav style={{ display: "flex", gap: 4 }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 16px",
                    fontFamily: fontStack,
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    color: activeTab === tab.id ? tokens.color.primary : tokens.color.muted,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderBottom: activeTab === tab.id ? `2px solid ${tokens.color.primary}` : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <tab.icon size={16} color={activeTab === tab.id ? tokens.color.primary : tokens.color.muted} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px" }}>
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <FreedomCommandCenter user={MOCK_USER} />
            <AICoachMessages />
            <QuickActions />
          </>
        )}

        {/* Discover Tab */}
        {activeTab === "discover" && (
          <>
            <DiscoverHustles />
            <InfluencerProfiles />
            <NewsAndTrends />
            <IdeaRiver />
            <Community />
          </>
        )}

        {/* Build Tab */}
        {activeTab === "build" && (
          <>
            <WeeklyPlanner />
            <ActiveHustles />
            <LocalEvents />
          </>
        )}

        {/* Formalize Tab */}
        {activeTab === "formalize" && (
          <>
            <DocumentGenerator />
            <IncomeExpenseLedger />
            <FinanceEducation />
            <Calculators />
          </>
        )}

        {/* Protect Tab */}
        {activeTab === "protect" && (
          <>
            <WellnessMetrics />
            <QuitReadyChecklist />
            <LocalWellness />
            <SuccessStories />
          </>
        )}

        {/* Optimize Tab */}
        {activeTab === "optimize" && (
          <>
            <Card style={{ padding: 12, background: `${tokens.color.warning}15`, marginBottom: 32, display: "flex", gap: 12 }}>
              <Icons.AlertTriangle size={20} color={tokens.color.warning} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.text, margin: 0, lineHeight: 1.5 }}>
                <strong>Disclaimer:</strong> This section provides educational tools and calculators only. Nothing here constitutes investment, financial, or legal advice. Always consult a qualified professional before making financial decisions.
              </p>
            </Card>
            <CostOptimization />
            <Calculators2 />
            <ToolEvaluations />
          </>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            <PersonalInfo />
            <KnowledgeBase />
            <Questionnaires />
            <GoalChat />
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: tokens.color.surface,
        borderTop: `1px solid ${tokens.color.border}`,
        padding: "24px 20px",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: fontStack, fontSize: 12, color: tokens.color.muted, margin: 0 }}>
          LADO by Costa Spirits LLC · www.lado.club
        </p>
      </footer>
    </div>
  );
}
