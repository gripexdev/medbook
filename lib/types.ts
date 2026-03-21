export type ServiceCategory = "Consultation" | "Care" | "Specialty";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

export type BookingStatus = "confirmed" | "cancelled";

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
};
