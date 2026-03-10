import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ExternalLink,
  Search,
  ShieldBan,
  ShieldCheck,
  Trash2,
  RefreshCcw,
  Copy,
  Link2,
  BarChart3,
} from "lucide-react";
import {
  useAdminUsersAdvanced,
  useSuspendUser,
  useSetUserPlan,
  useResetUserPassword,
  useAdminUserLinks,
  useAdminUserAnalytics,
  useDeleteUser,
} from "@/hooks/useApi";

type Plan = "starter" | "pro" | "premium";
type StatusFilter = "all" | "active" | "inactive";

const chipClass = (plan: string) =>
  plan === "premium"
    ? "bg-accent/15 text-accent"
    : plan === "pro"
    ? "bg-primary/15 text-primary"
    : "bg-secondary text-muted-foreground";

function formatDate(d: any) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default function AdminUsersPage() {
  // Filters
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<"all" | Plan>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  // Details dialog
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Reset password dialog
  const [resetOpen, setResetOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string>("");

  const params = useMemo(() => {
    const p: any = {
      q: q.trim() || undefined,
      plan: plan === "all" ? undefined : plan,
      page,
      limit,
      activeDays: 30,
    };
    if (status !== "all") p.status = status;
    if (from) p.from = new Date(from).toISOString();
    if (to) p.to = new Date(to).toISOString();
    return p;
  }, [q, plan, status, from, to, page]);

  const { data, isLoading, refetch, isFetching } = useAdminUsersAdvanced(params);

  const users = data?.users || [];
  const pagination = data?.pagination;

  const suspendUser = useSuspendUser();
  const setUserPlan = useSetUserPlan();
  const resetPassword = useResetUserPassword();
  const deleteUser = useDeleteUser();

  const linksQuery = useAdminUserLinks(detailsOpen ? selectedUser?._id : undefined);
  const analyticsQuery = useAdminUserAnalytics(detailsOpen ? selectedUser?._id : undefined, 30);

  const publicBaseUrl = window.location.origin;

  const openPreview = (username: string) => {
    window.open(`${publicBaseUrl}/${username}`, "_blank", "noopener,noreferrer");
  };

  const openDetails = (u: any) => {
    setSelectedUser(u);
    setDetailsOpen(true);
  };

  const handleSuspendToggle = (u: any) => {
    suspendUser.mutate({ id: u._id, suspended: !u.isBanned });
  };

  const handlePlanChange = (u: any, newPlan: Plan) => {
    setUserPlan.mutate({ id: u._id, plan: newPlan });
  };

  const handleResetPassword = async (u: any) => {
    try {
      const res = await resetPassword.mutateAsync(u._id);
      const pw = res.data?.tempPassword;
      if (!pw) return toast.error("Temp password missing from server response");
      setTempPassword(pw);
      setResetOpen(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to reset password");
    }
  };

  const copyTempPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDelete = (u: any) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    deleteUser.mutate(u._id);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search, filter, suspend, reset passwords, change plan, preview creator pages
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2" disabled={isFetching}>
            <RefreshCcw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="text-xs text-muted-foreground mb-1 block">Search (name/email/username)</label>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search users..."
                  className="bg-secondary/50 pl-9"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Plan</label>
              <select
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value as any);
                  setPage(1);
                }}
                className="w-full h-11 rounded-xl bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Activity (30d)</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setPage(1);
                }}
                className="w-full h-11 rounded-xl bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="bg-secondary/50" />
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="bg-secondary/50" />
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setQ("");
                  setPlan("all");
                  setStatus("all");
                  setFrom("");
                  setTo("");
                  setPage(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Plan</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Joined</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">{u.name}</span>
                          <span className="text-xs text-muted-foreground">{u.email} • @{u.username}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${chipClass(u.plan)}`}>{u.plan}</span>
                      </td>

                      <td className="py-3 px-4">
                        {u.isBanned ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Suspended</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Active</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openDetails(u)}>
                            Details
                          </Button>

                          <button
                            onClick={() => openPreview(u.username)}
                            className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                            title="Preview page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleSuspendToggle(u)}
                            className={`p-2 rounded-lg transition-colors ${
                              u.isBanned
                                ? "hover:bg-emerald-500/10 text-emerald-400"
                                : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            }`}
                            title={u.isBanned ? "Unsuspend" : "Suspend"}
                          >
                            {u.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!!pagination && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
              <span>
                Page <span className="text-foreground font-medium">{pagination.page}</span> of{" "}
                <span className="text-foreground font-medium">{pagination.pages}</span> • Total{" "}
                <span className="text-foreground font-medium">{pagination.total}</span>
              </span>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="glass-strong border-border max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-display">User Details</DialogTitle>
            </DialogHeader>

            {!selectedUser ? null : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-foreground">{selectedUser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedUser.email} • @{selectedUser.username}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Joined: {formatDate(selectedUser.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedUser.plan}
                      onChange={(e) => {
                        const newPlan = e.target.value as Plan;
                        handlePlanChange(selectedUser, newPlan);
                        setSelectedUser((prev: any) => ({ ...prev, plan: newPlan }));
                      }}
                      className="h-10 rounded-xl bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="starter">starter</option>
                      <option value="pro">pro</option>
                      <option value="premium">premium</option>
                    </select>

                    <Button
                      variant="outline"
                      onClick={() => handleResetPassword(selectedUser)}
                      className="gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Reset Password
                    </Button>

                    <Button
                      variant={selectedUser.isBanned ? "outline" : "destructive"}
                      onClick={() => {
                        handleSuspendToggle(selectedUser);
                        setSelectedUser((prev: any) => ({ ...prev, isBanned: !prev.isBanned }));
                      }}
                      className="gap-2"
                    >
                      {selectedUser.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />}
                      {selectedUser.isBanned ? "Unsuspend" : "Suspend"}
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium text-foreground">Analytics (30d)</h4>
                    </div>

                    {analyticsQuery.isLoading ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="glass rounded-xl p-3">
                          <div className="text-xs text-muted-foreground">Profile Views</div>
                          <div className="text-lg font-semibold text-foreground">{analyticsQuery.data?.profileViews ?? 0}</div>
                        </div>
                        <div className="glass rounded-xl p-3">
                          <div className="text-xs text-muted-foreground">Link Clicks</div>
                          <div className="text-lg font-semibold text-foreground">{analyticsQuery.data?.linkClicks ?? 0}</div>
                        </div>
                        <div className="glass rounded-xl p-3">
                          <div className="text-xs text-muted-foreground">QR Scans</div>
                          <div className="text-lg font-semibold text-foreground">{analyticsQuery.data?.qrScans ?? 0}</div>
                        </div>
                        <div className="glass rounded-xl p-3">
                          <div className="text-xs text-muted-foreground">Click Rate</div>
                          <div className="text-lg font-semibold text-foreground">{analyticsQuery.data?.clickRate ?? 0}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium text-foreground">Links</h4>
                    </div>

                    {linksQuery.isLoading ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-auto pr-1">
                        {(linksQuery.data || []).map((l: any) => (
                          <a
                            key={l._id}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-border bg-secondary/30 hover:bg-secondary/40 transition px-3 py-2"
                          >
                            <div className="text-sm font-medium text-foreground">{l.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{l.url}</div>
                          </a>
                        ))}
                        {(linksQuery.data || []).length === 0 && (
                          <div className="text-sm text-muted-foreground">No links.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => openPreview(selectedUser.username)} className="gap-2">
                    <ExternalLink className="w-4 h-4" /> Preview Page
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedUser)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogContent className="glass-strong border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Temporary Password</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Share this temporary password with the user. It is already saved (hashed) in the database.
              </p>

              <div className="flex gap-2">
                <Input readOnly value={tempPassword} className="bg-secondary/50 font-mono" />
                <Button variant="outline" onClick={copyTempPassword} className="gap-2">
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              </div>

              <Button className="w-full" onClick={() => setResetOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}