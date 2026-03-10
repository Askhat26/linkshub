import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { ProfileLayoutProps } from "./common";
import { PageFrame, ProfileHeader, QrFooter, enabledLinks, fadeItem } from "./common";

function radiusFromButtonStyle(buttonStyle: string) {
  if (buttonStyle === "pill") return "rounded-full";
  if (buttonStyle === "square") return "rounded-lg";
  return "rounded-2xl";
}

export default function NeonGamingLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const radius = radiusFromButtonStyle(appearance.buttonStyle);

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full space-y-3 mt-6">
          {list.map((l, i) => (
            <motion.a
              key={l._id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onLinkClick?.(l._id)}
              {...fadeItem(i)}
              className={`w-full py-3.5 px-5 ${radius} text-sm font-semibold flex items-center justify-between`}
              style={{
                background: "rgba(0,0,0,0.25)",
                border: `1px solid ${theme.accent}70`,
                color: theme.text,
                boxShadow: `0 0 20px ${theme.accent}25`,
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>{l.title}</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </motion.a>
          ))}
        </div>

        <QrFooter theme={theme} user={user} />
      </div>
    </PageFrame>
  );
}