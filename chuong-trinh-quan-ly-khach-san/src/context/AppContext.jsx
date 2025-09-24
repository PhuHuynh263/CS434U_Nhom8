import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Auth Context
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    await authAPI.logout();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// App Context for general app state
const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.payload };
    case "CLEAR_SUCCESS_MESSAGE":
      return { ...state, successMessage: null };
    default:
      return state;
  }
};

const appInitialState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, appInitialState);

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setSuccessMessage = (message) => {
    dispatch({ type: "SET_SUCCESS_MESSAGE", payload: message });
  };

  const clearSuccessMessage = () => {
    dispatch({ type: "CLEAR_SUCCESS_MESSAGE" });
  };

  const showNotification = (message, type = "info") => {
    if (type === "success") {
      setSuccessMessage(message);
      // Auto clear after 3 seconds
      setTimeout(clearSuccessMessage, 3000);
    } else if (type === "error") {
      setError(message);
      // Auto clear after 5 seconds
      setTimeout(clearError, 5000);
    }
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setSuccessMessage,
    clearSuccessMessage,
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
