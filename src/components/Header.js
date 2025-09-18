import React from "react";
import { FileText, Crown, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.tenant.name} Notes
              </h1>
              <p className="text-sm text-gray-500">
                {user.tenant.subscription.plan === "pro" ? (
                  <span className="inline-flex items-center">
                    <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                    Pro Plan
                  </span>
                ) : (
                  "Free Plan"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView("notes")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === "notes"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Notes
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => setCurrentView("admin")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{user.email}</span>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                {user.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
