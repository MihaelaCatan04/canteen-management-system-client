// password validation regex - matches signup form requirements
// requirements: 8-24 chars, 1 lowercase, 1 uppercase, 1 number, 1 special char
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

// individual requirement checks for real-time feedback
export const passwordRequirements = {
  minLength: {
    test: (pwd) => pwd.length >= 8,
    message: "At least 8 characters",
  },
  maxLength: {
    test: (pwd) => pwd.length <= 24,
    message: "Maximum 24 characters",
  },
  hasLowercase: {
    test: (pwd) => /[a-z]/.test(pwd),
    message: "At least 1 lowercase letter",
  },
  hasUppercase: {
    test: (pwd) => /[A-Z]/.test(pwd),
    message: "At least 1 uppercase letter",
  },
  hasNumber: {
    test: (pwd) => /\d/.test(pwd),
    message: "At least 1 number",
  },
  hasSpecialChar: {
    test: (pwd) => /[@$!%*?&]/.test(pwd),
    message: "At least 1 special character (@$!%*?&)",
  },
};

// validate password against all requirements
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, errors: [], passedChecks: [] };
  }

  const errors = [];
  const passedChecks = [];

  Object.entries(passwordRequirements).forEach(([key, requirement]) => {
    if (requirement.test(password)) {
      passedChecks.push(key);
    } else {
      errors.push({ key, message: requirement.message });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    passedChecks,
  };
};

// check if passwords match
export const checkPasswordsMatch = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, isEmpty: true };
  return {
    isValid: password === confirmPassword,
    isEmpty: false,
  };
};

// check if new password is different from old password
export const checkNewPasswordDifferent = (oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) return { isValid: true, isEmpty: true };
  return {
    isValid: oldPassword !== newPassword,
    isEmpty: false,
  };
};

// get password strength level (for optional strength indicator)
export const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: "" };
  
  const validation = validatePassword(password);
  const passedCount = validation.passedChecks.length;
  const totalChecks = Object.keys(passwordRequirements).length;
  
  if (passedCount === totalChecks) {
    return { level: 3, label: "Strong" };
  } else if (passedCount >= 4) {
    return { level: 2, label: "Medium" };
  } else if (passedCount >= 2) {
    return { level: 1, label: "Weak" };
  }
  return { level: 0, label: "Very Weak" };
};
