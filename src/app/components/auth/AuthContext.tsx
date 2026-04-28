import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  loginMember,
  signupMember,
  logoutMemberAsync,
  verifyAuth,
  AuthMember,
} from "@/store/slices/authSlice";

interface AuthContextType {
  user: AuthMember | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (memberNick: string, memberPassword: string) => Promise<void>;
  logout: () => void;       // confirm dialog ochadi
  confirmLogout: () => void; // haqiqatda logout qiladi
  cancelLogout: () => void;  // dialogni yopadi
  showLogoutConfirm: boolean;
  register: (memberNick: string, memberPhone: string, memberPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { member, loading, error } = useAppSelector((state) => state.auth);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // On app load, try to restore session from cookie
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  const login = async (memberNick: string, memberPassword: string) => {
    await dispatch(loginMember({ memberNick, memberPassword })).unwrap();
  };

  // Logout bosilganda — faqat confirm dialog ko'rsatadi
  const logout = () => {
    setShowLogoutConfirm(true);
  };

  // Dialog "Ha" bosilganda — backend logout + local state tozalash
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logoutMemberAsync());
  };

  // Dialog "Yo'q" bosilganda — yopish
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const register = async (memberNick: string, memberPhone: string, memberPassword: string) => {
    await dispatch(signupMember({ memberNick, memberPhone, memberPassword })).unwrap();
  };

  return (
    <AuthContext.Provider
      value={{
        user: member,
        isAuthenticated: !!member,
        loading,
        error,
        login,
        logout,
        confirmLogout,
        cancelLogout,
        showLogoutConfirm,
        register,
      }}
    >
      {/* Qizil Logout Confirm Dialog — global, har yerda ishlaydi */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "1px solid #ef4444",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 0 40px rgba(239,68,68,0.3)",
              textAlign: "center",
            }}
          >
            {/* Qizil icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(239,68,68,0.15)",
                border: "2px solid #ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h3 style={{ color: "#ef4444", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
              Logout
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
              Are you sure you want to log out?
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              {/* Cancel */}
              <button
                onClick={cancelLogout}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>

              {/* Confirm logout */}
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
