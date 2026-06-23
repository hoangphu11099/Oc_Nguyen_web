import type {
  AuthResponse,
  MenuItem,
  MenuPayload,
  Promotion,
  PromotionPayload,
  Reservation,
  ReservationPayload,
  ReservationStatus,
  User,
  AdminNotification,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "oc_nguyen_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStore.get();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message;
    throw new Error(
      Array.isArray(message) ? message.join(", ") : message || "Có lỗi xảy ra",
    );
  }

  return data as T;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  profile: () => apiRequest<User>("/auth/profile"),
};

export const menuApi = {
  getAll: () => apiRequest<MenuItem[]>("/menu"),
  create: (payload: MenuPayload) =>
    apiRequest<MenuItem>("/menu", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: Partial<MenuPayload>) =>
    apiRequest<MenuItem>(`/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    apiRequest<{ message: string }>(`/menu/${id}`, { method: "DELETE" }),
};

export const reservationApi = {
  create: (payload: ReservationPayload) =>
    apiRequest<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAll: () => apiRequest<Reservation[]>("/reservations"),
  updateStatus: (id: number, status: ReservationStatus) =>
    apiRequest<Reservation>(`/reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id: number) =>
    apiRequest<{ message: string }>(`/reservations/${id}`, {
      method: "DELETE",
    }),
};

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
export const promotionApi = {
  getActive: () => apiRequest<Promotion | null>("/promotions/active"),

  getAdminCurrent: () =>
    apiRequest<Promotion | null>("/promotions/admin/current"),

  saveAdminCurrent: (payload: PromotionPayload) =>
    apiRequest<Promotion>("/promotions/admin/current", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
// Admin notifications
export const notificationApi = {
  getAll: () => apiRequest<AdminNotification[]>("/notifications/admin"),

  getUnreadCount: () => apiRequest<number>("/notifications/admin/unread-count"),

  markAsRead: (id: number) =>
    apiRequest<AdminNotification>(`/notifications/admin/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiRequest<{ count: number }>("/notifications/admin/read-all", {
      method: "PATCH",
    }),

  remove: (id: number) =>
    apiRequest<{ message: string }>(`/notifications/admin/${id}`, {
      method: "DELETE",
    }),
};
