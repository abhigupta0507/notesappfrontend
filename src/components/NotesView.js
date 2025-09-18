import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Crown,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const NotesView = () => {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: [],
  });

  useEffect(() => {
    loadNotes();
    loadStats();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await api.getNotes(token, 1, searchTerm);
      if (response.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      setError("Failed to load notes");
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const response = await api.getNotesStats(token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createNote(token, noteForm);
      if (response.success) {
        setNotes([response.data.note, ...notes]);
        setNoteForm({ title: "", content: "", tags: [] });
        setShowCreateForm(false);
        loadStats();
        setError("");
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to create note");
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await api.updateNote(token, editingNote._id, noteForm);
      if (response.success) {
        setNotes(
          notes.map((note) =>
            note._id === editingNote._id ? response.data.note : note
          )
        );
        setEditingNote(null);
        setNoteForm({ title: "", content: "", tags: [] });
        setShowCreateForm(false);
        setError("");
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await api.deleteNote(token, noteId);
      if (response.success) {
        setNotes(notes.filter((note) => note._id !== noteId));
        loadStats();
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to delete note");
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await api.upgradeTenant(token, user.tenant.slug);
      if (response.success) {
        window.location.reload();
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to upgrade plan");
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNoteForm({ title: "", content: "", tags: [] });
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-600">Loading notes...</p>
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

      {/* Stats Card */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalNotes}
              </div>
              <div className="text-sm text-gray-500">Total Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.recentNotes}
              </div>
              <div className="text-sm text-gray-500">Recent Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.subscription.isPro ? "∞" : stats.subscription.maxNotes}
              </div>
              <div className="text-sm text-gray-500">Note Limit</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  stats.subscription.canCreateMore
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stats.subscription.canCreateMore ? "✓" : "✗"}
              </div>
              <div className="text-sm text-gray-500">Can Create</div>
            </div>
          </div>

          {!stats.subscription.isPro &&
            !stats.subscription.canCreateMore &&
            user.role === "admin" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Note limit reached!
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Upgrade to Pro for unlimited notes.
                    </p>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={stats && !stats.subscription.canCreateMore}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && loadNotes()}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={loadNotes}
            className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h3>
          <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={noteForm.title}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note title..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                rows={6}
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your note content..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingNote ? "Update Note" : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-900 truncate flex-1 mr-2">
                {note.title}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(note)}
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="Edit note"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p
              className="text-gray-600 text-sm mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {note.content}
            </p>
            <div className="text-xs text-gray-500 border-t pt-2">
              <div>By {note.author.email}</div>
              <div>{new Date(note.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notes.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Create your first note to get started."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={stats && !stats.subscription.canCreateMore}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              Create First Note
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesView;
