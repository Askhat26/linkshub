import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  linksApi,
  appearanceApi,
  cardApi,
  analyticsApi,
  qrApi,
  couponsApi,
  adminApi,
  publicApi,
} from "@/lib/api";
import { toast } from "sonner";

// ─── LINKS ──────────────────────────────────────
export function useLinks() {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => (await linksApi.getAll()).data.links,
  });
}

export function useCreateLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; url: string }) => linksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link added");
    },
    onError: () => toast.error("Failed to add link"),
  });
}

export function useUpdateLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; url?: string; enabled?: boolean } }) =>
      linksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link updated");
    },
    onError: () => toast.error("Failed to update link"),
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => linksApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link deleted");
    },
    onError: () => toast.error("Failed to delete link"),
  });
}

export function useReorderLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => linksApi.reorder(orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
    onError: () => toast.error("Failed to save order"),
  });
}

// ─── APPEARANCE ─────────────────────────────────
export function useAppearance() {
  return useQuery({
    queryKey: ["appearance"],
    queryFn: async () => (await appearanceApi.get()).data.appearance,
  });
}

export function useUpdateAppearance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, string>) => appearanceApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appearance"] }),
    onError: () => toast.error("Failed to save appearance"),
  });
}

// ─── CARD ───────────────────────────────────────
export function useCard() {
  return useQuery({
    queryKey: ["card"],
    queryFn: async () => (await cardApi.get()).data.card,
  });
}

export function useUpdateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => cardApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["card"] });
      toast.success("Card saved");
    },
    onError: () => toast.error("Failed to save card"),
  });
}

export function useDownloadCardPdf() {
  return useMutation({
    mutationFn: async () => {
      const res = await cardApi.downloadPdf();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "business-card.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: () => toast.error("Failed to download PDF"),
  });
}

// NEW: upload card logo
export function useUploadCardLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => cardApi.uploadLogo(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["card"] });
      toast.success("Logo uploaded");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to upload logo");
    },
  });
}

// NEW: remove card logo
export function useRemoveCardLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cardApi.removeLogo(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["card"] });
      toast.success("Logo removed");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to remove logo");
    },
  });
}

// ─── ANALYTICS ──────────────────────────────────
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ["analytics-stats"],
    queryFn: async () => (await analyticsApi.getStats()).data,
  });
}

export function useAnalyticsChart(days = 30) {
  return useQuery({
    queryKey: ["analytics-chart", days],
    queryFn: async () => (await analyticsApi.getChartData(days)).data,
  });
}

// ─── QR ─────────────────────────────────────────
export function useQrStats() {
  return useQuery({
    queryKey: ["qr-stats"],
    queryFn: async () => (await qrApi.getStats()).data,
  });
}

export function useDownloadQr() {
  return useMutation({
    mutationFn: async () => {
      const res = await qrApi.downloadPng();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: () => toast.error("Failed to download QR"),
  });
}

// ─── COUPONS (user-facing) ──────────────────────
export function useValidateCoupon() {
  return useMutation({
    mutationFn: (code: string) => couponsApi.validate(code),
    onError: (err: any) => toast.error(err.response?.data?.error || "Invalid coupon"),
  });
}

// ─── ADMIN ──────────────────────────────────────
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await adminApi.getDashboard()).data,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers()).data.users,
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await adminApi.getCoupons()).data.coupons,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { code: string; discountPercent: number; maxUses: number; expiresAt: string }) =>
      adminApi.createCoupon(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created");
    },
    onError: () => toast.error("Failed to create coupon"),
  });
}

export function useToggleCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.toggleCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.banUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User banned");
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted");
    },
  });
}

// ─── PUBLIC PROFILE ─────────────────────────────
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => (await publicApi.getProfile(username)).data,
    enabled: !!username,
  });
}

export function useAdminOverview(days = 30) {
  return useQuery({
    queryKey: ["admin-overview", days],
    queryFn: async () => (await adminApi.getAnalyticsOverview(days)).data,
  });
}

export function useAdminCouponStats() {
  return useQuery({
    queryKey: ["admin-coupon-stats"],
    queryFn: async () => (await adminApi.getCouponStats()).data,
  });
}

export function useAdminUsersAdvanced(params: any) {
  return useQuery({
    queryKey: ["admin-users-advanced", params],
    queryFn: async () => (await adminApi.getUsersAdvanced(params)).data,
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) =>
      adminApi.suspendUser(id, suspended),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-users-advanced"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });
}

export function useSetUserPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: "starter" | "pro" | "premium" }) =>
      adminApi.setUserPlan(id, plan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-users-advanced"] });
      toast.success("Plan updated");
    },
    onError: () => toast.error("Failed to update plan"),
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => adminApi.resetUserPassword(id),
    onError: () => toast.error("Failed to reset password"),
  });
}

export function useAdminUserLinks(userId?: string) {
  return useQuery({
    queryKey: ["admin-user-links", userId],
    queryFn: async () => (await adminApi.getUserLinks(userId!)).data.links,
    enabled: !!userId,
  });
}

export function useAdminUserAnalytics(userId?: string, days = 30) {
  return useQuery({
    queryKey: ["admin-user-analytics", userId, days],
    queryFn: async () => (await adminApi.getUserAnalytics(userId!, days)).data.stats,
    enabled: !!userId,
  });
}