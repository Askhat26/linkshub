import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicProfile } from "@/hooks/useApi";
import { themes } from "@/lib/mock-data";
import { ExternalLink, QrCode, Share2, Check, X } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { isNewLayout, RenderNewLayout } from "../profile-layouts/NewLayouts";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = usePublicProfile(username || "");
  const [copied, setCopied] = useState(false);

  // Promo modal
  const [promoOpen, setPromoOpen] = useState(false);

  useEffect(() => {
    if (username) publicApi.trackView(username).catch(() => {});
  }, [username]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const promoUrl = useMemo(() => {
    if (typeof window === "undefined") return "linktr.ee/yourname";
    const u = username || "yourname";
    return `linktr.ee/${u}`;
  }, [username]);

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
      <div className="min-h-screen flex items-center justify-center bg-background noise-bg overflow-x-hidden">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background noise-bg overflow-x-hidden">
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
    <div className="min-h-screen bg-background noise-bg overflow-x-hidden">
      <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
        {/* Premium background glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" />

        {/* Centered wrapper (mobile width) */}
        <div className="relative z-10 w-full max-w-[420px] mx-auto">
          {/* Premium outer frame */}
          <div className="rounded-[3.2rem] p-[3px] bg-gradient-to-b from-white/15 to-white/0 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            {/* Phone frame */}
            <div
              className="relative w-full rounded-[3rem] overflow-hidden border border-border/60"
              style={{ background: theme.bg }}
            >
              {/* Gradient overlay */}
              {theme.gradient && (
                <div className="absolute inset-0 opacity-10" style={{ background: theme.gradient }} />
              )}

              {/* NEW: Top hero banner inside phone */}
              <div
                className="absolute top-0 left-0 right-0 h-40 opacity-30"
                style={{ background: theme.gradient || theme.accent }}
              />

              {/* Share button (top-right) - unchanged */}
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:bg-secondary/40 transition"
                  aria-label="Share profile"
                  title="Share"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* NEW: Promo button (top-left) uses /favicon.ico */}
              <div className="absolute top-4 left-4 z-30">
                <button
                  onClick={() => setPromoOpen(true)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-secondary/40 transition"
                  aria-label="About Linkora"
                  title="About Linkora"
                >
                  <img src="/favicon.ico" alt="Linkora" className="w-5 h-5" />
                </button>
              </div>

              {/* Content area with fixed footer spacing */}
              <div
                className="relative z-10 p-5 pt-16 pb-24 flex flex-col items-center"
                style={{ fontFamily: safeAppearance.font }}
              >
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
                    {/* Old layout hero (existing logic) */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.4 }}
                      className={`${safeAppearance?.layout === "focus-avatar" ? "w-28 h-28 text-4xl" : "w-24 h-24 text-3xl"} ${getAvatarRadius()} flex items-center justify-center font-bold mb-4 mt-2`}
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

                    {/* QR section (existing) */}
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
                  </>
                )}
              </div>

              {/* NEW: Fixed footer with branding inside (logic unchanged: starter only) */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="glass-strong border-t border-border/60 px-4 py-3">
                  <div className="flex items-center justify-center min-h-[20px]">
                    {user?.plan === "starter" ? (
                      <div className="flex items-center gap-1.5 opacity-60">
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
                    ) : (
                      <span className="text-[10px] opacity-40" style={{ color: theme.subtext }}>
                        {/* Keep empty-ish footer for paid plans (no branding), but footer still exists */}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Removed desktop copy link button outside phone (as requested) */}
        </div>

        {/* Promo modal */}
        <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
          <DialogContent className="glass-strong border-border max-w-lg p-0 overflow-hidden">
            <div className="relative">
              <button
                onClick={() => setPromoOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal body (Linktree-like) */}
              <div className="bg-[#D8F500] text-black p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl leading-tight">
                    Join the only link in bio trusted by 70M+{" "}
                    <span className="text-blue-600">businesses.</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-3 text-sm opacity-80 space-y-1">
                  <div>creators.</div>
                  <div>businesses.</div>
                  <div>musicians.</div>
                  <div>realtors.</div>
                  <div>creatives.</div>
                </div>

                <p className="mt-4 text-sm opacity-80">
                  One link to share everything you create, curate and sell across IG, TikTok and more.
                </p>

                <div className="mt-5 bg-white rounded-xl px-4 py-3 text-sm">
                  {promoUrl}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <Button
                    className="w-full rounded-xl bg-black text-white hover:bg-black/90"
                    onClick={() => navigate("/signup")}
                  >
                    Claim your Linkora URL
                  </Button>

                  <div className="flex flex-col gap-2 text-sm underline underline-offset-4">
                    <button className="text-left" type="button">
                      Explore more Linkora
                    </button>
                    <button className="text-left" type="button">
                      Learn more about Linora
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-black text-black hover:bg-black/5"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up free
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PublicProfilePage;