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
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: "Linkora Profile",
          text: "Check out this profile",
          url: shareUrl,
        });
        return;
      }

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
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            404
          </h1>
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
    const base =
      "w-full py-3.5 px-5 text-sm text-center transition-all cursor-pointer backdrop-blur-md hover:scale-[1.03] hover:shadow-lg";

    const border = `1px solid ${theme.accent}33`;

    return {
      className: `${base} rounded-2xl flex items-center justify-between`,
      style: {
        background: theme.buttonBg,
        border,
        color: theme.buttonText,
      },
    };
  };

  const linkProps = getLinkStyle();

  const renderLinksOldLayouts = () => {
    return (
      <div className="w-full space-y-3 mb-8">
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
            <span className="font-medium">{link.title}</span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </motion.a>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background noise-bg overflow-x-hidden">
      <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
        {/* Background Glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" />

        <div className="relative z-10 w-full max-w-[420px] mx-auto">
          {/* Phone Frame */}
          <div className="rounded-[3rem] p-[3px] bg-gradient-to-b from-white/15 to-white/0 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div
              className="relative w-full rounded-[2.8rem] overflow-hidden border border-border/60"
              style={{ background: theme.bg }}
            >
              {/* HERO BANNER */}
              <div
                className="w-full h-36"
                style={{
                  background: theme.gradient || theme.accent,
                }}
              />

              {/* Share button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="relative flex flex-col items-center px-6 pb-6">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className={`w-24 h-24 ${getAvatarRadius()} -mt-12 flex items-center justify-center text-3xl font-bold border-4 border-background`}
                  style={{
                    background: theme.gradient || theme.accent,
                    color: "#fff",
                    boxShadow: `0 0 40px ${theme.accent}40`,
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0) || "?"
                  )}
                </motion.div>

                {/* Username */}
                <h1
                  className="text-xl font-bold mt-4"
                  style={{ color: theme.text }}
                >
                  @{user?.username}
                </h1>

                {/* Bio */}
                <p
                  className="text-sm text-center mt-2 mb-6 max-w-xs"
                  style={{ color: theme.subtext }}
                >
                  {user?.bio}
                </p>

                {renderLinksOldLayouts()}

                {/* QR Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 mt-4"
                >
                  <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <QrCode className="w-12 h-12 text-gray-900" />
                  </div>
                  <p className="text-xs" style={{ color: theme.subtext }}>
                    Scan to open this page
                  </p>
                </motion.div>

                {/* Branding */}
                {user?.plan === "starter" && (
                  <div className="mt-8 flex flex-col items-center opacity-70">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={{
                          background: theme.gradient || theme.accent,
                        }}
                      >
                        <span className="text-[10px] font-bold text-white">
                          L
                        </span>
                      </div>

                      <span
                        className="text-xs font-semibold"
                        style={{ color: theme.subtext }}
                      >
                        Powered by Linkora
                      </span>
                    </div>

                    <span className="text-[10px] opacity-60">
                      Create your own page at linkora.app
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop copy button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied");
                } catch {
                  toast.error("Copy failed");
                }
              }}
              className="hidden sm:flex glass rounded-xl px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition"
            >
              <Copy className="w-3.5 h-3.5 mr-2" />
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;