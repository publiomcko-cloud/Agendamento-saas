export type UserRole = "admin" | "attendant" | "client";

export type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  active: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  clientId: string;
  serviceId: string;
  createdByUserId?: string | null;
  scheduledAt: string;
  endAt: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string | null;
  client: Client;
  service: Service;
  createdByUser?: AuthUser | null;
};

export type Payment = {
  id: string;
  appointmentId: string;
  amount: string;
  status: "pending" | "paid" | "refunded" | "failed";
  method?: "cash" | "pix" | "credit_card" | "debit_card" | "other" | null;
  paidAt?: string | null;
  externalReference?: string | null;
  appointment: Appointment;
};

export type DashboardData = {
  referenceDate: string;
  totals: {
    appointmentsToday: number;
    paymentsToday: number;
    revenuePaidToday: string;
  };
  appointmentsToday: Appointment[];
  upcomingAppointments: Appointment[];
};
