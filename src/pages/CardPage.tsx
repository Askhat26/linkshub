import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCard, useUpdateCard, useDownloadCardPdf } from "@/hooks/useApi";
import { cardTemplates, type Card } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  QrCode,
  Check,
  Briefcase,
} from "lucide-react";

const CardPage = () => {
  const { data: fetchedCard, isLoading } = useCard();
  const updateCard = useUpdateCard();
  const downloadPdf = useDownloadCardPdf();

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
  });

  useEffect(() => {
    if (fetchedCard) setCard(fetchedCard);
  }, [fetchedCard]);

  const currentTemplate =
    cardTemplates.find((t) => t.id === card.template) || cardTemplates[0];

  const handleChange = <K extends keyof Card>(key: K, value: Card[K]) => {
    const updated = { ...card, [key]: value };
    setCard(updated);
    updateCard.mutate({ [key]: value } as any);
  };

  const renderPattern = (side: "front" | "back") => {
    const styleObj =
      side === "front" ? currentTemplate.frontBgStyle : currentTemplate.backBgStyle;

    // IMPORTANT:
    // If template already defines layered backgroundImage (patterns/overlays),
    // do not add extra overlay patterns here (keeps designs accurate).
    if (styleObj && (styleObj as any).backgroundImage) return null;

    if (currentTemplate.pattern === "ornate") {
      return (
        <>
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentTemplate.accentColor} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-20 h-20 opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentTemplate.accentColor} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentTemplate.accentColor}60, transparent)`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentTemplate.accentColor}60, transparent)`,
            }}
          />
        </>
      );
    }

    if (currentTemplate.pattern === "triangles") {
      return (
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: `10px solid ${currentTemplate.accentColor}`,
                left: `${(i % 5) * 22 + 5}%`,
                top: `${Math.floor(i / 5) * 28 + 10}%`,
                transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          ))}
        </div>
      );
    }

    // Default subtle glow for templates without custom layered bg
    return (
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
    );
  };

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
                  onClick={() => handleChange("template", t.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                    card.template === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className="w-8 h-5 rounded overflow-hidden relative"
                    style={t.frontBgStyle || {}}
                  >
                    {!t.frontBgStyle && (
                      <div
                        className={`w-full h-full bg-gradient-to-r ${t.gradient}`}
                      />
                    )}
                  </div>

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
            <h3 className="text-sm font-medium text-foreground">Brand Info</h3>

            {[
              { key: "brandName" as const, label: "Brand / Company", placeholder: "Your brand name" },
              { key: "tagline" as const, label: "Tagline", placeholder: "Design Studio" },
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

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Contact Details
            </h3>

            {[
              { key: "name" as const, label: "Name", placeholder: "Your name" },
              { key: "role" as const, label: "Role", placeholder: "Product Designer" },
              { key: "phone" as const, label: "Phone", placeholder: "+91 98765 43210" },
              { key: "email" as const, label: "Email", placeholder: "you@example.com" },
              { key: "website" as const, label: "Website", placeholder: "yoursite.com" },
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
            onClick={() => downloadPdf.mutate()}
            disabled={downloadPdf.isPending}
          >
            <Download className="w-4 h-4" />{" "}
            {downloadPdf.isPending ? "Generating..." : "Download PDF"}
          </Button>
        </div>

        {/* Preview */}
        <div className="sticky top-20 space-y-4">
          <p className="text-sm text-muted-foreground">Card Preview</p>

          <motion.div
            layout
            className="rounded-2xl overflow-hidden relative aspect-[1.7/1]"
            style={currentTemplate.frontBgStyle || {}}
          >
            {!currentTemplate.frontBgStyle && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTemplate.gradient}`}
              />
            )}

            {renderPattern("front")}

            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
              {card.brandName && (
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{
                        border: `1px solid ${currentTemplate.accentColor}50`,
                      }}
                    >
                      <Briefcase
                        className="w-3 h-3"
                        style={{ color: currentTemplate.accentColor }}
                      />
                    </div>
                    <span
                      className={`text-sm font-display font-bold ${currentTemplate.textColor}`}
                    >
                      {card.brandName}
                    </span>
                  </div>

                  {card.tagline && (
                    <p className={`text-[10px] ${currentTemplate.subColor} ml-8`}>
                      {card.tagline}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3
                  className={`text-lg font-display font-bold ${currentTemplate.textColor}`}
                >
                  {card.name || "Your Name"}
                </h3>
                <p className={`text-xs mb-3 ${currentTemplate.subColor}`}>
                  {card.role || "Your Role"}
                </p>

                <div className={`space-y-1 text-[10px] ${currentTemplate.subColor}`}>
                  {card.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone
                        className="w-3 h-3"
                        style={{ color: currentTemplate.accentColor }}
                      />
                      {card.phone}
                    </p>
                  )}
                  {card.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail
                        className="w-3 h-3"
                        style={{ color: currentTemplate.accentColor }}
                      />
                      {card.email}
                    </p>
                  )}
                  {card.website && (
                    <p className="flex items-center gap-1.5">
                      <Globe
                        className="w-3 h-3"
                        style={{ color: currentTemplate.accentColor }}
                      />
                      {card.website}
                    </p>
                  )}
                  {card.location && (
                    <p className="flex items-center gap-1.5">
                      <MapPin
                        className="w-3 h-3"
                        style={{ color: currentTemplate.accentColor }}
                      />
                      {card.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            layout
            className="rounded-2xl overflow-hidden relative aspect-[1.7/1]"
            style={currentTemplate.backBgStyle || {}}
          >
            {!currentTemplate.backBgStyle && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTemplate.gradient} opacity-30`}
              />
            )}

            {renderPattern("back")}

            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
              <div className="w-28 h-28 rounded-xl bg-white flex items-center justify-center mb-3 shadow-lg">
                <QrCode className="w-14 h-14 text-gray-900" />
              </div>

              <p className={`text-xs ${currentTemplate.subColor}`}>
                Scan to open profile
              </p>

              {card.brandName && (
                <p
                  className={`text-[10px] mt-2 font-display font-bold ${currentTemplate.textColor} opacity-60`}
                >
                  {card.brandName}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CardPage;