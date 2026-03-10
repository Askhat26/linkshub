import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import {
  PageFrame,
  ProfileHeader,
  QrFooter,
  enabledLinks,
  fadeItem,
  LinkButton,
} from "./common";

export default function StoryTimelineLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full mt-6 relative pl-4">
          <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: `${theme.accent}40` }} />

          <div className="space-y-4">
            {list.map((l, i) => (
              <motion.div key={l._id} {...fadeItem(i)} className="relative">
                <div
                  className="absolute left-0 top-4 w-2.5 h-2.5 rounded-full"
                  style={{ background: theme.accent, boxShadow: `0 0 20px ${theme.accent}60` }}
                />
                <div className="ml-4">
                  <LinkButton link={l} theme={theme} appearance={appearance} onLinkClick={onLinkClick} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}