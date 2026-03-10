import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mia Chen",
    handle: "@miachen",
    text: "Linkora completely changed how I share my work. The glassmorphism themes are absolutely stunning.",
    role: "UX Designer",
  },
  {
    name: "Jordan Lee",
    handle: "@jordanlee",
    text: "Switched from Linktree and never looked back. The analytics and custom domains are game-changers.",
    role: "Content Creator",
  },
  {
    name: "Alex Rivera",
    handle: "@alexrivera",
    text: "The digital business card feature alone is worth it. I get compliments every time I share mine.",
    role: "Freelance Developer",
  },
];

export function Testimonials() {
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
            Loved by <span className="gradient-text">creators</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover-lift"
            >
              <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
