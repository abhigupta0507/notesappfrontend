import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Crown,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const AdminView = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getNotesStats(token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      setError("Failed to load statistics");
    }
    setLoading(false);
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.inviteUser(
        token,
        inviteForm.email,
        inviteForm.role
      );
      if (response.success) {
        setSuccess(
          `User invited successfully! Default password: ${response.defaultPassword}`
        );
        setInviteForm({ email: "", role: "member" });
        setShowInviteForm(false);
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to invite user");
    }
  };

  const handleUpgrade = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await api.upgradeTenant(token, user.tenant.slug);
      if (response.success) {
        setSuccess("Successfully upgraded to Pro plan!");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to upgrade plan");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-400 hover:text-green-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <button
          onClick={() => setShowInviteForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.notesByUser.length}
                </div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalNotes}
                </div>
                <div className="text-sm text-gray-500">Total Notes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.subscription.plan.toUpperCase()}
                </div>
                <div className="text-sm text-gray-500">Current Plan</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.subscription.isPro ? "∞" : stats.subscription.maxNotes}
                </div>
                <div className="text-sm text-gray-500">Note Limit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Management */}
      {stats && !stats.subscription.isPro && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Subscription Management</h3>
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Free Plan Active
              </h4>
              <p className="text-sm text-yellow-700">
                You're currently on the free plan with limited features. Upgrade
                to Pro for unlimited notes and advanced features.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center flex-shrink-0 ml-4"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      {/* User Activity */}
      {stats && stats.notesByUser.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">User Activity</h3>
          <div className="space-y-3">
            {stats.notesByUser.map((userStat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {userStat.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userStat.count} notes created
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {userStat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite User Form */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Invite New User
              </h3>
              <form onSubmit={handleInviteUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteForm({ email: "", role: "member" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> The invited user will receive a default
                  password: "password" and should change it on first login.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!stats && !loading && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Admin Dashboard
          </h3>
          <p className="text-gray-500">
            Manage your tenant users and subscription from here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminView;
