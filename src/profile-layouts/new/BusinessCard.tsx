import React from "react";
import { Mail, Phone, Globe, BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import {
  PageFrame,
  QrFooter,
  enabledLinks,
  fadeItem,
  getAvatarRadius,
  LinkButton,
} from "./common";

export default function BusinessCardLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);

  // derive contact info from links (public API does not include user email/phone)
  const emailLink = list.find((l) => l.url.toLowerCase().startsWith("mailto:"));
  const phoneLink = list.find((l) => l.url.toLowerCase().startsWith("tel:") || l.url.toLowerCase().includes("wa.me"));
  const websiteLink = list.find((l) => l.url.toLowerCase().startsWith("http"));

  const profession =
    user?.bio?.split("\n")?.[0]?.slice(0, 40) ||
    "Creator";

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 ${getAvatarRadius(appearance)} flex items-center justify-center font-bold text-xl`}
              style={{ background: theme.gradient || theme.accent, color: "#fff" }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "?"
              )}
            </div>

            <div className="min-w-0">
              <div className="text-base font-bold truncate" style={{ color: theme.text }}>
                {user?.name || `@${user?.username}`}
              </div>

              <div className="text-sm flex items-center gap-2" style={{ color: theme.subtext }}>
                <BriefcaseBusiness className="w-4 h-4 opacity-70" />
                {profession}
              </div>

              <div className="text-xs mt-1" style={{ color: theme.subtext }}>
                @{user?.username}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
            <a
              className="flex items-center justify-between rounded-xl border border-border px-3 py-2 hover:bg-secondary/30 transition"
              href={phoneLink?.url || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={() => phoneLink && onLinkClick?.(phoneLink._id)}
              style={{ color: theme.text }}
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 opacity-70" /> Phone
              </span>
              <span className="text-xs" style={{ color: theme.subtext }}>
                {phoneLink ? "Open" : "—"}
              </span>
            </a>

            <a
              className="flex items-center justify-between rounded-xl border border-border px-3 py-2 hover:bg-secondary/30 transition"
              href={emailLink?.url || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={() => emailLink && onLinkClick?.(emailLink._id)}
              style={{ color: theme.text }}
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-70" /> Email
              </span>
              <span className="text-xs" style={{ color: theme.subtext }}>
                {emailLink ? "Open" : "—"}
              </span>
            </a>

            <a
              className="flex items-center justify-between rounded-xl border border-border px-3 py-2 hover:bg-secondary/30 transition"
              href={websiteLink?.url || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={() => websiteLink && onLinkClick?.(websiteLink._id)}
              style={{ color: theme.text }}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 opacity-70" /> Website
              </span>
              <span className="text-xs" style={{ color: theme.subtext }}>
                {websiteLink ? "Open" : "—"}
              </span>
            </a>
          </div>

          <div className="text-sm mt-4" style={{ color: theme.subtext }}>
            {user?.bio}
          </div>
        </div>

        {/* Links below */}
        <div className="space-y-3">
          {list.map((l, i) => (
            <motion.div key={l._id} {...fadeItem(i)}>
              <LinkButton link={l} theme={theme} appearance={appearance} onLinkClick={onLinkClick} />
            </motion.div>
          ))}
        </div>

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}