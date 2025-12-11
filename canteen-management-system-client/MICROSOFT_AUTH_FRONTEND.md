# Microsoft OAuth Authentication - Frontend Setup

This guide explains how to set up Microsoft OAuth authentication in the React frontend to work with the Django backend.

## Architecture Overview

```
┌─────────────┐                     ┌──────────────────────────────┐                     ┌─────────────┐
│   React     │                     │   Microsoft Identity Platform │                     │   Django    │
│   Frontend  │                     │  login.microsoftonline.com    │                     │   Backend   │
│   + MSAL    │                     │                                │                     │   Web API   │
└──────┬──────┘                     └───────────────┬────────────────┘                     └──────┬──────┘
       │                                            │                                             │
       │  1. User clicks "Sign in with Microsoft"   │                                             │
       │                                            │                                             │
       │  2. MSAL redirects to Microsoft login      │                                             │
       │───────────────────────────────────────────>│                                             │
       │                                            │                                             │
       │  3. User authenticates & consents          │                                             │
       │                                            │                                             │
       │  4. Microsoft returns access_token         │                                             │
       │<───────────────────────────────────────────│                                             │
       │                                            │                                             │
       │  5. Frontend calls API with token          │                                             │
       │     Authorization: Bearer <ms_token>       │                                             │
       │────────────────────────────────────────────────────────────────────────────────────────>│
       │                                            │                                             │
       │  6. Backend validates token & returns data │                                             │
       │<────────────────────────────────────────────────────────────────────────────────────────│
```

**Key Point:** The frontend handles the entire OAuth flow. The backend only validates the Microsoft access token.

---

## Step 1: Install Dependencies

```bash
npm install @azure/msal-browser @azure/msal-react
```

---

## Step 2: Environment Variables on backend

Create or update your `.env` file:

```env
# Microsoft OAuth Configuration
VITE_MICROSOFT_CLIENT_ID=check env on telegr
VITE_MICROSOFT_TENANT_ID=check env on telegr
VITE_MICROSOFT_REDIRECT_URI=http://localhost:8080

# Backend API URL
VITE_API_URL=http://localhost:8000
```

---

## Step 3: Create MSAL Configuration

Create `src/config/msalConfig.ts`:

```typescript
import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage"
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes required for Microsoft Graph API
export const loginRequest = {
  scopes: ["User.Read"],
};

// API scopes (same as login for now)
export const apiRequest = {
  scopes: ["User.Read"],
};
```

---

## Step 4: Set Up MSAL Provider

Update `src/main.tsx` (or `src/index.tsx`):

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/msalConfig";
import App from "./App";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
msalInstance.initialize().then(() => {
  // Handle redirect callback
  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      msalInstance.setActiveAccount(response.account);
    }
  });

  // Set active account on login success
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as { account: any };
      msalInstance.setActiveAccount(payload.account);
    }
  });

  // Render app
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
});
```

---

## Step 5: Create Authentication Hook

Create `src/hooks/useMicrosoftAuth.ts`:

```typescript
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, apiRequest } from "../config/msalConfig";

export function useMicrosoftAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginRedirect = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login redirect failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!accounts[0]) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...apiRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      // If silent token acquisition fails, try interactive
      try {
        const response = await instance.acquireTokenPopup(apiRequest);
        return response.accessToken;
      } catch (interactiveError) {
        console.error("Token acquisition failed:", interactiveError);
        return null;
      }
    }
  };

  const user = accounts[0]
    ? {
        email: accounts[0].username,
        name: accounts[0].name,
      }
    : null;

  return {
    isAuthenticated,
    isLoading: inProgress !== InteractionStatus.None,
    user,
    login,
    loginRedirect,
    logout,
    getAccessToken,
  };
}
```

---

## Step 6: Create API Client

Create `src/services/api.ts`:

```typescript
import { useMicrosoftAuth } from "../hooks/useMicrosoftAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useApi() {
  const { getAccessToken } = useMicrosoftAuth();

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await getAccessToken();

    if (!token) {
      throw new Error("No access token available");
    }

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  const get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetchWithAuth(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  };

  const post = async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  };

  const put = async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  };

  const del = async (endpoint: string): Promise<void> => {
    const response = await fetchWithAuth(endpoint, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  };

  return { get, post, put, del, fetchWithAuth };
}
```

---

## Step 7: Create Login Component

Create `src/components/MicrosoftLoginButton.tsx`:

```typescript
import { useMicrosoftAuth } from "../hooks/useMicrosoftAuth";

export function MicrosoftLoginButton() {
  const { isAuthenticated, isLoading, user, login, logout } = useMicrosoftAuth();

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (isAuthenticated && user) {
    return (
      <div>
        <span>Welcome, {user.name || user.email}</span>
        <button onClick={logout}>Sign out</button>
      </div>
    );
  }

  return (
    <button onClick={login}>
      Sign in with Microsoft
    </button>
  );
}
```

---

## Step 8: Example Usage in a Component

```typescript
import { useEffect, useState } from "react";
import { useMicrosoftAuth } from "../hooks/useMicrosoftAuth";
import { useApi } from "../services/api";

function Dashboard() {
  const { isAuthenticated, user } = useMicrosoftAuth();
  const { get } = useApi();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch data from backend using Microsoft token
      get("/menus")
        .then(setMenus)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <p>Please sign in to view the dashboard.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <h2>Menus</h2>
      <ul>
        {menus.map((menu: any) => (
          <li key={menu.id}>{menu.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## How Token Validation Works

1. **Frontend** obtains Microsoft access token via MSAL
2. **Frontend** sends token in `Authorization: Bearer <token>` header
3. **Backend** `MicrosoftBearerAuthentication` class:
   - Detects Microsoft issuer in token
   - Fetches Microsoft's public keys (JWKS)
   - Validates token signature, issuer, audience, and expiry
   - Extracts user info (email, name) from token claims
   - Creates/updates local user in database
   - Sets `request.user` for the API view

---

## Token Refresh

MSAL handles token refresh automatically:

- Access tokens expire after ~1 hour
- `acquireTokenSilent()` automatically refreshes expired tokens
- If silent refresh fails, user may need to re-authenticate

---

## Troubleshooting

### CORS Errors
Make sure your frontend URL is in the backend's `CORS_ALLOWED_ORIGINS`:
```python
# config/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
]
```

### "Invalid audience" Error
Ensure `MICROSOFT_CLIENT_ID` in backend `.env` matches `VITE_MICROSOFT_CLIENT_ID` in frontend.

### "Invalid issuer" Error
Ensure `MICROSOFT_TENANT_ID` in backend `.env` matches `VITE_MICROSOFT_TENANT_ID` in frontend.

### Redirect URI Mismatch
The redirect URI in Azure Portal must **exactly match** `VITE_MICROSOFT_REDIRECT_URI`.

### Token Not Being Sent
Check browser DevTools → Network tab to verify `Authorization` header is present.

---

## Environment Summary

### Frontend `.env`
```env
VITE_MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MICROSOFT_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MICROSOFT_REDIRECT_URI=http://localhost:8080
VITE_API_URL=http://localhost:8000
```

### Backend `.env`
```env
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> ⚠️ **Important:** Both `CLIENT_ID` and `TENANT_ID` must be the same in frontend and backend!

---

## Azure Portal Configuration

| Setting | Value |
|---------|-------|
| **Platform** | Single-page application (SPA) |
| **Redirect URI** | `http://localhost:8080` |
| **API Permission** | `User.Read` (Delegated) |
| **Implicit grant** | Leave unchecked (using PKCE) |

