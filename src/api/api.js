// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URl;
console.log(process.env);
// API Helper Functions
export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getNotes: async (token, page = 1, search = "") => {
    const params = new URLSearchParams({ page, limit: 10 });
    if (search) params.append("search", search);

    const response = await fetch(`${API_BASE_URL}/notes?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  createNote: async (token, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  updateNote: async (token, noteId, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  deleteNote: async (token, noteId) => {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  upgradeTenant: async (token, tenantSlug) => {
    const response = await fetch(
      `${API_BASE_URL}/tenants/${tenantSlug}/upgrade`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  inviteUser: async (token, email, role = "member") => {
    const response = await fetch(`${API_BASE_URL}/auth/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });
    return response.json();
  },

  getNotesStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notes/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
