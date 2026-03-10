import { motion } from "framer-motion";

const stats = [
  { value: "2M+", label: "Creators" },
  { value: "50M+", label: "Link clicks" },
  { value: "190+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const avatars = [
  "bg-gradient-to-br from-primary to-accent",
  "bg-gradient-to-br from-accent to-primary",
  "bg-gradient-to-br from-primary/80 to-accent/80",
  "bg-gradient-to-br from-accent/80 to-primary/80",
  "bg-gradient-to-br from-primary/60 to-accent/60",
];

export function SocialProof() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        {/* Avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 mb-16"
        >
          <div className="flex -space-x-3">
            {avatars.map((bg, i) => (
              <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-background`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by <span className="text-foreground font-medium">2M+ creators</span> worldwide
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center hover-lift"
            >
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
