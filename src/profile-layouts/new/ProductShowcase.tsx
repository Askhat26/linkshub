import React from "react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks, fadeItem, LinkButton } from "./common";

export default function ProductShowcaseLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);

  const products = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full space-y-3 mt-6">
          {products.map((p, i) => (
            <motion.a
              key={p._id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onLinkClick?.(p._id)}
              {...fadeItem(i)}
              className="block rounded-2xl border border-border overflow-hidden hover-lift"
              style={{ background: theme.cardBg }}
            >
              <div className="h-28" style={{ background: theme.gradient || theme.accent, opacity: 0.25 }} />
              <div className="p-4">
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {p.title}
                </div>
                <div className="text-xs mt-1 truncate" style={{ color: theme.subtext }}>
                  {p.url}
                </div>

                <div
                  className="mt-3 inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium"
                  style={{
                    background: theme.buttonBg,
                    color: theme.buttonText,
                    border: `1px solid ${theme.accent}33`,
                  }}
                >
                  View →
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Remaining links below */}
        {rest.length > 0 && (
          <div className="w-full space-y-3 mt-4">
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