// Mock data service — replace with real API calls to your Express backend

import type { CSSProperties } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  plan: "starter" | "pro" | "premium";
  role: "user" | "admin";
  createdAt: string;
}

export interface Link {
  _id: string;
  userId: string;
  title: string;
  url: string;
  enabled: boolean;
  clicks: number;
  order: number;
}

export interface Appearance {
  layout: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
  font: string;
  buttonStyle: string;
  animation: string;
  avatarStyle: string;
}

export interface Card {
  _id: string;
  userId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  template: string;
  brandName: string;
  tagline: string;
  logoUrl: string;
  servicesText: string;
}

export interface AnalyticsEvent {
  _id: string;
  userId: string;
  type: "profile_view" | "link_click" | "qr_scan";
  linkId?: string;
  timestamp: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AppliedCoupon {
  _id: string;
  userId: string;
  couponId: string;
  discountPercent: number;
  appliedAt: string;
}

// --- LAYOUT TEMPLATES ---
export interface LayoutTemplate {
  id: string;
  label: string;
  description: string;
}

export const layoutTemplates: LayoutTemplate[] = [
  { id: "classic-glass", label: "Classic Glass", description: "Clean glassmorphism with centered avatar" },
  { id: "card-stack", label: "Card Stack", description: "Links as stacked floating cards" },
  { id: "minimal", label: "Minimal", description: "Ultra-clean with maximum whitespace" },
  { id: "focus-avatar", label: "Focus Avatar", description: "Large hero avatar with compact links" },
  { id: "bubble-links", label: "Bubble Links", description: "Rounded bubble-shaped link buttons" },
  { id: "bordered", label: "Bordered", description: "Strong borders with structured layout" },
  { id: "edge-accent", label: "Edge Accent", description: "Colored left border accent on links" },
  { id: "pastel-header", label: "Pastel Header", description: "Soft pastel gradient header section" },
  { id: "neon-cyber", label: "Neon Cyber", description: "Cyberpunk-inspired neon glow effects" },
  { id: "gradient-wave", label: "Gradient Wave", description: "Flowing gradient background waves" },
  { id: "glass-morph", label: "Glass Morph", description: "Heavy glassmorphism on every element" },
  { id: "modern-grid", label: "Modern Card Grid", description: "Grid layout for links instead of list" },
  { id: "soft-ui", label: "Soft UI", description: "Neumorphic soft shadows and depth" },
  { id: "dark-creator", label: "Dark Creator", description: "Bold dark mode for creators" },
  { id: "sunset-gradient", label: "Sunset Gradient", description: "Warm sunset color gradients" },

  { id: "creator-hero", label: "Creator Hero", description: "Hero banner + social icons + featured link" },
  { id: "featured-spotlight", label: "Featured Spotlight", description: "Large glowing featured link on top" },
  { id: "social-grid", label: "Social Grid", description: "Two-column grid cards for links" },
  { id: "creator-card-stack", label: "Creator Card Stack", description: "Overlapping floating cards" },
  { id: "media-creator", label: "Media Creator", description: "Media preview section + links" },
  { id: "story-timeline", label: "Story Timeline", description: "Timeline nodes for links" },
  { id: "business-card-layout", label: "Business Card", description: "Contact card + dynamic links below" },
  { id: "product-showcase", label: "Product Showcase", description: "Product cards + remaining links below" },
  { id: "neon-gaming", label: "Neon Gaming", description: "Neon glow buttons + cyber vibe" },
  { id: "minimal-portfolio", label: "Minimal Portfolio", description: "Portfolio projects + links" },
];

// --- THEME SYSTEM ---
export interface Theme {
  id: string;
  label: string;
  bg: string;
  cardBg: string;
  text: string;
  subtext: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  gradient?: string;
}

export const themes: Theme[] = [
  { id: "neon-cyber", label: "Neon Cyber", bg: "#0a0a1a", cardBg: "rgba(124,58,237,0.1)", text: "#e0e0ff", subtext: "#8888cc", accent: "#7c3aed", buttonBg: "rgba(124,58,237,0.2)", buttonText: "#c4b5fd", gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)" },
  { id: "glass-morph", label: "Glass Morph", bg: "#0f0f1e", cardBg: "rgba(255,255,255,0.06)", text: "#f0f0f0", subtext: "#888", accent: "#6366f1", buttonBg: "rgba(255,255,255,0.08)", buttonText: "#e0e0e0", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { id: "sunset-gradient", label: "Sunset Gradient", bg: "#1a0a0a", cardBg: "rgba(249,115,22,0.1)", text: "#fff5e0", subtext: "#cc9966", accent: "#f97316", buttonBg: "rgba(249,115,22,0.15)", buttonText: "#fed7aa", gradient: "linear-gradient(135deg, #f97316, #ec4899)" },
  { id: "minimal-creator", label: "Minimal Creator", bg: "#fafafa", cardBg: "rgba(0,0,0,0.03)", text: "#111", subtext: "#666", accent: "#111", buttonBg: "rgba(0,0,0,0.05)", buttonText: "#111" },
  { id: "pastel-dream", label: "Pastel Dream", bg: "#fef3f8", cardBg: "rgba(236,72,153,0.08)", text: "#4a2040", subtext: "#9a6080", accent: "#ec4899", buttonBg: "rgba(236,72,153,0.1)", buttonText: "#be185d", gradient: "linear-gradient(135deg, #ec4899, #a855f7)" },
  { id: "creator-dark", label: "Creator Dark Mode", bg: "#0a0a0f", cardBg: "rgba(255,255,255,0.04)", text: "#f0f0f0", subtext: "#666", accent: "#8b5cf6", buttonBg: "rgba(139,92,246,0.15)", buttonText: "#c4b5fd" },
  { id: "bubble-pop", label: "Bubble Pop", bg: "#fffbeb", cardBg: "rgba(245,158,11,0.08)", text: "#422006", subtext: "#92400e", accent: "#f59e0b", buttonBg: "rgba(245,158,11,0.12)", buttonText: "#b45309", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { id: "tech-founder", label: "Tech Founder", bg: "#030712", cardBg: "rgba(59,130,246,0.08)", text: "#e0eaff", subtext: "#6b7fa8", accent: "#3b82f6", buttonBg: "rgba(59,130,246,0.15)", buttonText: "#93c5fd" },
  { id: "gradient-wave", label: "Gradient Wave", bg: "#0c0a1d", cardBg: "rgba(168,85,247,0.1)", text: "#e8dff5", subtext: "#9580b0", accent: "#a855f7", buttonBg: "rgba(168,85,247,0.15)", buttonText: "#d8b4fe", gradient: "linear-gradient(135deg, #a855f7, #6366f1)" },
  { id: "luxury-gold", label: "Luxury Gold", bg: "#0a0a05", cardBg: "rgba(234,179,8,0.08)", text: "#fef3c7", subtext: "#a89050", accent: "#eab308", buttonBg: "rgba(234,179,8,0.12)", buttonText: "#fde68a", gradient: "linear-gradient(135deg, #eab308, #d97706)" },
  { id: "creator-neon", label: "Creator Neon", bg: "#050510", cardBg: "rgba(16,185,129,0.08)", text: "#d1fae5", subtext: "#5eaa8a", accent: "#10b981", buttonBg: "rgba(16,185,129,0.15)", buttonText: "#6ee7b7", gradient: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { id: "ocean-blue", label: "Ocean Blue", bg: "#0a1628", cardBg: "rgba(6,182,212,0.08)", text: "#cffafe", subtext: "#5eaab8", accent: "#06b6d4", buttonBg: "rgba(6,182,212,0.12)", buttonText: "#67e8f9", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { id: "soft-ui", label: "Soft UI Neumorphism", bg: "#e8e8e8", cardBg: "rgba(255,255,255,0.6)", text: "#333", subtext: "#777", accent: "#6366f1", buttonBg: "rgba(255,255,255,0.8)", buttonText: "#333" },
  { id: "retro-90s", label: "Retro 90s", bg: "#1a0533", cardBg: "rgba(236,72,153,0.12)", text: "#fce7f3", subtext: "#c084ab", accent: "#ec4899", buttonBg: "rgba(236,72,153,0.18)", buttonText: "#f9a8d4", gradient: "linear-gradient(135deg, #ec4899, #f59e0b)" },
  { id: "future-tech", label: "Future Tech", bg: "#020617", cardBg: "rgba(34,211,238,0.06)", text: "#e0f2fe", subtext: "#5e8fa8", accent: "#22d3ee", buttonBg: "rgba(34,211,238,0.12)", buttonText: "#a5f3fc", gradient: "linear-gradient(135deg, #22d3ee, #818cf8)" },
  { id: "creator-grid", label: "Creator Grid", bg: "#111", cardBg: "rgba(255,255,255,0.04)", text: "#eee", subtext: "#777", accent: "#ef4444", buttonBg: "rgba(239,68,68,0.12)", buttonText: "#fca5a5" },
  { id: "midnight-glow", label: "Midnight Glow", bg: "#0c0c1d", cardBg: "rgba(99,102,241,0.08)", text: "#e0e7ff", subtext: "#7e82b0", accent: "#6366f1", buttonBg: "rgba(99,102,241,0.15)", buttonText: "#a5b4fc", gradient: "linear-gradient(135deg, #6366f1, #ec4899)" },
  { id: "pink-social", label: "Pink Social", bg: "#fdf2f8", cardBg: "rgba(236,72,153,0.06)", text: "#831843", subtext: "#9d174d", accent: "#ec4899", buttonBg: "rgba(236,72,153,0.1)", buttonText: "#be185d", gradient: "linear-gradient(135deg, #ec4899, #f43f5e)" },
  { id: "minimal-mono", label: "Minimal Mono", bg: "#fff", cardBg: "rgba(0,0,0,0.02)", text: "#000", subtext: "#555", accent: "#000", buttonBg: "rgba(0,0,0,0.04)", buttonText: "#000" },
  { id: "aurora-gradient", label: "Aurora Gradient", bg: "#040d15", cardBg: "rgba(16,185,129,0.06)", text: "#d1fae5", subtext: "#5ea88a", accent: "#10b981", buttonBg: "rgba(16,185,129,0.12)", buttonText: "#6ee7b7", gradient: "linear-gradient(135deg, #10b981, #8b5cf6, #06b6d4)" },
];

// --- MOCK CURRENT USER ---
export const mockUser: User = {
  _id: "u1",
  name: "Alex Rivera",
  email: "alex@linkora.io",
  username: "alexrivera",
  avatar: "",
  bio: "Designer & creator. Building cool things on the internet ✨",
  plan: "pro",
  role: "admin",
  createdAt: "2024-11-01T00:00:00Z",
};

// --- MOCK LINKS ---
export const mockLinks: Link[] = [
  { _id: "l1", userId: "u1", title: "My Portfolio", url: "https://alexrivera.design", enabled: true, clicks: 342, order: 0 },
  { _id: "l2", userId: "u1", title: "Twitter / X", url: "https://x.com/alexrivera", enabled: true, clicks: 218, order: 1 },
  { _id: "l3", userId: "u1", title: "YouTube Channel", url: "https://youtube.com/@alexrivera", enabled: true, clicks: 156, order: 2 },
  { _id: "l4", userId: "u1", title: "Buy Me a Coffee", url: "https://buymeacoffee.com/alex", enabled: false, clicks: 89, order: 3 },
  { _id: "l5", userId: "u1", title: "Latest Blog Post", url: "https://blog.alexrivera.design/new", enabled: true, clicks: 67, order: 4 },
];

// --- MOCK APPEARANCE ---
export const mockAppearance: Appearance = {
  layout: "classic-glass",
  theme: "neon-cyber",
  accentColor: "#7c3aed",
  backgroundColor: "#0a0a0f",
  font: "Space Grotesk",
  buttonStyle: "rounded",
  animation: "fade-up",
  avatarStyle: "circle",
};

// --- MOCK CARD ---
export const mockCard: Card = {
  _id: "c1",
  userId: "u1",
  name: "Alex Rivera",
  role: "Product Designer",
  phone: "+91 98765 43210",
  email: "alex@linkora.io",
  website: "alexrivera.design",
  location: "Mumbai, India",
  template: "luxury-dark-gold",
  brandName: "Linkora",
  tagline: "Design Studio",
  logoUrl: "",
  servicesText: "Web • App • SEO • Digital Marketing",
};

// --- MOCK ANALYTICS ---
export const mockAnalyticsEvents: AnalyticsEvent[] = Array.from({ length: 90 }, (_, i) => ({
  _id: `ae${i}`,
  userId: "u1",
  type: (["profile_view", "link_click", "qr_scan"] as const)[i % 3],
  linkId: i % 3 === 1 ? mockLinks[i % mockLinks.length]._id : undefined,
  timestamp: new Date(Date.now() - i * 86400000 * (Math.random() + 0.5)).toISOString(),
}));

// --- MOCK COUPONS ---
export const mockCoupons: Coupon[] = [
  { _id: "cp1", code: "LAUNCH50", discountPercent: 50, maxUses: 100, usedCount: 47, expiresAt: "2026-06-01T00:00:00Z", isActive: true, createdBy: "u1", createdAt: "2026-01-15T00:00:00Z" },
  { _id: "cp2", code: "WELCOME25", discountPercent: 25, maxUses: 500, usedCount: 312, expiresAt: "2026-12-31T00:00:00Z", isActive: true, createdBy: "u1", createdAt: "2026-01-01T00:00:00Z" },
  { _id: "cp3", code: "EARLYBIRD", discountPercent: 30, maxUses: 50, usedCount: 50, expiresAt: "2025-12-31T00:00:00Z", isActive: false, createdBy: "u1", createdAt: "2025-06-01T00:00:00Z" },
  { _id: "cp4", code: "PREMIUM10", discountPercent: 10, maxUses: 1000, usedCount: 89, expiresAt: "2026-09-01T00:00:00Z", isActive: true, createdBy: "u1", createdAt: "2026-02-01T00:00:00Z" },
];

// --- MOCK ADMIN USERS ---
export const mockAdminUsers: User[] = [
  mockUser,
  { _id: "u2", name: "Jordan Lee", email: "jordan@gmail.com", username: "jordanlee", avatar: "", bio: "Content creator", plan: "starter", role: "user", createdAt: "2025-12-15T00:00:00Z" },
  { _id: "u3", name: "Sam Chen", email: "sam@outlook.com", username: "samchen", avatar: "", bio: "Photographer", plan: "premium", role: "user", createdAt: "2025-11-20T00:00:00Z" },
  { _id: "u4", name: "Taylor Kim", email: "taylor@yahoo.com", username: "taylorkim", avatar: "", bio: "Music producer", plan: "pro", role: "user", createdAt: "2026-01-10T00:00:00Z" },
  { _id: "u5", name: "Casey Nguyen", email: "casey@gmail.com", username: "caseyng", avatar: "", bio: "Developer", plan: "starter", role: "user", createdAt: "2026-02-01T00:00:00Z" },
];

// --- CARD TEMPLATES (15 Premium) ---
export interface CardTemplate {
  id: string;
  label: string;
  gradient: string;
  textColor: string;
  subColor: string;
  accentColor: string;
  frontBgStyle?: CSSProperties;
  backBgStyle?: CSSProperties;
}

export const cardTemplates: CardTemplate[] = [
  {
    id: "minimal-white",
    label: "Hex Minimal (Modern)",
    gradient: "from-slate-50 to-white",
    textColor: "text-slate-900",
    subColor: "text-slate-600",
    accentColor: "#0f172a",
    frontBgStyle: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        radial-gradient(circle at 18% 22%, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0) 55%),
        linear-gradient(135deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0) 60%),
        linear-gradient(135deg, #ffffff 0%, #fbfdff 60%, #f5f7ff 100%)
      `,
      border: "1px solid rgba(15,23,42,0.08)",
      boxShadow: "0 24px 60px rgba(2,6,23,0.10)",
      backgroundBlendMode: "normal",
    },
    backBgStyle: {
      backgroundColor: "#0f172a",
      backgroundImage: `linear-gradient(135deg, #0f172a 0%, #111827 100%)`,
      border: "1px solid rgba(255,255,255,0.10)",
    },
  },
  {
    id: "premium-black",
    label: "Ornate Navy Gold",
    gradient: "from-[#0b1220] to-[#05070d]",
    textColor: "text-[#f5d37a]",
    subColor: "text-[#d6c28c]",
    accentColor: "#d4a853",
    frontBgStyle: {
      backgroundColor: "#05070d",
      backgroundImage: `
        radial-gradient(circle at 12% 35%, rgba(212,168,83,0.20) 0%, rgba(212,168,83,0) 55%),
        radial-gradient(circle at 0% 0%, rgba(212,168,83,0.22) 0%, rgba(212,168,83,0) 45%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.00) 45%),
        linear-gradient(135deg, #07101f 0%, #05070d 55%, #07101f 100%)
      `,
      border: "1px solid rgba(212,168,83,0.35)",
      boxShadow: "0 22px 60px rgba(0,0,0,0.45)",
    },
    backBgStyle: {
      backgroundColor: "#05070d",
      backgroundImage: `linear-gradient(135deg, #05070d 0%, #07101f 100%)`,
      border: "1px solid rgba(212,168,83,0.30)",
    },
  },
  {
    id: "luxury-dark-gold",
    label: "Mandala Luxe",
    gradient: "from-[#0b1020] to-[#06070c]",
    textColor: "text-[#f0d28a]",
    subColor: "text-[#cbb57a]",
    accentColor: "#d4a853",
    frontBgStyle: {
      backgroundColor: "#06070c",
      backgroundImage: `
        radial-gradient(circle at 78% 50%, rgba(212,168,83,0.22) 0%, rgba(212,168,83,0) 55%),
        conic-gradient(from 90deg at 88% 50%, rgba(212,168,83,0.00) 0deg, rgba(212,168,83,0.18) 40deg, rgba(212,168,83,0.00) 80deg),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.00) 45%),
        linear-gradient(135deg, #0b1020 0%, #06070c 55%, #0b1020 100%)
      `,
      borderTop: "1px solid rgba(212,168,83,0.35)",
      borderBottom: "1px solid rgba(212,168,83,0.35)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
    },
    backBgStyle: {
      backgroundColor: "#06070c",
      backgroundImage: `linear-gradient(135deg, #0b1020 0%, #06070c 100%)`,
      border: "1px solid rgba(212,168,83,0.28)",
    },
  },
  {
    id: "geometric-dark",
    label: "Triangle Matrix Blue",
    gradient: "from-[#050b14] to-[#030712]",
    textColor: "text-white",
    subColor: "text-slate-300",
    accentColor: "#22d3ee",
    frontBgStyle: {
      backgroundColor: "#030712",
      backgroundImage: `
        repeating-linear-gradient(60deg, rgba(34,211,238,0.20) 0 2px, rgba(0,0,0,0) 2px 18px),
        repeating-linear-gradient(120deg, rgba(34,211,238,0.14) 0 2px, rgba(0,0,0,0) 2px 18px),
        radial-gradient(circle at 20% 30%, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0) 45%),
        linear-gradient(135deg, #050b14 0%, #030712 100%)
      `,
      border: "1px solid rgba(34,211,238,0.20)",
      boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
      backgroundBlendMode: "screen",
    },
    backBgStyle: {
      backgroundColor: "#030712",
      backgroundImage: `linear-gradient(135deg, #030712 0%, #050b14 100%)`,
      border: "1px solid rgba(34,211,238,0.18)",
    },
  },
  {
    id: "split-modern",
    label: "Origami Split",
    gradient: "from-white to-slate-50",
    textColor: "text-slate-900",
    subColor: "text-slate-600",
    accentColor: "#f97316",
    frontBgStyle: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        linear-gradient(135deg, rgba(249,115,22,0.95) 0%, rgba(239,68,68,0.90) 55%, rgba(249,115,22,0.00) 56%),
        linear-gradient(225deg, rgba(249,115,22,0.00) 0%, rgba(249,115,22,0.00) 52%, rgba(249,115,22,0.60) 53%, rgba(249,115,22,0.00) 75%),
        linear-gradient(135deg, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.00) 45%),
        linear-gradient(90deg, #ffffff 0%, #ffffff 38%, #0b2130 38%, #081823 100%)
      `,
      border: "1px solid rgba(2,6,23,0.10)",
      boxShadow: "0 26px 60px rgba(2,6,23,0.18)",
      backgroundBlendMode: "normal",
    },
    backBgStyle: {
      backgroundColor: "#081823",
      backgroundImage: `linear-gradient(135deg, #0b2130 0%, #081823 100%)`,
      border: "1px solid rgba(255,255,255,0.10)",
    },
  },
  {
    id: "gradient-glass",
    label: "Forest Prism",
    gradient: "from-emerald-500 to-cyan-500",
    textColor: "text-white",
    subColor: "text-emerald-100",
    accentColor: "#22c55e",
    frontBgStyle: {
      backgroundColor: "#02100e",
      backgroundImage: `
        linear-gradient(115deg, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.00) 55%),
        linear-gradient(245deg, rgba(20,184,166,0.18) 0%, rgba(20,184,166,0.00) 55%),
        repeating-linear-gradient(120deg, rgba(34,197,94,0.12) 0 2px, rgba(0,0,0,0) 2px 18px),
        linear-gradient(135deg, #041312 0%, #02100e 55%, #041312 100%)
      `,
      border: "1px solid rgba(34,197,94,0.20)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
      backgroundBlendMode: "screen",
    },
    backBgStyle: {
      backgroundColor: "#02100e",
      backgroundImage: `linear-gradient(135deg, #02100e 0%, #041312 100%)`,
      border: "1px solid rgba(34,197,94,0.18)",
    },
  },
  {
    id: "corporate-blue",
    label: "Code Pro Yellow",
    gradient: "from-yellow-400 to-zinc-800",
    textColor: "text-zinc-900",
    subColor: "text-zinc-700",
    accentColor: "#facc15",
    frontBgStyle: {
      backgroundColor: "#facc15",
      backgroundImage: `
        radial-gradient(circle at 33% 50%, rgba(250,204,21,1) 0%, rgba(250,204,21,1) 42%, rgba(250,204,21,0) 43%),
        linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%),
        linear-gradient(90deg, #facc15 0%, #facc15 45%, #2b2f36 45%, #1f232a 100%)
      `,
      border: "1px solid rgba(0,0,0,0.10)",
      boxShadow: "0 26px 60px rgba(0,0,0,0.25)",
    },
    backBgStyle: {
      backgroundColor: "#1f232a",
      backgroundImage: `linear-gradient(135deg, #1f232a 0%, #2b2f36 100%)`,
      border: "1px solid rgba(250,204,21,0.18)",
    },
  },
  {
    id: "neon-creator",
    label: "Gold Ribbon",
    gradient: "from-[#111827] to-white",
    textColor: "text-zinc-900",
    subColor: "text-zinc-600",
    accentColor: "#d4a853",
    frontBgStyle: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        radial-gradient(circle at 65% 35%, rgba(212,168,83,0.18) 0%, rgba(212,168,83,0) 55%),
        linear-gradient(100deg, rgba(212,168,83,0.65) 0%, rgba(212,168,83,0.0) 40%),
        linear-gradient(260deg, rgba(212,168,83,0.55) 0%, rgba(212,168,83,0.0) 40%),
        linear-gradient(90deg, #1a1a1a 0%, #1a1a1a 62%, #ffffff 62%, #ffffff 100%)
      `,
      border: "1px solid rgba(212,168,83,0.18)",
      boxShadow: "0 26px 60px rgba(2,6,23,0.22)",
    },
    backBgStyle: {
      backgroundColor: "#111827",
      backgroundImage: `linear-gradient(135deg, #111827 0%, #0b1020 100%)`,
      border: "1px solid rgba(212,168,83,0.22)",
    },
  },
  {
    id: "startup-founder",
    label: "Sand Wave",
    gradient: "from-[#0b2430] to-[#081821]",
    textColor: "text-[#f5e9d0]",
    subColor: "text-[#d9c8a2]",
    accentColor: "#c9a46b",
    frontBgStyle: {
      backgroundColor: "#031018",
      backgroundImage: `
        radial-gradient(120% 80% at 50% 110%, rgba(201,164,107,0.85) 0%, rgba(201,164,107,0) 60%),
        radial-gradient(120% 80% at 52% 120%, rgba(180,140,80,0.55) 0%, rgba(180,140,80,0) 64%),
        linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%),
        linear-gradient(135deg, #071b24 0%, #031018 100%)
      `,
      border: "1px solid rgba(201,164,107,0.20)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
      backgroundBlendMode: "normal",
    },
    backBgStyle: {
      backgroundColor: "#031018",
      backgroundImage: `linear-gradient(135deg, #031018 0%, #071b24 100%)`,
      border: "1px solid rgba(201,164,107,0.18)",
    },
  },
  {
    id: "creative-designer",
    label: "Mosaic Grid",
    gradient: "from-white to-slate-50",
    textColor: "text-slate-900",
    subColor: "text-slate-600",
    accentColor: "#22c55e",
    frontBgStyle: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(34,197,94,0.18) 0 10px, rgba(34,197,94,0) 10px 20px),
        repeating-linear-gradient(135deg, rgba(245,158,11,0.18) 0 10px, rgba(245,158,11,0) 10px 20px),
        repeating-linear-gradient(90deg, rgba(239,68,68,0.12) 0 12px, rgba(239,68,68,0) 12px 24px),
        linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0) 55%),
        linear-gradient(135deg, #ffffff 0%, #fbfdff 100%)
      `,
      border: "1px solid rgba(2,6,23,0.10)",
      boxShadow: "0 26px 60px rgba(2,6,23,0.16)",
      backgroundBlendMode: "multiply",
    },
    backBgStyle: {
      backgroundColor: "#0f172a",
      backgroundImage: `linear-gradient(135deg, #0f172a 0%, #111827 100%)`,
      border: "1px solid rgba(255,255,255,0.10)",
    },
  },
  {
    id: "soft-pastel",
    label: "Blush Half-Round",
    gradient: "from-pink-100 to-white",
    textColor: "text-[#b04b63]",
    subColor: "text-[#c06a80]",
    accentColor: "#e65a7a",
    frontBgStyle: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        radial-gradient(100% 140% at 82% 50%, rgba(230,90,122,0.35) 0%, rgba(230,90,122,0.18) 38%, rgba(230,90,122,0.00) 39%),
        repeating-linear-gradient(45deg, rgba(230,90,122,0.10) 0 6px, rgba(230,90,122,0) 6px 16px),
        linear-gradient(135deg, #ffffff 0%, #fff4f7 55%, #ffe6ee 100%)
      `,
      border: "1px solid rgba(176,75,99,0.16)",
      boxShadow: "0 24px 60px rgba(2,6,23,0.12)",
      backgroundBlendMode: "multiply",
    },
    backBgStyle: {
      backgroundColor: "#fff4f7",
      backgroundImage: `linear-gradient(135deg, #fff4f7 0%, #ffe6ee 100%)`,
      border: "1px solid rgba(176,75,99,0.14)",
    },
  },
  {
    id: "elegant-gold",
    label: "Gold & Navy Curve",
    gradient: "from-amber-200 to-amber-500",
    textColor: "text-[#0b2b3a]",
    subColor: "text-[#1f3e4d]",
    accentColor: "#d4a853",
    frontBgStyle: {
      backgroundColor: "#e3b768",
      backgroundImage: `
        radial-gradient(120% 140% at 14% 50%, rgba(11,43,58,1) 0%, rgba(11,43,58,1) 36%, rgba(11,43,58,0) 37%),
        radial-gradient(120% 140% at 18% 50%, rgba(6,32,44,1) 0%, rgba(6,32,44,1) 28%, rgba(6,32,44,0) 29%),
        linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 45%),
        linear-gradient(135deg, #f5d28b 0%, #e3b768 55%, #f1d08a 100%)
      `,
      border: "1px solid rgba(11,43,58,0.18)",
      boxShadow: "0 26px 60px rgba(2,6,23,0.22)",
      backgroundBlendMode: "normal",
    },
    backBgStyle: {
      backgroundColor: "#071a24",
      backgroundImage: `linear-gradient(135deg, #0b2b3a 0%, #071a24 100%)`,
      border: "1px solid rgba(212,168,83,0.22)",
    },
  },
  {
    id: "ruby-gradient",
    label: "Tri-Arrow Dark",
    gradient: "from-slate-900 to-slate-800",
    textColor: "text-white",
    subColor: "text-slate-200",
    accentColor: "#ef4444",
    frontBgStyle: {
      backgroundColor: "#111827",
      backgroundImage: `
        linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(239,68,68,0) 52%),
        linear-gradient(135deg, rgba(245,158,11,0.95) 0%, rgba(245,158,11,0) 60%),
        linear-gradient(315deg, rgba(15,23,42,0.0) 0%, rgba(15,23,42,0.0) 48%, rgba(15,23,42,0.55) 49%, rgba(15,23,42,0) 70%),
        linear-gradient(135deg, #0b1220 0%, #111827 100%)
      `,
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
      backgroundBlendMode: "normal",
    },
    backBgStyle: {
      backgroundColor: "#0a0f1a",
      backgroundImage: `linear-gradient(135deg, #0b1220 0%, #0a0f1a 100%)`,
      border: "1px solid rgba(255,255,255,0.10)",
    },
  },
  {
    id: "tech-dark",
    label: "Black Gold Dots",
    gradient: "from-black to-zinc-900",
    textColor: "text-[#d4a853]",
    subColor: "text-[#c9b17a]",
    accentColor: "#d4a853",
    frontBgStyle: {
      backgroundColor: "#050505",
      backgroundImage: `
        radial-gradient(circle at 14% 22%, rgba(212,168,83,0.85) 0 3px, rgba(212,168,83,0) 4px),
        radial-gradient(circle at 22% 22%, rgba(212,168,83,0.55) 0 3px, rgba(212,168,83,0) 4px),
        radial-gradient(circle at 30% 22%, rgba(212,168,83,0.35) 0 3px, rgba(212,168,83,0) 4px),
        radial-gradient(circle at 18% 78%, rgba(212,168,83,0.40) 0 3px, rgba(212,168,83,0) 4px),
        radial-gradient(circle at 26% 78%, rgba(212,168,83,0.25) 0 3px, rgba(212,168,83,0) 4px),
        radial-gradient(circle at 90% 12%, rgba(212,168,83,0.35) 0%, rgba(212,168,83,0) 34%),
        radial-gradient(circle at 12% 88%, rgba(212,168,83,0.22) 0%, rgba(212,168,83,0) 36%),
        linear-gradient(135deg, #050505 0%, #0b0b0b 100%)
      `,
      border: "1px solid rgba(212,168,83,0.24)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.60)",
      backgroundBlendMode: "screen",
    },
    backBgStyle: {
      backgroundColor: "#050505",
      backgroundImage: `linear-gradient(135deg, #050505 0%, #0b0b0b 100%)`,
      border: "1px solid rgba(212,168,83,0.20)",
    },
  },
  {
    id: "midnight-aurora",
    label: "Art Deco Plum",
    gradient: "from-[#1e1b4b] to-[#0f172a]",
    textColor: "text-[#f5d37a]",
    subColor: "text-[#e7d3a2]",
    accentColor: "#f5d37a",
    frontBgStyle: {
      backgroundColor: "#120a22",
      backgroundImage: `
        linear-gradient(90deg, rgba(245,211,122,0.22) 0 2px, rgba(0,0,0,0) 2px 100%),
        linear-gradient(0deg, rgba(245,211,122,0.22) 0 2px, rgba(0,0,0,0) 2px 100%),
        radial-gradient(circle at 92% 18%, rgba(245,211,122,0.18) 0%, rgba(245,211,122,0) 35%),
        radial-gradient(circle at 12% 86%, rgba(245,211,122,0.12) 0%, rgba(245,211,122,0) 38%),
        linear-gradient(135deg, #2a0f3d 0%, #1a1230 55%, #120a22 100%)
      `,
      border: "1px solid rgba(245,211,122,0.30)",
      boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
      backgroundBlendMode: "screen",
    },
    backBgStyle: {
      backgroundColor: "#120a22",
      backgroundImage: `linear-gradient(135deg, #120a22 0%, #1a1230 100%)`,
      border: "1px solid rgba(245,211,122,0.22)",
    },
  },
];

// --- ANALYTICS CHART DATA ---
export function getChartData(days: number = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 80 + 20),
      clicks: Math.floor(Math.random() * 50 + 10),
      qrScans: Math.floor(Math.random() * 15 + 2),
    });
  }
  return data;
}

export function getCouponStats() {
  return {
    total: mockCoupons.length,
    totalUsage: mockCoupons.reduce((a, c) => a + c.usedCount, 0),
    active: mockCoupons.filter((c) => c.isActive).length,
    expired: mockCoupons.filter((c) => new Date(c.expiresAt) < new Date()).length,
    mostUsed: mockCoupons.reduce((a, c) => (c.usedCount > a.usedCount ? c : a)),
  };
}