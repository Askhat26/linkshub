import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicProfile } from "@/hooks/useApi";
import { themes } from "@/lib/mock-data";
import {
  ExternalLink,
  QrCode,
  Share2,
  Check,
  X,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
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
    const u = username || "yourname";
    return `linktr.ee/${u}`;
  }, [username]);

  const handleShare = async () => {
    try {
      // Native share sheet on mobile (best UX, like )
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

  const { user, links, appearance } = data as any;
  const showBranding = (data as any)?.showBranding ?? user?.plan === "starter";

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

  const featuredLink = enabledLinks[0];

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

  // --- hero helpers (UI-only) ---
  const getSocialIcon = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes("instagram.com")) return Instagram;
    if (u.includes("youtube.com") || u.includes("youtu.be")) return Youtube;
    if (u.includes("twitter.com") || u.includes("x.com")) return Twitter;
    if (u.includes("linkedin.com")) return Linkedin;
    if (u.includes("github.com")) return Github;
    return Globe;
  };

  const socialLinks = enabledLinks
    .filter((l: any) => {
      const u = l.url.toLowerCase();
      return (
        u.includes("instagram.com") ||
        u.includes("youtube.com") ||
        u.includes("youtu.be") ||
        u.includes("twitter.com") ||
        u.includes("x.com") ||
        u.includes("linkedin.com") ||
        u.includes("github.com")
      );
    })
    .slice(0, 5);

  const getHost = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const HeroPremium = () => (
    <div className="w-full mb-5">
      <div className="relative rounded-3xl overflow-hidden border border-border/60 glass">
        {/* Banner */}
        <div className="h-24" style={{ background: theme.gradient || theme.accent, opacity: 0.9 }} />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 38%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 40%), radial-gradient(circle at 60% 90%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0) 45%)",
          }}
        />

        {/* Glass profile card */}
        <div className="relative px-4 pb-4 -mt-10">
          <div className="glass-strong rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-16 h-16 ${getAvatarRadius()} shrink-0 flex items-center justify-center font-bold text-xl`}
                style={{
                  background: theme.gradient || theme.accent,
                  color: "#fff",
                  boxShadow: `0 0 30px ${theme.accent}30`,
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || "?"
                )}
              </div>

              <div className="min-w-0">
                <div className="text-lg font-bold truncate" style={{ color: theme.text }}>
                  @{user?.username}
                </div>

                <div
                  className="text-xs mt-1"
                  style={{
                    color: theme.subtext,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {user?.bio}
                </div>
              </div>
            </div>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                {socialLinks.map((l: any) => {
                  const Icon = getSocialIcon(l.url);
                  return (
                    <a
                      key={l._id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleLinkClick(l._id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/60 hover:bg-secondary/40 transition"
                      style={{ color: theme.text }}
                      title={l.title}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* ✅ Featured Link Card */}
            {featuredLink && (
              <motion.a
                href={featuredLink.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleLinkClick(featuredLink._id)}
                className="mt-4 block rounded-2xl border border-border/60 overflow-hidden hover:translate-y-[-1px] transition-transform"
                style={{ background: theme.cardBg }}
              >
                <div className="relative p-4">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ background: theme.accent }} />
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70" style={{ color: theme.subtext }}>
                        Featured
                      </div>
                      <div className="text-sm font-semibold truncate mt-1" style={{ color: theme.text }}>
                        {featuredLink.title}
                      </div>
                      <div className="text-[11px] truncate mt-1" style={{ color: theme.subtext }}>
                        {getHost(featuredLink.url)}
                      </div>
                    </div>
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: theme.buttonBg,
                        border: `1px solid ${theme.accent}33`,
                        color: theme.buttonText,
                      }}
                      title="Open"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
            <div className="relative w-full rounded-[3rem] overflow-hidden border border-border/60" style={{ background: theme.bg }}>
              {/* Gradient overlay */}
              {theme.gradient && <div className="absolute inset-0 opacity-10" style={{ background: theme.gradient }} />}

              {/* Hero banner background */}
              <div className="absolute top-0 left-0 right-0 h-44 opacity-25" style={{ background: theme.gradient || theme.accent }} />

              {/* Share button (top-right) */}
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

              {/* Promo button (top-left) */}
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
              <div className="relative z-10 p-5 pt-16 pb-24 flex flex-col items-center" style={{ fontFamily: safeAppearance.font }}>
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
                    {/* Premium hero with featured link */}
                    <HeroPremium />

                    {/* Links (unchanged) */}
                    {renderLinksOldLayouts()}

                    {/* QR section (unchanged) */}
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

              {/* Fixed footer branding */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="glass-strong border-t border-border/60 px-4 py-3">
                  <div className="flex items-center justify-center min-h-[20px]">
                    {showBranding ? (
                      <div className="flex items-center gap-1.5 opacity-70">
                        <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: theme.gradient || theme.accent }}>
                          <span className="text-[8px] font-bold text-white">L</span>
                        </div>
                        <span className="text-[10px]" style={{ color: theme.subtext }}>
                          Powered by Linkora
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] opacity-0 select-none">Powered by Linkora</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Removed desktop copy link button as requested */}
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
                    Claim your Link
                  </Button>

                  <div className="flex flex-col gap-2 text-sm underline underline-offset-4">
                    <button className="text-left" type="button">
                      Explore more features of Linkora
                    </button>
                    <button className="text-left" type="button">
                      Learn more about Linkora
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