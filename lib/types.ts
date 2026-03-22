export type ServiceCategory = "Consultation" | "Care" | "Specialty";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  duration: string;
  durationMinutes: number;
  price: string;
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

export type BookingStatus = "confirmed" | "cancelled" | "completed";

export type UserRole = "client" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthUser = SessionUser & {
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type BookingInput = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

export type BookingRecord = BookingInput & {
  id: string;
  userId: string;
  serviceName: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  confirmationSentAt: string | null;
  cancellationSentAt: string | null;
  reminderSentAt: string | null;
};

export type AdminBookingStatusFilter = BookingStatus | "all";

export type AdminBookingsQuery = {
  page: number;
  pageSize: number;
  status: AdminBookingStatusFilter;
  query: string;
};

export type AdminBookingSummary = {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AdminBookingsResult = {
  bookings: BookingRecord[];
  summary: AdminBookingSummary;
  pagination: PaginationMeta;
  filters: AdminBookingsQuery;
};

export type AvailabilityWindowInput = {
  weekday: number;
  startTime: string;
  endTime: string;
};

export type AvailabilityWindowRecord = AvailabilityWindowInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BlackoutDateInput = {
  date: string;
  reason: string;
};

export type BlackoutDateRecord = BlackoutDateInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type AvailableSlot = {
  time: string;
  label: string;
};

export type AvailableDate = {
  date: string;
  label: string;
  slotCount: number;
};

export type BookingNotificationKind = "confirmation" | "cancellation" | "reminder";

export type EmailDeliveryStatus = "sent" | "skipped" | "failed";

export type EmailDeliveryResult = {
  status: EmailDeliveryStatus;
  message: string;
  providerId?: string;
};

export type ReminderRunResult = {
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
};
