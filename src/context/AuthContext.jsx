import { createContext, useReducer, useEffect, useCallback } from "react";
import { TokenService } from "../services/core";
import { apiRefreshToken } from "../services/authApi";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  isVerified:      false,   // email verified flag
  role:            null,    // "owner" | "admin" | etc.
  user:            null,    // { id, email, role, is_verified, first_name, last_name }
  accessToken:     null,
  refreshToken:    null,
  loading:         true,
};

// ─────────────────────────────────────────────
// Action Types
// ─────────────────────────────────────────────
export const AUTH_ACTIONS = {
  LOGIN:           "LOGIN",
  LOGOUT:          "LOGOUT",
  SET_USER:        "SET_USER",
  RESTORE_SESSION: "RESTORE_SESSION",
  SET_LOADING:     "SET_LOADING",
  UPDATE_ACCESS:   "UPDATE_ACCESS",
  SET_VERIFIED:    "SET_VERIFIED",
};

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {

    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        isVerified:      action.payload.user?.is_verified || false,
        role:            action.payload.user?.role        || null,
        user:            action.payload.user,
        accessToken:     action.payload.accessToken,
        refreshToken:    action.payload.refreshToken,
        loading:         false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, loading: false };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user:       action.payload.user,
        isVerified: action.payload.user?.is_verified || state.isVerified,
        role:       action.payload.user?.role        || state.role,
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        isVerified:      action.payload.user?.is_verified || false,
        role:            action.payload.user?.role        || null,
        user:            action.payload.user,
        accessToken:     action.payload.accessToken,
        refreshToken:    action.payload.refreshToken,
        loading:         false,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.UPDATE_ACCESS:
      return { ...state, accessToken: action.payload.accessToken };

    // Marks email as verified in state + localStorage
    case AUTH_ACTIONS.SET_VERIFIED:
      return {
        ...state,
        isVerified: true,
        user: state.user ? { ...state.user, is_verified: true } : state.user,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
export const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Restore session on app start ──────────
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken  = TokenService.getAccess();
      const refreshToken = TokenService.getRefresh();
      const user         = TokenService.getUser();

      // Scenario 1: everything exists → restore normally
      if (accessToken && refreshToken && user) {
        dispatch({ type: AUTH_ACTIONS.RESTORE_SESSION, payload: { accessToken, refreshToken, user } });
        return;
      }

      // Scenario 2: access missing but refresh + user exist → regenerate
      if (!accessToken && refreshToken && user) {
        if (IS_MOCK) {
          const newMockToken = `mock-access-${user.id || "user"}-${Date.now()}`;
          TokenService.setAccess(newMockToken);
          dispatch({ type: AUTH_ACTIONS.RESTORE_SESSION, payload: { accessToken: newMockToken, refreshToken, user } });
          return;
        }
        try {
          const result = await apiRefreshToken();
          if (result.success) {
            TokenService.setAccess(result.data.access);
            dispatch({ type: AUTH_ACTIONS.RESTORE_SESSION, payload: { accessToken: result.data.access, refreshToken, user } });
          } else {
            TokenService.clearAll();
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } catch {
          TokenService.clearAll();
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
        return;
      }

      // Scenario 3: no session → show login
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };
    restoreSession();
  }, []);

  // ── Logout helper ──────────────────────────
  const handleLogout = useCallback(() => {
    TokenService.clearAll();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // ── Silent refresh timer (real mode only) ──
  const silentRefresh = useCallback(async () => {
    if (IS_MOCK) return;
    const token = TokenService.getAccess();
    if (!token || token.startsWith("mock-")) return;
    try {
      const { jwtDecode } = await import("jwt-decode");
      const decoded  = jwtDecode(token);
      const timeLeft = decoded.exp * 1000 - Date.now();
      if (timeLeft < 5 * 60 * 1000) {
        const result = await apiRefreshToken();
        if (result.success) {
          TokenService.setAccess(result.data.access);
          dispatch({ type: AUTH_ACTIONS.UPDATE_ACCESS, payload: { accessToken: result.data.access } });
        } else {
          handleLogout();
        }
      }
    } catch { handleLogout(); }
  }, [handleLogout]);

  useEffect(() => {
    if (!state.isAuthenticated || IS_MOCK) return;
    silentRefresh();
    const interval = setInterval(silentRefresh, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, silentRefresh]);

  // ─────────────────────────────────────────────
  // login()
  // Called in LoginForm after POST /api/auth/login/
  // user: { id, email, role, is_verified, ... }
  // ─────────────────────────────────────────────
  const login = (accessToken, refreshToken, user) => {
    TokenService.setTokens(accessToken, refreshToken, user);
    dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { accessToken, refreshToken, user } });
  };

  // ─────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────
  const logout = () => handleLogout();

  // ─────────────────────────────────────────────
  // register()
  // Called in SignupForm — signup does NOT log in
  // ─────────────────────────────────────────────
  const register = (userData) => {
    console.log("Registered user:", userData);
  };

  // ─────────────────────────────────────────────
  // setUser()
  // Called after PATCH /api/users/me/
  // ─────────────────────────────────────────────
  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } });
  };

  // ─────────────────────────────────────────────
  // setVerified()
  // Call this after GET /api/auth/verify-email/ succeeds
  // Marks user as verified in state + localStorage
  // ─────────────────────────────────────────────
  const setVerified = () => {
    const user = TokenService.getUser();
    if (user) {
      const updated = { ...user, is_verified: true };
      localStorage.setItem("user", JSON.stringify(updated));
    }
    dispatch({ type: AUTH_ACTIONS.SET_VERIFIED });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login, logout, register, setUser, setVerified,
      isOwner: state.role === "owner",
      isAdmin: state.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
}