/**
 * Password update utilities
 * Currently uses dummy data, ready for backend API integration
 */

import { SUPER_ADMIN_PASSWORD } from "./auth";

/**
 * Dummy admin profile data
 * In production, this would be fetched from backend
 */
export const adminProfile = {
  email: "superadmin@example.com",
  password: SUPER_ADMIN_PASSWORD,
  name: "Super Admin",
  role: "Super Admin",
};

const DUMMY_ADMIN_PROFILE = adminProfile;

/**
 * Updates admin password (dummy implementation)
 * TODO: Replace with actual API call when backend is ready
 * 
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns Promise that resolves to success status
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  return updateAdminPassword(currentPassword, newPassword);
};

/**
 * Updates admin password (dummy implementation)
 * TODO: Replace with actual API call when backend is ready
 * 
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns Promise that resolves to success status
 */
const updateAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Dummy validation - in production, this would be an API call
  const sanitizedCurrent = currentPassword?.trim();
  const sanitizedNew = newPassword?.trim();

  if (!sanitizedCurrent || !sanitizedNew) {
    return {
      success: false,
      message: "Password fields cannot be empty",
    };
  }

  // Verify current password matches
  if (sanitizedCurrent !== DUMMY_ADMIN_PROFILE.password) {
    return {
      success: false,
      message: "Current password is incorrect",
    };
  }

  // In production, this would update the password via API:
  // const response = await fetch('/api/admin/update-password', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ currentPassword, newPassword })
  // });
  // return await response.json();

  // Dummy success response
  return {
    success: true,
    message: "Password updated successfully",
  };
};

/**
 * Gets current admin profile (dummy implementation)
 * TODO: Replace with actual API call when backend is ready
 */
export const getAdminProfile = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In production, this would fetch from API:
  // const response = await fetch('/api/admin/profile');
  // return await response.json();

  return DUMMY_ADMIN_PROFILE;
};

