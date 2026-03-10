import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks, fadeItem, getSocialIcon, LinkButton } from "./common";

export default function CreatorHeroLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const featured = list[0];
  const rest = featured ? list.slice(1) : list;

  const socials = list
    .filter((l) => {
      const u = l.url.toLowerCase();
      return (
        u.includes("instagram.com") ||
        u.includes("youtube.com") ||
        u.includes("youtu.be") ||
        u.includes("linkedin.com") ||
        u.includes("twitter.com") ||
        u.includes("x.com") ||
        u.includes("github.com")
      );
    })
    .slice(0, 6);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="h-28" style={{ background: theme.gradient || theme.accent, opacity: 0.85 }} />

        <div className="p-5 -mt-10">
          <ProfileHeader user={user} theme={theme} appearance={appearance} compact />

          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {socials.map((l) => {
                const Icon = getSocialIcon(l.url);
                return (
                  <a
                    key={l._id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onLinkClick?.(l._id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-border hover:bg-secondary/40 transition"
                    style={{ color: theme.text }}
                    title={l.title}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}

          {featured && (
            <motion.a
              {...fadeItem(0)}
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onLinkClick?.(featured._id)}
              className="block rounded-2xl p-4 mt-5 border border-border glow-border relative overflow-hidden"
              style={{ background: theme.cardBg }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: theme.accent }} />
              <div className="text-xs font-medium" style={{ color: theme.subtext }}>
                Featured
              </div>
              <div className="text-base font-semibold mt-1" style={{ color: theme.text }}>
                {featured.title}
              </div>
              <div className="text-xs mt-2" style={{ color: theme.subtext }}>
                Tap to open →
              </div>
            </motion.a>
          )}

          <div className="mt-4 space-y-3">
            {rest.map((l, i) => (
              <motion.div key={l._id} {...fadeItem(i + 1)}>
                <LinkButton link={l} theme={theme} appearance={appearance} onLinkClick={onLinkClick} />
              </motion.div>
            ))}
          </div>

          <QrFooter theme={theme} user={user} compact />
        </div>
      </div>
    </PageFrame>
  );
}