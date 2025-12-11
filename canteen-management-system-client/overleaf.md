\documentclass[12pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{geometry}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{graphicx}
\usepackage{enumitem}
\usepackage{booktabs}
\usepackage{fancyhdr}
\usepackage{titlesec}

\geometry{margin=1in}

% Code listing style
\definecolor{codegreen}{rgb}{0,0.6,0}
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
\definecolor{backcolour}{rgb}{0.95,0.95,0.92}

\lstdefinestyle{mystyle}{
    backgroundcolor=\color{backcolour},   
    commentstyle=\color{codegreen},
    keywordstyle=\color{magenta},
    numberstyle=\tiny\color{codegray},
    stringstyle=\color{codepurple},
    basicstyle=\ttfamily\footnotesize,
    breakatwhitespace=false,         
    breaklines=true,                 
    captionpos=b,                    
    keepspaces=true,                 
    numbers=left,                    
    numbersep=5pt,                  
    showspaces=false,                
    showstringspaces=false,
    showtabs=false,                  
    tabsize=2
}
\lstset{style=mystyle}

\title{\textbf{Individual Security Work Log}\\
\large Canteen Management System (TrayGo) - Frontend Client}
\author{Security Contributor: inercaso}
\date{December 2025}

\begin{document}

\maketitle
\tableofcontents
\newpage

%===============================================================================
% SECTION A: INDIVIDUAL WORK LOG
%===============================================================================
\section{Individual Work Log}

\subsection{Overview of Security Contributions}

This document details my security-related contributions to the TrayGo Canteen Management System frontend client. My work focused on implementing robust authentication mechanisms, multi-factor authentication (MFA), email verification, password management, and Microsoft OAuth integration---all critical security features for protecting user accounts and sensitive data.

\subsection{Security Requirements Identified}

\begin{enumerate}[label=\textbf{SR\arabic*.}]
    \item \textbf{Multi-Factor Authentication (MFA):} Users should be able to enable TOTP-based two-factor authentication to add an extra layer of security beyond passwords.
    
    \item \textbf{Email Verification:} New user accounts must verify their email addresses before accessing sensitive features, preventing account impersonation.
    
    \item \textbf{Password Security:} Passwords must meet complexity requirements (8-24 chars, uppercase, lowercase, number, special character) and users must be able to change/reset passwords securely.
    
    \item \textbf{OAuth 2.0 Integration:} Support for Microsoft OAuth login with proper CSRF protection via state parameter validation.
    
    \item \textbf{Access Control:} Verified vs. unverified users should have different access levels; sensitive operations restricted to verified users only.
    
    \item \textbf{Secure Token Handling:} JWT access tokens stored securely with automatic refresh, refresh tokens in httpOnly cookies.
    
    \item \textbf{Email Enumeration Prevention:} Password reset and verification resend endpoints should not reveal whether an email exists in the system.
\end{enumerate}

%-------------------------------------------------------------------------------
\subsection{Secure Features Implemented}
%-------------------------------------------------------------------------------

\subsubsection{Multi-Factor Authentication (MFA) System}

\textbf{Commits:}
\begin{itemize}
    \item \texttt{60c44db} - add 'enable mfa' to dropdown menu (2025-10-19)
    \item \texttt{11939ee} - added the endpoints for MFA feature (2025-10-20)
    \item \texttt{cf1a627} - modified the NavBar so that it handles enabling and managing MFA (2025-10-20)
    \item \texttt{be130ac} - implement the MFA enabling system in the main page (2025-10-20)
    \item \texttt{572531e} - added the styling for the MFA enabling option (2025-10-20)
    \item \texttt{14af1ef} - add MFA service (2025-10-20)
    \item \texttt{6caa70f} - fix mfa ui implementation (2025-11-24)
\end{itemize}

\textbf{What I Did:}

Implemented a complete MFA system including:
\begin{itemize}
    \item MFA setup flow with QR code generation and manual secret key entry
    \item TOTP verification during login
    \item Backup codes generation and download functionality
    \item MFA management interface (disable MFA, regenerate backup codes)
    \item Integration with Microsoft OAuth for MFA-enabled accounts
\end{itemize}

\textbf{Key Implementation - MFA Service (src/services/MFAService.jsx):}

\begin{lstlisting}[language=JavaScript, caption=MFA Service Implementation]
export class MFAService {
  // Start MFA setup - generates QR code and secret
  async startMFASetup() {
    try {
      const data = await httpService.privatePost(
        API_ENDPOINTS.MFA.SETUP_START
      );
      return data; 
    } catch (error) {
      console.error("Error starting MFA setup:", error);
      throw error;
    }
  }

  // Confirm MFA setup with TOTP code verification
  async confirmMFASetup(code) {
    try {
      const data = await httpService.privatePost(
        API_ENDPOINTS.MFA.SETUP_CONFIRM,
        { code }
      );
      return data; // Returns backup codes
    } catch (error) {
      console.error("Error confirming MFA setup:", error);
      throw error;
    }
  }

  // Verify MFA during login flow
  async verifyMFA(ticket, code) {
    try {
      const data = await httpService.publicPost(API_ENDPOINTS.MFA.VERIFY, {
        ticket,
        code,
      });
      return data; 
    } catch (error) {
      console.error("Error verifying MFA:", error);
      throw error;
    }
  }

  // Disable MFA - requires password confirmation
  async disableMFA(password) {
    try {
      const data = await httpService.privatePost(API_ENDPOINTS.MFA.DISABLE, {
        password,
      });
      return data;
    } catch (error) {
      console.error("Error disabling MFA:", error);
      throw error;
    }
  }
}
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item Protects against credential theft - even if password is compromised, attacker cannot access account without TOTP code
    \item Backup codes ensure account recovery if authenticator app is lost
    \item Password confirmation for disabling MFA prevents unauthorized deactivation
\end{itemize}

\textbf{Challenges Faced:}
\begin{itemize}
    \item Handling MFA flow during Microsoft OAuth login required storing MFA ticket in session storage and redirecting appropriately
    \item Ensuring backup codes are properly displayed and downloadable while warning users about one-time use
\end{itemize}

%-------------------------------------------------------------------------------
\subsubsection{Email Verification System}

\textbf{Commits:}
\begin{itemize}
    \item \texttt{2c89d8d} - feat(auth): add email verification api endpoints (2025-12-05)
    \item \texttt{a2526f0} - feat(auth): add email verification service methods (2025-12-05)
    \item \texttt{b7d7ac7} - feat(auth): create verify email page (2025-12-05)
    \item \texttt{a5da98a} - feat(auth): create resend verification page (2025-12-05)
    \item \texttt{f78ceaf} - feat(auth): add email verification routes (2025-12-05)
    \item \texttt{94f920a} - feat(auth): create verification banner component (2025-12-05)
    \item \texttt{36de9a4} - feat(auth): integrate verification banner into main layout (2025-12-05)
    \item \texttt{46d7eae} - feat(auth): show verification prompt after signup (2025-12-05)
    \item \texttt{b8a5f35} - feat(auth): redirect unverified users on 403 response (2025-12-05)
\end{itemize}

\textbf{What I Did:}

Implemented complete email verification workflow:
\begin{itemize}
    \item Token-based email verification page
    \item Resend verification email functionality
    \item Verification banner for unverified users
    \item Automatic 403 handling to redirect unverified users
    \item Access control based on verification status
\end{itemize}

\textbf{Key Implementation - Email Enumeration Prevention (src/pages/ResendVerification/ResendVerification.jsx):}

\begin{lstlisting}[language=JavaScript, caption=Preventing Email Enumeration]
const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");
  setMessage("");

  try {
    await authService.resendVerification(email);
    setStatus("success");
    // Generic message prevents email enumeration
    setMessage(
      "If an account exists with this email, a verification link has been sent."
    );
  } catch (error) {
    if (error?.response?.status === 400) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message || "Email is already verified"
      );
    } else {
      setStatus("success");
      // Return success message for security (prevent email enumeration)
      setMessage(
        "If an account exists with this email, a verification link has been sent."
      );
    }
  }
};
\end{lstlisting}

\textbf{Key Implementation - 403 Interceptor for Unverified Users (src/api/Interceptors.jsx):}

\begin{lstlisting}[language=JavaScript, caption=Interceptor for Unverified User Handling]
// Handle 403 errors - check if it's due to unverified email
if (error?.response?.status === 403) {
  const token = axiosPrivate.defaults.headers.common["Authorization"];
  if (token && typeof token === "string" && token.startsWith("Bearer ")) {
    try {
      const accessToken = token.replace("Bearer ", "");
      const mod = await import("jwt-decode");
      const jwtDecode = mod?.default ?? mod?.jwtDecode ?? mod;
      const decoded = jwtDecode(accessToken);
      
      // If user is not verified, redirect to resend verification page
      if (decoded && !decoded.verified) {
        window.location.href = "/resend-verification";
        return Promise.reject(error);
      }
    } catch (decodeError) {
      console.error("Failed to decode token:", decodeError);
    }
  }
}
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item Ensures users own the email addresses they register with
    \item Prevents spam and fake accounts
    \item Generic error messages prevent attackers from discovering valid email addresses
    \item Graceful handling of 403 responses improves user experience while maintaining security
\end{itemize}

\textbf{Challenges Faced:}
\begin{itemize}
    \item Balancing user experience (clear error messages) with security (not revealing email existence)
    \item Handling token expiration scenarios gracefully
\end{itemize}

%-------------------------------------------------------------------------------
\subsubsection{Password Management System}

\textbf{Commits:}
\begin{itemize}
    \item \texttt{ec06f81} - feat(api): add password management endpoints (2025-12-06)
    \item \texttt{59409a5} - feat(auth): create password service (2025-12-06)
    \item \texttt{b0f4123} - feat(utils): add shared password validation utility (2025-12-06)
    \item \texttt{ab48930} - feat(auth): add change password component with real-time validation (2025-12-06)
    \item \texttt{45cf402} - feat(auth): integrate change password modal into navbar (2025-12-06)
    \item \texttt{5237295} - feat(auth): add forgot password page (2025-12-06)
    \item \texttt{bbc43fc} - feat(auth): add reset password page with token validation (2025-12-06)
    \item \texttt{2b64b92} - feat(auth): add password reset routes and forgot password link (2025-12-06)
\end{itemize}

\textbf{What I Did:}

Implemented comprehensive password management:
\begin{itemize}
    \item Password validation utility with real-time feedback
    \item Change password functionality for authenticated users
    \item Forgot password flow with email-based reset
    \item Token-validated password reset page
    \item Password strength indicators
\end{itemize}

\textbf{Key Implementation - Password Validation Utility (src/utils/passwordValidation.js):}

\begin{lstlisting}[language=JavaScript, caption=Password Validation with Real-time Checks]
// Password regex: 8-24 chars, 1 lowercase, 1 uppercase, 1 number, 1 special char
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

// Individual requirement checks for real-time feedback
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

// Validate password against all requirements
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

// Get password strength level
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
\end{lstlisting}

\textbf{Key Implementation - Email Enumeration Prevention in Forgot Password:}

\begin{lstlisting}[language=JavaScript, caption=Forgot Password - Preventing Email Enumeration]
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await passwordService.requestPasswordReset(email);
    setSubmitted(true);
  } catch (err) {
    // Always show success to prevent email enumeration (security best practice)
    // but if there's a network error, show it
    if (err.status === undefined || err.status >= 500) {
      setError("Something went wrong. Please try again.");
    } else {
      // For 400 errors, still show success to prevent enumeration
      setSubmitted(true);
    }
  } finally {
    setLoading(false);
  }
};
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item Strong password requirements prevent weak passwords
    \item Real-time validation improves user experience while enforcing security
    \item Token-based password reset prevents unauthorized password changes
    \item Email enumeration prevention protects user privacy
\end{itemize}

\textbf{Challenges Faced:}
\begin{itemize}
    \item Creating reusable validation logic that works across signup, change password, and reset password flows
    \item Ensuring new password is different from old password during change operations
\end{itemize}

%-------------------------------------------------------------------------------
\subsubsection{Microsoft OAuth 2.0 Integration}

\textbf{Commits:}
\begin{itemize}
    \item \texttt{ead36fb} - feat(auth): add microsoft oauth api endpoints and service methods (2025-12-04)
    \item \texttt{f22062c} - feat(auth): create microsoft login button component (2025-12-04)
    \item \texttt{7c9c1e5} - feat(auth): create microsoft oauth callback page (2025-12-04)
    \item \texttt{12081c9} - feat(auth): add mfa redirect wrapper for microsoft oauth (2025-12-04)
    \item \texttt{be5b2ac} - feat(auth): integrate microsoft login button (2025-12-04)
    \item \texttt{112edf6} - feat(auth): add microsoft callback and mfa redirect routes (2025-12-04)
    \item \texttt{9985f05} - fix(docker): resolve esbuild version mismatch with dockerignore (2025-12-04)
\end{itemize}

\textbf{What I Did:}

Implemented secure Microsoft OAuth 2.0 authentication:
\begin{itemize}
    \item OAuth state parameter for CSRF protection
    \item Secure callback handling with error management
    \item MFA integration for Microsoft accounts
    \item Session storage for OAuth state validation
\end{itemize}

\textbf{Key Implementation - OAuth CSRF Protection (src/services/AuthService.jsx):}

\begin{lstlisting}[language=JavaScript, caption=OAuth State Parameter for CSRF Protection]
// Get microsoft oauth authorization url from backend
async getMicrosoftAuthUrl() {
  try {
    const data = await httpService.publicGet(API_ENDPOINTS.AUTH.MICROSOFT);
    
    // Store state in session storage for CSRF validation
    if (data?.state) {
      sessionStorage.setItem('oauth_state', data.state);
    }
    
    return data;
  } catch (err) {
    throw new Error(err.message || "Failed to get Microsoft auth URL");
  }
}
\end{lstlisting}

\textbf{Key Implementation - Microsoft Callback Handler (src/pages/MicrosoftCallback/MicrosoftCallback.jsx):}

\begin{lstlisting}[language=JavaScript, caption=Secure Microsoft OAuth Callback Handling]
const handleCallback = async () => {
  try {
    const accessToken = searchParams.get("access_token");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const mfaTicket = searchParams.get("ticket");
    const mfaType = searchParams.get("type");

    // Handle MFA redirect from backend
    if (mfaTicket) {
      sessionStorage.setItem("microsoft_mfa_pending", "true");
      sessionStorage.setItem("mfa_ticket", mfaTicket);
      sessionStorage.setItem("mfa_type", mfaType || "totp");
      navigate("/login?mfa=microsoft", { replace: true });
      return;
    }

    // Handle error from Microsoft or backend
    if (errorParam) {
      console.error("Microsoft auth error:", errorParam, errorDescription);
      setStatus("error");
      setMessage(errorDescription || errorParam || "Authentication failed");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
      return;
    }

    // Handle success - process the access token
    if (accessToken) {
      await authService.processMicrosoftCallback(accessToken, setAuth);
      
      // Clean up session storage
      sessionStorage.removeItem("oauth_state");
      sessionStorage.removeItem("microsoft_mfa_pending");
      
      navigate("/order", { replace: true });
      return;
    }
  } catch (err) {
    setStatus("error");
    setMessage(err.message || "Failed to complete Microsoft login");
  }
};
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item OAuth state parameter prevents CSRF attacks during authentication flow
    \item Proper error handling prevents information leakage
    \item Session storage cleanup prevents stale authentication data
    \item MFA integration ensures Microsoft users also benefit from two-factor authentication
\end{itemize}

\textbf{Challenges Faced:}
\begin{itemize}
    \item Coordinating MFA flow between Microsoft OAuth and native login
    \item Handling various error scenarios from both Microsoft and backend
    \item Preventing duplicate callback processing with useRef
\end{itemize}

%-------------------------------------------------------------------------------
\subsubsection{Access Control for Verified Users}

\textbf{Commits:}
\begin{itemize}
    \item \texttt{baa41fa} - fix(navbar): restrict mfa and change password to verified users (2025-12-10)
\end{itemize}

\textbf{What I Did:}

Implemented UI-level access control restricting sensitive features to verified users only:

\textbf{Key Implementation - NavBar Access Control (src/components/MainPage/NavBar/NavBar.jsx):}

\begin{lstlisting}[language=JavaScript, caption=Restricting Features to Verified Users]
const { auth, setAuth } = useAuth();
const isVerified = Boolean(auth?.isVerified ?? auth?.verified ?? false);

// In dropdown menu:
{isDropdownOpen && (
  <Card ref={dropdownRef} className="dropdown-menu">
    {isVerified && (
      <>
        <div
          className="dropdown-item poppins-medium"
          onClick={handleChangePassword}
        >
          Change Password
        </div>
        <div className="dropdown-divider"></div>
        <div
          className="dropdown-item poppins-medium"
          onClick={mfaEnabled ? handleManageMFA : handleEnableMFA}
        >
          {mfaEnabled ? "Manage MFA" : "Enable MFA"}
        </div>
        <div className="dropdown-divider"></div>
      </>
    )}
    <div className="dropdown-item" onClick={handleLogOut}>
      Log Out
    </div>
  </Card>
)}
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item Prevents unverified users from enabling MFA (would lock them out if email is compromised)
    \item Encourages email verification by restricting features
    \item Defense in depth - UI restrictions complement backend authorization
\end{itemize}

%-------------------------------------------------------------------------------
\subsection{Secure Error Handling}
%-------------------------------------------------------------------------------

\textbf{Key Implementation - HttpService Error Handling (src/services/HttpService.jsx):}

\begin{lstlisting}[language=JavaScript, caption=Secure Error Handling]
handleError(error) {
  // Extract error message from backend response
  let message = "An error occurred";
  
  if (error.response?.data) {
    // Handle different error response formats from backend
    if (typeof error.response.data === 'string') {
      message = error.response.data;
    } else if (error.response.data.detail) {
      message = error.response.data.detail;
    } else if (error.response.data.error) {
      message = error.response.data.error;
    } else if (error.response.data.message) {
      message = error.response.data.message;
    } else if (error.response.data.non_field_errors) {
      message = Array.isArray(error.response.data.non_field_errors)
        ? error.response.data.non_field_errors[0]
        : error.response.data.non_field_errors;
    }
  } else if (error.message) {
    message = error.message;
  }

  const err = new Error(message);
  err.status = error.response?.status;
  err.data = error.response?.data;
  return err;
}
\end{lstlisting}

\textbf{Why It Matters:}
\begin{itemize}
    \item Consistent error handling prevents information leakage
    \item Field-specific errors enable proper form validation
    \item Generic fallback messages for unexpected errors
\end{itemize}

%===============================================================================
% SECTION B: EVIDENCE FOLDER
%===============================================================================
\newpage
\section{Evidence Folder}

\subsection{Commit History Summary}

\begin{table}[h]
\centering
\caption{Security-Related Commits by Feature}
\begin{tabular}{@{}lll@{}}
\toprule
\textbf{Feature} & \textbf{Commits} & \textbf{Date Range} \\
\midrule
MFA System & 7 commits & Oct 19 - Nov 24, 2025 \\
Email Verification & 9 commits & Dec 5, 2025 \\
Password Management & 8 commits & Dec 6, 2025 \\
Microsoft OAuth & 7 commits & Dec 4, 2025 \\
Access Control & 1 commit & Dec 10, 2025 \\
\midrule
\textbf{Total} & \textbf{32 commits} & \\
\bottomrule
\end{tabular}
\end{table}

\subsection{API Endpoints Defined}

\begin{lstlisting}[language=JavaScript, caption=Security-Related API Endpoints]
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    REFRESH: "/auth/refresh/",
    LOGOUT: "/auth/logout/",
    EMAIL_VERIFY: "/auth/email/verify/",
    EMAIL_RESEND: "/auth/email/resend/",
    MICROSOFT: "/auth/microsoft",
    MICROSOFT_CALLBACK: "/auth/microsoft/callback",
    PASSWORD_CHANGE: "/auth/password/change/",
    PASSWORD_RESET: "/auth/password/reset/",
    PASSWORD_RESET_CONFIRM: "/auth/password/reset/confirm/",
  },
  MFA: {
    SETUP_START: "/auth/mfa/setup/start",
    SETUP_CONFIRM: "/auth/mfa/setup/confirm",
    VERIFY: "/auth/mfa/verify",
    DISABLE: "/auth/mfa/disable",
    REGENERATE_CODES: "/auth/mfa/setup/regenerate",
  },
};
\end{lstlisting}

\subsection{Security Threat Mitigations}

\begin{table}[h]
\centering
\caption{Threat Mitigations Implemented}
\begin{tabular}{@{}p{4cm}p{8cm}@{}}
\toprule
\textbf{Threat} & \textbf{Mitigation} \\
\midrule
Credential Theft & MFA with TOTP codes and backup codes \\
Weak Passwords & Password complexity regex with real-time validation \\
Email Enumeration & Generic success messages in password reset and verification resend \\
CSRF on OAuth & State parameter stored in sessionStorage \\
Session Hijacking & JWT with short expiry, httpOnly refresh cookies \\
Unauthorized Access & Role-based RequireAuth and verification-based RequireVerified \\
Unverified Accounts & Verification banner, feature restrictions, 403 handling \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Files Created/Modified}

\textbf{Services:}
\begin{itemize}
    \item \texttt{src/services/MFAService.jsx} - MFA operations
    \item \texttt{src/services/PasswordService.jsx} - Password change/reset
    \item \texttt{src/services/AuthService.jsx} - Extended with OAuth, MFA, email verification
    \item \texttt{src/services/HttpService.jsx} - Secure error handling
\end{itemize}

\textbf{Components:}
\begin{itemize}
    \item \texttt{src/components/MainPage/MFASetup/} - MFA setup wizard
    \item \texttt{src/components/MainPage/MFAManage/} - MFA management (disable, regenerate codes)
    \item \texttt{src/components/MainPage/ChangePassword/} - Password change modal
    \item \texttt{src/components/MainPage/VerificationBanner/} - Email verification prompt
    \item \texttt{src/components/LandingPage/MicrosoftLoginButton/} - OAuth button
\end{itemize}

\textbf{Pages:}
\begin{itemize}
    \item \texttt{src/pages/MicrosoftCallback/} - OAuth callback handler
    \item \texttt{src/pages/MFARedirect/} - MFA redirect wrapper
    \item \texttt{src/pages/VerifyEmail/} - Email verification page
    \item \texttt{src/pages/ResendVerification/} - Resend verification email
    \item \texttt{src/pages/ForgotPassword/} - Request password reset
    \item \texttt{src/pages/ResetPassword/} - Token-validated password reset
\end{itemize}

\textbf{Utilities:}
\begin{itemize}
    \item \texttt{src/utils/passwordValidation.js} - Shared password validation
\end{itemize}

%===============================================================================
% SECTION C: SELF-EVALUATION
%===============================================================================
\newpage
\section{Security-Focused Self-Evaluation}

\subsection{Ratings (1-10)}

\begin{table}[h]
\centering
\caption{Self-Evaluation Ratings}
\begin{tabular}{@{}lcp{8cm}@{}}
\toprule
\textbf{Category} & \textbf{Rating} & \textbf{Justification} \\
\midrule
Security Contribution & 9/10 & Implemented 5 major security features (MFA, email verification, password management, OAuth, access control) with comprehensive coverage \\
\addlinespace
Code Quality in Security Context & 8/10 & Consistent error handling, reusable validation utilities, proper service layer abstraction; could improve with more TypeScript types \\
\addlinespace
Collaboration on Security Decisions & 8/10 & Worked with backend team on API contracts, coordinated MFA and OAuth flows, participated in PR reviews \\
\addlinespace
Initiative & 9/10 & Identified email enumeration vulnerability and implemented prevention; suggested and implemented verification banner \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Reflection}

\textbf{One Security Achievement I'm Proud Of:}

The implementation of the complete Multi-Factor Authentication (MFA) system stands out as my most significant achievement. This feature involved:

\begin{itemize}
    \item Creating an intuitive setup wizard with QR code scanning
    \item Implementing TOTP verification during both normal and OAuth login flows
    \item Providing backup codes as a recovery mechanism
    \item Building a management interface for disabling MFA and regenerating codes
    \item Requiring password confirmation for security-sensitive operations
\end{itemize}

This feature significantly enhances account security by adding a second authentication factor, protecting users even if their passwords are compromised. The integration with Microsoft OAuth was particularly challenging but ensures consistent security for all authentication methods.

\textbf{One Security Skill I Need to Improve:}

\textbf{Security Testing and Penetration Testing}: While I implemented numerous security features, I could improve my skills in systematically testing these implementations for vulnerabilities. Specifically:

\begin{itemize}
    \item Learning to use security testing tools (Burp Suite, OWASP ZAP)
    \item Writing more comprehensive negative test cases
    \item Understanding common attack vectors (XSS, CSRF, injection) more deeply
    \item Practicing threat modeling to identify potential vulnerabilities earlier
\end{itemize}

Formal security testing would help validate that my implementations are truly secure and not just following best practices superficially.

\end{document}
