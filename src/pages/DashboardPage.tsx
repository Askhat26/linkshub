import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks, useAnalyticsStats } from "@/hooks/useApi";
import { Eye, MousePointerClick, QrCode, TrendingUp, ExternalLink, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useAnalyticsChart } from "@/hooks/useApi";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: analyticsStats } = useAnalyticsStats();
  const { data: chartResponse } = useAnalyticsChart(14);
  const { data: links } = useLinks();

  const chartData = chartResponse?.chart || [];

  const stats = [
    { label: "Profile Views", value: analyticsStats?.totalViews ?? "—", change: analyticsStats?.viewsChange ?? "+0%", icon: Eye, gradient: "from-violet-600 to-indigo-600", glow: "shadow-violet-500/20" },
    { label: "Total Clicks", value: analyticsStats?.totalClicks ?? "—", change: analyticsStats?.clicksChange ?? "+0%", icon: MousePointerClick, gradient: "from-pink-600 to-rose-600", glow: "shadow-pink-500/20" },
    { label: "QR Scans", value: analyticsStats?.totalQrScans ?? "—", change: analyticsStats?.qrChange ?? "+0%", icon: QrCode, gradient: "from-cyan-500 to-blue-600", glow: "shadow-cyan-500/20" },
    { label: "Click Rate", value: analyticsStats?.clickRate ? `${analyticsStats.clickRate}%` : "—", change: analyticsStats?.rateChange ?? "+0%", icon: TrendingUp, gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20" },
  ];

  const topLinks = (links || []).filter((l: any) => l.enabled).slice(0, 4);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl glass p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "Creator"} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Here's how your profile is performing today</p>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl glass p-5 group hover-lift shadow-lg ${s.glow}`}>
              <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{s.change}</span>
                </div>
                <p className="text-2xl font-display font-bold text-foreground tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Performance (14 days)</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] text-muted-foreground">Views</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-[10px] text-muted-foreground">Clicks</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(260,80%,65%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(260,80%,65%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(330,85%,60%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(330,85%,60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid hsl(240,10%,20%)", borderRadius: 12, fontSize: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="views" stroke="hsl(260,80%,65%)" fill="url(#viewsGrad)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="clicks" stroke="hsl(330,85%,60%)" fill="url(#clicksGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Top Links</h3>
              <Link to="/dashboard/links" className="text-xs text-primary hover:underline font-medium">View all</Link>
            </div>
            <div className="space-y-2.5">
              {topLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No links yet</p>
              ) : topLinks.map((link: any, i: number) => (
                <motion.div key={link._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs font-semibold text-muted-foreground">{link.clicks}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add Link", to: "/dashboard/links", icon: "🔗" },
            { label: "Customize", to: "/dashboard/appearance", icon: "🎨" },
            { label: "View QR", to: "/dashboard/qr", icon: "📱" },
            { label: "Business Card", to: "/dashboard/card", icon: "💳" },
          ].map((action) => (
            <Link key={action.label} to={action.to}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-secondary/50 hover-lift transition-all group">
              <span className="text-xl">{action.icon}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
