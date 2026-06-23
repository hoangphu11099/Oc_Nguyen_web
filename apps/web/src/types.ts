export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  isSignature: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE";

export type TableType = "NORMAL" | "VIP";

export interface ReservationItem {
  id: number;
  reservationId: number;
  menuItemId: number;
  quantity: number;

  menuItem: MenuItem;
}

export interface Reservation {
  id: number;
  bookingCode?: string | null;
  customerName: string;
  phone: string;
  email?: string | null;
  numberOfGuests: number;
  reservationDate: string;
  note?: string | null;
  status: ReservationStatus;
  tableType: TableType;

  items?: ReservationItem[];

  user?: Pick<User, "id" | "name" | "email"> | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PreOrderItemPayload {
  menuItemId: number;
  quantity: number;
}

export interface ReservationPayload {
  customerName: string;
  phone: string;
  email?: string;
  numberOfGuests: number;
  reservationDate: string;
  note?: string;
  tableType?: TableType;
  preOrderItems?: PreOrderItemPayload[];
}

export type MenuPayload = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;
export interface Promotion {
  id: number;
  title: string;
  highlightText?: string | null;
  description: string;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionPayload {
  title: string;
  highlightText?: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
}
export type NotificationType =
  | "RESERVATION"
  | "REVIEW"
  | "PROMOTION"
  | "SYSTEM";

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export type PreOrderItem = {
  menuItemId: number;
  quantity: number;
  name?: string;
};

export type ReservationRequest = {
  customerName: string;
  phone: string;
  email: string;
  numberOfGuests: number;
  reservationDate: string;
  note?: string;

  tableType: "NORMAL" | "VIP";
  preOrderItems?: PreOrderItem[];
};
