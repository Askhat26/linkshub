import { motion } from "framer-motion";
import { Palette, CreditCard, BarChart3, Globe, Layout, QrCode } from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "15 Layout Templates",
    description: "Choose from 15 stunning layout templates — glassmorphism, minimal, card stacks, neon cyber, and more.",
  },
  {
    icon: Palette,
    title: "20 Gen-Z Themes",
    description: "Apply beautiful themes with one click — Neon Cyber, Pastel Dream, Luxury Gold, Aurora Gradient, and more.",
  },
  {
    icon: CreditCard,
    title: "Digital Business Cards",
    description: "Create premium digital cards with 10 templates. Share via QR or download as PDF.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track clicks, views, and engagement with beautiful, real-time analytics charts.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain for a fully branded experience. SSL included.",
  },
  {
    icon: QrCode,
    title: "QR Code System",
    description: "Unique QR codes for each profile. Track scans and share anywhere.",
  },
];

export function Features() {
  return (
    <section id="features" className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text">stand out</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to create, customize, and grow your online presence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
