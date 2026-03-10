import React from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { ProfileLayoutProps } from "./common";
import {
  PageFrame,
  ProfileHeader,
  QrFooter,
  enabledLinks,
  fadeItem,
  LinkButton,
  parseYouTubeId,
} from "./common";

export default function MediaCreatorLayout(props: ProfileLayoutProps) {
  const { mode, user, appearance, theme, links, onLinkClick } = props;

  const list = enabledLinks(links);
  const yt = list.find((l) => l.url.toLowerCase().includes("youtube") || l.url.toLowerCase().includes("youtu.be"));
  const id = yt ? parseYouTubeId(yt.url) : null;
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;

  const rest = yt ? list.filter((l) => l._id !== yt._id) : list;

  return (
    <PageFrame mode={mode} theme={theme} appearance={appearance}>
      <div className="flex flex-col items-center">
        <ProfileHeader user={user} theme={theme} appearance={appearance} />

        <div className="w-full rounded-2xl overflow-hidden border border-border mt-6" style={{ background: theme.cardBg }}>
          <div className="aspect-video relative">
            {thumb ? (
              <img src={thumb} alt="Media preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: theme.gradient || theme.accent, opacity: 0.25 }}>
                <Play className="w-10 h-10" style={{ color: theme.text }} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-xs text-white/80">Featured media</div>
              <div className="text-sm font-semibold text-white">{yt?.title || "Latest video"}</div>
            </div>
          </div>

          {yt && (
            <a
              href={yt.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onLinkClick?.(yt._id)}
              className="block px-4 py-3 text-sm font-medium"
              style={{ color: theme.text }}
            >
              Watch now →
            </a>
          )}
        </div>

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