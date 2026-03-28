import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Best for getting started with your bio page.",
    features: [
      "Unlimited Links",
      "Social Icons, Videos & Embeds",
      "Essential Analytics",
      "SEO Optimized Design",
      "Unique QR Code",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "₹49",
    period: "/month",
    description: "Great for creators who want more customization and growth tools.",
    features: [
      "Everything in Free Plan",
      "Custom Themes",
      "Own Your Audience",
      "Redirect Links",
    ],
    cta: "Get Starter",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "₹79",
    period: "/month",
    description: "Perfect for professionals who want branding, priority links, and advanced insights.",
    features: [
      "Everything in Starter Plan",
      "Personalized Link Page",
      "Highlight Key Links",
      "Comprehensive Analytics",
    ],
    cta: "Get Premium",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 flex flex-col hover-lift ${
                plan.highlighted
                  ? "glass-strong glow-primary ring-1 ring-primary/30 relative"
                  : "glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="font-display font-bold text-lg text-foreground">
                {plan.name}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                {plan.description}
              </p>

              <div className="mt-4 mb-6">
                <span className="text-4xl font-display font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className={`w-full rounded-xl h-11 ${
                  plan.highlighted ? "glow-primary" : ""
                }`}
                asChild
              >
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}