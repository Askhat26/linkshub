import React from "react";
import { motion } from "framer-motion";
import type { Appearance, Theme, Link as LinkType } from "@/lib/mock-data";
import {
  ExternalLink,
  QrCode,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

export type LayoutMode = "preview" | "public";

export type PublicUser = {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  plan?: "starter" | "pro" | "premium";
};

export type ProfileLayoutProps = {
  mode: LayoutMode;
  user: PublicUser;
  appearance: Appearance;
  theme: Theme;
  links: LinkType[];
  onLinkClick?: (linkId: string) => void;
};

export const fadeItem = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06 },
});

export function getAvatarRadius(appearance: Appearance) {
  switch (appearance.avatarStyle) {
    case "rounded":
      return "rounded-2xl";
    case "square":
      return "rounded-lg";
    default:
      return "rounded-full";
  }
}

export function enabledLinks(links: LinkType[]) {
  return (links || []).filter((l) => l.enabled);
}

export function safeHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function parseYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export function getSocialIcon(url: string) {
  const u = url.toLowerCase();
  if (u.includes("instagram.com")) return Instagram;
  if (u.includes("youtube.com") || u.includes("youtu.be")) return Youtube;
  if (u.includes("twitter.com") || u.includes("x.com")) return Twitter;
  if (u.includes("linkedin.com")) return Linkedin;
  if (u.includes("github.com")) return Github;
  if (u.startsWith("mailto:")) return Mail;
  if (u.startsWith("tel:") || u.includes("wa.me")) return Phone;
  return Globe;
}

export function getLinkProps(theme: Theme, appearance: Appearance) {
  const base = "w-full py-3.5 px-5 text-sm text-center transition-all cursor-pointer";
  const border = `1px solid ${theme.accent}33`;

  switch (appearance.buttonStyle) {
    case "pill":
      return { className: `${base} rounded-full hover:scale-[1.02]`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
    case "square":
      return { className: `${base} rounded-lg hover:scale-[1.02]`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
    case "outline":
      return { className: `${base} rounded-2xl hover:scale-[1.02]`, style: { background: "transparent", border: `2px solid ${theme.accent}50`, color: theme.buttonText } };
    case "ghost":
      return { className: `${base} rounded-2xl hover:opacity-80`, style: { background: "transparent", color: theme.buttonText } };
    default:
      return { className: `${base} rounded-2xl hover:scale-[1.02]`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
  }
}

export function LinkButton({
  link,
  theme,
  appearance,
  onLinkClick,
  rightIcon = true,
  leftIcon = false,
}: {
  link: LinkType;
  theme: Theme;
  appearance: Appearance;
  onLinkClick?: (linkId: string) => void;
  rightIcon?: boolean;
  leftIcon?: boolean;
}) {
  const props = getLinkProps(theme, appearance);
  const Left = getSocialIcon(link.url);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(link._id)}
      className={`${props.className} flex items-center justify-between`}
      style={props.style}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="flex items-center gap-2">
        {leftIcon && <Left className="w-4 h-4 opacity-70" />}
        <span className="font-medium">{link.title}</span>
      </span>
      {rightIcon && <ExternalLink className="w-4 h-4 opacity-50" />}
    </motion.a>
  );
}

export function ProfileHeader({
  user,
  theme,
  appearance,
  compact = false,
}: {
  user: PublicUser;
  theme: Theme;
  appearance: Appearance;
  compact?: boolean;
}) {
  const avatarSize = compact ? "w-16 h-16 text-xl" : "w-20 h-20 text-2xl";
  const radius = getAvatarRadius(appearance);

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`${avatarSize} ${radius} flex items-center justify-center font-bold mb-4`}
        style={{
          background: theme.gradient || theme.accent,
          color: "#fff",
          boxShadow: `0 0 40px ${theme.accent}40`,
        }}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          user?.name?.charAt(0) || "?"
        )}
      </div>

      <div className="text-lg font-bold" style={{ color: theme.text }}>
        @{user?.username}
      </div>

      <div className="text-sm mt-2" style={{ color: theme.subtext }}>
        {user?.bio}
      </div>
    </div>
  );
}

export function QrFooter({
  theme,
  user,
  compact = false,
}: {
  theme: Theme;
  user: PublicUser;
  compact?: boolean;
}) {
  const box = compact ? "w-16 h-16" : "w-24 h-24";
  const icon = compact ? "w-8 h-8" : "w-12 h-12";

  return (
    <div className="pt-6 pb-2 flex flex-col items-center gap-2">
      <div className={`${box} rounded-xl bg-white flex items-center justify-center shadow-lg`}>
        <QrCode className={`${icon} text-gray-900`} />
      </div>
      <p className="text-xs font-medium" style={{ color: theme.subtext }}>
        Scan to open your page
      </p>

      {user?.plan === "starter" && (
        <div className="mt-3 flex items-center gap-1.5 opacity-40">
          <div
            className="w-4 h-4 rounded flex items-center justify-center"
            style={{ background: theme.gradient || theme.accent }}
          >
            <span className="text-[8px] font-bold text-white">L</span>
          </div>
          <span className="text-[10px]" style={{ color: theme.subtext }}>
            Powered by Linkora
          </span>
        </div>
      )}
    </div>
  );
}

export function PageFrame({
  mode,
  theme,
  appearance,
  children,
}: {
  mode: LayoutMode;
  theme: Theme;
  appearance: Appearance;
  children: React.ReactNode;
}) {
  if (mode === "preview") {
    return (
      <div className="w-full" style={{ fontFamily: appearance.font }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: theme.bg, fontFamily: appearance.font }}
    >
      {theme.gradient && (
        <>
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[128px] opacity-20" style={{ background: theme.accent }} />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-[128px] opacity-15" style={{ background: theme.gradient }} />
        </>
      )}

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        {children}
      </motion.div>
    </div>
  );
}