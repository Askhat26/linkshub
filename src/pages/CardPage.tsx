import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  useCard,
  useUpdateCard,
  useUploadCardLogo,
  useRemoveCardLogo,
} from "@/hooks/useApi";
import { cardTemplates, type Card } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Check,
  Upload,
  Trash2,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

const CARD_W = 350;
const CARD_H = 200;

const CardPage = () => {
  const { user } = useAuth();
  const { data: fetchedCard, isLoading } = useCard();
  const updateCard = useUpdateCard();
  const uploadLogo = useUploadCardLogo();
  const removeLogo = useRemoveCardLogo();

  const [isExporting, setIsExporting] = useState(false);

  const [card, setCard] = useState<Card>({
    _id: "",
    userId: "",
    name: "",
    role: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    template: "luxury-dark-gold",
    brandName: "",
    tagline: "",
    logoUrl: "",
    servicesText: "",
  });

  const pendingRef = useRef<Partial<Card>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileUrl = `${window.location.origin}/${user?.username || ""}`;

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (fetchedCard) {
      setCard({
        ...fetchedCard,
        logoUrl: fetchedCard.logoUrl || "",
        servicesText: fetchedCard.servicesText || "",
      });
    }
  }, [fetchedCard]);

  const currentTemplate =
    cardTemplates.find((t) => t.id === card.template) || cardTemplates[0];

  const handleChange = <K extends keyof Card>(key: K, value: Card[K]) => {
    setCard((prev) => ({ ...prev, [key]: value }));
    pendingRef.current = { ...pendingRef.current, [key]: value };

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const changes = { ...pendingRef.current };
      pendingRef.current = {};
      if (Object.keys(changes).length > 0) {
        updateCard.mutate(changes as Record<string, string>);
      }
    }, 500);
  };

  const handleTemplateChange = (templateId: string) => {
    setCard((prev) => ({ ...prev, template: templateId }));
    clearTimeout(debounceRef.current);

    const changes = { ...pendingRef.current, template: templateId };
    pendingRef.current = {};
    updateCard.mutate(changes as Record<string, string>);
  };

  const flushPendingChanges = () => {
    clearTimeout(debounceRef.current);
    const changes = { ...pendingRef.current };
    pendingRef.current = {};

    if (Object.keys(changes).length === 0) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      updateCard.mutate(changes as Record<string, string>, {
        onSuccess: () => resolve(),
        onError: () => reject(),
      });
    });
  };

  const waitForFonts = async () => {
    if ("fonts" in document) {
      // @ts-ignore
      await document.fonts.ready;
    }
  };

  const exportNodeToPng = async (node: HTMLElement) => {
    return toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: null,
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      await flushPendingChanges();
      await waitForFonts();

      if (!frontRef.current || !backRef.current) {
        toast.error("Card preview not ready");
        return;
      }

      const frontDataUrl = await exportNodeToPng(frontRef.current);
      const backDataUrl = await exportNodeToPng(backRef.current);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CARD_W, CARD_H],
        compress: true,
      });

      pdf.addImage(frontDataUrl, "PNG", 0, 0, CARD_W, CARD_H, undefined, "FAST");
      pdf.addPage([CARD_W, CARD_H], "landscape");
      pdf.addImage(backDataUrl, "PNG", 0, 0, CARD_W, CARD_H, undefined, "FAST");

      const safeName = (card.name || card.brandName || "business")
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");

      pdf.save(`${safeName}-card.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadLogo.mutateAsync(file);
      setCard((prev) => ({
        ...prev,
        logoUrl: result.data.logoUrl,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await removeLogo.mutateAsync();
      setCard((prev) => ({
        ...prev,
        logoUrl: "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const backColors = (() => {
    const bg =
      (currentTemplate.backBgStyle?.backgroundColor as string) || "#0f172a";
    const hex = bg.replace("#", "");
    const safeHex = hex.length >= 6 ? hex : "0f172a";
    const r = parseInt(safeHex.substring(0, 2), 16);
    const g = parseInt(safeHex.substring(2, 4), 16);
    const b = parseInt(safeHex.substring(4, 6), 16);
    const isDark = (r * 299 + g * 587 + b * 114) / 1000 < 140;

    return {
      text: isDark ? "#f8fafc" : "#0f172a",
      sub: isDark ? "#cbd5e1" : "#475569",
    };
  })();

  const brandDisplay = card.brandName || card.name || "YOUR BRAND";
  const servicesDisplay =
    card.servicesText || "Add your services, specialties, or brand message";
  const hasContact = !!(card.phone || card.website || card.email || card.location);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Digital Business Card
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create your premium digital card
            </p>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Template ({cardTemplates.length} available)
            </h3>

            <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {cardTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                    card.template === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className="w-8 h-5 rounded overflow-hidden relative"
                    style={t.frontBgStyle || {}}
                  />
                  <span className="text-xs font-medium text-foreground truncate">
                    {t.label}
                  </span>
                  {card.template === t.id && (
                    <Check className="w-3 h-3 text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Branding</h3>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Logo
              </label>

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLogo.isPending}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadLogo.isPending ? "Uploading..." : "Upload Logo"}
                </Button>

                {card.logoUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveLogo}
                    disabled={removeLogo.isPending}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                )}
              </div>

              {card.logoUrl && (
                <div className="mt-3 w-20 h-20 rounded-xl bg-white/5 border border-border flex items-center justify-center overflow-hidden">
                  <img
                    src={card.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Brand / Company
              </label>
              <Input
                value={card.brandName || ""}
                onChange={(e) => handleChange("brandName", e.target.value)}
                placeholder="Your Brand Name"
                className="bg-secondary/50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Tagline
              </label>
              <Input
                value={card.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Your brand tagline"
                className="bg-secondary/50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Services Line
              </label>
              <Textarea
                value={card.servicesText || ""}
                onChange={(e) => handleChange("servicesText", e.target.value)}
                placeholder="Add your services, specialties, or short brand message"
                className="bg-secondary/50 min-h-[90px]"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Contact Details</h3>

            {[
              { key: "name" as const, label: "Name", placeholder: "Your name" },
              { key: "role" as const, label: "Role", placeholder: "Your role or designation" },
              { key: "phone" as const, label: "Phone", placeholder: "+91 98765 43210" },
              { key: "email" as const, label: "Email", placeholder: "you@example.com" },
              { key: "website" as const, label: "Website", placeholder: "www.yoursite.com" },
              { key: "location" as const, label: "Location", placeholder: "City, Country" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {f.label}
                </label>
                <Input
                  value={card[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="bg-secondary/50"
                />
              </div>
            ))}
          </div>

          <Button
            className="w-full gap-1.5"
            onClick={handleDownloadPdf}
            disabled={isExporting || updateCard.isPending}
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? "Generating..."
              : updateCard.isPending
              ? "Saving..."
              : "Download PDF"}
          </Button>
        </div>

        {/* RIGHT */}
        <div className="sticky top-20 space-y-3">
          <p className="text-sm text-muted-foreground">Card Preview</p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">
              Front
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <motion.div
            ref={frontRef}
            layout
            className="rounded-2xl overflow-hidden relative aspect-[1.75/1]"
            style={{
              width: "100%",
              maxWidth: `${CARD_W * 1.4}px`,
              ...currentTemplate.frontBgStyle,
            }}
          >
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
              {card.logoUrl ? (
                <div className="w-20 h-20 mb-4 flex items-center justify-center">
                  <img
                    src={card.logoUrl}
                    alt="Brand logo"
                    className="max-w-full max-h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `${currentTemplate.accentColor}18`,
                    border: `2px solid ${currentTemplate.accentColor}40`,
                  }}
                >
                  <Briefcase
                    className="w-8 h-8"
                    style={{ color: currentTemplate.accentColor }}
                  />
                </div>
              )}

              <h2
                className="text-[2rem] leading-none font-display font-extrabold tracking-wide"
                style={{ color: currentTemplate.accentColor }}
              >
                {brandDisplay.toUpperCase()}
              </h2>

              {card.tagline && (
                <p
                  className={`text-lg italic font-semibold mt-3 ${currentTemplate.textColor}`}
                >
                  {card.tagline}
                </p>
              )}

              {servicesDisplay && (
                <p
                  className={`text-[12px] mt-4 max-w-[85%] leading-snug ${currentTemplate.subColor}`}
                >
                  {servicesDisplay}
                </p>
              )}
            </div>
          </motion.div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">
              Back
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <motion.div
            ref={backRef}
            layout
            className="rounded-2xl overflow-hidden relative aspect-[1.75/1]"
            style={{
              width: "100%",
              maxWidth: `${CARD_W * 1.4}px`,
              ...currentTemplate.backBgStyle,
            }}
          >
            <div
              className={`relative z-10 h-full flex items-center p-5 ${
                hasContact ? "gap-4" : "justify-center"
              }`}
            >
              {hasContact && (
                <div className="flex-1 space-y-3 min-w-0">
                  {card.phone && (
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: `${currentTemplate.accentColor}25` }}
                      >
                        <Phone className="w-3.5 h-3.5" style={{ color: currentTemplate.accentColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] leading-none" style={{ color: backColors.sub }}>
                          Phone Number :
                        </p>
                        <p className="text-[11px] font-bold truncate mt-0.5" style={{ color: backColors.text }}>
                          {card.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {card.website && (
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: `${currentTemplate.accentColor}25` }}
                      >
                        <Globe className="w-3.5 h-3.5" style={{ color: currentTemplate.accentColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] leading-none" style={{ color: backColors.sub }}>
                          Website :
                        </p>
                        <p className="text-[11px] font-bold truncate mt-0.5" style={{ color: backColors.text }}>
                          {card.website}
                        </p>
                      </div>
                    </div>
                  )}

                  {card.email && (
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: `${currentTemplate.accentColor}25` }}
                      >
                        <Mail className="w-3.5 h-3.5" style={{ color: currentTemplate.accentColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] leading-none" style={{ color: backColors.sub }}>
                          Email Address :
                        </p>
                        <p className="text-[11px] font-bold truncate mt-0.5" style={{ color: backColors.text }}>
                          {card.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {card.location && (
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                        style={{ background: `${currentTemplate.accentColor}25` }}
                      >
                        <MapPin className="w-3.5 h-3.5" style={{ color: currentTemplate.accentColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] leading-none" style={{ color: backColors.sub }}>
                          Address :
                        </p>
                        <p className="text-[11px] font-bold truncate mt-0.5" style={{ color: backColors.text }}>
                          {card.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="shrink-0 flex flex-col items-center">
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: `${currentTemplate.accentColor}18`,
                    border: `1px solid ${currentTemplate.accentColor}30`,
                  }}
                >
                  <div className="bg-white p-2 rounded-xl relative">
                    <QRCodeCanvas
                      value={profileUrl}
                      size={96}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold shadow"
                        style={{ background: currentTemplate.accentColor }}
                      >
                        L
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] mt-2 font-medium" style={{ color: backColors.sub }}>
                  Scan Me
                </p>

                {card.brandName && (
                  <p className="text-[9px] mt-0.5 font-semibold opacity-50" style={{ color: backColors.sub }}>
                    {card.brandName}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CardPage;