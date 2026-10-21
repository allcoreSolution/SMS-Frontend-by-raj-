import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  ArrowLeft, 
  Book, 
  Lightbulb, 
  Layers, 
  Globe, 
  Trash2, 
  Edit3, 
  Check, 
  HelpCircle,
  Eye,
  Sliders,
  FolderOpen,
  FolderTree,
  Lock,
  Search,
  Sparkles
} from "lucide-react";
import Swal from 'sweetalert2';
import { helpCenterService } from '../../api/helpCenterService';
import HelpCenterNav from './HelpCenterNav';

export default function KbCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states: "list" = Categories Dashboard; "add" / "edit" = Form view
  const [viewState, setViewState] = useState("list");
  const [editingId, setEditingId] = useState(null);

  const [catName, setCatName] = useState("");
  const [parentCat, setParentCat] = useState("— None (Root) —");
  const [iconChar, setIconChar] = useState("📖");
  const [catDescription, setCatDescription] = useState("");
  const [catVisibility, setCatVisibility] = useState("Public");
  const [catSortOrder, setCatSortOrder] = useState(0);
  const [catStatus, setCatStatus] = useState("Active");
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories from MongoDB
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await helpCenterService.getCategories();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      c.name?.toLowerCase().includes(s) ||
      c.description?.toLowerCase().includes(s)
    );
  });

  // Open "Add Category" form
  const handleOpenAddForm = () => {
    setEditingId(null);
    setCatName("");
    setParentCat("— None (Root) —");
    setIconChar("📖");
    setCatDescription("");
    setCatVisibility("Public");
    setCatSortOrder(categories.length + 1);
    setCatStatus("Active");
    setViewState("add");
  };

  // Open "Edit Category" form
  const handleOpenEditForm = (cat) => {
    setEditingId(cat._id);
    setCatName(cat.name || "");
    setParentCat(cat.parentCategory || "— None (Root) —");
    setIconChar(cat.icon || "📖");
    setCatDescription(cat.description || "");
    setCatVisibility(cat.visibility || "Public");
    setCatSortOrder(cat.sortOrder || 0);
    setCatStatus(cat.status || "Active");
    setViewState("add");
  };

  // Submit / Save Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      Swal.fire({ icon: "warning", title: "Missing Name", text: "Please enter category name." });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: catName.trim(),
        parentCategory: parentCat,
        icon: iconChar,
        description: catDescription.trim(),
        visibility: catVisibility,
        sortOrder: Number(catSortOrder) || 0,
        status: catStatus
      };

      let res;
      if (editingId) {
        res = await helpCenterService.updateCategory(editingId, payload);
      } else {
        res = await helpCenterService.createCategory(payload);
      }

      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: editingId ? "Category Updated!" : "Category Created!",
          timer: 1800,
          showConfirmButton: false
        });
        setViewState("list");
        fetchCategories();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save Error",
        text: err?.response?.data?.message || err.message || "Failed to save category."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat) => {
    const result = await Swal.fire({
      title: `Delete "${cat.name}"?`,
      text: "This category will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        const res = await helpCenterService.deleteCategory(cat._id);
        if (res?.success) {
          Swal.fire({
            icon: "success",
            title: "Category Deleted",
            timer: 1600,
            showConfirmButton: false
          });
          fetchCategories();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Error",
          text: err?.response?.data?.message || err.message || "Cannot delete category."
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Shared Navigation Header */}
      <HelpCenterNav
        counts={{
          categories: categories.length
        }}
        onRefresh={fetchCategories}
        loading={loading}
      />

      {viewState === "list" ? (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                <span>Knowledge Base Categories</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {categories.length} Categories
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize guides, manuals, and FAQs into structured institutional folders
              </p>
            </div>

            <button
              onClick={handleOpenAddForm}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Category</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search category name or description..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredCategories.length} of {categories.length}
            </span>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="p-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading categories from MongoDB...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No Categories Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? "No categories match your search query."
                  : "Create your first category to group school guides."}
              </p>
              <button
                onClick={handleOpenAddForm}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                + Add First Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shadow-xs shrink-0">
                          {cat.icon || "📖"}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {cat.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                              <Globe className="w-3 h-3 text-slate-400" />
                              <span>{cat.visibility || "Public"}</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {cat.status || "Active"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditForm(cat)}
                          title="Edit Category"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          title="Delete Category"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cat.description || "General collection of help articles and user guides."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {cat.articlesCount || 0} Articles
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Order: {cat.sortOrder || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* CREATE / EDIT FORM VIEW */
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewState("list")}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingId ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-xs text-slate-500">Configure category classification, icon and visibility</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
            {/* Category Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Online Examinations, Fee Waivers"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all text-xs sm:text-sm"
              />
            </div>

            {/* Icon Char & Visibility */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Category Emoji / Icon
                </label>
                <input
                  type="text"
                  value={iconChar}
                  onChange={(e) => setIconChar(e.target.value)}
                  placeholder="e.g. 🚀, 📚, 💼, 🚌, 💵"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Visibility</label>
                <select
                  value={catVisibility}
                  onChange={(e) => setCatVisibility(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
                >
                  <option value="Public">Public (All Users)</option>
                  <option value="Internal">Internal (Staff Only)</option>
                  <option value="Private">Private (Admin Only)</option>
                </select>
              </div>
            </div>

            {/* Parent Category & Sort Order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Parent Category</label>
                <select
                  value={parentCat}
                  onChange={(e) => setParentCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
                >
                  <option value="— None (Root) —">— None (Root Category) —</option>
                  {categories.filter(c => c._id !== editingId).map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Sort Order Priority</label>
                <input
                  type="number"
                  min="0"
                  value={catSortOrder}
                  onChange={(e) => setCatSortOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Description</label>
              <textarea
                rows="3"
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="What topics are grouped in this category?"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Status</label>
              <select
                value={catStatus}
                onChange={(e) => setCatStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewState("list")}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
