import { createContext, useReducer } from "react";

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialState = {
  notification: null,   // { message, type: "success" | "error" | "info" }
};

// ─────────────────────────────────────────────
// Action Types
// ─────────────────────────────────────────────
export const APP_ACTIONS = {
  SET_NOTIFICATION:   "SET_NOTIFICATION",
  CLEAR_NOTIFICATION: "CLEAR_NOTIFICATION",
};

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {

    case APP_ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    case APP_ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
export const AppContext = createContext(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ── Show a notification (auto-clears after 4 seconds) ──
  const showNotification = (message, type = "info") => {
    dispatch({
      type: APP_ACTIONS.SET_NOTIFICATION,
      payload: { message, type },
    });
    setTimeout(() => {
      dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATION });
    }, 4000);
  };

  const clearNotification = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATION });
  };

  return (
    <AppContext.Provider value={{ ...state, showNotification, clearNotification }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;