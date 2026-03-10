import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAdminOverview, useAdminUsers } from "@/hooks/useApi";
import { Users, Link2, QrCode, Eye, MousePointerClick, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#22d3ee"]; // views, clicks, qr

const AdminDashboardPage = () => {
  const { data: overview, isLoading } = useAdminOverview(30);
  const { data: users } = useAdminUsers();

  const stats = overview?.stats;
  const charts = overview?.charts;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "text-primary" },
    { label: "Active Users (30d)", value: stats?.activeUsers ?? "—", icon: Users, color: "text-emerald-400" },
    { label: "Total Links", value: stats?.totalLinksCreated ?? "—", icon: Link2, color: "text-accent" },
    { label: "Profile Views", value: stats?.totalProfileViews ?? "—", icon: Eye, color: "text-cyan-400" },
    { label: "Link Clicks", value: stats?.totalLinkClicks ?? "—", icon: MousePointerClick, color: "text-violet-400" },
    { label: "QR Scans", value: stats?.totalQrScans ?? "—", icon: QrCode, color: "text-sky-400" },
    { label: "Active Subs", value: stats?.activeSubscriptions ?? "—", icon: CreditCard, color: "text-amber-400" },
    { label: "Est. MRR (₹)", value: stats?.estimatedMrrInr ?? "—", icon: CreditCard, color: "text-emerald-400" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Admin Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Platform analytics • Signups today: {stats?.newSignups?.today ?? "—"} • Week: {stats?.newSignups?.week ?? "—"} • Month: {stats?.newSignups?.month ?? "—"}
            </p>
          </div>
          <Link to="/admin/coupons" className="text-sm text-primary hover:underline">
            Manage Coupons →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-5"
            >
              <c.icon className={`w-5 h-5 mb-3 ${c.color}`} />
              <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* User Growth */}
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-medium text-foreground mb-4">User Growth (last 30 days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.userGrowthDaily || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Mix */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-medium text-foreground mb-4">Traffic Mix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts?.trafficMix || []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                    {(charts?.trafficMix || []).map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Sources Time Series */}
          <div className="glass rounded-2xl p-5 lg:col-span-3">
            <h3 className="text-sm font-medium text-foreground mb-4">Traffic Sources (last 30 days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.trafficDaily || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profileViews" fill="#60a5fa" />
                  <Bar dataKey="linkClicks" fill="#34d399" />
                  <Bar dataKey="qrScans" fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Users table (keep existing feature) */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">All Users</h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Username</th>
                    <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Plan</th>
                    <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {(users || []).map((u: any) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-3 text-foreground">{u.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3 px-3 text-muted-foreground">@{u.username}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            u.plan === "premium"
                              ? "bg-accent/15 text-accent"
                              : u.plan === "pro"
                              ? "bg-primary/15 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;