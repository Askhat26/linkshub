import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-32">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      
      <div className="container-tight relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-full px-4 py-1.5 mb-8 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">20 themes · 15 layouts · Unlimited creativity</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            Your internet identity.{" "}
            <span className="gradient-text">One beautiful link.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance"
          >
            Create a stunning link-in-bio page, digital business card, and manage your entire online presence — all from one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" className="glow-primary text-base px-8 h-12 rounded-xl" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-xl" asChild>
              <Link to="/profile/alexrivera">View Demo</Link>
            </Button>
          </motion.div>

          {/* Phone preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 w-full max-w-sm mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 to-accent/20 rounded-[2rem] blur-2xl" />
              <div className="relative glass-strong rounded-[2rem] p-6 glow-border">
                {/* Mock profile */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="text-center">
                    <h3 className="font-display font-bold text-foreground">@creativemind</h3>
                    <p className="text-sm text-muted-foreground">Designer • Creator • Dreamer</p>
                  </div>
                  <div className="w-full flex flex-col gap-2.5 mt-2">
                    {["Portfolio", "YouTube", "Newsletter", "Shop"].map((label, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="w-full py-3 rounded-xl bg-secondary/80 text-center text-sm font-medium text-secondary-foreground hover-lift cursor-pointer"
                      >
                        {label}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
