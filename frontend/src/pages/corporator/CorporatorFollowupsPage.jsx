import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LoadingState } from "../../components/LoadingState";
import { Modal } from "../../components/Modal";
import {
  ListTodo,
  Clock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Copy,
  Trash2,
  Edit3,
  LayoutGrid,
  List as ListIcon,
  Printer,
  X,
  ExternalLink,
  Check,
  Flame,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

const STORAGE_KEY = "ward24_followups_list_v2";

// Realistic initial ward follow-ups for Ward 24 (Shivaji Nagar)
const DEFAULT_FOLLOWUPS = [
  {
    followup_id: "FLW-001",
    matter: "Monsoon Drain Desilting Clearance Report",
    department_name: "Storm Water Drainage",
    officer_first_name: "Prakash",
    officer_last_name: "Kulkarni",
    officer_phone: "+91 94220 11984",
    priority: "CRITICAL",
    due_date: new Date().toISOString(),
    status: "DUE_TODAY",
    remarks:
      "Heavy rains forecasted this weekend. Need desilting completion sign-off from junior engineer for Sector 4.",
  },
  {
    followup_id: "FLW-002",
    matter: "Pothole Filling Inspection on Sector 4 Main Road",
    department_name: "Roads & Infrastructure",
    officer_first_name: "Suresh",
    officer_last_name: "Patil",
    officer_phone: "+91 98221 44102",
    priority: "HIGH",
    due_date: new Date(Date.now() + 86400000).toISOString(),
    status: "PENDING",
    remarks:
      "Patchwork commenced on Monday. Joint physical inspection with ward engineer scheduled.",
  },
  {
    followup_id: "FLW-003",
    matter: "Streetlight Cable Fault Repair Follow-up",
    department_name: "Electrical & Lighting",
    officer_first_name: "Amit",
    officer_last_name: "Deshmukh",
    officer_phone: "+91 99750 33812",
    priority: "HIGH",
    due_date: new Date(Date.now() - 86400000).toISOString(),
    status: "OVERDUE",
    remarks:
      "Citizens submitted grievance about dark patch near Municipal Primary School. Underground cable was burned.",
  },
  {
    followup_id: "FLW-004",
    matter: "Public Garden Open Gym Equipment Delivery Verification",
    department_name: "Parks & Recreation",
    officer_first_name: "Sneha",
    officer_last_name: "Jadhav",
    officer_phone: "+91 97631 88290",
    priority: "MEDIUM",
    due_date: new Date(Date.now() + 172800000).toISOString(),
    status: "IN_PROGRESS",
    remarks:
      "Equipment delivered by supplier. Concrete foundation platform curing in progress.",
  },
  {
    followup_id: "FLW-005",
    matter: "Water Pipeline Pressure Leakage Test Report",
    department_name: "Water Supply",
    officer_first_name: "Ramesh",
    officer_last_name: "Bhosale",
    officer_phone: "+91 98902 55193",
    priority: "CRITICAL",
    due_date: new Date().toISOString(),
    status: "DUE_TODAY",
    remarks:
      "Low pressure reported in Sector 2 households. Pressure testing report required before evening meeting.",
  },
  {
    followup_id: "FLW-006",
    matter: "Special Garbage Collection Vehicle for Weekly Market",
    department_name: "Solid Waste Management",
    officer_first_name: "Kiran",
    officer_last_name: "Shinde",
    officer_phone: "+91 94233 77109",
    priority: "MEDIUM",
    due_date: new Date(Date.now() + 259200000).toISOString(),
    status: "PENDING",
    remarks:
      "Deploy extra mini-tippers every Sunday at 8 PM after Sunday vegetable market closes.",
  },
  {
    followup_id: "FLW-007",
    matter: "Mosquito Fogging & Larvicide Spraying near River Bank",
    department_name: "Health & Sanitation",
    officer_first_name: "Dr. Vinod",
    officer_last_name: "Gaikwad",
    officer_phone: "+91 98210 66451",
    priority: "LOW",
    due_date: new Date(Date.now() - 172800000).toISOString(),
    status: "COMPLETED",
    remarks:
      "Fogging drive completed across river belt. Signed logbook submitted by sanitary inspector.",
  },
];

const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water Supply",
  "Storm Water Drainage",
  "Solid Waste Management",
  "Electrical & Lighting",
  "Health & Sanitation",
  "Parks & Recreation",
  "Town Planning & Building",
];

export const CorporatorFollowupsPage = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, OVERDUE, DUE_TODAY, IN_PROGRESS, COMPLETED
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [viewMode, setViewMode] = useState("CARDS"); // 'CARDS' | 'TABLE'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    matter: "",
    department_name: "Roads & Infrastructure",
    officer_name: "",
    officer_phone: "",
    priority: "HIGH",
    due_date: new Date().toISOString().split("T")[0],
    remarks: "",
    status: "PENDING",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/corporator/followups");
      const apiList = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      // Check local cache
      const cached = localStorage.getItem(STORAGE_KEY);
      let localList = [];
      if (cached) {
        try {
          localList = JSON.parse(cached);
        } catch (e) {
          console.error("Error reading cached followups", e);
        }
      }

      if (apiList.length > 0) {
        setFollowups(apiList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiList));
      } else if (localList.length > 0) {
        setFollowups(localList);
      } else {
        setFollowups(DEFAULT_FOLLOWUPS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FOLLOWUPS));
      }
    } catch (err) {
      console.warn("API error, using stored or default followups:", err);
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          setFollowups(JSON.parse(cached));
        } catch (e) {
          setFollowups(DEFAULT_FOLLOWUPS);
        }
      } else {
        setFollowups(DEFAULT_FOLLOWUPS);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFollowups();
  };

  // Save to state and localStorage
  const updateListAndCache = (newList) => {
    setFollowups(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  // Due Date calculation helper
  const getDueInfo = (dueDateStr, status) => {
    if (status === "COMPLETED") {
      return {
        label: "Completed",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        isOverdue: false,
        isDueToday: false,
      };
    }
    if (!dueDateStr) {
      return {
        label: "No Deadline",
        color: "text-slate-600 bg-slate-50 border-slate-200",
        isOverdue: false,
        isDueToday: false,
      };
    }

    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffTime = dueDay.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        label: `Overdue by ${daysAgo} ${daysAgo === 1 ? "day" : "days"}`,
        color: "text-rose-700 bg-rose-50 border-rose-200 font-bold",
        isOverdue: true,
        isDueToday: false,
      };
    } else if (diffDays === 0) {
      return {
        label: "Due Today",
        color: "text-amber-800 bg-amber-50 border-amber-300 font-bold",
        isOverdue: false,
        isDueToday: true,
      };
    } else if (diffDays === 1) {
      return {
        label: "Due Tomorrow",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        isOverdue: false,
        isDueToday: false,
      };
    } else {
      return {
        label: `Due in ${diffDays} days`,
        color: "text-slate-700 bg-slate-50 border-slate-200",
        isOverdue: false,
        isDueToday: false,
      };
    }
  };

  // Toggle Completed / In Progress
  const handleToggleDone = async (item) => {
    const isNowCompleted = item.status !== "COMPLETED";
    const newStatus = isNowCompleted ? "COMPLETED" : "IN_PROGRESS";

    const updatedList = followups.map((f) =>
      f.followup_id === item.followup_id ? { ...f, status: newStatus } : f,
    );
    updateListAndCache(updatedList);

    // Call API in background
    try {
      await api.patch(`/corporator/followups/${item.followup_id}`, {
        status: newStatus,
      });
    } catch (e) {
      console.warn(
        "Could not sync status update with API, kept in local state",
        e,
      );
    }

    showToast(
      isNowCompleted
        ? "Marked task as Completed!"
        : "Re-opened task to In Progress",
      "success",
    );
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      matter: "",
      department_name: "Roads & Infrastructure",
      officer_name: "",
      officer_phone: "",
      priority: "HIGH",
      due_date: new Date().toISOString().split("T")[0],
      remarks: "",
      status: "PENDING",
    });
    setIsAddModalOpen(true);
  };

  // Submit Add Form
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.matter.trim()) {
      showToast("Please enter what needs to be done", "error");
      return;
    }

    const nameParts = formData.officer_name.trim().split(" ");
    const firstName = nameParts[0] || "Ward";
    const lastName = nameParts.slice(1).join(" ") || "Officer";

    const newItem = {
      followup_id: `FLW-${Date.now().toString(36).toUpperCase()}`,
      matter: formData.matter.trim(),
      department_name: formData.department_name,
      officer_first_name: firstName,
      officer_last_name: lastName,
      officer_phone: formData.officer_phone.trim() || "+91 94220 00000",
      priority: formData.priority,
      due_date: new Date(formData.due_date).toISOString(),
      status: formData.status || "PENDING",
      remarks: formData.remarks.trim() || "Added from Ward Follow-up Manager",
    };

    const updatedList = [newItem, ...followups];
    updateListAndCache(updatedList);
    setIsAddModalOpen(false);
    showToast("New reminder created successfully!", "success");

    // Sync with backend API
    try {
      await api.post("/corporator/followups", {
        matter: newItem.matter,
        priority: newItem.priority,
        due_date: newItem.due_date,
        remarks: newItem.remarks,
        status: newItem.status,
      });
    } catch (err) {
      console.warn("Backend API add failed, saved locally", err);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setActiveItem(item);
    const officerName = item.officer_first_name
      ? `${item.officer_first_name} ${item.officer_last_name || ""}`.trim()
      : "";
    setFormData({
      matter: item.matter || "",
      department_name: item.department_name || "Roads & Infrastructure",
      officer_name: officerName,
      officer_phone: item.officer_phone || "",
      priority: item.priority || "MEDIUM",
      due_date: item.due_date
        ? new Date(item.due_date).toISOString().split("T")[0]
        : "",
      remarks: item.remarks || "",
      status: item.status || "PENDING",
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!activeItem) return;

    const nameParts = formData.officer_name.trim().split(" ");
    const firstName = nameParts[0] || activeItem.officer_first_name || "Ward";
    const lastName =
      nameParts.slice(1).join(" ") || activeItem.officer_last_name || "Officer";

    const updatedList = followups.map((f) => {
      if (f.followup_id === activeItem.followup_id) {
        return {
          ...f,
          matter: formData.matter.trim(),
          department_name: formData.department_name,
          officer_first_name: firstName,
          officer_last_name: lastName,
          officer_phone: formData.officer_phone.trim() || f.officer_phone,
          priority: formData.priority,
          due_date: new Date(formData.due_date).toISOString(),
          status: formData.status,
          remarks: formData.remarks.trim(),
        };
      }
      return f;
    });

    updateListAndCache(updatedList);
    setIsEditModalOpen(false);
    showToast("Reminder updated successfully!", "success");

    try {
      await api.patch(`/corporator/followups/${activeItem.followup_id}`, {
        matter: formData.matter.trim(),
        priority: formData.priority,
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status,
        remarks: formData.remarks.trim(),
      });
    } catch (e) {
      console.warn("API update failed, updated in local cache", e);
    }
  };

  // Delete Follow-up
  const handleDeleteConfirm = async () => {
    if (!activeItem) return;
    const updatedList = followups.filter(
      (f) => f.followup_id !== activeItem.followup_id,
    );
    updateListAndCache(updatedList);
    setIsDeleteModalOpen(false);
    showToast("Reminder deleted successfully", "success");

    try {
      await api.delete(`/corporator/followups/${activeItem.followup_id}`);
    } catch (e) {
      console.warn("API delete failed, removed locally", e);
    }
  };

  // Open Send Reminder Modal
  const handleOpenSend = (item) => {
    setActiveItem(item);
    setIsSendModalOpen(true);
  };

  // Copy Reminder Text
  const getPrecomposedMessage = (item) => {
    if (!item) return "";
    const officer = item.officer_first_name
      ? `${item.officer_first_name} ${item.officer_last_name || ""}`.trim()
      : "Officer";
    const dueDateFormatted = new Date(item.due_date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    return `Namaskar ${officer} ji,\n\nThis is a follow-up reminder from Hon. Corporator (Ward 24) regarding:\n📌 *Task:* ${item.matter}\n🏢 *Department:* ${item.department_name || "Municipal Works"}\n⏰ *Target Due Date:* ${dueDateFormatted}\n\nNotes: ${item.remarks || "Please inspect on priority and update the status."}\n\nPlease expedite the execution and keep us updated. Thank you.`;
  };

  const handleCopyMessage = () => {
    const text = getPrecomposedMessage(activeItem);
    navigator.clipboard.writeText(text);
    showToast("Reminder message copied to clipboard!", "success");
  };

  const handleOpenWhatsApp = () => {
    const text = getPrecomposedMessage(activeItem);
    const phone = activeItem?.officer_phone
      ? activeItem.officer_phone.replace(/[^0-9]/g, "")
      : "";
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  // Filtered List calculation
  const filteredFollowups = useMemo(() => {
    return followups.filter((item) => {
      // Tab filter
      const dueInfo = getDueInfo(item.due_date, item.status);
      if (
        activeTab === "OVERDUE" &&
        (!dueInfo.isOverdue || item.status === "COMPLETED")
      )
        return false;
      if (
        activeTab === "DUE_TODAY" &&
        (!dueInfo.isDueToday || item.status === "COMPLETED")
      )
        return false;
      if (
        activeTab === "IN_PROGRESS" &&
        (item.status === "COMPLETED" || dueInfo.isOverdue)
      )
        return false;
      if (activeTab === "COMPLETED" && item.status !== "COMPLETED")
        return false;

      // Department filter
      if (selectedDept !== "ALL" && item.department_name !== selectedDept) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== "ALL" && item.priority !== selectedPriority) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matterMatch = item.matter?.toLowerCase().includes(query);
        const deptMatch = item.department_name?.toLowerCase().includes(query);
        const officerMatch =
          `${item.officer_first_name || ""} ${item.officer_last_name || ""}`
            .toLowerCase()
            .includes(query);
        const remarksMatch = item.remarks?.toLowerCase().includes(query);
        if (!matterMatch && !deptMatch && !officerMatch && !remarksMatch) {
          return false;
        }
      }

      return true;
    });
  }, [followups, activeTab, selectedDept, selectedPriority, searchQuery]);

  // Counts for tabs
  const overdueCount = followups.filter(
    (f) =>
      f.status !== "COMPLETED" && getDueInfo(f.due_date, f.status).isOverdue,
  ).length;
  const dueTodayCount = followups.filter(
    (f) =>
      f.status !== "COMPLETED" && getDueInfo(f.due_date, f.status).isDueToday,
  ).length;
  const inProgressCount = followups.filter(
    (f) =>
      f.status !== "COMPLETED" &&
      !getDueInfo(f.due_date, f.status).isOverdue &&
      !getDueInfo(f.due_date, f.status).isDueToday,
  ).length;
  const completedCount = followups.filter(
    (f) => f.status === "COMPLETED",
  ).length;

  if (loading) {
    return (
      <LoadingState message="Loading your Ward Reminders & Follow-ups..." />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-semibold transition-all transform animate-bounce-short ${
            toast.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-300"
              : "bg-emerald-50 text-emerald-900 border-emerald-300"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <button
            onClick={() => navigate("/corporator/dashboard")}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Corporator Dashboard
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Ward 24 Action Tracker
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Shivaji Nagar
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Ward Reminders & Department Follow-ups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Keep track of pending municipal works, deadlines, and reminders for
            your ward officers. Ensure works are completed on time for citizens.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            title="Refresh list"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
            title="Print list for meetings"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Reminder</span>
          </button>
        </div>
      </div>

      {/* Urgent Attention Alert Banner (Only when overdue tasks exist) */}
      {overdueCount > 0 && activeTab !== "OVERDUE" && (
        <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-rose-900">
                Action Required: You have {overdueCount} overdue department{" "}
                {overdueCount === 1 ? "task" : "tasks"}!
              </p>
              <p className="text-xs text-rose-700">
                Officers have not submitted updates for these items. Consider
                sending a quick reminder ping.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("OVERDUE")}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-rose-800 bg-white hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors shrink-0 shadow-2xs"
          >
            View Overdue Tasks
          </button>
        </div>
      )}

      {/* Interactive Metric Summary Cards (Clickable Quick Filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* All Reminders */}
        <button
          onClick={() => setActiveTab("ALL")}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            activeTab === "ALL"
              ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              All Tasks
            </span>
            <ListTodo className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {followups.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Total active items
          </p>
          {activeTab === "ALL" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
          )}
        </button>

        {/* Needs Action / Overdue */}
        <button
          onClick={() => setActiveTab("OVERDUE")}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            activeTab === "OVERDUE"
              ? "bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 animate-pulse" />
              Overdue
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            {overdueCount}
          </div>
          <p className="text-[11px] text-rose-600 mt-0.5 font-medium">
            Missed target date
          </p>
          {activeTab === "OVERDUE" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600" />
          )}
        </button>

        {/* Due Today */}
        <button
          onClick={() => setActiveTab("DUE_TODAY")}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            activeTab === "DUE_TODAY"
              ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-amber-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Due Today
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {dueTodayCount}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-0.5 font-medium">
            To finish before evening
          </p>
          {activeTab === "DUE_TODAY" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
          )}
        </button>

        {/* In Progress */}
        <button
          onClick={() => setActiveTab("IN_PROGRESS")}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            activeTab === "IN_PROGRESS"
              ? "bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Upcoming
            </span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-blue-600/80 mt-0.5 font-medium">
            Pending with department
          </p>
          {activeTab === "IN_PROGRESS" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          )}
        </button>

        {/* Completed */}
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden col-span-2 sm:col-span-1 ${
            activeTab === "COMPLETED"
              ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {completedCount}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-0.5 font-medium">
            Successfully resolved
          </p>
          {activeTab === "COMPLETED" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
          )}
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reminder, department, or officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-48">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="w-36">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
              >
                <option value="ALL">All Urgencies</option>
                <option value="CRITICAL">🔴 Urgent</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="MEDIUM">🔵 Normal</option>
                <option value="LOW">⚪ Low Priority</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setViewMode("CARDS")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  viewMode === "CARDS"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("TABLE")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  viewMode === "TABLE"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table View"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {/* Clear Filters Button */}
            {(selectedDept !== "ALL" ||
              selectedPriority !== "ALL" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDept("ALL");
                  setSelectedPriority("ALL");
                  setSearchQuery("");
                }}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Helper Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing{" "}
            <strong className="text-slate-800">
              {filteredFollowups.length}
            </strong>{" "}
            of <strong>{followups.length}</strong> reminders
            {activeTab !== "ALL" && (
              <span className="ml-1 text-blue-600 font-semibold">
                ({activeTab.replace("_", " ")})
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click checkmark to toggle Done • Click Send to ping officer on
            WhatsApp
          </span>
        </div>
      </div>

      {/* Main Content: Cards or Table */}
      {filteredFollowups.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Reminders Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedDept !== "ALL" || selectedPriority !== "ALL"
              ? "No reminders match your search or filter criteria. Try clearing filters."
              : "All clear! There are no pending follow-up items in this category."}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add a New Reminder</span>
          </button>
        </div>
      ) : viewMode === "CARDS" ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFollowups.map((item) => {
            const dueInfo = getDueInfo(item.due_date, item.status);
            const isCompleted = item.status === "COMPLETED";
            const officerFullName = item.officer_first_name
              ? `${item.officer_first_name} ${item.officer_last_name || ""}`.trim()
              : "Field Officer";

            return (
              <div
                key={item.followup_id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 relative group ${
                  isCompleted
                    ? "border-emerald-200/80 bg-emerald-50/10 opacity-80"
                    : dueInfo.isOverdue
                      ? "border-rose-300 shadow-sm hover:border-rose-400"
                      : "border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                }`}
              >
                <div>
                  {/* Top Badges: Urgency & Due Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        item.priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border-rose-200"
                          : item.priority === "HIGH"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : item.priority === "LOW"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                      }`}
                    >
                      {item.priority === "CRITICAL" ? (
                        <>
                          <Flame className="w-3 h-3 mr-1 text-rose-600" />{" "}
                          Urgent
                        </>
                      ) : item.priority === "HIGH" ? (
                        <>High Priority</>
                      ) : item.priority === "LOW" ? (
                        <>Low Priority</>
                      ) : (
                        <>Normal</>
                      )}
                    </span>

                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${dueInfo.color}`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {dueInfo.label}
                    </span>
                  </div>

                  {/* Task Title */}
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-bold leading-snug ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {item.matter}
                    </h3>
                  </div>

                  {/* Department & Officer Details */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {item.department_name || "Engineering Works"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800 font-medium">
                          {officerFullName}
                        </span>
                      </div>
                      {item.officer_phone && (
                        <span className="text-[11px] text-slate-400">
                          {item.officer_phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Target Date:{" "}
                        {new Date(item.due_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Remarks Box */}
                  {item.remarks && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-700 block mb-0.5 text-[10px] uppercase tracking-wide">
                        Notes & Context:
                      </span>
                      {item.remarks}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  {/* Mark as Done Toggle */}
                  <button
                    onClick={() => handleToggleDone(item)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? "Reopen" : "Done"}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {/* Ping / Send Reminder */}
                    <button
                      onClick={() => handleOpenSend(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Send WhatsApp or SMS reminder to officer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit reminder"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Task / Matter</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Officer</th>
                  <th className="px-5 py-3.5">Urgency</th>
                  <th className="px-5 py-3.5">Target Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFollowups.map((item) => {
                  const dueInfo = getDueInfo(item.due_date, item.status);
                  const isCompleted = item.status === "COMPLETED";
                  const officerFullName = item.officer_first_name
                    ? `${item.officer_first_name} ${item.officer_last_name || ""}`.trim()
                    : "Field Officer";

                  return (
                    <tr
                      key={item.followup_id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCompleted ? "bg-slate-50/30" : ""
                      }`}
                    >
                      {/* Checkbox / Done toggle */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleDone(item)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isCompleted
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 hover:border-slate-400 bg-white text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-current stroke-[3]" />
                        </button>
                      </td>

                      {/* Task Name & Notes */}
                      <td className="px-5 py-4 max-w-sm">
                        <p
                          className={`font-bold ${
                            isCompleted
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {item.matter}
                        </p>
                        {item.remarks && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.remarks}
                          </p>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-slate-700 font-medium">
                        {item.department_name || "Engineering"}
                      </td>

                      {/* Officer */}
                      <td className="px-5 py-4 text-slate-700">
                        <div className="font-semibold">{officerFullName}</div>
                        {item.officer_phone && (
                          <div className="text-[10px] text-slate-400">
                            {item.officer_phone}
                          </div>
                        )}
                      </td>

                      {/* Urgency */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            item.priority === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : item.priority === "HIGH"
                                ? "bg-amber-100 text-amber-800"
                                : item.priority === "LOW"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.priority === "CRITICAL"
                            ? "Urgent"
                            : item.priority === "HIGH"
                              ? "High"
                              : item.priority === "LOW"
                                ? "Low"
                                : "Normal"}
                        </span>
                      </td>

                      {/* Due Date & Badge */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">
                          {new Date(item.due_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-semibold mt-0.5 px-1.5 py-0.5 rounded border ${dueInfo.color}`}
                        >
                          {dueInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenSend(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Send reminder to officer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveItem(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW REMINDER */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Ward Follow-up Reminder"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              What needs to be done? <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inspect pothole patchwork on Shivaji Road"
              value={formData.matter}
              onChange={(e) =>
                setFormData({ ...formData, matter: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Write a clear, short description of the pending municipal work or
              citizen grievance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Department
              </label>
              <select
                value={formData.department_name}
                onChange={(e) =>
                  setFormData({ ...formData, department_name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Urgency Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
              >
                <option value="CRITICAL">
                  🔴 Urgent (Needs immediate action)
                </option>
                <option value="HIGH">
                  🟠 High Priority (Within 24-48 hrs)
                </option>
                <option value="MEDIUM">🔵 Normal (Standard timeline)</option>
                <option value="LOW">⚪ Low Priority (Planned work)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Officer In Charge
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh Patil (Junior Engineer)"
                value={formData.officer_name}
                onChange={(e) =>
                  setFormData({ ...formData, officer_name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Officer Phone (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98221 00000"
                value={formData.officer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, officer_phone: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Target Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center space-x-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      due_date: new Date().toISOString().split("T")[0],
                    })
                  }
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tom = new Date(Date.now() + 86400000);
                    setFormData({
                      ...formData,
                      due_date: tom.toISOString().split("T")[0],
                    });
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const week = new Date(Date.now() + 7 * 86400000);
                    setFormData({
                      ...formData,
                      due_date: week.toISOString().split("T")[0],
                    });
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Next Week
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Notes & Discussion Points
            </label>
            <textarea
              rows={3}
              placeholder="Add extra context, citizen complaints, or instructions given during ward visit..."
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT REMINDER */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Follow-up Reminder"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Task Description
            </label>
            <input
              type="text"
              required
              value={formData.matter}
              onChange={(e) =>
                setFormData({ ...formData, matter: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Department
              </label>
              <select
                value={formData.department_name}
                onChange={(e) =>
                  setFormData({ ...formData, department_name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DUE_TODAY">Due Today</option>
                <option value="OVERDUE">Overdue</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Officer In Charge
              </label>
              <input
                type="text"
                value={formData.officer_name}
                onChange={(e) =>
                  setFormData({ ...formData, officer_name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Urgency
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
              >
                <option value="CRITICAL">🔴 Urgent</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="MEDIUM">🔵 Normal</option>
                <option value="LOW">⚪ Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Target Due Date
            </label>
            <input
              type="date"
              required
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Notes & Progress Remarks
            </label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              Update Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: SEND REMINDER PING */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Reminder to Field Officer"
        maxWidth="max-w-lg"
      >
        {activeItem && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <span className="font-bold block mb-0.5">
                Ready-to-send polite reminder message:
              </span>
              <p className="text-[11px] text-blue-800">
                You can directly share this message to the officer on WhatsApp
                or copy it to SMS.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
              {getPrecomposedMessage(activeItem)}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Message</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Reminder?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Are you sure you want to remove this reminder?
          </p>
          {activeItem && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
              "{activeItem.matter}"
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors"
            >
              Yes, Delete
            </button>
          
          </div>
        </div>
      </Modal>
    </div>
  );
};


