import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, QrFooter, enabledLinks, fadeItem, LinkButton, getAvatarRadius } from "./common";

export default function MinimalPortfolioLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const projects = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 ${getAvatarRadius(appearance)} flex items-center justify-center font-bold text-xl`}
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
              @{user?.username}
            </div>
            <div className="text-xs mt-1" style={{ color: theme.subtext }}>
              {user?.bio}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: theme.subtext }}>
            Portfolio
          </div>

          <div className="space-y-3">
            {projects.map((p, i) => (
              <motion.a
                key={p._id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onLinkClick?.(p._id)}
                {...fadeItem(i)}
                className="block rounded-xl border border-border px-4 py-3 hover:bg-secondary/30 transition"
              >
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {p.title}
                </div>
                <div className="text-xs truncate mt-1" style={{ color: theme.subtext }}>
                  {p.url}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {rest.length > 0 && (
          <div className="space-y-3">
            {rest.map((l, i) => (
              <motion.div key={l._id} {...fadeItem(i)}>
                <LinkButton link={l} theme={theme} appearance={appearance} onLinkClick={onLinkClick} />
              </motion.div>
            ))}
          </div>
        )}

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}