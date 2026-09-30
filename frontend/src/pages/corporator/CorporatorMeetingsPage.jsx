import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { StatusBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { LoadingState } from "../../components/LoadingState";
import { Modal } from "../../components/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Search,
  Check,
  X,
  ChevronRight,
  Vote,
  Building2,
  Briefcase,
  Wrench,
  UserCheck,
  Eye,
  Gavel,
  Sparkles,
} from "lucide-react";

// ============================================================================
// SIMPLE & CLEAR DATASET
// ============================================================================

const INITIAL_ISSUES = [
  {
    id: "ISSUE-101",
    title: "Low drinking water pressure in Sector 4 & 5",
    category: "Water Supply",
    submitted_by: "Hon. Corporator (Ward 24)",
    role: "Corporator",
    department: "Water Supply Department",
    urgency: "High",
    date: "2026-09-20",
    status: "ACCEPTED", // PENDING, ACCEPTED, RESOLVED
    meeting_assigned: "Meeting #24 (28 Sep)",
    description:
      "Over 1,200 homes are getting very low water pressure in the mornings. Need to replace old pipe with a 300mm pipe.",
    estimated_cost: 3200000,
  },
  {
    id: "ISSUE-102",
    title: "Monsoon drain cleaning and garbage clearing report",
    category: "Cleanliness & Health",
    submitted_by: "Dr. Sunita Kulkarni (Health Dept)",
    role: "Department Head",
    department: "Health & Sanitation",
    urgency: "Medium",
    date: "2026-09-21",
    status: "ACCEPTED",
    meeting_assigned: "Meeting #24 (28 Sep)",
    description:
      "Status of road cleaning and desilting of major stormwater canals before heavy rains.",
    estimated_cost: 0,
  },
  {
    id: "ISSUE-103",
    title: "Install 8 high-mast streetlights at dark spots",
    category: "Streetlights & Electrical",
    submitted_by: "Hon. Corporator (Ward 24)",
    role: "Corporator",
    department: "Electrical Department",
    urgency: "Medium",
    date: "2026-09-22",
    status: "ACCEPTED",
    meeting_assigned: "Meeting #24 (28 Sep)",
    description:
      "Citizens and women commuters requested lights near Railway Underpass and weekly bazaar for safety.",
    estimated_cost: 1450000,
  },
  {
    id: "ISSUE-104",
    title: "Speed breakers and pedestrian crossing near Vidya Mandir School",
    category: "Roads & Safety",
    submitted_by: "Hon. Corporator (Ward 24)",
    role: "Corporator",
    department: "Roads & Traffic",
    urgency: "High",
    date: "2026-09-24",
    status: "PENDING",
    meeting_assigned: null,
    description:
      "Parents and teachers submitted a petition for safety speed breakers and zebra crossing outside the school.",
    estimated_cost: 450000,
  },
  {
    id: "ISSUE-105",
    title: "Proposal: Smart waste bins in commercial markets",
    category: "Waste Management",
    submitted_by: "Er. Rajesh Patil (Waste Dept)",
    role: "Department Head",
    department: "Solid Waste Management",
    urgency: "Low",
    date: "2026-09-25",
    status: "PENDING",
    meeting_assigned: null,
    description:
      "Installing sensor-based bins in 20 major shopping markets to alert garbage vans when full.",
    estimated_cost: 850000,
  },
];

const INITIAL_MEETINGS = [
  {
    id: "M-24",
    title: "Ward 24 Committee Meeting & Development Works",
    type: "Ward Committee",
    date: "2026-09-28",
    time: "11:00 AM",
    venue: "Ward Office Meeting Hall, 2nd Floor, Sector 4",
    status: "IN_SESSION", // UPCOMING, IN_SESSION, COMPLETED
    chairperson: "Committee Chairperson",
    summary:
      "Discussion on water pipeline replacement, streetlight installation, and review of past work.",
    topics: [
      {
        id: "T-1",
        title: "Review past meeting decisions and work progress",
        raised_by: "Council Secretariat",
        corporator_said:
          "Checked on-site road work on Market Lane; drain covers must be smooth for pedestrians.",
        dept_said:
          "Road work is 65% complete. Fogging completed in all slum pockets.",
        officer_said:
          "Inspection done. Contractor given 3 weeks to complete concrete curing.",
        status: "CONFIRMED",
        votes: { yes: 9, no: 0 },
      },
      {
        id: "T-2",
        title:
          "Approval for 300mm drinking water pipe in Sector 4 & 5 (₹32 Lakhs)",
        raised_by: "Corporator (Ward 24)",
        corporator_said:
          "Citizens are facing acute drinking water shortage daily. Work must start without delay.",
        dept_said:
          "Department has approved the plan. Funding available in ward budget.",
        officer_said:
          "Survey completed. Can finish laying the pipes within 45 days after sanction.",
        status: "APPROVED",
        votes: { yes: 9, no: 0 },
      },
      {
        id: "T-3",
        title: "Install 8 high-mast streetlights at dark spots (₹14.5 Lakhs)",
        raised_by: "Corporator (Ward 24)",
        corporator_said:
          "Dark streets near railway underpass are unsafe at night. Need lights quickly.",
        dept_said:
          "Electric load test passed. 5-year maintenance included in quote.",
        officer_said: "Foundations can be cast next week once approved.",
        status: "VOTING",
        votes: { yes: 7, no: 0 },
      },
    ],
    attendees: [
      { name: "Hon. Corporator (Ward 24)", role: "Corporator", present: true },
      { name: "Hon. Corporator (Ward 25)", role: "Corporator", present: true },
      { name: "Dr. Sunita Kulkarni", role: "Health Dept Head", present: true },
      { name: "Er. Rajesh Patil", role: "Water Dept Head", present: true },
      {
        name: "Er. Sanjay Deshmukh",
        role: "Junior Engineer (Roads)",
        present: true,
      },
      { name: "Mr. Arun Kadam", role: "Secretary / Staff", present: true },
    ],
  },
  {
    id: "M-23",
    title: "Ward 24 Monsoon Preparation & Road Resurfacing",
    type: "Ward Committee",
    date: "2026-08-25",
    time: "11:30 AM",
    venue: "Municipal Corporation Central Hall",
    status: "COMPLETED",
    chairperson: "Hon. Mayor",
    summary:
      "Approved concrete road work on Market Lane and new mosquito fogging machines.",
    topics: [
      {
        id: "T-OLD-1",
        title: "Cement road and side drain on Market Lane #4 (₹24 Lakhs)",
        raised_by: "Corporator (Ward 24)",
        corporator_said: "Old vegetable market road had large potholes.",
        dept_said: "Approved and work order given to contractor.",
        officer_said: "Work started in early September.",
        status: "APPROVED",
        votes: { yes: 10, no: 0 },
      },
    ],
    attendees: [],
  },
  {
    id: "M-25",
    title: "Standing Committee Meeting: Infrastructure & Health",
    type: "Standing Committee",
    date: "2026-10-15",
    time: "02:30 PM",
    venue: "Standing Committee Hall, Main HQ",
    status: "UPCOMING",
    chairperson: "Standing Committee Chair",
    summary: "Review of major city flyovers and large municipal tenders.",
    topics: [],
    attendees: [],
  },
];

const INITIAL_TASKS = [
  {
    id: "TASK-01",
    meeting_id: "M-23",
    title: "Pave Market Lane #4 with Concrete & Cover Drains",
    cost: 2400000,
    department: "Roads & Infrastructure",
    assigned_to: "Er. Sanjay Deshmukh (Junior Engineer)",
    hod: "City Engineer (Roads)",
    deadline: "2026-10-30",
    progress: 65,
    status: "IN_PROGRESS", // IN_PROGRESS, COMPLETED, DELAYED
    officer_notes:
      "Side drains are ready. Concrete road pouring underway. Curing will take 10 more days.",
    corporator_feedback:
      "Visited site on 22 Sep. Work looks good, asked workers to keep drain covers level with shops.",
    delay_reported: false,
  },
  {
    id: "TASK-02",
    meeting_id: "M-23",
    title: "Purchase 2 Fogging Machines & Spray Slum Pockets",
    cost: 380000,
    department: "Health & Sanitation",
    assigned_to: "Dr. Sunita Kulkarni (Health Officer)",
    hod: "Health Chief",
    deadline: "2026-09-20",
    progress: 100,
    status: "COMPLETED",
    officer_notes:
      "Machines delivered and fogging done daily in all 14 vulnerable areas.",
    corporator_feedback:
      "Verified with residents in Shanti Nagar. Mosquito complaints stopped.",
    delay_reported: false,
  },
  {
    id: "TASK-03",
    meeting_id: "M-24",
    title: "Lay 300mm Water Pipeline in Sector 4 & 5",
    cost: 3200000,
    department: "Water Supply Department",
    assigned_to: "Er. Rajesh Patil (Water Works)",
    hod: "Chief Hydraulic Engineer",
    deadline: "2026-11-15",
    progress: 20,
    status: "IN_PROGRESS",
    officer_notes: "Tender work order issued. Pipes ordered from factory.",
    corporator_feedback:
      "Checking progress weekly. Told team to take care of underground telephone cables.",
    delay_reported: false,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CorporatorMeetingsPage = () => {
  // Simple 5-step flow:
  // 1: Submissions (Submit issues)
  // 2: Schedule (Meetings calendar)
  // 3: Meeting (Inside the meeting room)
  // 4: Tasks (Assigned tasks)
  // 5: Follow-up (Check progress)
  const [activeStep, setActiveStep] = useState("2"); // default to meetings list
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeMeetingId, setActiveMeetingId] = useState("M-24");

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] =
    useState(false);
  const [isWardFeedbackModalOpen, setIsWardFeedbackModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Forms
  const [issueForm, setIssueForm] = useState({
    title: "",
    role: "Corporator",
    department: "Water Supply Department",
    urgency: "High",
    cost: "",
    description: "",
  });

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    type: "Ward Committee",
    date: "",
    time: "11:00 AM",
    venue: "Ward Office Meeting Hall, Sector 4",
    summary: "",
    selectedIssueIds: [],
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    department: "Water Supply Department",
    assigned_to: "Er. Rajesh Patil (Water Works)",
    deadline: "",
    cost: "",
  });

  const [progressForm, setProgressForm] = useState({
    progress: 50,
    note: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    note: "",
    hasIssue: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeMeeting = useMemo(() => {
    return meetings.find((m) => m.id === activeMeetingId) || meetings[0];
  }, [meetings, activeMeetingId]);

  // Try fetching API meetings if available
  useEffect(() => {
    api
      .get("/corporator/meetings")
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Keep rich data intact while reading backend
          console.log("Backend meetings found:", res.data.length);
        }
      })
      .catch(() => {});
  }, []);

  // 1. Submit an issue
  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!issueForm.title.trim()) return;

    const newIssue = {
      id: `ISSUE-${issues.length + 101}`,
      title: issueForm.title,
      category: issueForm.department,
      submitted_by:
        issueForm.role === "Corporator"
          ? "Hon. Corporator (Ward 24)"
          : `Head, ${issueForm.department}`,
      role: issueForm.role,
      department: issueForm.department,
      urgency: issueForm.urgency,
      date: new Date().toISOString().split("T")[0],
      status: "PENDING",
      meeting_assigned: null,
      description: issueForm.description,
      estimated_cost: Number(issueForm.cost) || 0,
    };

    setIssues([newIssue, ...issues]);
    setIsSubmitModalOpen(false);
    setIssueForm({
      title: "",
      role: "Corporator",
      department: "Water Supply Department",
      urgency: "High",
      cost: "",
      description: "",
    });
    showToast("Your issue has been submitted for the next meeting!");
  };

  // 2. Accept an issue into meeting
  const handleAcceptIssue = (issueId) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, status: "ACCEPTED", meeting_assigned: activeMeeting.title }
          : i,
      ),
    );

    const targetIssue = issues.find((i) => i.id === issueId);
    if (targetIssue) {
      setMeetings((prev) =>
        prev.map((m) => {
          if (m.id === activeMeeting.id) {
            return {
              ...m,
              topics: [
                ...m.topics,
                {
                  id: `T-${Date.now()}`,
                  title: targetIssue.title,
                  raised_by: targetIssue.submitted_by,
                  corporator_said: targetIssue.description,
                  dept_said:
                    "Department will verify feasibility and report back.",
                  officer_said: "Preliminary site inspection scheduled.",
                  status: "UNDER_DISCUSSION",
                  votes: { yes: 0, no: 0 },
                },
              ],
            };
          }
          return m;
        }),
      );
    }
    showToast("Added to meeting agenda!");
  };

  // 3. Schedule meeting
  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    if (!meetingForm.title.trim() || !meetingForm.date) return;

    const newM = {
      id: `M-${meetings.length + 24}`,
      title: meetingForm.title,
      type: meetingForm.type,
      date: meetingForm.date,
      time: meetingForm.time,
      venue: meetingForm.venue,
      status: "UPCOMING",
      chairperson: "Committee Chairperson",
      summary: meetingForm.summary || "Ward discussions and progress review.",
      topics: [],
      attendees: [
        {
          name: "Hon. Corporator (Ward 24)",
          role: "Corporator",
          present: false,
        },
        { name: "Dr. Sunita Kulkarni", role: "Health Officer", present: false },
        { name: "Er. Rajesh Patil", role: "Water Works Head", present: false },
      ],
    };

    setMeetings([newM, ...meetings]);
    setIsScheduleModalOpen(false);
    showToast("New meeting scheduled successfully!");
  };

  // 4. Vote on a topic inside meeting
  const handleVote = (topicId, type) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === activeMeeting.id) {
          const updatedTopics = m.topics.map((t) => {
            if (t.id === topicId) {
              const yes = type === "YES" ? t.votes.yes + 1 : t.votes.yes;
              const no = type === "NO" ? t.votes.no + 1 : t.votes.no;
              return {
                ...t,
                votes: { yes, no },
                status: yes > no ? "APPROVED" : "REJECTED",
              };
            }
            return t;
          });
          return { ...m, topics: updatedTopics };
        }
        return m;
      }),
    );
    showToast(`Your vote (${type}) has been counted!`);
  };

  // 5. Assign task
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const newTask = {
      id: `TASK-0${tasks.length + 1}`,
      meeting_id: activeMeeting.id,
      title: taskForm.title,
      cost: Number(taskForm.cost) || 0,
      department: taskForm.department,
      assigned_to: taskForm.assigned_to,
      hod: "Department Head",
      deadline: taskForm.deadline || "2026-11-30",
      progress: 0,
      status: "IN_PROGRESS",
      officer_notes: "Task assigned by Council. Starting initial preparations.",
      corporator_feedback: "Task created. Waiting for on-ground start.",
      delay_reported: false,
    };

    setTasks([newTask, ...tasks]);
    setIsAssignTaskModalOpen(false);
    showToast("Task officially assigned to officer!");
  };

  // 6. Update officer progress
  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          const p = Number(progressForm.progress);
          return {
            ...t,
            progress: p,
            status: p >= 100 ? "COMPLETED" : "IN_PROGRESS",
            officer_notes: progressForm.note || t.officer_notes,
          };
        }
        return t;
      }),
    );
    setIsUpdateProgressModalOpen(false);
    showToast("Work progress updated!");
  };

  // 7. Corporator field feedback
  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            corporator_feedback: feedbackForm.note,
            delay_reported: feedbackForm.hasIssue,
            status: feedbackForm.hasIssue ? "DELAYED" : t.status,
          };
        }
        return t;
      }),
    );
    setIsWardFeedbackModalOpen(false);
    showToast(
      feedbackForm.hasIssue
        ? "Alert sent to Municipal Commissioner!"
        : "Ward inspection note saved!",
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
            <Building2 className="w-3.5 h-3.5" />
            Ward 24 &bull; Council Meetings & Decisions
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Civic Meetings & Action Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Simple 5-step flow: Raise an issue &rarr; Schedule meeting &rarr;
            Discuss & Vote &rarr; Assign to officers &rarr; Track on-ground
            completion.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Raise New Issue
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold border border-slate-300 transition-all"
          >
            <Calendar className="w-4 h-4 text-slate-600" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* 5-Step Clear Flow Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {[
          {
            id: "1",
            title: "1. Raise Issues",
            desc: "Ward issues & proposals",
            count: issues.length,
          },
          {
            id: "2",
            title: "2. Meetings",
            desc: "Dates & agendas",
            count: meetings.length,
          },
          {
            id: "3",
            title: "3. In Meeting",
            desc: "Discussions & voting",
            badge: "Live Room",
          },
          {
            id: "4",
            title: "4. Tasks Assigned",
            desc: "Who does what",
            count: tasks.length,
          },
          { id: "5", title: "5. Follow-Up", desc: "Work completion status" },
        ].map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{step.title}</span>
                {step.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-purple-900 text-purple-200"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {step.count}
                  </span>
                )}
                {step.badge && (
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                    {step.badge}
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 ${isActive ? "text-purple-100" : "text-slate-500"}`}
              >
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: RAISE ISSUES & PROPOSALS */}
      {/* ========================================================================= */}
      {activeStep === "1" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Issues Submitted for Meeting
              </h2>
              <p className="text-xs text-slate-500">
                Corporators and Department Heads can raise ward problems here so
                they get placed on the meeting agenda.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit an Issue
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {item.department}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        item.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status === "ACCEPTED"
                        ? "✓ On Agenda"
                        : "Waiting Review"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-2 border border-slate-100 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span>
                      Raised by:{" "}
                      <strong className="text-slate-800">
                        {item.submitted_by}
                      </strong>
                    </span>
                    <span>
                      Priority:{" "}
                      <strong className="text-purple-700">
                        {item.urgency}
                      </strong>
                    </span>
                  </div>

                  {item.estimated_cost > 0 && (
                    <div className="mt-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
                      Estimated Cost: {formatCurrency(item.estimated_cost)}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  {item.status === "PENDING" ? (
                    <button
                      onClick={() => handleAcceptIssue(item.id)}
                      className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-lg transition-colors"
                    >
                      + Put on Next Meeting Agenda
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">
                      Scheduled in: <strong>{item.meeting_assigned}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SCHEDULED MEETINGS CALENDAR */}
      {/* ========================================================================= */}
      {activeStep === "2" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Meetings Calendar
              </h2>
              <p className="text-xs text-slate-500">
                Corporation Admin schedules official council and ward committee
                meetings with date, venue, and topics.
              </p>
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule New Meeting
            </button>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => {
              const isCurrent = m.id === activeMeetingId;
              const isInSession = m.status === "IN_SESSION";

              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                    isCurrent
                      ? "border-purple-600 ring-2 ring-purple-600/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                        {m.type}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        #{m.id}
                      </span>
                      {isInSession && (
                        <span className="text-[11px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                          Meeting Happening Now
                        </span>
                      )}
                      {m.status === "COMPLETED" && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          Concluded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {m.date} at {m.time}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {m.venue} &bull; Chair: {m.chairperson}
                  </p>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2.5">
                    {m.summary}
                  </p>

                  {/* Topics list */}
                  {m.topics?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-slate-700 mb-1.5">
                        Items for Discussion ({m.topics.length}):
                      </p>
                      <div className="space-y-1">
                        {m.topics.map((t, idx) => (
                          <div
                            key={t.id}
                            className="text-xs flex items-center justify-between p-2 rounded bg-slate-50 text-slate-800"
                          >
                            <span>
                              <strong>#{idx + 1}</strong> {t.title}
                            </span>
                            <span className="text-[11px] font-semibold text-purple-700">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Attendees Expected: Corporator, Officers, Health & Water
                      HODs
                    </span>

                    <button
                      onClick={() => {
                        setActiveMeetingId(m.id);
                        setActiveStep("3"); // Go to meeting room
                      }}
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      Enter Meeting Room &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: INSIDE THE MEETING ROOM (Discussion & Voting) */}
      {/* ========================================================================= */}
      {activeStep === "3" && (
        <div className="space-y-4">
          <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <span className="text-xs bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                ● Live Meeting Chamber
              </span>
              <h2 className="text-lg font-black mt-1">{activeMeeting.title}</h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Venue: {activeMeeting.venue} &bull; Date: {activeMeeting.date}
              </p>
            </div>

            <button
              onClick={() => setIsAssignTaskModalOpen(true)}
              className="px-3.5 py-2 bg-white text-purple-900 font-bold text-xs rounded-xl hover:bg-purple-50 transition-colors self-start"
            >
              + Record Decision & Assign Task
            </button>
          </div>

          {/* Attendees Presence */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              Members & Officers in Room:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {activeMeeting.attendees?.map((a, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {a.name} ({a.role})
                </span>
              ))}
            </div>
          </div>

          {/* Agenda Topics Deliberation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              Discussions & Voting on Agenda Topics:
            </h3>

            {activeMeeting.topics?.map((topic, index) => (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    #{index + 1}. {topic.title}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    {topic.status}
                  </span>
                </div>

                {/* 3-Way Perspectives */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-0.5">
                      🗣 Corporator says:
                    </span>
                    <p className="text-slate-700">{topic.corporator_said}</p>
                  </div>
                  <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-0.5">
                      📋 Dept Head update:
                    </span>
                    <p className="text-slate-700">{topic.dept_said}</p>
                  </div>
                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      🔧 Officer technical view:
                    </span>
                    <p className="text-slate-700">{topic.officer_said}</p>
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Vote Result:{" "}
                    <strong className="text-emerald-700">
                      {topic.votes?.yes || 0} Yes
                    </strong>{" "}
                    &bull;{" "}
                    <strong className="text-red-700">
                      {topic.votes?.no || 0} No
                    </strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(topic.id, "YES")}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg font-bold"
                    >
                      ✓ Vote Yes
                    </button>
                    <button
                      onClick={() => handleVote(topic.id, "NO")}
                      className="px-3 py-1 bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 rounded-lg font-bold"
                    >
                      ✗ Vote No
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: ASSIGNED TASKS (Decisions given to Officers) */}
      {/* ========================================================================= */}
      {activeStep === "4" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Tasks Assigned from Meeting Decisions
              </h2>
              <p className="text-xs text-slate-500">
                Corporation Admin assigns the passed decisions to specific
                Department Heads and Junior Engineers with deadlines.
              </p>
            </div>
            <button
              onClick={() => setIsAssignTaskModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              Assign New Task
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {task.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {task.title}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "DELAYED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">
                      Assigned Officer:
                    </span>
                    <strong className="text-slate-800">
                      {task.assigned_to}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      Deadline / Target:
                    </span>
                    <strong className="text-slate-800">{task.deadline}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      Sanctioned Budget:
                    </span>
                    <strong className="text-emerald-700">
                      {formatCurrency(task.cost)}
                    </strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Ground Completion: {task.progress}%</span>
                    <span>
                      {task.progress >= 100 ? "Completed" : "Work in progress"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Quick actions for Officer & Corporator */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setProgressForm({ progress: task.progress, note: "" });
                      setIsUpdateProgressModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
                  >
                    Officer: Update Progress
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setFeedbackForm({
                        note: task.corporator_feedback,
                        hasIssue: task.delay_reported,
                      });
                      setIsWardFeedbackModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg"
                  >
                    Corporator: Check on Ground
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: WARD FOLLOW-UP & NEXT MEETING REVIEW */}
      {/* ========================================================================= */}
      {activeStep === "5" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Ward Follow-up & Review for Next Meeting
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Corporator checks ground work. Completed tasks and delayed tasks
              are automatically prepared to be reviewed as Item #1 in the next
              meeting.
            </p>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {task.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {task.progress}% done
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">
                      🔧 Officer's Field Note:
                    </span>
                    <p className="text-slate-600">
                      {task.officer_notes || "No recent note"}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${
                      task.delay_reported
                        ? "bg-red-50 border-red-200 text-red-900"
                        : "bg-purple-50/70 border-purple-200 text-purple-900"
                    }`}
                  >
                    <span className="font-bold block mb-1">
                      👁 Corporator's Ground Check:
                    </span>
                    <p className="text-slate-700">{task.corporator_feedback}</p>
                    {task.delay_reported && (
                      <span className="text-[10px] font-black text-red-700 mt-1 block">
                        ⚠ ESCALATED TO COMMISSIONER FOR SLA DELAY
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setFeedbackForm({
                        note: task.corporator_feedback,
                        hasIssue: task.delay_reported,
                      });
                      setIsWardFeedbackModalOpen(true);
                    }}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800"
                  >
                    + Add New Inspection Note
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prepared summary box */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <strong className="block font-bold">
                ✓ Ready for Next Meeting Agenda
              </strong>
              All above updates will automatically show up as "Previous Work
              Progress Review" when scheduling the next council session.
            </div>
            <button
              onClick={() =>
                showToast("Report printed and dispatched to Council Secretary!")
              }
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shrink-0"
            >
              Print Summary
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMIT AN ISSUE */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Raise a Ward Issue or Proposal"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Who is Submitting? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setIssueForm({ ...issueForm, role: "Corporator" })
                }
                className={`p-2.5 rounded-lg border font-bold text-left ${
                  issueForm.role === "Corporator"
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Hon. Corporator (Ward 24)
                <span className="block text-[10px] font-normal text-slate-500">
                  Citizen problem or ward issue
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setIssueForm({ ...issueForm, role: "Department Head" })
                }
                className={`p-2.5 rounded-lg border font-bold text-left ${
                  issueForm.role === "Department Head"
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Department Head
                <span className="block text-[10px] font-normal text-slate-500">
                  Department report or project
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              What is the Problem / Topic? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken water pipeline outside Sector 4 vegetable market"
              value={issueForm.title}
              onChange={(e) =>
                setIssueForm({ ...issueForm, title: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Concerned Department
              </label>
              <select
                value={issueForm.department}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, department: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              >
                <option value="Water Supply Department">
                  Water Supply Department
                </option>
                <option value="Roads & Infrastructure">
                  Roads & Infrastructure
                </option>
                <option value="Health & Sanitation">Health & Sanitation</option>
                <option value="Electrical Department">
                  Electrical Department
                </option>
                <option value="Solid Waste Management">
                  Solid Waste Management
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={issueForm.urgency}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, urgency: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              >
                <option value="High">High (Urgent Public Need)</option>
                <option value="Medium">Medium (Routine Work)</option>
                <option value="Low">Low (Future Plan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Estimated Budget Needed (₹ Optional)
            </label>
            <input
              type="number"
              placeholder="e.g. 500000"
              value={issueForm.cost}
              onChange={(e) =>
                setIssueForm({ ...issueForm, cost: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Details & Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the location, how many residents are affected, and what action is required..."
              value={issueForm.description}
              onChange={(e) =>
                setIssueForm({ ...issueForm, description: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
            >
              Submit Issue
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: SCHEDULE MEETING */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Council / Ward Meeting"
      >
        <form onSubmit={handleScheduleMeeting} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Meeting Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ward 24 Monthly Development Meeting"
              value={meetingForm.title}
              onChange={(e) =>
                setMeetingForm({ ...meetingForm, title: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={meetingForm.date}
                onChange={(e) =>
                  setMeetingForm({ ...meetingForm, date: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Time
              </label>
              <input
                type="text"
                value={meetingForm.time}
                onChange={(e) =>
                  setMeetingForm({ ...meetingForm, time: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Meeting Place / Hall
            </label>
            <input
              type="text"
              value={meetingForm.venue}
              onChange={(e) =>
                setMeetingForm({ ...meetingForm, venue: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Short Summary / Purpose
            </label>
            <textarea
              rows={2}
              placeholder="Brief note on what this meeting is about..."
              value={meetingForm.summary}
              onChange={(e) =>
                setMeetingForm({ ...meetingForm, summary: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
            >
              Confirm & Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN TASK TO OFFICER */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAssignTaskModalOpen}
        onClose={() => setIsAssignTaskModalOpen(false)}
        title="Assign Meeting Decision to Officer"
      >
        <form onSubmit={handleAssignTask} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Laying 300mm drinking water pipe in Sector 4"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={taskForm.department}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, department: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              >
                <option value="Water Supply Department">
                  Water Supply Department
                </option>
                <option value="Roads & Infrastructure">
                  Roads & Infrastructure
                </option>
                <option value="Health & Sanitation">Health & Sanitation</option>
                <option value="Electrical Department">
                  Electrical Department
                </option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Officer in Charge *
              </label>
              <input
                type="text"
                required
                value={taskForm.assigned_to}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, assigned_to: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Deadline Date
              </label>
              <input
                type="date"
                value={taskForm.deadline}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, deadline: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sanctioned Budget (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 3200000"
                value={taskForm.cost}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, cost: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignTaskModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
            >
              Assign to Officer
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: OFFICER PROGRESS UPDATE */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isUpdateProgressModalOpen}
        onClose={() => setIsUpdateProgressModalOpen(false)}
        title="Officer: Update Work Progress"
      >
        <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Task</label>
            <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
              {selectedTask?.title}
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Completion Percentage ({progressForm.progress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressForm.progress}
              onChange={(e) =>
                setProgressForm({
                  ...progressForm,
                  progress: Number(e.target.value),
                })
              }
              className="w-full accent-purple-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Field Progress Note
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Trenches dug, pipes delivered to site, joining work underway..."
              value={progressForm.note}
              onChange={(e) =>
                setProgressForm({ ...progressForm, note: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUpdateProgressModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
            >
              Save Progress
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: CORPORATOR ON-GROUND FEEDBACK */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isWardFeedbackModalOpen}
        onClose={() => setIsWardFeedbackModalOpen(false)}
        title="Corporator: On-Site Ward Inspection"
      >
        <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Task Being Inspected
            </label>
            <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
              {selectedTask?.title}
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Your On-Site Observation / Notes
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Inspected work at Sector 4. Good speed, instructed contractor to clean debris from pedestrian path..."
              value={feedbackForm.note}
              onChange={(e) =>
                setFeedbackForm({ ...feedbackForm, note: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feedbackForm.hasIssue}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    hasIssue: e.target.checked,
                  })
                }
                className="rounded text-red-600"
              />
              <span className="font-bold text-red-800">
                Flag serious delay or poor quality to Municipal Commissioner
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWardFeedbackModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold hover:bg-purple-800"
            >
              Save Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
