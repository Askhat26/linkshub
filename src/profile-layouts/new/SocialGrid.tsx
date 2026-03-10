import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks, fadeItem, getLinkProps, getSocialIcon } from "./common";

export default function SocialGridLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const btn = getLinkProps(theme, appearance);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          {list.map((l, i) => {
            const Icon = getSocialIcon(l.url);
            return (
              <motion.a
                key={l._id}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onLinkClick?.(l._id)}
                {...fadeItem(i)}
                className={`${btn.className} flex items-center justify-center gap-2`}
                style={btn.style}
              >
                <Icon className="w-4 h-4 opacity-80" />
                <span className="text-xs font-medium">{l.title}</span>
              </motion.a>
            );
          })}
        </div>

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}