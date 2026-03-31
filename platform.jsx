import React, { useState, useEffect } from "react";

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
  radius: { sm: 8, md: 12, lg: 16 },
  shadow: {
    card: "0 1px 3px rgba(32,36,43,0.06), 0 1px 2px rgba(32,36,43,0.04)",
    elevated: "0 4px 12px rgba(32,36,43,0.08)",
  },
};

const fontStack = "'Inter', -apple-system, sans-serif";
const headingFont = "'Sora', 'Inter', sans-serif";

const MOCK_USER = {
  name: "Tommy",
  ladoName: "Atlas",
  currentJob: "Marketing Manager",
  skills: ["Marketing", "Social Media", "Content Creation"],
  hoursPerWeek: 15,
  budget: "pro",
  monthlyIncome: 5200,
  monthlyExpenses: 3800,
  currentSavings: 9500,
  sideHustleIncome: 1200,
  channel: "telegram",
  joinedDate: "2026-03-28",
  confidenceScore: 78,
  employerDependency: 68,
};

// ============ ICON COMPONENTS ============
const Home = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Zap = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Inbox = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.88 4H7.12a2 2 0 0 0-1.67.11z" />
  </svg>
);

const Search = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ShoppingBag = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const FileText = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="13" x2="8" y2="13" />
    <line x1="12" y1="17" x2="8" y2="17" />
    <polyline points="9 9 8 9 8 9" />
  </svg>
);

const Shield = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const DollarSign = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const User = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Settings = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </svg>
);

const ChevronRight = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronDown = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const X = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Check = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckCircle = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Clock = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrendingUp = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDown = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const Plus = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Send = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ExternalLink = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Star = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" {...props}>
    <polygon points="12 2 15.09 10.26 24 10.26 17.55 16.52 19.64 24.78 12 18.52 4.36 24.78 6.45 16.52 0 10.26 8.91 10.26 12 2" />
  </svg>
);

const AlertTriangle = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.04h16.94a2 2 0 0 0 1.71-3.04l-8.47-14.14a2 2 0 0 0-3.41 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MoreHorizontal = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const Play = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ArrowRight = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Forward = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="15 17 20 12 15 7" />
    <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
  </svg>
);

const Globe = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Clipboard = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const MessageCircle = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BarChart = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const Edit2 = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const Trash2 = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const Eye = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ============ SHARED COMPONENTS ============
const Button = ({ variant = "primary", size = "md", children, ...props }) => {
  const baseStyle = {
    padding: size === "sm" ? "6px 12px" : "10px 16px",
    fontSize: size === "sm" ? "13px" : "14px",
    fontWeight: 500,
    border: "none",
    borderRadius: tokens.radius.md,
    cursor: "pointer",
    fontFamily: fontStack,
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  const variants = {
    primary: {
      background: tokens.color.primary,
      color: tokens.color.white,
      ...baseStyle,
    },
    secondary: {
      background: tokens.color.surface,
      color: tokens.color.text,
      border: `1px solid ${tokens.color.border}`,
      ...baseStyle,
    },
    ghost: {
      background: "transparent",
      color: tokens.color.text,
      ...baseStyle,
    },
    success: {
      background: tokens.color.success,
      color: tokens.color.white,
      ...baseStyle,
    },
    danger: {
      background: tokens.color.error,
      color: tokens.color.white,
      ...baseStyle,
    },
  };

  return (
    <button style={variants[variant]} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ color = "info", children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 8px",
      fontSize: "12px",
      fontWeight: 600,
      borderRadius: tokens.radius.sm,
      backgroundColor: color === "success" ? tokens.color.success :
                       color === "warning" ? tokens.color.warning :
                       color === "error" ? tokens.color.error :
                       color === "info" ? tokens.color.info : tokens.color.muted,
      color: tokens.color.white,
    }}
  >
    {children}
  </span>
);

const Card = ({ children, padding = true }) => (
  <div
    style={{
      background: tokens.color.white,
      border: `1px solid ${tokens.color.border}`,
      borderRadius: tokens.radius.lg,
      padding: padding ? "16px" : "0",
      boxShadow: tokens.shadow.card,
    }}
  >
    {children}
  </div>
);

const ProgressBar = ({ value, max, color = "info" }) => {
  const percent = (value / max) * 100;
  const barColor = color === "success" ? tokens.color.success :
                   color === "warning" ? tokens.color.warning :
                   color === "info" ? tokens.color.info : tokens.color.primary;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "6px", background: tokens.color.surface, borderRadius: tokens.radius.sm, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${percent}%`, background: barColor, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: "12px", color: tokens.color.muted, minWidth: "40px", textAlign: "right" }}>
        {Math.round(percent)}%
      </span>
    </div>
  );
};

const Table = ({ columns, rows, onRowClick }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fontStack, fontSize: "14px" }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${tokens.color.border}`, background: tokens.color.surface }}>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                padding: "10px 12px",
                textAlign: "left",
                fontWeight: 600,
                color: tokens.color.text,
                width: col.width,
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              borderBottom: `1px solid ${tokens.color.border}`,
              background: "transparent",
              cursor: onRowClick ? "pointer" : "default",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (onRowClick) e.currentTarget.style.background = tokens.color.surface;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ padding: "10px 12px", color: tokens.color.text }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Input = ({ label, placeholder, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {label && <label style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text }}>{label}</label>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: "8px 12px",
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.md,
        fontSize: "14px",
        fontFamily: fontStack,
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = tokens.color.primary)}
      onBlur={(e) => (e.target.style.borderColor = tokens.color.border)}
    />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {label && <label style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text }}>{label}</label>}
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: "8px 12px",
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.md,
        fontSize: "14px",
        fontFamily: fontStack,
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      border: "none",
      background: checked ? tokens.color.success : tokens.color.surface,
      cursor: "pointer",
      position: "relative",
      transition: "background 0.2s",
    }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: tokens.color.white,
        position: "absolute",
        top: "2px",
        left: checked ? "22px" : "2px",
        transition: "left 0.2s",
      }}
    />
  </button>
);

const Tabs = ({ items, activeId, onChange }) => (
  <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.border}`, gap: "24px", marginBottom: "16px" }}>
    {items.map((item) => (
      <button
        key={item.id}
        onClick={() => onChange(item.id)}
        style={{
          padding: "12px 0",
          border: "none",
          background: "transparent",
          color: activeId === item.id ? tokens.color.primary : tokens.color.muted,
          fontSize: "14px",
          fontWeight: activeId === item.id ? 600 : 400,
          cursor: "pointer",
          borderBottom: activeId === item.id ? `2px solid ${tokens.color.primary}` : "none",
          fontFamily: fontStack,
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const DetailPanel = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            zIndex: 99,
          }}
        />
      )}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "420px",
          height: "100vh",
          background: tokens.color.white,
          boxShadow: tokens.shadow.elevated,
          zIndex: 100,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px", borderBottom: `1px solid ${tokens.color.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: tokens.color.text, fontFamily: fontStack }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: tokens.color.muted }}
          >
            <X />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", color: tokens.color.muted }}>
    {Icon && <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>}
    <p style={{ margin: 0, fontSize: "14px", fontFamily: fontStack }}>{message}</p>
  </div>
);

// ============ SIDEBAR COMPONENT ============
const Sidebar = ({ activeSection, onNavigate, user }) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "execute", label: "Execute", icon: Zap },
    { id: "inbox", label: "Inbox", icon: Inbox, badge: "3" },
    { id: "discover", label: "Discover", icon: Search },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "formalize", label: "Formalize", icon: FileText },
    { id: "protect", label: "Protect", icon: Shield },
    { id: "optimize", label: "Optimize", icon: DollarSign },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: tokens.color.primary,
        color: tokens.color.white,
        position: "fixed",
        left: 0,
        top: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        fontFamily: fontStack,
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 600, fontFamily: headingFont }}>LADO</h1>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tokens.color.success }} />
          {user.ladoName} online
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: tokens.radius.md, padding: "12px", marginBottom: "24px" }}>
        <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.color.secondary }}>$3,800</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>/mo Freedom Number</div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                padding: "12px 12px",
                margin: "4px 0",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                border: "none",
                borderLeft: isActive ? `3px solid ${tokens.color.secondary}` : "3px solid transparent",
                borderRadius: tokens.radius.md,
                color: tokens.color.white,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: fontStack,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = "transparent")}
            >
              <Icon />
              {item.label}
              {item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: tokens.color.warning,
                    color: tokens.color.white,
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: "16px" }}>
        <button
          onClick={() => onNavigate("settings")}
          style={{
            width: "100%",
            padding: "12px 12px",
            background: "transparent",
            border: "none",
            borderRadius: tokens.radius.md,
            color: tokens.color.white,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: fontStack,
          }}
        >
          <Settings />
          Settings
        </button>
      </div>
    </div>
  );
};

// ============ HOME SECTION ============
const HomeSection = ({ user }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Card>
          <div style={{ fontFamily: headingFont }}>
            <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "8px", textTransform: "uppercase", fontWeight: 600 }}>
              Freedom Number
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: tokens.color.primary }}>$3,800</div>
            <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "4px" }}>/month to quit</div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 500, marginBottom: "4px", color: tokens.color.text }}>6-Mo Runway</div>
              <ProgressBar value={9500} max={22800} color="success" />
              <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "4px" }}>$9,500 / $22,800</div>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 500, marginBottom: "4px", color: tokens.color.text }}>75% Salary Target</div>
              <ProgressBar value={1200} max={3900} color="warning" />
              <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "4px" }}>$1,200 / $3,900/mo</div>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 500, marginBottom: "4px", color: tokens.color.text }}>Quit-Ready</div>
              <ProgressBar value={34} max={100} color="info" />
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Confidence</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: tokens.color.success, display: "flex", alignItems: "center", gap: "6px" }}>
                78 <TrendingUp style={{ color: tokens.color.success }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Employer Dependency</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: tokens.color.success, display: "flex", alignItems: "center", gap: "6px" }}>
                68% <TrendingDown style={{ color: tokens.color.success }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Card>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>AI Coach Messages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { msg: "I reworked your schedule based on this week's results. 2 extra hustle hours found.", action: "View", time: "2 hours ago" },
              { msg: "You're 4 weeks behind your runway target. I built a 3-step catch-up plan.", action: "See Plan", time: "Yesterday" },
              { msg: "Your Etsy store content is getting stale. I drafted 5 new posts for review.", action: "Review", time: "2 days ago" },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md, fontSize: "13px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.color.primary, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px 0", color: tokens.color.text }}>{item.msg}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: tokens.color.muted }}>{item.time}</span>
                      <Button variant="ghost" size="sm">{item.action}</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Active Missions</div>
          <Table
            columns={[
              { key: "name", label: "Mission" },
              { key: "progress", label: "Progress" },
              { key: "next", label: "Next Step" },
            ]}
            rows={[
              { name: "Launch Etsy Store", progress: <ProgressBar value={67} max={100} />, next: "Write product descriptions" },
              { name: "Build Emergency Fund", progress: <ProgressBar value={33} max={100} />, next: "Save $800 this month" },
              { name: "Get 10 UGC Clients", progress: <ProgressBar value={15} max={100} />, next: "Send outreach batch #2" },
            ]}
          />
        </Card>

        <Card>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Running Tasks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { task: "Scraping trending Etsy niches...", status: "Running" },
              { task: "Drafting Instagram captions...", status: "Running" },
              { task: "P&L for March ready", status: "Done" },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", fontSize: "13px", borderBottom: idx < 2 ? `1px solid ${tokens.color.border}` : "none" }}>
                <span style={{ color: tokens.color.text }}>{item.task}</span>
                {item.status === "Running" ? <Clock style={{ color: tokens.color.info }} /> : <CheckCircle style={{ color: tokens.color.success }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============ EXECUTE SECTION ============
const ExecuteSection = ({ onForward }) => {
  const [activeTab, setActiveTab] = useState("missions");
  const [selectedMission, setSelectedMission] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showForwardPanel, setShowForwardPanel] = useState(false);
  const [forwardConfig, setForwardConfig] = useState({ channel: "etsy", price: "", deliverables: [] });
  const [analysisType, setAnalysisType] = useState(null);
  const [analysisUrl, setAnalysisUrl] = useState("");

  const missions = [
    { id: 1, name: "Launch Etsy Print-on-Demand Store", status: "Active", progress: 67, steps: 12, dueDate: "Apr 15", engine: "Build", deliverables: ["5 product designs", "SEO-optimized listings", "Product photography"] },
    { id: 2, name: "Get First 10 UGC Clients", status: "Active", progress: 15, steps: 8, dueDate: "Apr 30", engine: "Build", deliverables: ["Portfolio samples", "Outreach templates", "Rate card"] },
    { id: 3, name: "Build 6-Month Emergency Fund", status: "Active", progress: 42, steps: null, dueDate: "Sep 1", engine: "Protect", deliverables: [] },
    { id: 4, name: "Create Course: Social Media 101", status: "Paused", progress: 20, steps: 10, dueDate: null, engine: "Build", deliverables: ["Course outline", "3 video scripts", "Landing page copy"] },
    { id: 5, name: "File LLC for Side Business", status: "Not Started", progress: 0, steps: 5, dueDate: "May 15", engine: "Formalize", deliverables: [] },
    { id: 6, name: "Custom Pet Phone Case Collection", status: "Complete", progress: 100, steps: 8, dueDate: "Mar 25", engine: "Build", deliverables: ["8 phone case designs", "Mockup photos", "SEO descriptions", "Pricing analysis"] },
  ];

  const missionSteps = {
    1: [
      { num: 1, title: "Research profitable niches", status: "Done" },
      { num: 2, title: "Select niche: Pet accessories", status: "Done" },
      { num: 3, title: "Create Printful account", status: "Done" },
      { num: 4, title: "Design first 5 products", status: "Done" },
      { num: 5, title: "Write Etsy listing titles", status: "Done" },
      { num: 6, title: "SEO keyword research", status: "Done" },
      { num: 7, title: "Photograph mockups", status: "Done" },
      { num: 8, title: "Write product descriptions", status: "Working", owner: "AI" },
      { num: 9, title: "Set pricing strategy", status: "Pending", owner: "You" },
      { num: 10, title: "Create Etsy shop listing", status: "Pending", owner: "You" },
      { num: 11, title: "Set up Etsy ads ($5/day)", status: "Pending", owner: "You" },
      { num: 12, title: "Launch social media campaign", status: "Pending" },
    ],
    6: [
      { num: 1, title: "Research trending pet phone case designs", status: "Done" },
      { num: 2, title: "Create 8 unique designs in Canva", status: "Done" },
      { num: 3, title: "Generate mockup photos", status: "Done" },
      { num: 4, title: "Write SEO-optimized descriptions", status: "Done" },
      { num: 5, title: "Competitive pricing analysis", status: "Done" },
      { num: 6, title: "Set up Printful fulfillment", status: "Done" },
      { num: 7, title: "Quality check all files", status: "Done" },
      { num: 8, title: "Final review and approval", status: "Done" },
    ],
  };

  const analysisTemplates = [
    { id: "website", title: "Website Audit", icon: "🌐", desc: "Full review: SEO, speed, UX, conversion, mobile, copy effectiveness", fields: ["URL", "Target audience", "Primary goal (sales, leads, info)"] },
    { id: "campaign", title: "Campaign Review", icon: "📊", desc: "Analyze ad spend, targeting, creative, ROI, and optimization opportunities", fields: ["Platform (Meta, Google, TikTok)", "Budget", "Campaign URL or screenshot"] },
    { id: "listing", title: "Listing Optimization", icon: "🏪", desc: "Review product listing: title, photos, pricing, SEO, competitor positioning", fields: ["Marketplace (Etsy, Shopify, Amazon)", "Listing URL", "Target price range"] },
    { id: "social", title: "Social Media Audit", icon: "📱", desc: "Profile review: content strategy, engagement rates, growth opportunities", fields: ["Platform", "Handle/URL", "Current follower count"] },
    { id: "email", title: "Email Sequence Review", icon: "📧", desc: "Analyze open rates, subject lines, CTAs, flow logic, and deliverability", fields: ["Email platform (Mailchimp, ConvertKit)", "Sequence name", "Current open rate"] },
  ];

  const handleMissionClick = (mission) => {
    setSelectedMission(mission);
    setIsPanelOpen(true);
    setShowForwardPanel(false);
  };

  const handleForward = () => {
    if (selectedMission && onForward) {
      const channelFees = { etsy: "6.5% + $0.20", shopify: "2.9% + $0.30", gumroad: "10%", printful: "Varies", eventbrite: "3.7% + $1.79" };
      onForward({
        missionName: selectedMission.name,
        deliverables: selectedMission.deliverables || [],
        suggestedChannel: forwardConfig.channel,
        suggestedPrice: parseFloat(forwardConfig.price) || 24.99,
        platformFee: channelFees[forwardConfig.channel] || "Varies",
        productionCost: 8.50,
        projectedMargin: (parseFloat(forwardConfig.price) || 24.99) - 8.50 - ((parseFloat(forwardConfig.price) || 24.99) * 0.065),
      });
      setIsPanelOpen(false);
      setShowForwardPanel(false);
    }
  };

  return (
    <>
      <Tabs
        items={[
          { id: "missions", label: "Missions" },
          { id: "tasks", label: "Tasks" },
          { id: "automations", label: "Automations" },
          { id: "analysis", label: "Analysis" },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "missions" && (
        <Card>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "status", label: "Status" },
              { key: "progress", label: "Progress" },
              { key: "steps", label: "Steps" },
              { key: "dueDate", label: "Due Date" },
              { key: "engine", label: "Engine" },
              { key: "actions", label: "" },
            ]}
            rows={missions.map((m) => ({
              name: m.name,
              status: <Badge color={m.status === "Active" ? "success" : m.status === "Complete" ? "info" : m.status === "Paused" ? "warning" : "info"}>{m.status}</Badge>,
              progress: <ProgressBar value={m.progress} max={100} />,
              steps: m.steps ? `${m.steps}/${m.steps}` : "—",
              dueDate: m.dueDate || "—",
              engine: <Badge>{m.engine}</Badge>,
              actions: m.status === "Complete" ? (
                <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); handleMissionClick(m); }}>
                  <Forward /> Marketplace
                </Button>
              ) : null,
            }))}
            onRowClick={handleMissionClick}
          />
        </Card>
      )}

      {activeTab === "tasks" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {["Queued", "Running", "Review", "Done"].map((col) => (
            <div key={col}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>{col}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {col === "Queued" && [
                  "Research Q2 Etsy trends",
                  "Draft client follow-up emails",
                  "Update branding guide",
                ].map((t) => (
                  <Card key={t} padding={true}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text, marginBottom: "6px" }}>{t}</div>
                    <Badge color="info">Build</Badge>
                  </Card>
                ))}
                {col === "Running" && [
                  "Scraping top Etsy niches...",
                  "Drafting 5 Instagram captions...",
                ].map((t) => (
                  <Card key={t} padding={true}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text, marginBottom: "6px" }}>{t}</div>
                    <Badge color="info">AI</Badge>
                  </Card>
                ))}
                {col === "Review" && [
                  "March P&L Statement",
                ].map((t) => (
                  <Card key={t} padding={true}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text, marginBottom: "6px" }}>{t}</div>
                    <Badge color="warning">Review</Badge>
                  </Card>
                ))}
                {col === "Done" && [
                  "Created Printful account",
                  "Etsy SEO keywords found",
                  "Schedule optimized",
                  "Sent 3 outreach emails",
                ].map((t) => (
                  <Card key={t} padding={true}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text }}>✓ {t}</div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "automations" && (
        <Card>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "frequency", label: "Frequency" },
              { key: "lastRun", label: "Last Run" },
              { key: "nextRun", label: "Next Run" },
              { key: "engine", label: "Engine" },
              { key: "status", label: "Status" },
            ]}
            rows={[
              { name: "Scrape trending side hustles", frequency: "Weekly", lastRun: "Mar 28", nextRun: "Apr 4", engine: "Discover", status: <Toggle checked={true} onChange={() => {}} /> },
              { name: "Send client follow-ups", frequency: "Weekly (Fri)", lastRun: "Mar 28", nextRun: "Apr 4", engine: "Build", status: <Toggle checked={true} onChange={() => {}} /> },
              { name: "Generate weekly P&L", frequency: "Weekly (Sun)", lastRun: "Mar 30", nextRun: "Apr 6", engine: "Formalize", status: <Toggle checked={true} onChange={() => {}} /> },
              { name: "Monitor competitor prices", frequency: "Daily", lastRun: "Today", nextRun: "Tomorrow", engine: "Discover", status: <Toggle checked={true} onChange={() => {}} /> },
              { name: "Post scheduled content", frequency: "3x/week", lastRun: "Mar 29", nextRun: "Mar 31", engine: "Build", status: <Toggle checked={false} onChange={() => {}} /> },
              { name: "Burnout wellness check", frequency: "Weekly (Fri)", lastRun: "Mar 28", nextRun: "Apr 4", engine: "Protect", status: <Toggle checked={true} onChange={() => {}} /> },
            ]}
          />
        </Card>
      )}

      {activeTab === "analysis" && (
        <div>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text, marginBottom: "4px" }}>Project Analysis</h3>
            <p style={{ fontSize: "13px", color: tokens.color.muted, margin: 0 }}>Let Atlas audit your projects and find what's working, what's broken, and what to fix next.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {analysisTemplates.map((template) => (
              <Card key={template.id}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{template.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text }}>{template.title}</div>
                    <p style={{ fontSize: "12px", color: tokens.color.muted, margin: "4px 0 0 0", lineHeight: "1.4" }}>{template.desc}</p>
                  </div>
                </div>
                <Button
                  variant={analysisType === template.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setAnalysisType(analysisType === template.id ? null : template.id)}
                  style={{ width: "100%" }}
                >
                  {analysisType === template.id ? "Selected" : "Start Audit"}
                </Button>
              </Card>
            ))}
          </div>

          {analysisType && (
            <Card>
              <div style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text, marginBottom: "16px" }}>
                {analysisTemplates.find(t => t.id === analysisType)?.icon} {analysisTemplates.find(t => t.id === analysisType)?.title}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {analysisTemplates.find(t => t.id === analysisType)?.fields.map((field, idx) => (
                  <Input key={idx} label={field} placeholder={`Enter ${field.toLowerCase()}...`} value="" onChange={() => {}} />
                ))}
                <Input label="Additional context (optional)" placeholder="Anything else Atlas should know..." value="" onChange={() => {}} />
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button variant="primary">
                  <Search style={{ width: "14px", height: "14px" }} /> Run Analysis
                </Button>
                <Button variant="secondary" onClick={() => setAnalysisType(null)}>Cancel</Button>
              </div>

              <div style={{ marginTop: "24px", padding: "16px", background: tokens.color.surface, borderRadius: tokens.radius.lg }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text, marginBottom: "12px" }}>Sample Output: What You'll Get</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  {[
                    { label: "Overall Score", value: "72/100", color: tokens.color.warning },
                    { label: "Critical Issues", value: "3 found", color: tokens.color.error },
                    { label: "Quick Wins", value: "5 opportunities", color: tokens.color.success },
                    { label: "Estimated Impact", value: "+$340/mo revenue", color: tokens.color.primary },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: tokens.color.white, borderRadius: tokens.radius.md }}>
                      <span style={{ color: tokens.color.text }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "12px", color: tokens.color.muted, margin: "12px 0 0 0" }}>Results generate prioritized action items that auto-create tasks in your kanban board.</p>
              </div>
            </Card>
          )}

          {!analysisType && (
            <Card>
              <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text, marginBottom: "12px" }}>Recent Analyses</div>
              <Table
                columns={[
                  { key: "name", label: "Analysis" },
                  { key: "type", label: "Type" },
                  { key: "score", label: "Score" },
                  { key: "issues", label: "Issues" },
                  { key: "date", label: "Date" },
                  { key: "actions", label: "" },
                ]}
                rows={[
                  { name: "Etsy Store SEO Audit", type: <Badge color="info">Listing</Badge>, score: <span style={{ fontWeight: 600, color: tokens.color.warning }}>72/100</span>, issues: "3 critical, 5 minor", date: "Mar 28", actions: <Button variant="ghost" size="sm"><Eye /> View</Button> },
                  { name: "Instagram Growth Review", type: <Badge color="info">Social</Badge>, score: <span style={{ fontWeight: 600, color: tokens.color.success }}>85/100</span>, issues: "1 critical, 2 minor", date: "Mar 22", actions: <Button variant="ghost" size="sm"><Eye /> View</Button> },
                ]}
              />
            </Card>
          )}
        </div>
      )}

      <DetailPanel isOpen={isPanelOpen} onClose={() => { setIsPanelOpen(false); setShowForwardPanel(false); }} title={selectedMission?.name || ""}>
        {selectedMission && !showForwardPanel && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Overall Progress</div>
              <ProgressBar value={selectedMission.progress} max={100} />
            </div>

            {selectedMission.deliverables && selectedMission.deliverables.length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: tokens.color.text }}>Deliverables</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {selectedMission.deliverables.map((d, idx) => (
                    <div key={idx} style={{ padding: "6px 8px", background: tokens.color.surface, borderRadius: tokens.radius.sm, fontSize: "13px", color: tokens.color.text, display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clipboard /> {d}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: tokens.color.text }}>Steps</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {missionSteps[selectedMission.id]?.map((step) => (
                  <div key={step.num} style={{ padding: "8px", background: tokens.color.surface, borderRadius: tokens.radius.md, display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "13px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: step.status === "Done" ? tokens.color.success : step.status === "Working" ? tokens.color.info : tokens.color.border, flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tokens.color.text, fontWeight: step.status === "Done" ? 400 : 500 }}>{step.title}</div>
                      {step.owner && <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "2px" }}>{step.owner}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="primary">Add Step</Button>

            {(selectedMission.progress >= 60 || selectedMission.status === "Complete") && selectedMission.deliverables && selectedMission.deliverables.length > 0 && (
              <div style={{ borderTop: `1px solid ${tokens.color.border}`, paddingTop: "16px" }}>
                <Button variant="success" onClick={() => setShowForwardPanel(true)} style={{ width: "100%" }}>
                  <Forward /> Forward to Marketplace
                </Button>
                <p style={{ fontSize: "11px", color: tokens.color.muted, margin: "6px 0 0 0", textAlign: "center" }}>
                  {selectedMission.status === "Complete" ? "Ready to list — all steps complete" : "Mission 60%+ complete — you can start preparing your listing"}
                </p>
              </div>
            )}
          </div>
        )}

        {selectedMission && showForwardPanel && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Forwarding from</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>{selectedMission.name}</div>
            </div>

            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: tokens.color.text }}>Deliverables to List</div>
              {selectedMission.deliverables?.map((d, idx) => (
                <label key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: tokens.color.text, marginBottom: "6px", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
                  {d}
                </label>
              ))}
            </div>

            <Select
              label="Marketplace Channel"
              options={[
                { value: "etsy", label: "Etsy" },
                { value: "shopify", label: "Shopify" },
                { value: "gumroad", label: "Gumroad" },
                { value: "printful", label: "Printful" },
                { value: "eventbrite", label: "Eventbrite" },
                { value: "amazon", label: "Amazon" },
              ]}
              value={forwardConfig.channel}
              onChange={(e) => setForwardConfig({ ...forwardConfig, channel: e.target.value })}
            />

            <Input
              label="Suggested Price ($)"
              placeholder="24.99"
              value={forwardConfig.price}
              onChange={(e) => setForwardConfig({ ...forwardConfig, price: e.target.value })}
            />

            <div style={{ padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.text, marginBottom: "8px" }}>Quote Estimate</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: tokens.color.muted }}>Sale Price</span>
                  <span style={{ color: tokens.color.text, fontWeight: 500 }}>${forwardConfig.price || "24.99"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: tokens.color.muted }}>Platform Fee</span>
                  <span style={{ color: tokens.color.error }}>-${ (parseFloat(forwardConfig.price || 24.99) * 0.065 + 0.20).toFixed(2) }</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: tokens.color.muted }}>Est. Production</span>
                  <span style={{ color: tokens.color.error }}>-$8.50</span>
                </div>
                <div style={{ borderTop: `1px solid ${tokens.color.border}`, paddingTop: "6px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: tokens.color.text, fontWeight: 600 }}>Projected Margin</span>
                  <span style={{ color: tokens.color.success, fontWeight: 700 }}>${ (parseFloat(forwardConfig.price || 24.99) - (parseFloat(forwardConfig.price || 24.99) * 0.065 + 0.20) - 8.50).toFixed(2) }</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button variant="secondary" onClick={() => setShowForwardPanel(false)} style={{ flex: 1 }}>Back</Button>
              <Button variant="success" onClick={handleForward} style={{ flex: 1 }}>
                <Forward /> Send to Marketplace
              </Button>
            </div>
          </div>
        )}
      </DetailPanel>
    </>
  );
};

// ============ INBOX SECTION ============
const InboxSection = () => {
  const [selectedMsg, setSelectedMsg] = useState(0);

  const messages = [
    { id: 1, from: "Atlas", subject: "Schedule Optimization Complete", preview: "Based on this week's data, I've found 2 additional hustle hours...", time: "2h ago", folder: "Agent", fullMsg: "Based on your this week's data, I've found 2 additional hustle hours that fit your schedule. I recommend moving your UGC client work to Tuesday afternoons. Ready to update?" },
    { id: 2, from: "Atlas", subject: "Runway Warning: 4 Weeks Behind", preview: "Your current savings rate puts you 4 weeks behind...", time: "Yesterday", folder: "Agent", fullMsg: "Your current savings rate puts you 4 weeks behind your 6-month target. I've built a 3-step catch-up plan." },
    { id: 3, from: "Atlas", subject: "5 New Content Drafts Ready", preview: "I noticed your Etsy store hasn't had new content in 10 days...", time: "2d ago", folder: "Agent", fullMsg: "I noticed your Etsy store hasn't had new content in 10 days. I've drafted 5 new product descriptions and 3 social posts." },
    { id: 4, from: "Sarah Chen", subject: "Re: UGC Collaboration", preview: "Hi Tommy, I'd love to discuss the UGC project...", time: "3h ago", folder: "Email", fullMsg: "Hi Tommy, I'd love to discuss the UGC project further. Are you available for a call this week?" },
    { id: 5, from: "Etsy Support", subject: "Your shop metrics for March", preview: "Congratulations! Your shop had 47 views this week...", time: "1d ago", folder: "Email", fullMsg: "Congratulations! Your shop had 47 views this week, a 20% increase from last week." },
    { id: 6, from: "Printful", subject: "Order #1247 Shipped", preview: "Your order for Custom Pet Phone Case has been shipped...", time: "1d ago", folder: "Email", fullMsg: "Your order #1247 has been shipped and will arrive in 3-5 business days." },
    { id: 7, from: "Mike Rodriguez", subject: "Re: Marketing Consult", preview: "Thanks for the quote. Let's set up a call this week...", time: "2d ago", folder: "Email", fullMsg: "Thanks for the quote. Let's set up a call this week." },
    { id: 8, from: "LADO Club", subject: "New member welcome", preview: "Welcome to the LADO builder community...", time: "3d ago", folder: "Notification", fullMsg: "Welcome to the LADO builder community! You now have access to 2,400+ builders sharing wins and feedback." },
  ];

  const folders = [
    { name: "All", count: 12 },
    { name: "Agent Messages", count: 3 },
    { name: "Email", count: 8 },
    { name: "Notifications", count: 1 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 400px", gap: "16px", height: "calc(100vh - 96px)" }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.muted, marginBottom: "12px" }}>Folders</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {folders.map((folder) => (
            <button
              key={folder.name}
              style={{
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                borderRadius: tokens.radius.md,
                textAlign: "left",
                fontSize: "13px",
                color: tokens.color.text,
                cursor: "pointer",
                fontFamily: fontStack,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {folder.name}
              <span style={{ fontSize: "11px", color: tokens.color.muted }}>{folder.count}</span>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {messages.map((msg, idx) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMsg(idx)}
              style={{
                padding: "12px",
                background: selectedMsg === idx ? tokens.color.surface : "transparent",
                border: "none",
                borderBottom: `1px solid ${tokens.color.border}`,
                textAlign: "left",
                cursor: "pointer",
                fontFamily: fontStack,
              }}
            >
              <div style={{ fontWeight: 500, color: tokens.color.text, fontSize: "13px" }}>{msg.from}</div>
              <div style={{ fontSize: "12px", color: tokens.color.text, fontWeight: 500, marginTop: "2px" }}>{msg.subject}</div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "2px" }}>{msg.preview}</div>
              <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "4px" }}>{msg.time}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        {messages[selectedMsg] && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>{messages[selectedMsg].subject}</div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "4px" }}>From: {messages[selectedMsg].from}</div>
            </div>
            <div style={{ flex: 1, fontSize: "13px", color: tokens.color.text, lineHeight: "1.5" }}>
              {messages[selectedMsg].fullMsg}
            </div>
            <div style={{ paddingTop: "12px", borderTop: `1px solid ${tokens.color.border}`, display: "flex", gap: "8px" }}>
              <input
                placeholder="Reply..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: tokens.radius.md,
                  fontFamily: fontStack,
                  fontSize: "13px",
                }}
              />
              <Button variant="primary" size="sm"><Send style={{ width: "14px", height: "14px" }} /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

// ============ DISCOVER SECTION ============
const DiscoverSection = () => {
  const [activeTab, setActiveTab] = useState("hustles");
  const [selectedHustle, setSelectedHustle] = useState(null);

  const hustles = [
    { name: "AI-Powered Etsy Stores", cost: "$50-200", income: "2-4 wks", difficulty: 2, aiScore: 92, saturation: "Low", type: "Remote" },
    { name: "UGC Content Creation", cost: "$0-100", income: "1-2 wks", difficulty: 2, aiScore: 88, saturation: "Medium", type: "Remote" },
    { name: "Local Lead Generation", cost: "$200-500", income: "4-6 wks", difficulty: 3, aiScore: 71, saturation: "Low", type: "Local" },
    { name: "Digital Course Creation", cost: "$100-300", income: "6-8 wks", difficulty: 3, aiScore: 85, saturation: "Medium", type: "Remote" },
    { name: "Print-on-Demand Merch", cost: "$0-50", income: "2-3 wks", difficulty: 1, aiScore: 95, saturation: "High", type: "Remote" },
    { name: "Freelance Social Media Mgmt", cost: "$0", income: "1-2 wks", difficulty: 2, aiScore: 82, saturation: "Medium", type: "Remote" },
  ];

  const influencers = [
    { name: "Grant Cardone", category: "Real Estate & Sales", quote: "10X everything. Revenue solves all problems.", followers: "15M" },
    { name: "Alex Hormozi", category: "Business Acquisition", quote: "$100M Offers: Make offers so good people feel stupid saying no.", followers: "5M" },
    { name: "Tony Robbins", category: "Mindset & Performance", quote: "Success is 80% psychology, 20% mechanics.", followers: "10M" },
    { name: "Pat Flynn", category: "Passive Income", quote: "Will it fly? Test your business idea before you waste your time.", followers: "2M" },
  ];

  const trends = [
    { title: "Print-on-Demand Market Hits $10B", source: "Forbes", date: "Mar 28", snippet: "The POD industry grew 26% YoY..." },
    { title: "AI Tools Double Freelancer Productivity", source: "TechCrunch", date: "Mar 25", snippet: "New study shows freelancers using AI..." },
    { title: "Etsy Introduces AI Listing Optimization", source: "Etsy Blog", date: "Mar 22", snippet: "Etsy's new AI tools help sellers..." },
    { title: "Side Hustle Economy Reaches 65M Americans", source: "CNBC", date: "Mar 20", snippet: "Latest Census data shows..." },
  ];

  const ideas = [
    { title: "AI Pet Portrait Store", match: 94, desc: "Combine your marketing skills with AI image gen to sell custom pet portraits on Etsy" },
    { title: "Social Media Audit Service", match: 91, desc: "Offer $99 social media audits to local businesses. Your marketing background = instant credibility" },
    { title: "Content Creation Course", match: 87, desc: "Teach what you know about content creation. Package into a 4-week course on Gumroad" },
  ];

  return (
    <>
      <Tabs
        items={[
          { id: "hustles", label: "Hustles" },
          { id: "influencers", label: "Influencers" },
          { id: "trends", label: "Trends" },
          { id: "ideas", label: "Ideas" },
          { id: "community", label: "Community" },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "hustles" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Card>
            <Table
              columns={[
                { key: "name", label: "Hustle" },
                { key: "cost", label: "Startup Cost" },
                { key: "income", label: "First Income" },
                { key: "difficulty", label: "Difficulty" },
                { key: "aiScore", label: "AI Score" },
                { key: "saturation", label: "Saturation" },
              ]}
              rows={hustles.map((h) => ({
                name: h.name,
                cost: h.cost,
                income: h.income,
                difficulty: "★".repeat(h.difficulty) + "☆".repeat(5 - h.difficulty),
                aiScore: `${h.aiScore}/100`,
                saturation: h.saturation,
              }))}
              onRowClick={(row) => setSelectedHustle(hustles.find((h) => h.name === row.name))}
            />
          </Card>

          {selectedHustle && (
            <Card>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>
                {selectedHustle.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div>
                  <div style={{ color: tokens.color.muted, marginBottom: "4px" }}>Startup Cost</div>
                  <div style={{ color: tokens.color.text, fontWeight: 500 }}>{selectedHustle.cost}</div>
                </div>
                <div>
                  <div style={{ color: tokens.color.muted, marginBottom: "4px" }}>First Income Timeline</div>
                  <div style={{ color: tokens.color.text, fontWeight: 500 }}>{selectedHustle.income}</div>
                </div>
                <div>
                  <div style={{ color: tokens.color.muted, marginBottom: "4px" }}>AI Score</div>
                  <ProgressBar value={selectedHustle.aiScore} max={100} color="success" />
                </div>
                <div>
                  <div style={{ color: tokens.color.muted, marginBottom: "4px" }}>AI Assessment</div>
                  <p style={{ margin: 0, color: tokens.color.text }}>High-potential hustle with strong AI automation opportunities. Your marketing background gives you competitive advantage in positioning and customer acquisition.</p>
                </div>
                <Button variant="primary">Launch as Mission →</Button>
                <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.text, marginTop: "8px" }}>Launch Checklist</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {["Research market demand", "Validate pricing", "Create landing page", "Build product/service", "Launch beta"].map((item) => (
                    <label key={item} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: tokens.color.text", cursor: "pointer" }}>
                      <input type="checkbox" style={{ cursor: "pointer" }} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "influencers" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {influencers.map((inf) => (
            <Card key={inf.name}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>{inf.name}</div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "4px" }}>{inf.category}</div>
              <p style={{ fontSize: "13px", color: tokens.color.text, fontStyle: "italic", margin: "8px 0", lineHeight: "1.4" }}>"{inf.quote}"</p>
              <div style={{ fontSize: "12px", color: tokens.color.muted }}>{inf.followers} followers</div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "trends" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {trends.map((trend) => (
            <Card key={trend.title}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text }}>{trend.title}</div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "4px" }}>
                {trend.source} • {trend.date}
              </div>
              <p style={{ fontSize: "13px", color: tokens.color.text, margin: "8px 0", lineHeight: "1.4" }}>{trend.snippet}</p>
              <Button variant="ghost" size="sm">Read More</Button>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "ideas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {ideas.map((idea) => (
            <Card key={idea.title}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text }}>{idea.title}</div>
                <Badge color="success">Match: {idea.match}%</Badge>
              </div>
              <p style={{ fontSize: "13px", color: tokens.color.text, margin: "8px 0", lineHeight: "1.4" }}>{idea.desc}</p>
              <Button variant="primary" size="sm">Explore →</Button>
            </Card>
          ))}
          <Button variant="secondary" size="md">Refresh Ideas</Button>
        </div>
      )}

      {activeTab === "community" && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: tokens.color.text }}>Join the LADO Club</h3>
            <p style={{ fontSize: "13px", color: tokens.color.muted, marginTop: "8px" }}>Connect with 2,400+ builders. Share wins, get feedback, find partners.</p>
            <Button variant="primary" style={{ marginTop: "16px" }}>Join on Discord →</Button>
          </div>
        </Card>
      )}
    </>
  );
};

// ============ MARKETPLACE SECTION ============
const MarketplaceSection = ({ forwardedItems = [], onPublish }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [selectedForwarded, setSelectedForwarded] = useState(null);

  const products = [
    { name: "Custom Pet Phone Case", channel: "Etsy", status: "Active", orders: 23, revenue: 437 },
    { name: "Motivational Quote Mug", channel: "Etsy", status: "Active", orders: 15, revenue: 210 },
    { name: "Social Media 101 Course", channel: "Gumroad", status: "Draft", orders: 0, revenue: 0 },
    { name: "Hustle Planner Template", channel: "Etsy", status: "Active", orders: 8, revenue: 120 },
    { name: "Brand Strategy Workshop", channel: "Eventbrite", status: "Upcoming", orders: 12, revenue: 0 },
    { name: "Pet Portrait — Custom AI Art", channel: "Shopify", status: "Active", orders: 5, revenue: 80 },
  ];

  const pendingForwards = forwardedItems.filter(i => i.status === "quote");

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Revenue This Month</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.color.primary }}>$847</div>
        </Card>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Active Listings</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.color.primary }}>12</div>
        </Card>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Pending Orders</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: tokens.color.primary }}>3</div>
        </Card>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Freedom Progress</div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: tokens.color.primary }}>22%</div>
          <ProgressBar value={847} max={3800} color="success" />
        </Card>
      </div>

      <Tabs
        items={[
          { id: "products", label: "Products" },
          { id: "forwarded", label: `Forwarded (${pendingForwards.length})` },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "products" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: tokens.color.text, margin: 0 }}>Products</h2>
            <Button variant="primary" size="sm"><Plus /> New Listing</Button>
          </div>

          <Card>
            <Table
              columns={[
                { key: "name", label: "Product" },
                { key: "channel", label: "Channel" },
                { key: "status", label: "Status" },
                { key: "orders", label: "Orders" },
                { key: "revenue", label: "Revenue" },
                { key: "actions", label: "Actions" },
              ]}
              rows={products.map((p) => ({
                name: p.name,
                channel: p.channel,
                status: <Badge>{p.status}</Badge>,
                orders: p.orders || "—",
                revenue: p.revenue ? `$${p.revenue}` : "—",
                actions: <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(p); setIsPanelOpen(true); }}>View</Button>,
              }))}
            />
          </Card>
        </>
      )}

      {activeTab === "forwarded" && (
        <>
          {pendingForwards.length === 0 ? (
            <Card>
              <EmptyState message="No pending forwards. Complete a mission in Execute and use the Forward button to send deliverables here." />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {pendingForwards.map((item) => (
                <Card key={item.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <Badge color="warning">Quote</Badge>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>{item.missionName}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "12px" }}>
                        Forwarded {item.forwardedDate} • Target: {item.suggestedChannel.charAt(0).toUpperCase() + item.suggestedChannel.slice(1)}
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {item.deliverables.map((d, idx) => (
                          <span key={idx} style={{ padding: "4px 8px", background: tokens.color.surface, borderRadius: tokens.radius.sm, fontSize: "12px", color: tokens.color.text }}>
                            {d}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                        <div style={{ padding: "10px", background: tokens.color.surface, borderRadius: tokens.radius.md, textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: tokens.color.muted }}>Price</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: tokens.color.primary }}>${item.suggestedPrice}</div>
                        </div>
                        <div style={{ padding: "10px", background: tokens.color.surface, borderRadius: tokens.radius.md, textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: tokens.color.muted }}>Platform Fee</div>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.error }}>{item.platformFee}</div>
                        </div>
                        <div style={{ padding: "10px", background: tokens.color.surface, borderRadius: tokens.radius.md, textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: tokens.color.muted }}>Production</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: tokens.color.error }}>${item.productionCost}</div>
                        </div>
                        <div style={{ padding: "10px", background: tokens.color.success + "15", borderRadius: tokens.radius.md, textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: tokens.color.muted }}>Margin</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: tokens.color.success }}>${item.projectedMargin.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "16px", borderTop: `1px solid ${tokens.color.border}`, paddingTop: "16px" }}>
                    <Button variant="primary" onClick={() => onPublish && onPublish(item.id)}>
                      <CheckCircle style={{ width: "14px", height: "14px" }} /> Publish Listing
                    </Button>
                    <Button variant="secondary">
                      <Edit2 /> Edit Quote
                    </Button>
                    <Button variant="ghost">
                      <Eye /> Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <DetailPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={selectedProduct?.name || ""}>
        {selectedProduct && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Channel</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>{selectedProduct.channel}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Status</div>
              <Badge>{selectedProduct.status}</Badge>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Orders</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: tokens.color.primary }}>{selectedProduct.orders}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "4px" }}>Revenue</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: tokens.color.success }}>${selectedProduct.revenue}</div>
            </div>
            <Button variant="primary">Edit Listing</Button>
            <Button variant="secondary">View on {selectedProduct.channel}</Button>
          </div>
        )}
      </DetailPanel>
    </>
  );
};

// ============ FORMALIZE SECTION ============
const FormalizeSection = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [selectedDocType, setSelectedDocType] = useState(null);

  const documents = [
    { name: "March 2026 P&L", type: "P&L", hustle: "Etsy Store", status: "Ready", date: "Mar 28" },
    { name: "Q1 Revenue Projections", type: "Projection", hustle: "All", status: "Ready", date: "Mar 25" },
    { name: "Business Plan — Etsy", type: "Business Plan", hustle: "Etsy Store", status: "Draft", date: "Mar 20" },
    { name: "Branding Guide v1", type: "Branding", hustle: "All", status: "Ready", date: "Mar 15" },
  ];

  const ledgerEntries = [
    { date: "Mar 28", desc: "Etsy sales — phone cases", category: "Sales", amount: 87.5, type: "Income" },
    { date: "Mar 27", desc: "Printful order fulfillment", category: "COGS", amount: -32.0, type: "Expense" },
    { date: "Mar 26", desc: "Canva Pro subscription", category: "Tools", amount: -13.0, type: "Expense" },
    { date: "Mar 25", desc: "UGC client payment", category: "Freelance", amount: 250.0, type: "Income" },
    { date: "Mar 24", desc: "Etsy listing fees", category: "Fees", amount: -4.2, type: "Expense" },
  ];

  const education = [
    { title: "How to Read a P&L Statement", duration: "12 min", desc: "A P&L tracks your revenue minus expenses over a period..." },
    { title: "Getting Your First Business Loan", duration: "8 min", desc: "SBA microloans start at $500. You'll need a business plan..." },
    { title: "Tax Basics for Side Hustlers", duration: "15 min", desc: "If you earn over $400 in self-employment income..." },
  ];

  return (
    <>
      <Tabs
        items={[
          { id: "documents", label: "Documents" },
          { id: "ledger", label: "Ledger" },
          { id: "education", label: "Education" },
          { id: "calculators", label: "Calculators" },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "documents" && (
        <>
          <Card style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Generate New Document</div>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px" }}>
              <Select
                label="Select Hustle"
                options={[
                  { value: "all", label: "All Hustles" },
                  { value: "etsy", label: "Etsy Store" },
                  { value: "ugc", label: "UGC Clients" },
                ]}
                value=""
                onChange={() => {}}
              />
              <div>
                <label style={{ fontSize: "12px", fontWeight: 500, color: tokens.color.text, display: "block", marginBottom: "8px" }}>Document Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {["P&L", "Projections", "Business Plan", "Branding Guide", "Loan Package", "Tax Summary"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedDocType(type)}
                      style={{
                        padding: "8px",
                        border: `1px solid ${tokens.color.border}`,
                        borderRadius: tokens.radius.md,
                        background: selectedDocType === type ? tokens.color.primary : tokens.color.white,
                        color: selectedDocType === type ? tokens.color.white : tokens.color.text,
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: fontStack,
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {selectedDocType && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${tokens.color.border}` }}>
                <Input label="What's your MOAT? What makes you different?" placeholder="Your answer..." />
                <Input label="Who is your target customer?" placeholder="Your answer..." style={{ marginTop: "12px" }} />
                <Input label="What's your unfair advantage?" placeholder="Your answer..." style={{ marginTop: "12px" }} />
                <Button variant="primary" style={{ marginTop: "12px" }}>Generate Document</Button>
              </div>
            )}
          </Card>

          <Card>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Recent Documents</div>
            <Table
              columns={[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "hustle", label: "Hustle" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
              rows={documents.map((d) => ({
                name: d.name,
                type: d.type,
                hustle: d.hustle,
                status: d.status === "Ready" ? <CheckCircle style={{ color: tokens.color.success }} /> : <Badge color="warning">{d.status}</Badge>,
                date: d.date,
              }))}
            />
          </Card>
        </>
      )}

      {activeTab === "ledger" && (
        <Card>
          <Table
            columns={[
              { key: "date", label: "Date" },
              { key: "desc", label: "Description" },
              { key: "category", label: "Category" },
              { key: "amount", label: "Amount" },
              { key: "type", label: "Type" },
            ]}
            rows={[
              ...ledgerEntries.map((e) => ({
                date: e.date,
                desc: e.desc,
                category: e.category,
                amount: (
                  <span style={{ color: e.amount > 0 ? tokens.color.success : tokens.color.error, fontWeight: 600 }}>
                    {e.amount > 0 ? "+" : ""}${Math.abs(e.amount).toFixed(2)}
                  </span>
                ),
                type: e.type,
              })),
              {
                date: "",
                desc: "TOTAL",
                category: "",
                amount: (
                  <span style={{ color: tokens.color.primary, fontWeight: 700 }}>
                    +${(87.5 + 250.0 - 32.0 - 13.0 - 4.2).toFixed(2)}
                  </span>
                ),
                type: "",
              },
            ]}
          />
          <Button variant="secondary" style={{ marginTop: "16px" }}>Connect QuickBooks →</Button>
        </Card>
      )}

      {activeTab === "education" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {education.map((item) => (
            <Card key={item.title}>
              <div style={{ position: "relative", width: "100%", height: "120px", background: tokens.color.surface, borderRadius: tokens.radius.md, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                <Play style={{ width: "32px", height: "32px", color: tokens.color.primary }} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text }}>{item.title}</div>
              <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "4px" }}>{item.duration}</div>
              <p style={{ fontSize: "12px", color: tokens.color.text, margin: "8px 0", lineHeight: "1.4" }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "calculators" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Card>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Break-Even Calculator</div>
            <Input label="Monthly Costs" placeholder="$1,000" />
            <Input label="Price Per Unit" placeholder="$25" style={{ marginTop: "12px" }} />
            <div style={{ marginTop: "12px", padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
              <div style={{ fontSize: "11px", color: tokens.color.muted }}>You break even at</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: tokens.color.primary }}>40 units/month</div>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Revenue Projector</div>
            <Input label="Current Monthly Revenue" placeholder="$500" />
            <Input label="Growth Rate (%)" placeholder="10" style={{ marginTop: "12px" }} />
            <div style={{ marginTop: "12px", fontSize: "11px", color: tokens.color.muted }}>6-Month Projection</div>
          </Card>
        </div>
      )}
    </>
  );
};

// ============ PROTECT SECTION ============
const ProtectSection = ({ user }) => {
  const quitReadyItems = [
    { label: "6 months of expenses saved", current: user.currentSavings, target: user.monthlyExpenses * 6, done: user.currentSavings >= user.monthlyExpenses * 6 },
    { label: "Side hustle at 75% salary for 3+ months", current: user.sideHustleIncome, target: user.monthlyIncome * 0.75, done: user.sideHustleIncome >= user.monthlyIncome * 0.75 },
    { label: "At least 2 income streams active", current: 2, target: 2, done: true },
    { label: "Health insurance plan identified", current: 0, target: 1, done: false },
    { label: "Business formally registered", current: 0, target: 1, done: false },
    { label: "Emergency client pipeline (3+ leads)", current: 0, target: 3, done: false },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Burnout Risk</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: tokens.color.success }}>Low</div>
        </Card>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Hustle Hours</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: tokens.color.primary }}>15h this week</div>
        </Card>
        <Card>
          <div style={{ fontSize: "12px", color: tokens.color.muted, marginBottom: "6px" }}>Months to Runway</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: tokens.color.warning }}>5mo</div>
        </Card>
      </div>

      <Card style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Quit-Ready Checklist</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {quitReadyItems.map((item, idx) => (
            <label key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start", cursor: "pointer", fontSize: "13px" }}>
              <input type="checkbox" checked={item.done} readOnly style={{ marginTop: "3px", cursor: "pointer" }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: tokens.color.text, fontWeight: item.done ? 400 : 500 }}>{item.label}</div>
                <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "2px" }}>
                  {item.current} / {item.target}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <div>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Local Wellness</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { name: "Zen Yoga Studio", distance: "0.5mi", rating: 4.8 },
            { name: "Float Miami", distance: "1.2mi", rating: 4.9 },
            { name: "Mindful Movement", distance: "2mi", rating: 4.7 },
          ].map((place) => (
            <Card key={place.name}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text }}>{place.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: tokens.color.muted" }}>
                <span>{place.distance}</span>
                <span>{"★".repeat(Math.floor(place.rating))} {place.rating}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Success Stories</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { name: "Sarah", story: "Quit accounting after 8 months. Now making $6,200/mo from Etsy store." },
            { name: "Marcus", story: "Replaced his $4,500/mo salary with UGC + freelance work in 11 months." },
          ].map((person) => (
            <Card key={person.name}>
              <p style={{ margin: 0, fontSize: "13px", color: tokens.color.text, lineHeight: "1.5", fontStyle: "italic" }}>"{person.story}"</p>
              <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: 600, color: tokens.color.primary }}>— {person.name}</div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

// ============ OPTIMIZE SECTION ============
const OptimizeSection = () => {
  return (
    <>
      <div style={{ padding: "12px 16px", background: tokens.color.warning, borderRadius: tokens.radius.md, display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "24px" }}>
        <AlertTriangle style={{ color: tokens.color.white, flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13px", color: tokens.color.white }}>
          This section provides educational tools and calculators only. Nothing here constitutes investment, financial, or legal advice.
        </div>
      </div>

      <Card style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Monthly Cost Audit</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "Car Insurance", cost: 480, save: 85 },
            { name: "Streaming Services", cost: 65, save: 33 },
            { name: "Phone Plan", cost: 95, save: 60 },
            { name: "Home Insurance", cost: 220, save: 40 },
          ].map((item) => (
            <div key={item.name} style={{ padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: tokens.color.text }}>{item.name}</div>
                <div style={{ fontSize: "12px", color: tokens.color.muted, marginTop: "2px" }}>${item.cost}/mo</div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.success }}>Save ${item.save}/mo</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px", padding: "12px", background: tokens.color.success, borderRadius: tokens.radius.md, fontSize: "13px", fontWeight: 600, color: tokens.color.white }}>
          Total potential savings: $218/mo
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <Card>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Lease vs Buy</div>
          <Input label="Monthly Cost" placeholder="$480" />
          <Input label="Purchase Price" placeholder="$25,000" style={{ marginTop: "12px" }} />
          <div style={{ marginTop: "12px", padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
            <div style={{ fontSize: "11px", color: tokens.color.muted }}>Break-even</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: tokens.color.primary }}>52 months</div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Mortgage Calculator</div>
          <Input label="Home Price" placeholder="$400,000" />
          <Input label="Down Payment %" placeholder="20" style={{ marginTop: "12px" }} />
          <div style={{ marginTop: "12px", padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
            <div style={{ fontSize: "11px", color: tokens.color.muted }}>Monthly Payment</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: tokens.color.primary }}>$1,910</div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Recommended Tools</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { name: "Canva Pro", cost: "$13/mo", desc: "Design graphics for your brand" },
            { name: "Printful", cost: "Free", desc: "Print-on-demand fulfillment" },
            { name: "TubeBuddy", cost: "$8/mo", desc: "YouTube optimization tools" },
          ].map((tool) => (
            <div key={tool.name} style={{ padding: "12px", background: tokens.color.surface, borderRadius: tokens.radius.md }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.text }}>{tool.name}</div>
              <div style={{ fontSize: "11px", color: tokens.color.muted, marginTop: "2px" }}>{tool.cost}</div>
              <div style={{ fontSize: "12px", color: tokens.color.text, marginTop: "4px" }}>{tool.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

// ============ PROFILE SECTION ============
const ProfileSection = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <>
      <Tabs
        items={[
          { id: "info", label: "Info" },
          { id: "knowledge", label: "Knowledge Base" },
          { id: "integrations", label: "Integrations" },
          { id: "chat", label: "Goal Chat" },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "info" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: tokens.color.text }}>Profile Information</h2>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}><Edit2 /> Edit</Button>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Agent Name"
              value={formData.ladoName}
              onChange={(e) => setFormData({ ...formData, ladoName: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Current Job"
              value={formData.currentJob}
              onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Monthly Income"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Monthly Expenses"
              value={formData.monthlyExpenses}
              onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Current Savings"
              value={formData.currentSavings}
              onChange={(e) => setFormData({ ...formData, currentSavings: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Hustle Income"
              value={formData.sideHustleIncome}
              onChange={(e) => setFormData({ ...formData, sideHustleIncome: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Hours Per Week"
              value={formData.hoursPerWeek}
              onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
              disabled={!isEditing}
            />
            <Select
              label="Channel"
              options={[
                { value: "telegram", label: "Telegram" },
                { value: "discord", label: "Discord" },
                { value: "email", label: "Email" },
              ]}
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            />
          </div>
        </Card>
      )}

      {activeTab === "knowledge" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card>
            <div style={{ border: `2px dashed ${tokens.color.border}`, borderRadius: tokens.radius.lg, padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
              <p style={{ margin: 0, fontSize: "13px", color: tokens.color.text, fontWeight: 500 }}>Drop files here to upload</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: tokens.color.muted }}>or click to browse</p>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Your Documents</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Resume_2026.pdf", date: "Mar 25" },
                { name: "Business_Ideas.docx", date: "Mar 20" },
              ].map((doc) => (
                <div key={doc.name} style={{ padding: "8px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${tokens.color.border}` }}>
                  <span style={{ fontSize: "13px", color: tokens.color.text" }}>{doc.name}</span>
                  <span style={{ fontSize: "12px", color: tokens.color.muted }}>{doc.date}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Questionnaires</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { title: "About Your Goals", progress: 3, max: 5 },
              { title: "Work Style", progress: 0, max: 4 },
              { title: "Risk Tolerance", progress: 0, max: 6 },
            ].map((q) => (
              <Card key={q.title}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.text, marginBottom: "8px" }}>{q.title}</div>
                <ProgressBar value={q.progress} max={q.max} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <>
          <h3 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Essential</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { name: "Gmail", connected: true },
              { name: "Google Calendar", connected: true },
              { name: "Stripe", connected: true },
              { name: "Wave Accounting", connected: false },
            ].map((int) => (
              <Card key={int.name}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text, marginBottom: "8px" }}>{int.name}</div>
                <Badge color={int.connected ? "success" : "info"}>{int.connected ? "Connected" : "Not Connected"}</Badge>
                <Button variant={int.connected ? "secondary" : "primary"} size="sm" style={{ marginTop: "8px", width: "100%" }}>
                  {int.connected ? "Manage" : "Connect"}
                </Button>
              </Card>
            ))}
          </div>

          <h3 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>E-Commerce</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { name: "Etsy", connected: true },
              { name: "Shopify", connected: false },
              { name: "Printful", connected: true },
              { name: "Gumroad", connected: false },
            ].map((int) => (
              <Card key={int.name}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text, marginBottom: "8px" }}>{int.name}</div>
                <Badge color={int.connected ? "success" : "info"}>{int.connected ? "Connected" : "Not Connected"}</Badge>
                <Button variant={int.connected ? "secondary" : "primary"} size="sm" style={{ marginTop: "8px", width: "100%" }}>
                  {int.connected ? "Manage" : "Connect"}
                </Button>
              </Card>
            ))}
          </div>

          <h3 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: tokens.color.text }}>Social & Other</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { name: "Instagram", connected: false },
              { name: "YouTube", connected: false },
              { name: "Calendly", connected: false },
              { name: "HubSpot", connected: false },
            ].map((int) => (
              <Card key={int.name}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.text, marginBottom: "8px" }}>{int.name}</div>
                <Badge color={int.connected ? "success" : "info"}>{int.connected ? "Connected" : "Not Connected"}</Badge>
                <Button variant={int.connected ? "secondary" : "primary"} size="sm" style={{ marginTop: "8px", width: "100%" }}>
                  {int.connected ? "Manage" : "Connect"}
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "chat" && (
        <Card>
          <div style={{ height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.color.primary, flexShrink: 0 }} />
              <div style={{ background: tokens.color.surface, padding: "10px 12px", borderRadius: tokens.radius.md, maxWidth: "70%" }}>
                <p style={{ margin: 0, fontSize: "13px", color: tokens.color.text }}>Tell me about your biggest goal for the next 6 months.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <div style={{ background: tokens.color.primary, color: tokens.color.white, padding: "10px 12px", borderRadius: tokens.radius.md, maxWidth: "70%" }}>
                <p style={{ margin: 0, fontSize: "13px" }}>I want to replace my salary and quit by September.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.color.primary, flexShrink: 0 }} />
              <div style={{ background: tokens.color.surface, padding: "10px 12px", borderRadius: tokens.radius.md, maxWidth: "70%" }}>
                <p style={{ margin: 0, fontSize: "13px", color: tokens.color.text }}>That's 6 months away. Based on your Freedom Number of $3,800/mo and current hustle income of $1,200/mo, you need to 3x your side income. Here's what I'd suggest: focus 80% of your hustle hours on your Etsy store (highest margin), use the remaining 20% for UGC clients (quick cash). Want me to create a mission for this?</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              placeholder="Your message..."
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${tokens.color.border}`,
                borderRadius: tokens.radius.md,
                fontFamily: fontStack,
                fontSize: "13px",
              }}
            />
            <Button variant="primary" size="sm"><Send style={{ width: "14px", height: "14px" }} /></Button>
          </div>
        </Card>
      )}
    </>
  );
};

// ============ MAIN COMPONENT ============
export default function LadoPlatform() {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState(MOCK_USER);
  const [forwardedItems, setForwardedItems] = useState([
    { id: "fwd-1", missionName: "Launch Etsy Print-on-Demand Store", deliverables: ["5 product designs", "SEO-optimized listings", "Product photography"], suggestedChannel: "Etsy", suggestedPrice: 24.99, platformFee: "6.5% + $0.20", productionCost: 8.50, projectedMargin: 14.67, status: "quote", forwardedDate: "Mar 29" },
  ]);

  const handleForwardToMarketplace = (item) => {
    setForwardedItems([...forwardedItems, { ...item, id: `fwd-${Date.now()}`, status: "quote", forwardedDate: "Mar 30" }]);
    setActiveSection("marketplace");
  };

  const handlePublishListing = (itemId) => {
    setForwardedItems(forwardedItems.map(item =>
      item.id === itemId ? { ...item, status: "listed" } : item
    ));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: tokens.color.background, fontFamily: fontStack }}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} user={user} />

      <main style={{ flex: 1, marginLeft: "240px", padding: "24px 32px", maxWidth: "1400px" }}>
        {activeSection === "home" && <HomeSection user={user} />}
        {activeSection === "execute" && <ExecuteSection onForward={handleForwardToMarketplace} />}
        {activeSection === "inbox" && <InboxSection />}
        {activeSection === "discover" && <DiscoverSection />}
        {activeSection === "marketplace" && <MarketplaceSection forwardedItems={forwardedItems} onPublish={handlePublishListing} />}
        {activeSection === "formalize" && <FormalizeSection />}
        {activeSection === "protect" && <ProtectSection user={user} />}
        {activeSection === "optimize" && <OptimizeSection />}
        {activeSection === "profile" && <ProfileSection user={user} onUpdate={setUser} />}
      </main>
    </div>
  );
}
