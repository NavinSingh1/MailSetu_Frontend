import { createContext, useReducer, useEffect, useCallback } from "react";
import { TokenService, apiRefreshToken } from "../services/api";

// ─────────────────────────────────────────────
// Check if we are in mock mode
// ─────────────────────────────────────────────
const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
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
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, loading: false };

    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload.user };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.UPDATE_ACCESS:
      return { ...state, accessToken: action.payload.accessToken };

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

  // ─────────────────────────────────────────────
  // RESTORE SESSION ON APP START
  //
  // Scenario 1: access ✅ refresh ✅ user ✅
  //   → restore normally
  //
  // Scenario 2: access ❌ refresh ✅ user ✅
  //   → access deleted/expired
  //   → Mock mode:  generate new mock access token locally
  //   → Real mode:  call refresh API → get new access token
  //   → restore session → user stays on dashboard ✅
  //
  // Scenario 3: refresh ❌ or user ❌
  //   → full logout → go to login
  // ─────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {

      const accessToken  = TokenService.getAccess();
      const refreshToken = TokenService.getRefresh();
      const user         = TokenService.getUser();

      console.log("🔍 Session restore check:", {
        hasAccess:  !!accessToken,
        hasRefresh: !!refreshToken,
        hasUser:    !!user,
      });

      // ── Scenario 1: everything exists ─────────
      if (accessToken && refreshToken && user) {
        console.log("✅ Scenario 1: full session found");
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { accessToken, refreshToken, user },
        });
        return;
      }

      // ── Scenario 2: access missing ─────────────
      if (!accessToken && refreshToken && user) {
        console.log("🔄 Scenario 2: access token missing — restoring...");

        // ── Mock mode fix ──────────────────────────
        // In mock mode we don't have a real refresh API
        // So generate a new mock access token locally
        // and restore the session directly
        if (IS_MOCK) {
          console.log("⚙️ Mock mode — generating new mock access token");
          const mockUserId  = user.id || "mock-user";
          const newMockToken = `mock-access-${mockUserId}-${Date.now()}`;

          // Save new mock access token to localStorage
          TokenService.setAccess(newMockToken);

          console.log("✅ Mock session restored — user stays logged in");
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: {
              accessToken:  newMockToken,
              refreshToken: refreshToken,
              user:         user,
            },
          });
          return;
        }

        // ── Real mode: call refresh API ────────────
        try {
          console.log("📡 Real mode — calling refresh API...");
          const result = await apiRefreshToken();

          if (result.success) {
            const newAccessToken = result.data.access;
            TokenService.setAccess(newAccessToken);
            console.log("✅ Real session restored silently");
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: {
                accessToken:  newAccessToken,
                refreshToken: refreshToken,
                user:         user,
              },
            });
          } else {
            console.warn("⚠️ Refresh API failed — logging out");
            TokenService.clearAll();
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } catch (err) {
          console.error("❌ Refresh error:", err);
          TokenService.clearAll();
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
        return;
      }

      // ── Scenario 3: no session ─────────────────
      console.log("❌ Scenario 3: no session — go to login");
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };

    restoreSession();
  }, []);

  // ── Internal logout helper ─────────────────
  const handleLogout = useCallback(() => {
    TokenService.clearAll();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // ─────────────────────────────────────────────
  // SILENT REFRESH (proactive timer)
  // Only runs in real mode with real JWT tokens
  // ─────────────────────────────────────────────
  const silentRefresh = useCallback(async () => {
    if (IS_MOCK) return;

    const token = TokenService.getAccess();
    if (!token) return;
    if (token.startsWith("mock-")) return;

    try {
      const { jwtDecode } = await import("jwt-decode");
      const decoded  = jwtDecode(token);
      const expiry   = decoded.exp * 1000;
      const now      = Date.now();
      const timeLeft = expiry - now;

      console.log(`⏱ Token expires in ${Math.round(timeLeft / 1000)}s`);

      if (timeLeft < 5 * 60 * 1000) {
        console.log("🔄 Refreshing token proactively...");
        const result = await apiRefreshToken();
        if (result.success) {
          const newToken = result.data.access;
          TokenService.setAccess(newToken);
          dispatch({ type: AUTH_ACTIONS.UPDATE_ACCESS, payload: { accessToken: newToken } });
          console.log("✅ Token refreshed proactively");
        } else {
          handleLogout();
        }
      }
    } catch (err) {
      console.error("❌ Token error:", err);
      handleLogout();
    }
  }, [handleLogout]);

  // ── Proactive timer — real mode only ──────────
  useEffect(() => {
    if (!state.isAuthenticated) return;
    if (IS_MOCK) return;

    silentRefresh();
    const interval = setInterval(silentRefresh, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, silentRefresh]);

  // ── login() ───────────────────────────────
  const login = (accessToken, refreshToken, user) => {
    TokenService.setTokens(accessToken, refreshToken, user);
    dispatch({
      type: AUTH_ACTIONS.LOGIN,
      payload: { accessToken, refreshToken, user },
    });
  };

  // ── register() ────────────────────────────
  const register = (userData) => {
    console.log("Registered user:", userData);
  };

  // ── logout() ──────────────────────────────
  const logout = () => {
    handleLogout();
  };

  // ── setUser() ─────────────────────────────
  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}