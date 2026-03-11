import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicProfile } from "@/hooks/useApi";
import { themes } from "@/lib/mock-data";
import { ExternalLink, QrCode, Share2, Copy, Check } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { isNewLayout, RenderNewLayout } from "../profile-layouts/NewLayouts";

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, error } = usePublicProfile(username || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (username) publicApi.trackView(username).catch(() => {});
  }, [username]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const handleShare = async () => {
    try {
      // Native share sheet on mobile (best UX, like Linktree)
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: "Linkora Profile",
          text: "Check out this profile",
          url: shareUrl,
        });
        return;
      }

      // Fallback to copy
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Unable to share");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background noise-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background noise-bg">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const { user, links, appearance } = data;

  const safeAppearance =
    appearance || {
      layout: "classic-glass",
      theme: "neon-cyber",
      accentColor: "#7c3aed",
      backgroundColor: "#0a0a0f",
      font: "Inter",
      buttonStyle: "rounded",
      animation: "fade-up",
      avatarStyle: "circle",
    };

  const theme = themes.find((t) => t.id === safeAppearance.theme) || themes[0];
  const enabledLinks = (links || []).filter((l: any) => l.enabled);

  const handleLinkClick = (linkId: string) => {
    if (username) publicApi.trackClick(username, linkId).catch(() => {});
  };

  // Existing rendering helpers (unchanged logic)
  const getAvatarRadius = () => {
    switch (safeAppearance?.avatarStyle) {
      case "rounded":
        return "rounded-2xl";
      case "square":
        return "rounded-lg";
      default:
        return "rounded-full";
    }
  };

  const getLinkStyle = () => {
    const base = "w-full py-3.5 px-5 text-sm text-center transition-all cursor-pointer";
    const border = `1px solid ${theme.accent}33`;
    switch (safeAppearance?.buttonStyle) {
      case "pill":
        return {
          className: `${base} rounded-full hover:scale-[1.02]`,
          style: { background: theme.buttonBg, border, color: theme.buttonText },
        };
      case "square":
        return {
          className: `${base} rounded-lg hover:scale-[1.02]`,
          style: { background: theme.buttonBg, border, color: theme.buttonText },
        };
      case "outline":
        return {
          className: `${base} rounded-2xl hover:scale-[1.02]`,
          style: {
            background: "transparent",
            border: `2px solid ${theme.accent}50`,
            color: theme.buttonText,
          },
        };
      case "ghost":
        return {
          className: `${base} rounded-2xl hover:opacity-80`,
          style: { background: "transparent", color: theme.buttonText },
        };
      default:
        return {
          className: `${base} rounded-2xl hover:scale-[1.02]`,
          style: { background: theme.buttonBg, border, color: theme.buttonText },
        };
    }
  };

  const linkProps = getLinkStyle();

  const renderLinksOldLayouts = () => {
    if (safeAppearance?.layout === "modern-grid") {
      return (
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          {enabledLinks.map((link: any, i: number) => (
            <motion.a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link._id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={linkProps.className}
              style={linkProps.style}
            >
              <span className="text-xs font-medium">{link.title}</span>
            </motion.a>
          ))}
        </div>
      );
    }

    if (safeAppearance?.layout === "bubble-links") {
      return (
        <div className="w-full flex flex-wrap gap-3 justify-center mb-8">
          {enabledLinks.map((link: any, i: number) => (
            <motion.a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link._id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform"
              style={{
                background: theme.buttonBg,
                color: theme.buttonText,
                border: `1px solid ${theme.accent}33`,
              }}
            >
              {link.title}
            </motion.a>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full space-y-3 mb-8">
        {enabledLinks.map((link: any, i: number) => {
          const style = { ...linkProps.style } as any;
          if (safeAppearance?.layout === "edge-accent") style.borderLeft = `3px solid ${theme.accent}`;

          return (
            <motion.a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link._id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`${linkProps.className} flex items-center justify-between`}
              style={style}
            >
              <span className="font-medium">{link.title}</span>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </motion.a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background noise-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Soft blobs behind phone (optional, looks premium) */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" />

      {/* Phone Frame */}
      <div
        className="relative z-10 w-[360px] max-w-[92vw] h-[720px] max-h-[90vh] rounded-[2.8rem] border-4 border-border overflow-hidden shadow-2xl"
        style={{ background: theme.bg }}
      >
        {/* Gradient overlay like preview */}
        {theme.gradient && <div className="absolute inset-0 opacity-10" style={{ background: theme.gradient }} />}

        {/* Pastel header overlay (same as preview) */}
        {safeAppearance?.layout === "pastel-header" && (
          <div
            className="absolute top-0 left-0 right-0 h-36 opacity-25"
            style={{ background: theme.gradient || theme.accent }}
          />
        )}

        {/* Top actions (Share) */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:bg-secondary/40 transition"
            aria-label="Share profile"
            title="Share"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable content inside phone */}
        <div className="absolute inset-0 p-5 pt-10 flex flex-col items-center overflow-y-auto" style={{ fontFamily: safeAppearance.font }}>
          {/* NEW templates render here in "preview mode" so they fit in phone frame */}
          {isNewLayout(safeAppearance.layout) ? (
            <div className="w-full">
              <RenderNewLayout
                mode="preview"
                user={user}
                appearance={safeAppearance}
                theme={theme}
                links={enabledLinks}
                onLinkClick={handleLinkClick}
              />
            </div>
          ) : (
            <>
              {/* Old layout hero (same as your existing public page, but inside frame) */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className={`${safeAppearance?.layout === "focus-avatar" ? "w-28 h-28 text-4xl" : "w-24 h-24 text-3xl"} ${getAvatarRadius()} flex items-center justify-center font-bold mb-4 mt-4`}
                style={{
                  background: theme.gradient || theme.accent,
                  color: "#fff",
                  boxShadow: `0 0 40px ${theme.accent}40`,
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || "?"
                )}
              </motion.div>

              <h1 className="text-xl font-bold" style={{ color: theme.text }}>
                @{user?.username}
              </h1>
              <p className="text-sm text-center mt-2 mb-8 max-w-xs" style={{ color: theme.subtext }}>
                {user?.bio}
              </p>

              {renderLinksOldLayouts()}

              {/* QR Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <QrCode className="w-12 h-12 text-gray-900" />
                </div>
                <p className="text-xs font-medium" style={{ color: theme.subtext }}>
                  Scan to open your page
                </p>
              </motion.div>

              {/* Branding (starter only, same behavior as before) */}
              {user?.plan === "starter" && (
                <div className="mt-8 flex items-center gap-1.5 opacity-40 pb-4">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ background: theme.gradient || theme.accent }}
                  >
                    <span className="text-[8px] font-bold text-white">L</span>
                  </div>
                  <span className="text-[10px]" style={{ color: theme.subtext }}>
                    Powered by Linkora
                  </span>
                </div>
              )}

              {/* Extra bottom padding so last item not stuck */}
              <div className="h-6" />
            </>
          )}
        </div>
      </div>

      {/* Copy-only button for desktop users (optional) */}
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied");
          } catch {
            toast.error("Copy failed");
          }
        }}
        className="hidden sm:flex absolute bottom-6 right-6 glass rounded-xl px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition"
      >
        <Copy className="w-3.5 h-3.5 mr-2" />
        Copy link
      </button>
    </div>
  );
};

export default PublicProfilePage;