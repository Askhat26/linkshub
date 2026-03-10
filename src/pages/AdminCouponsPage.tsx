import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAdminCoupons, useCreateCoupon, useToggleCoupon, useDeleteCoupon } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Ticket } from "lucide-react";
import { toast } from "sonner";

const AdminCouponsPage = () => {
  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const toggleCoupon = useToggleCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "", maxUses: "", expiresAt: "" });

  const handleCreate = () => {
    if (!form.code || !form.discountPercent || !form.maxUses || !form.expiresAt) {
      return toast.error("Fill in all fields");
    }
    createCoupon.mutate({
      code: form.code.toUpperCase(),
      discountPercent: Number(form.discountPercent),
      maxUses: Number(form.maxUses),
      expiresAt: new Date(form.expiresAt).toISOString(),
    });
    setForm({ code: "", discountPercent: "", maxUses: "", expiresAt: "" });
    setOpen(false);
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Coupon Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Create and manage discount coupons</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Create Coupon</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border">
              <DialogHeader><DialogTitle className="font-display">Create Coupon</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Code</label>
                  <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="LAUNCH50" className="bg-secondary/50 uppercase" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Discount %</label>
                  <Input type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} placeholder="50" className="bg-secondary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Uses</label>
                  <Input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} placeholder="100" className="bg-secondary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Expires At</label>
                  <Input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="bg-secondary/50" />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createCoupon.isPending}>
                  {createCoupon.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Code</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Discount</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Usage</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Expires</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(coupons || []).map((coupon: any) => {
                  const expired = new Date(coupon.expiresAt) < new Date();
                  const exhausted = coupon.usedCount >= coupon.maxUses;
                  return (
                    <tr key={coupon._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1.5 font-mono font-medium text-foreground">
                          <Ticket className="w-3.5 h-3.5 text-primary" />{coupon.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground">{coupon.discountPercent}%</td>
                      <td className="py-3 px-4 text-muted-foreground">{coupon.usedCount}/{coupon.maxUses}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {expired ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Expired</span>
                        ) : exhausted ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Exhausted</span>
                        ) : coupon.isActive ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Active</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch checked={coupon.isActive} onCheckedChange={() => toggleCoupon.mutate(coupon._id)} disabled={expired} />
                          <button onClick={() => deleteCoupon.mutate(coupon._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminCouponsPage;
