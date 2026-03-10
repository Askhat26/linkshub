import axios from "axios";

// Configure this to your Express backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linkora_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
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
  updateProfile: (data: { name?: string; username?: string; bio?: string; avatar?: string }) =>
    api.put("/auth/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/password", data),
  deleteAccount: () => api.delete("/auth/account"),
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
  update: (data: {
    layout?: string; theme?: string; accentColor?: string;
    backgroundColor?: string; font?: string; buttonStyle?: string;
    animation?: string; avatarStyle?: string;
  }) => api.put("/appearance", data),
};

// ─── CARD ───────────────────────────────────────
export const cardApi = {
  get: () => api.get("/card"),
  update: (data: {
    name?: string; role?: string; phone?: string; email?: string;
    website?: string; location?: string; template?: string;
    brandName?: string; tagline?: string;
  }) => api.put("/card", data),
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
  apply: (code: string, planId: string) => api.post("/coupons/apply", { code, planId }),
};

// ─── ADMIN ──────────────────────────────────────
export const adminApi = {
  getUsers: () => api.get("/admin/users"),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getDashboard: () => api.get("/admin/dashboard"),

  // NEW
  getAnalyticsOverview: (days?: number) => api.get("/admin/analytics/overview", { params: { days } }),
  getCouponStats: () => api.get("/admin/coupons/stats"),

  // Coupons
  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (data: { code: string; discountPercent: number; maxUses: number; expiresAt: string }) =>
    api.post("/admin/coupons", data),
  toggleCoupon: (id: string) => api.put(`/admin/coupons/${id}/toggle`),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
    // Advanced Users (NEW)
  getUsersAdvanced: (params?: {
    q?: string;
    email?: string;
    username?: string;
    plan?: string;
    status?: "active" | "inactive";
    from?: string;
    to?: string;
    activeDays?: number;
    page?: number;
    limit?: number;
  }) => api.get("/admin/users", { params }),

  suspendUser: (id: string, suspended: boolean) =>
    api.patch(`/admin/users/${id}/suspend`, { suspended }),

  setUserPlan: (id: string, plan: "starter" | "pro" | "premium") =>
    api.patch(`/admin/users/${id}/plan`, { plan }),

  resetUserPassword: (id: string) =>
    api.post(`/admin/users/${id}/reset-password`),

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

// ─── UPGRADE / PAYMENTS ─────────────────────────
export const paymentsApi = {
  createOrder: (planId: string, couponCode?: string) =>
    api.post("/payments/create-order", { planId, couponCode }),
  verifyPayment: (data: { orderId: string; paymentId: string; signature: string }) =>
    api.post("/payments/verify", data),
};

export default api;
