import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks, fadeItem, LinkButton } from "./common";

export default function FeaturedSpotlightLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const featured = list[0];
  const rest = featured ? list.slice(1) : list;

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        {featured && (
          <motion.a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => onLinkClick?.(featured._id)}
            className="w-full rounded-2xl p-5 border border-border mt-6 relative overflow-hidden"
            style={{ background: theme.cardBg }}
            whileHover={{ y: -2 }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-35" style={{ background: theme.accent }} />
            <div className="text-xs font-medium" style={{ color: theme.subtext }}>
              Spotlight
            </div>
            <div className="text-lg font-semibold mt-1" style={{ color: theme.text }}>
              {featured.title}
            </div>
            <div className="text-xs mt-3" style={{ color: theme.subtext }}>
              Open now →
            </div>
          </motion.a>
        )}

        <div className="w-full space-y-3 mt-4">
          {rest.map((l, i) => (
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