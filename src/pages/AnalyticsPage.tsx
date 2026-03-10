import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAnalyticsStats, useAnalyticsChart } from "@/hooks/useApi";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Eye, MousePointerClick, QrCode, TrendingUp } from "lucide-react";

const statIcons = [Eye, MousePointerClick, QrCode, TrendingUp];
const statColors = ["hsl(260,80%,65%)", "hsl(330,85%,60%)", "hsl(190,90%,50%)", "hsl(150,80%,45%)"];
const tooltipStyle = { background: "hsl(240,12%,8%)", border: "1px solid hsl(240,10%,15%)", borderRadius: 12, fontSize: 12, color: "#fff" };

const AnalyticsPage = () => {
  const { data: stats } = useAnalyticsStats();
  const { data: chartData } = useAnalyticsChart(30);

  const statCards = [
    { label: "Profile Views", value: stats?.totalViews ?? "—" },
    { label: "Link Clicks", value: stats?.totalClicks ?? "—" },
    { label: "QR Scans", value: stats?.totalQrScans ?? "—" },
    { label: "Click Rate", value: stats?.clickRate ? `${stats.clickRate}%` : "—" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your profile performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
                <Icon className="w-5 h-5 mb-3" style={{ color: statColors[i] }} />
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Views & Clicks (30 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData?.chart || []}>
              <defs>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(260,80%,65%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(260,80%,65%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(330,85%,60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(330,85%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,10%,15%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="hsl(260,80%,65%)" fill="url(#vGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(330,85%,60%)" fill="url(#cGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">QR Scans (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData?.chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,10%,15%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="qrScans" fill="hsl(190,90%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
