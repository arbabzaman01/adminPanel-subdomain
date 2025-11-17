"use client";

const AUTH_TOKEN_KEY = "adminAuthToken";
const AUTH_ROLE_KEY = "adminRole";
const AUTH_EMAIL_KEY = "adminEmail";

export const ADMIN_ROLES = {
  SUPER_ADMIN: "superAdmin",
};

export const SUPER_ADMIN_EMAIL = "superadmin@example.com";
export const SUPER_ADMIN_PASSWORD = "super123";

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

  const normalizedEmail = sanitizedEmail.toLowerCase();
  const normalizedCorrectEmail = SUPER_ADMIN_EMAIL.toLowerCase();

  const isValid =
    normalizedEmail === normalizedCorrectEmail && sanitizedPassword === SUPER_ADMIN_PASSWORD;

  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  persistSession(ADMIN_ROLES.SUPER_ADMIN, SUPER_ADMIN_EMAIL);

  return {
    token: "loggedIn",
    role: ADMIN_ROLES.SUPER_ADMIN,
    email: SUPER_ADMIN_EMAIL,
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
};

