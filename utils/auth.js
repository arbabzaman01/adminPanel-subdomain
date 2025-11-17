"use client";

const AUTH_TOKEN_KEY = "adminAuthToken";
const AUTH_ROLE_KEY = "adminRole";
const AUTH_EMAIL_KEY = "adminEmail";

export const ADMIN_ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
};

const ADMIN_ACCOUNTS = [
  { email: "superadmin@example.com", password: "super123", role: ADMIN_ROLES.SUPER_ADMIN },
  { email: "admin1@example.com", password: "admin123", role: ADMIN_ROLES.ADMIN },
  { email: "admin2@example.com", password: "admin123", role: ADMIN_ROLES.ADMIN },
];

const persistSession = (role, email) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_TOKEN_KEY, "loggedIn");
  localStorage.setItem(AUTH_ROLE_KEY, role);
  localStorage.setItem(AUTH_EMAIL_KEY, email);
};

export const loginAdmin = (email, password) => {
  if (typeof window === "undefined") {
    throw new Error("AUTH_UNAVAILABLE");
  }

  const sanitizedEmail = email?.trim();
  const sanitizedPassword = password?.trim();

  if (!sanitizedEmail || !sanitizedPassword) {
    throw new Error("EMPTY_FIELDS");
  }

  const user = ADMIN_ACCOUNTS.find(
    (account) =>
      account.email.toLowerCase() === sanitizedEmail.toLowerCase() &&
      account.password === sanitizedPassword
  );

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  persistSession(user.role, user.email);

  return {
    token: "loggedIn",
    role: user.role,
    email: user.email,
  };
};

export const isLoggedIn = (allowedRoles = []) => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const storedRole = localStorage.getItem(AUTH_ROLE_KEY);

  if (!token) return false;

  if (allowedRoles.length === 0) return true;

  if (!storedRole) return false;

  return allowedRoles.includes(storedRole);
};

export const getAdminRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_ROLE_KEY);
};

export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
};

export const getAdminEmail = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_EMAIL_KEY);
};

export const ADMIN_ACL = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    canAccessDashboard: true,
    canAccessProducts: true,
    canAccessOrders: true,
    canAccessSettings: true,
  },
  [ADMIN_ROLES.ADMIN]: {
    canAccessDashboard: true,
    canAccessProducts: true,
    canAccessOrders: true,
    canAccessSettings: false,
  },
};

