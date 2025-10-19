"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Monoton } from "next/font/google";

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
  const [activeTab, setActiveTab] = useState("create");

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
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [filters, setFilters] = useState({ type: "", subject: "", section: "" });
  const [selectedResource, setSelectedResource] = useState(null);
  const [existingSubjects, setExistingSubjects] = useState({});
  const [showCustomSubject, setShowCustomSubject] = useState(false);

  // Predefined subjects from JSON files
  const predefinedSubjects = {
    alevel: ['Physics', 'Maths', 'Computer Science', 'Further Maths', 'Information Technology'],
    olevel: [],
    igcse: []
  };

  useEffect(() => {
    checkAuth();
    fetchExistingSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExistingSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Extract unique subjects grouped by type
        const subjectsByType = { ...predefinedSubjects };
        
        data.data?.forEach(resource => {
          if (resource.subject && resource.type) {
            if (!subjectsByType[resource.type]) {
              subjectsByType[resource.type] = [];
            }
            // Add subject if not already in list
            if (!subjectsByType[resource.type].includes(resource.subject)) {
              subjectsByType[resource.type].push(resource.subject);
            }
          }
        });
        
        // Sort all arrays
        Object.keys(subjectsByType).forEach(type => {
          subjectsByType[type] = subjectsByType[type].sort();
        });
        
        setExistingSubjects(subjectsByType);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      // Fallback to predefined subjects on error
      setExistingSubjects(predefinedSubjects);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      fetch("/api/admin/resources", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 403 || res.status === 401) {
            setMessage({ type: "error", text: "Access denied. Admin privileges required." });
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
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Reset section and dataKey when type changes
      if (name === 'type') {
        if (value === 'sat') {
          updated.section = 'books';
          updated.dataKey = 'english';
          updated.subject = 'SAT'; // Auto-fill subject for SAT
        } else {
          updated.section = 'books';
          updated.dataKey = '';
          updated.subject = '';
        }
        setShowCustomSubject(false);
      }
      
      // Handle subject selection (show custom input if "other" selected)
      if (name === 'subject' && value === '__custom__') {
        setShowCustomSubject(true);
        updated.subject = '';
      } else if (name === 'subject') {
        setShowCustomSubject(false);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Resource created successfully!" });
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
        setShowCustomSubject(false);
        // Refresh subjects list to include newly created subject
        fetchExistingSubjects();
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  const selectResourceForEdit = (resource) => {
    setSelectedResource(resource);
    setActiveTab("update");
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
        body: JSON.stringify(selectedResource),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Resource updated successfully!" });
        setSelectedResource(null);
        fetchResources();
        setActiveTab("read");
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Failed to update resource" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating." });
      console.error("Update error:", error);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedResource((prev) => ({ ...prev, [name]: value }));
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
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .fade-in-delay {
          animation: fadeIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>

      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1 pb-12">
        {/* Page Header */}
        <section className="p-6 max-w-[95rem] mx-auto mt-8 fade-in">
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

        {/* Tab Content */}
        <section className="p-6 max-w-[95rem] mx-auto">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 shadow-xl">
            
            {/* CREATE TAB */}
            {activeTab === "create" && (
              <div className="fade-in">
                <h2 className={`${monoton.className} text-3xl mb-8 text-white text-center`}>
                  Create New Resource
                </h2>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
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
                    {formData.type === 'sat' ? (
                      <input
                        type="text"
                        name="subject"
                        value="SAT"
                        readOnly
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#1a1a1a] rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    ) : (formData.type === 'alevel' || formData.type === 'olevel' || formData.type === 'igcse') ? (
                      <>
                        {!showCustomSubject ? (
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                          >
                            <option value="">Select a subject...</option>
                            {existingSubjects[formData.type]?.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                            <option value="__custom__">+ Add New Subject</option>
                          </select>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter new subject name (e.g., Computer Science, Physics)"
                              className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setShowCustomSubject(false);
                                setFormData(prev => ({ ...prev, subject: '' }));
                              }}
                              className="text-sm text-[#ffaa00] hover:underline"
                            >
                              ← Back to existing subjects
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Computer Science, Physics, Maths"
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    )}
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
                      {formData.type !== 'sat' && <option value="sa_resources">SA Resources</option>}
                    </select>
                  </div>

                  {/* Data Key field - for SAT, show as required dropdown */}
                  {formData.type === 'sat' ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        SAT Section <span className="text-[#ffaa00]">*</span>
                      </label>
                      <select
                        name="dataKey"
                        value={formData.dataKey}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      >
                        <option value="english">English</option>
                        <option value="maths">Maths</option>
                        <option value="combined">Combined Resources</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Data Key <span className="text-gray-500 text-xs">(optional, for nested sections)</span>
                      </label>
                      <input
                        type="text"
                        name="dataKey"
                        value={formData.dataKey}
                        onChange={handleInputChange}
                        placeholder="e.g., p1, p3, S1"
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                      />
                    </div>
                  )}

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

                  {formData.section === "yearly" && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Question Paper Link</label>
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
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Mark Scheme Link</label>
                        <input
                          type="url"
                          name="ms"
                          value={formData.ms}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Session</label>
                        <select
                          name="session"
                          value={formData.session}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                        >
                          <option value="">Select session...</option>
                          <option value="june">May/June</option>
                          <option value="november">October/November</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          placeholder="e.g., 2023"
                          className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Paper Code
                          <span className="text-gray-500 text-xs ml-2">(e.g., 11, 12, 21, 22, 31, 41, 42 - numbers only)</span>
                        </label>
                        <input
                          type="text"
                          name="paperCode"
                          value={formData.paperCode}
                          onChange={handleInputChange}
                          placeholder="e.g., 11, 12, 21, 22, 31, 32"
                          className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the full paper code (e.g., 11, 12, 13 for Paper 1; 21, 22, 23 for Paper 2)
                        </p>
                      </div>
                    </>
                  )}

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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition placeholder:text-gray-600"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full px-8 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? "Creating..." : "Create Resource"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* READ TAB */}
            {activeTab === "read" && (
              <div className="fade-in">
                <h2 className={`${monoton.className} text-3xl mb-8 text-white text-center`}>
                  View All Resources
                </h2>
                
                <div className="mb-6 flex gap-4 flex-wrap">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
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
                    className="px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                  >
                    <option value="">All Sections</option>
                    <option value="books">Books</option>
                    <option value="yearly">Yearly Papers</option>
                    <option value="topical">Topical</option>
                  </select>

                  <button
                    onClick={fetchResources}
                    className="px-6 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    {resourcesLoading ? "Loading..." : "Apply Filters"}
                  </button>
                </div>

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
                            {resourcesLoading ? "Loading resources..." : "No resources found"}
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
                                onClick={() => selectResourceForEdit(resource)}
                                className="px-3 py-1 bg-[#ffaa00] text-black rounded-lg transition text-sm font-semibold hover:opacity-90 mr-2"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* UPDATE TAB */}
            {activeTab === "update" && (
              <div className="fade-in">
                <h2 className={`${monoton.className} text-3xl mb-8 text-white text-center`}>
                  Update Resource
                </h2>
                
                {!selectedResource ? (
                  <div className="text-center text-gray-400 py-12">
                    <p className="mb-4">No resource selected for editing</p>
                    <button
                      onClick={() => { setActiveTab("read"); fetchResources(); }}
                      className="px-6 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      View Resources to Edit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={updateResource} className="max-w-2xl mx-auto space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Resource Type <span className="text-[#ffaa00]">*</span>
                      </label>
                      <select
                        name="type"
                        value={selectedResource.type}
                        onChange={handleUpdateChange}
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
                        value={selectedResource.subject}
                        onChange={handleUpdateChange}
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Section <span className="text-[#ffaa00]">*</span>
                      </label>
                      <select
                        name="section"
                        value={selectedResource.section}
                        onChange={handleUpdateChange}
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      >
                        <option value="books">Books</option>
                        <option value="yearly">Yearly Papers</option>
                        <option value="topical">Topical</option>
                        <option value="sa_resources">SA Resources</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Resource Name <span className="text-[#ffaa00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedResource.name}
                        onChange={handleUpdateChange}
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Link 1</label>
                      <input
                        type="url"
                        name="link1"
                        value={selectedResource.link1 || ""}
                        onChange={handleUpdateChange}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Link 2</label>
                      <input
                        type="url"
                        name="link2"
                        value={selectedResource.link2 || ""}
                        onChange={handleUpdateChange}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#ffaa00] outline-none transition"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-8 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
                      >
                        Update Resource
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedResource(null); setActiveTab("read"); }}
                        className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-[#222] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* DELETE TAB */}
            {activeTab === "delete" && (
              <div className="fade-in">
                <h2 className={`${monoton.className} text-3xl mb-8 text-white text-center`}>
                  Delete Resources
                </h2>
                
                <div className="mb-6">
                  <button
                    onClick={fetchResources}
                    className="px-6 py-3 bg-[#ffaa00] text-black font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    {resourcesLoading ? "Loading..." : "Refresh List"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#121212] border border-[#1a1a1a]">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Section</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {resources.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            {resourcesLoading ? "Loading resources..." : "No resources found"}
                          </td>
                        </tr>
                      ) : (
                        resources.map((resource) => (
                          <tr key={resource._id} className="hover:bg-[#121212]/50 transition">
                            <td className="px-4 py-3">{resource.name}</td>
                            <td className="px-4 py-3 capitalize">{resource.type}</td>
                            <td className="px-4 py-3">{resource.subject}</td>
                            <td className="px-4 py-3 capitalize">{resource.section}</td>
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
            )}

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
