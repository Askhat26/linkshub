import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks } from "./common";

export default function CreatorCardStackLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full mt-6">
          {list.map((l, i) => (
            <motion.a
              key={l._id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onLinkClick?.(l._id)}
              className="block rounded-2xl border border-border p-4 glass hover-lift"
              style={{ background: theme.cardBg, marginTop: i === 0 ? 0 : -10 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-sm font-semibold" style={{ color: theme.text }}>
                {l.title}
              </div>
              <div className="text-xs mt-1 truncate" style={{ color: theme.subtext }}>
                {l.url}
              </div>
            </motion.a>
          ))}
        </div>

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}