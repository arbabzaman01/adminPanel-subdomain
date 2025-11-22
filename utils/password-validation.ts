/**
 * Password validation utilities
 * Ready for backend API integration
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 number
 * - At least 1 special character
 */
export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || password.trim().length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates that current password matches stored password
 */
export const validateCurrentPassword = (
  currentPassword: string,
  storedPassword: string
): boolean => {
  const sanitizedCurrent = currentPassword?.trim();
  const sanitizedStored = storedPassword?.trim();

  if (!sanitizedCurrent || !sanitizedStored) {
    return false;
  }

  return sanitizedCurrent === sanitizedStored;
};

/**
 * Validates that confirm password matches new password
 */
export const validatePasswordMatch = (
  newPassword: string,
  confirmPassword: string
): boolean => {
  const sanitizedNew = newPassword?.trim();
  const sanitizedConfirm = confirmPassword?.trim();

  if (!sanitizedNew || !sanitizedConfirm) {
    return false;
  }

  return sanitizedNew === sanitizedConfirm;
};

/**
 * Validates password change (alias for validatePasswordChange)
 * Ready for API integration
 */
export const validatePassword = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  storedPassword: string
): PasswordValidationResult => {
  return validatePasswordChange(currentPassword, newPassword, confirmPassword, storedPassword);
};

/**
 * Comprehensive password change validation
 */
export const validatePasswordChange = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  storedPassword: string
): PasswordValidationResult => {
  const errors: string[] = [];

  // Validate current password
  if (!validateCurrentPassword(currentPassword, storedPassword)) {
    errors.push("Current password is incorrect");
  }

  // Validate new password strength
  const strengthValidation = validatePasswordStrength(newPassword);
  if (!strengthValidation.isValid) {
    errors.push(...strengthValidation.errors);
  }

  // Validate password match
  if (!validatePasswordMatch(newPassword, confirmPassword)) {
    errors.push("New password and confirm password do not match");
  }

  // Check if new password is same as current
  if (currentPassword.trim() === newPassword.trim()) {
    errors.push("New password must be different from current password");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

