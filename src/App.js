import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import NotesView from "./components/NotesView";
import AdminView from "./components/AdminView";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("notes");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main>
        {currentView === "notes" && <NotesView />}
        {currentView === "admin" && user.role === "admin" && <AdminView />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
