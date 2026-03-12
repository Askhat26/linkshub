import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linkora_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("linkora_token");
      localStorage.removeItem("linkora_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; username: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),

  // ✅ FIXED: these are in /api/user/*
  updateProfile: (data: { name?: string; username?: string; bio?: string }) =>
    api.put("/user/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/user/password", data),
  deleteAccount: () => api.delete("/user/account"),

  // ✅ NEW: update avatar
  updateAvatar: (avatar: string) => api.put("/user/avatar", { avatar }),
};

// ─── LINKS ──────────────────────────────────────
export const linksApi = {
  getAll: () => api.get("/links"),
  create: (data: { title: string; url: string }) => api.post("/links", data),
  update: (id: string, data: { title?: string; url?: string; enabled?: boolean }) =>
    api.put(`/links/${id}`, data),
  delete: (id: string) => api.delete(`/links/${id}`),
  reorder: (orderedIds: string[]) => api.put("/links/reorder", { orderedIds }),
};

// ─── APPEARANCE ─────────────────────────────────
export const appearanceApi = {
  get: () => api.get("/appearance"),
  update: (data: any) => api.put("/appearance", data),
};

// ─── CARD ───────────────────────────────────────
export const cardApi = {
  get: () => api.get("/card"),
  update: (data: any) => api.put("/card", data),
  downloadPdf: () => api.get("/card/pdf", { responseType: "blob" }),
};

// ─── ANALYTICS ──────────────────────────────────
export const analyticsApi = {
  getStats: () => api.get("/analytics/stats"),
  getChartData: (days?: number) => api.get("/analytics/chart", { params: { days } }),
  trackEvent: (data: { type: string; linkId?: string }) =>
    api.post("/analytics/track", data),
};

// ─── QR CODE ────────────────────────────────────
export const qrApi = {
  getStats: () => api.get("/qr/stats"),
  downloadPng: () => api.get("/qr/download", { responseType: "blob" }),
};

// ─── COUPONS ────────────────────────────────────
export const couponsApi = {
  validate: (code: string) => api.post("/coupons/validate", { code }),
  apply: (code: string, plan: string) => api.post("/coupons/apply", { code, plan }),
};

// ─── ADMIN ──────────────────────────────────────
export const adminApi = {
  getUsers: () => api.get("/admin/users"),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getDashboard: () => api.get("/admin/dashboard"),

  getAnalyticsOverview: (days?: number) => api.get("/admin/analytics/overview", { params: { days } }),
  getCouponStats: () => api.get("/admin/coupons/stats"),

  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (data: { code: string; discountPercent: number; maxUses: number; expiresAt: string }) =>
    api.post("/admin/coupons", data),
  toggleCoupon: (id: string) => api.put(`/admin/coupons/${id}/toggle`),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),

  getUsersAdvanced: (params?: any) => api.get("/admin/users", { params }),
  suspendUser: (id: string, suspended: boolean) => api.patch(`/admin/users/${id}/suspend`, { suspended }),
  setUserPlan: (id: string, plan: "starter" | "pro" | "premium") => api.patch(`/admin/users/${id}/plan`, { plan }),
  resetUserPassword: (id: string) => api.post(`/admin/users/${id}/reset-password`),
  getUserLinks: (id: string) => api.get(`/admin/users/${id}/links`),
  getUserAnalytics: (id: string, days = 30) => api.get(`/admin/users/${id}/analytics`, { params: { days } }),
};

// ─── PUBLIC PROFILE ─────────────────────────────
export const publicApi = {
  getProfile: (username: string) => api.get(`/public/${username}`),
  trackView: (username: string) => api.post(`/public/${username}/view`),
  trackClick: (username: string, linkId: string) =>
    api.post(`/public/${username}/click`, { linkId }),
};

// ─── UPLOADS (Cloudinary) ───────────────────────
export const uploadsApi = {
  getCloudinarySignature: (folder?: string) =>
    api.get("/uploads/cloudinary-signature", { params: folder ? { folder } : undefined }),
};

/**
 * ─── PAYMENTS (stub for build) ───────────────────
 * This is added ONLY to fix Vercel/TypeScript build.
 * Backend endpoints can be implemented later.
 *
 * UpgradePage currently expects: paymentsApi.createOrder(planId, couponCode?)
 */
export const paymentsApi = {
  createOrder: (planId: string, couponCode?: string) =>
    api.post("/payments/create-order", { planId, couponCode }),

  verifyPayment: (data: { orderId: string; paymentId: string; signature: string }) =>
    api.post("/payments/verify", data),
};

export default api;