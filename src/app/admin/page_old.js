"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Monoton } from "next/font/google";

// Load Monoton font
const monoton = Monoton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create"); // create, read, update, delete

  // Form state
  const [formData, setFormData] = useState({
    type: "alevel",
    subject: "",
    section: "books",
    dataKey: "",
    name: "",
    size: "3",
    link1: "",
    link2: "",
    qp: "",
    ms: "",
    text1: "View",
    text2: "",
    session: "",
    year: "",
    paperCode: "",
    order: 0,
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Resources list
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    subject: "",
    section: "",
  });

  // Update/Edit state
  const [selectedResource, setSelectedResource] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Decode token to check if user is admin
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      // Fetch user details to verify admin role
      fetch("/api/admin/resources", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 403 || res.status === 401) {
            setMessage({
              type: "error",
              text: "Access denied. Admin privileges required.",
            });
            setTimeout(() => router.push("/home"), 2000);
          } else if (res.ok) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Auth check failed:", err);
          router.push("/login");
        });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      // Clean up form data - remove empty fields
      const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Resource created successfully!" });
        // Reset form
        setFormData({
          type: "alevel",
          subject: "",
          section: "books",
          dataKey: "",
          name: "",
          size: "3",
          link1: "",
          link2: "",
          qp: "",
          ms: "",
          text1: "View",
          text2: "",
          session: "",
          year: "",
          paperCode: "",
          order: 0,
        });
        // Refresh resources list
        fetchResources();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create resource" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
      console.error("Submit error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchResources = async () => {
    setResourcesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (filters.type) params.append("type", filters.type);
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.section) params.append("section", filters.section);

      const response = await fetch(`/api/admin/resources?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setResourcesLoading(false);
    }
  };

  const deleteResource = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/resources?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Resource deleted successfully!" });
        fetchResources();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Failed to delete resource" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." });
      console.error("Delete error:", error);
    }
  };

  const updateResource = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/resources?id=${selectedResource._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateFormData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Resource updated successfully!" });
        setSelectedResource(null);
        setUpdateFormData({});
        fetchResources();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Failed to update resource" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating." });
      console.error("Update error:", error);
    }
  };

  const selectResourceForEdit = (resource) => {
    setSelectedResource(resource);
    setUpdateFormData(resource);
    setActiveTab("update");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000]">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1 pb-12">
        {/* Page Header Section */}
        <section className="p-6 max-w-[95rem] mx-auto mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-2">
            <h1 className={`${monoton.className} text-4xl sm:text-5xl text-white`}>
              Admin Panel
            </h1>
            <button
              onClick={() => router.push("/home")}
              className="px-6 py-2.5 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
            >
              Back to Home
            </button>
          </div>
        </section>

        {/* Message Display */}
        {message.text && (
          <section className="px-6 max-w-[95rem] mx-auto mb-6 fade-in">
            <div
              className={`p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-900/30 border-green-500 text-green-300"
                  : "bg-red-900/30 border-red-500 text-red-300"
              }`}
            >
              {message.text}
            </div>
          </section>
        )}

        {/* Tabs Navigation */}
        <section className="px-6 max-w-[95rem] mx-auto mb-6 fade-in-delay">
          <div className="flex flex-wrap gap-2 border-b border-[#1a1a1a] pb-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition ${
                activeTab === "create"
                  ? "bg-[#ffaa00] text-black"
                  : "bg-[#111111] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => { setActiveTab("read"); fetchResources(); }}
              className={`px-6 py-3 rounded-t-lg font-semibold transition ${
                activeTab === "read"
                  ? "bg-[#ffaa00] text-black"
                  : "bg-[#111111] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              View
            </button>
            <button
              onClick={() => setActiveTab("update")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition ${
                activeTab === "update"
                  ? "bg-[#ffaa00] text-black"
                  : "bg-[#111111] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              Update
            </button>
            <button
              onClick={() => { setActiveTab("delete"); fetchResources(); }}
              className={`px-6 py-3 rounded-t-lg font-semibold transition ${
                activeTab === "delete"
                  ? "bg-[#ffaa00] text-black"
                  : "bg-[#111111] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              Delete
            </button>
          </div>
        </section>

        {/* Tab Content Container */}
        <section className="p-6 max-w-[95rem] mx-auto">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 shadow-xl">
            
            {/* CREATE TAB */}
            {activeTab === "create" && (
              <div className="fade-in">
                <h2 className={`${monoton.className} text-3xl mb-8 text-white`}>
                  Create New Resource
                </h2>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">{/* Linear form design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Resource Type <span className="text-[#ffaa00]">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                >
                  <option value="alevel">A Level</option>
                  <option value="sat">SAT</option>
                  <option value="olevel">O Level</option>
                  <option value="igcse">IGCSE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Subject <span className="text-[#ffaa00]">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Computer Science, Physics"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Section <span className="text-[#ffaa00]">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                >
                  <option value="books">Books</option>
                  <option value="yearly">Yearly Papers</option>
                  <option value="topical">Topical</option>
                  <option value="sa_resources">SA Resources</option>
                </select>
              </div>
            </div>

            {/* Row 2: Name and DataKey */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Resource Name <span className="text-[#ffaa00]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Computer Science Textbook"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Data Key <span className="text-gray-500 text-xs">(optional, for nested sections)</span>
                </label>
                <input
                  type="text"
                  name="dataKey"
                  value={formData.dataKey}
                  onChange={handleInputChange}
                  placeholder="e.g., english, maths, p1, p3"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Row 3: Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Link 1</label>
                <input
                  type="url"
                  name="link1"
                  value={formData.link1}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Link 2</label>
                <input
                  type="url"
                  name="link2"
                  value={formData.link2}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Conditional: Yearly Papers Fields */}
            {formData.section === "yearly" && (
              <>
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-medium mb-4">Yearly Paper Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Session <span className="text-[#ffaa00]">*</span>
                      </label>
                      <select
                        name="session"
                        value={formData.session}
                        onChange={handleInputChange}
                        required={formData.section === "yearly"}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      >
                        <option value="">Select</option>
                        <option value="june">June</option>
                        <option value="november">November</option>
                        <option value="march">March</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Year <span className="text-[#ffaa00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required={formData.section === "yearly"}
                        placeholder="2024"
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Paper Code <span className="text-[#ffaa00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="paperCode"
                        value={formData.paperCode}
                        onChange={handleInputChange}
                        required={formData.section === "yearly"}
                        placeholder="11, 21, 42"
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Size</label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="3"
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Question Paper (QP) Link
                      </label>
                      <input
                        type="url"
                        name="qp"
                        value={formData.qp}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Mark Scheme (MS) Link
                      </label>
                      <input
                        type="url"
                        name="ms"
                        value={formData.ms}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Row 4: Text Labels and Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Text 1 Label</label>
                <input
                  type="text"
                  name="text1"
                  value={formData.text1}
                  onChange={handleInputChange}
                  placeholder="View"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Text 2 Label</label>
                <input
                  type="text"
                  name="text2"
                  value={formData.text2}
                  onChange={handleInputChange}
                  placeholder="Download"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitLoading}
                className="px-8 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Creating..." : "Create Resource"}
              </button>
            </div>
          </form>
          </div>
        </section>

        {/* Resources List */}
        <section className="p-6 max-w-[95rem] mx-auto mt-8">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <h2 className={`${monoton.className} text-3xl text-white`}>
              Existing Resources
            </h2>
            <button
              onClick={fetchResources}
              className="px-6 py-2.5 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
            >
              {resourcesLoading ? "Loading..." : "🔄 Refresh List"}
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
            >
              <option value="">All Types</option>
              <option value="alevel">A Level</option>
              <option value="sat">SAT</option>
              <option value="olevel">O Level</option>
              <option value="igcse">IGCSE</option>
            </select>

            <input
              type="text"
              placeholder="Filter by subject"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
            />

            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              className="px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
            >
              <option value="">All Sections</option>
              <option value="books">Books</option>
              <option value="yearly">Yearly Papers</option>
              <option value="topical">Topical</option>
            </select>
          </div>

          {/* Resources Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#121212] border border-[#1a1a1a]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      {resourcesLoading ? "Loading resources..." : "No resources found. Click 'Refresh List' to load."}
                    </td>
                  </tr>
                ) : (
                  resources.map((resource) => (
                    <tr key={resource._id} className="hover:bg-[#121212]/50 transition">
                      <td className="px-4 py-3">{resource.name}</td>
                      <td className="px-4 py-3 capitalize">{resource.type}</td>
                      <td className="px-4 py-3">{resource.subject}</td>
                      <td className="px-4 py-3 capitalize">{resource.section}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteResource(resource._id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
