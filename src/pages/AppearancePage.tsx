import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAppearance, useUpdateAppearance, useLinks } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { layoutTemplates, themes, type Theme, type Appearance } from "@/lib/mock-data";
import { Check, Smartphone, QrCode, Sparkles } from "lucide-react";
import type { Link as LinkType } from "@/lib/mock-data";

import { isNewLayout, RenderNewLayout } from "../profile-layouts/NewLayouts";

const fonts = ["Space Grotesk", "Inter", "DM Sans", "Outfit", "Sora", "Poppins", "Raleway"];
const buttonStyles = ["rounded", "pill", "square", "outline", "ghost"];
const animations = ["fade-up", "slide-in", "scale", "none"];
const avatarStyles = ["circle", "rounded", "square"];

// Keep in sync with the 10 new layouts you added
const NEW_LAYOUT_IDS = [
  "creator-hero",
  "featured-spotlight",
  "social-grid",
  "creator-card-stack",
  "media-creator",
  "story-timeline",
  "business-card-layout",
  "product-showcase",
  "neon-gaming",
  "minimal-portfolio",
];

const AppearancePage = () => {
  const { user } = useAuth();
  const { data: fetchedAppearance } = useAppearance();
  const { data: fetchedLinks } = useLinks();
  const updateAppearance = useUpdateAppearance();

  const [appearance, setAppearance] = useState<Appearance>({
    layout: "classic-glass",
    theme: "neon-cyber",
    accentColor: "#7c3aed",
    backgroundColor: "#0a0a0f",
    font: "Space Grotesk",
    buttonStyle: "rounded",
    animation: "fade-up",
    avatarStyle: "circle",
  });

  useEffect(() => {
    if (fetchedAppearance) setAppearance(fetchedAppearance);
  }, [fetchedAppearance]);

  const links: LinkType[] = fetchedLinks || [];
  const currentTheme = themes.find((t) => t.id === appearance.theme) || themes[0];

  const { classicTemplates, newTemplates } = useMemo(() => {
    const isNew = (id: string) => NEW_LAYOUT_IDS.includes(id);
    return {
      classicTemplates: layoutTemplates.filter((t) => !isNew(t.id)),
      newTemplates: layoutTemplates.filter((t) => isNew(t.id)),
    };
  }, []);

  const handleChange = (key: string, value: string) => {
    const updated: any = { ...appearance, [key]: value };

    if (key === "theme") {
      const t = themes.find((th) => th.id === value);
      if (t) {
        updated.accentColor = t.accent;
        updated.backgroundColor = t.bg;
      }
    }

    setAppearance(updated);

    updateAppearance.mutate({
      [key]: value,
      ...(key === "theme"
        ? { accentColor: updated.accentColor, backgroundColor: updated.backgroundColor }
        : {}),
    });
  };

  const getLinkStyle = (theme: Theme) => {
    const base = "w-full py-3 px-4 text-sm text-center transition-all";
    const border = `1px solid ${theme.accent}33`;
    switch (appearance.buttonStyle) {
      case "pill":
        return { className: `${base} rounded-full`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
      case "square":
        return { className: `${base} rounded-lg`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
      case "outline":
        return { className: `${base} rounded-2xl`, style: { background: "transparent", border: `2px solid ${theme.accent}50`, color: theme.buttonText } };
      case "ghost":
        return { className: `${base} rounded-2xl`, style: { background: "transparent", color: theme.buttonText } };
      default:
        return { className: `${base} rounded-2xl`, style: { background: theme.buttonBg, border, color: theme.buttonText } };
    }
  };

  const getAvatarRadius = () => {
    switch (appearance.avatarStyle) {
      case "rounded":
        return "rounded-2xl";
      case "square":
        return "rounded-lg";
      default:
        return "rounded-full";
    }
  };

  const renderPreviewLinks = (theme: Theme) => {
    const enabled = links.filter((l) => l.enabled);
    const linkProps = getLinkStyle(theme);

    if (appearance.layout === "modern-grid") {
      return (
        <div className="w-full grid grid-cols-2 gap-2">
          {enabled.map((link, i) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={linkProps.className}
              style={linkProps.style}
            >
              <span className="text-xs">{link.title}</span>
            </motion.div>
          ))}
        </div>
      );
    }

    if (appearance.layout === "bubble-links") {
      return (
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {enabled.map((link, i) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-2 rounded-full text-xs"
              style={{ background: theme.buttonBg, color: theme.buttonText, border: `1px solid ${theme.accent}33` }}
            >
              {link.title}
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full space-y-2.5">
        {enabled.map((link, i) => {
          const style = { ...linkProps.style } as any;
          if (appearance.layout === "edge-accent") style.borderLeft = `3px solid ${theme.accent}`;

          return (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={linkProps.className}
              style={style}
            >
              <span>{link.title}</span>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const TemplateButton = ({
    id,
    label,
    description,
    isNew,
  }: {
    id: string;
    label: string;
    description: string;
    isNew?: boolean;
  }) => (
    <button
      key={id}
      onClick={() => handleChange("layout", id)}
      className={`p-3 rounded-xl text-xs font-medium text-left transition-all border relative ${
        appearance.layout === id
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {appearance.layout === id && <Check className="w-3 h-3 shrink-0" />}
          <span className="font-semibold truncate">{label}</span>
        </div>

        {isNew && (
          <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
            NEW
          </span>
        )}
      </div>

      <span className="text-[10px] opacity-70">{description}</span>
    </button>
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editor */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Appearance</h1>
            <p className="text-sm text-muted-foreground mt-1">Customize your profile look & feel</p>
          </div>

          {/* Layout Template Registry */}
          <div className="glass rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-sm font-medium text-foreground">Layout Templates</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a layout. Your preview updates instantly.
              </p>
            </div>

            {/* Classic */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Classic Templates</h4>
                  <p className="text-[11px] text-muted-foreground">Stable, proven layouts</p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {classicTemplates.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {classicTemplates.map((t) => (
                  <TemplateButton
                    key={t.id}
                    id={t.id}
                    label={t.label}
                    description={t.description}
                  />
                ))}
              </div>
            </div>

            {/* New */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">New Templates</h4>
                    <p className="text-[11px] text-muted-foreground">Fresh layouts added recently</p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{newTemplates.length}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {newTemplates.map((t) => (
                  <TemplateButton
                    key={t.id}
                    id={t.id}
                    label={t.label}
                    description={t.description}
                    isNew
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Theme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleChange("theme", t.id)}
                  className={`p-3 rounded-xl text-xs transition-all border relative overflow-hidden ${
                    appearance.theme === t.id ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-4 rounded-full shrink-0" style={{ background: t.gradient || t.accent }} />
                    <span className="font-medium text-foreground truncate">{t.label}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ background: t.bg }} />
                    <div className="w-3 h-3 rounded-sm" style={{ background: t.accent }} />
                    <div className="w-3 h-3 rounded-sm" style={{ background: t.buttonBg }} />
                  </div>
                  {appearance.theme === t.id && <Check className="w-3 h-3 text-primary absolute top-2 right-2" />}
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Font", items: fonts, key: "font" },
            { title: "Button Style", items: buttonStyles, key: "buttonStyle" },
            { title: "Avatar Style", items: avatarStyles, key: "avatarStyle" },
            { title: "Animation", items: animations, key: "animation" },
          ].map((section) => (
            <div key={section.key} className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
              <div className="flex gap-2 flex-wrap">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleChange(section.key, item)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border capitalize ${
                      (appearance as any)[section.key] === item
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Live Preview</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">This is how your public page will feel on mobile.</p>

            <div
              className="mx-auto w-[280px] h-[580px] rounded-[2.5rem] border-4 border-border overflow-hidden relative shadow-2xl"
              style={{ background: currentTheme.bg }}
            >
              {currentTheme.gradient && <div className="absolute inset-0 opacity-10" style={{ background: currentTheme.gradient }} />}

              <div className="absolute inset-0 p-5 flex flex-col items-center overflow-y-auto" style={{ fontFamily: appearance.font }}>
                {isNewLayout(appearance.layout) ? (
                  <div className="w-full">
                    <RenderNewLayout
                      mode="preview"
                      user={{
                        name: user?.name || "You",
                        username: user?.username || "you",
                        avatar: user?.avatar,
                        bio: user?.bio || "Your bio here",
                        plan: user?.plan,
                      }}
                      appearance={appearance}
                      theme={currentTheme}
                      links={links}
                      onLinkClick={() => {}}
                    />
                  </div>
                ) : (
                  <>
                    {/* KEEP YOUR EXISTING PREVIEW UNCHANGED */}
                    {appearance.layout === "pastel-header" && (
                      <div className="absolute top-0 left-0 right-0 h-28 opacity-30" style={{ background: currentTheme.gradient || currentTheme.accent }} />
                    )}

                    <div
                      className={`${appearance.layout === "focus-avatar" ? "w-24 h-24 text-2xl" : "w-16 h-16 text-xl"} rounded-full mt-6 mb-3 flex items-center justify-center font-bold shrink-0`}
                      style={{ background: currentTheme.gradient || currentTheme.accent, color: "#fff", boxShadow: `0 0 30px ${currentTheme.accent}30` }}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </div>

                    <h4 className="font-bold text-sm" style={{ color: currentTheme.text }}>
                      @{user?.username || "you"}
                    </h4>
                    <p className="text-[10px] text-center mt-1 mb-5 px-2" style={{ color: currentTheme.subtext }}>
                      {user?.bio || "Your bio here"}
                    </p>

                    {renderPreviewLinks(currentTheme)}

                    <div className="mt-auto pt-6 pb-2 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-md">
                        <QrCode className="w-8 h-8 text-gray-900" />
                      </div>
                      <span className="text-[9px] font-medium" style={{ color: currentTheme.subtext }}>
                        Scan to open your page
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AppearancePage;