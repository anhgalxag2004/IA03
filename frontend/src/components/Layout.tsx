import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserProfile, useLogout } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useUserProfile();
  const logoutMutation = useLogout();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-[var(--primary)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-semibold text-[var(--text-on-primary)]">
                  IA03 | Simple Auth
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-white/20 text-[var(--text-on-primary)]"
                    : "text-[var(--text-on-primary)] hover:bg-white/10"
                }`}
              >
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "bg-white/20 text-[var(--text-on-primary)]"
                        : "text-[var(--text-on-primary)] hover:bg-white/10"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="px-3 py-2 rounded-md text-sm font-medium text-[var(--text-on-primary)] hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/login")
                        ? "bg-white/20 text-[var(--text-on-primary)]"
                        : "text-[var(--text-on-primary)] hover:bg-white/10"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/signup")
                        ? "bg-white/20 text-[var(--text-on-primary)]"
                        : "text-[var(--text-on-primary)] hover:bg-white/10"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};
