import { useEffect, useState } from "react";
import { X, Calendar, User as UserIcon, AlertCircle, MessageSquare, History, Trash2, Save } from "lucide-react";
import clsx from "clsx";
import axios from "../api/axios";

const PRIORITIES = ["Low", "Medium", "High"];

const TaskModal = ({ task, boardMembers = [], onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    dueDate: ""
  });
  const [activeTab, setActiveTab] = useState("details"); // details, activity, comments
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/tasks/${task._id}`, formData);
      onUpdate(res.data.data);
      // onClose(); // Keep open to show success or let user continue editing
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
       const res = await axios.put(`/tasks/${task._id}`, {
          $push: { comments: { text: comment } }
       });
       onUpdate(res.data.data);
       setComment("");
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
           <div className="flex items-center space-x-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                 <AlertCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Task Details</h2>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all">
              <X className="h-6 w-6" />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
           {["details", "comments", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-3 text-sm font-semibold capitalize transition-all border-b-2",
                  activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
           {activeTab === "details" && (
              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full text-lg font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add a more detailed description..."
                      className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                       <div className="flex space-x-2">
                          {PRIORITIES.map((p) => (
                             <button
                               key={p}
                               onClick={() => setFormData({ ...formData, priority: p })}
                               className={clsx(
                                 "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all border",
                                 formData.priority === p 
                                   ? "bg-indigo-600 border-indigo-600 text-white" 
                                   : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                               )}
                             >
                               {p}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assignee</label>
                       <select
                         name="assignedTo"
                         value={formData.assignedTo}
                         onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                          <option value="">Unassigned</option>
                          {boardMembers.map((m) => (
                             <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                          ))}
                       </select>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                       <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === "comments" && (
              <div className="space-y-6">
                 <form onSubmit={handleAddComment} className="relative">
                    <textarea
                      placeholder="Write a comment..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pb-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                       <Save className="h-4 w-4" />
                    </button>
                 </form>

                 <div className="space-y-4">
                    {task.comments?.map((c, idx) => (
                       <div key={idx} className="flex space-x-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                             <span className="text-xs font-bold text-slate-600">{c.user?.name?.[0] || "?"}</span>
                          </div>
                          <div className="bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 flex-1">
                             <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-900">{c.user?.name || "Member"}</span>
                                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                             </div>
                             <p className="text-sm text-slate-600">{c.text}</p>
                          </div>
                       </div>
                    ))}
                    {!task.comments?.length && <p className="text-center text-sm text-slate-400 py-10">No comments yet.</p>}
                 </div>
              </div>
           )}

           {activeTab === "activity" && (
              <div className="space-y-4">
                 {task.activityLog?.map((a, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                       <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                       <div>
                          <p className="text-sm text-slate-700">
                             <span className="font-bold">{a.user?.name || "System"}</span> {a.action}
                          </p>
                          <p className="text-xs text-slate-400">{new Date(a.timestamp).toLocaleString()}</p>
                       </div>
                    </div>
                 ))}
                 {!task.activityLog?.length && <p className="text-center text-sm text-slate-400 py-10">No activity yet.</p>}
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <button 
             onClick={() => { if(window.confirm("Delete this task?")) onDelete(task._id) }}
             className="flex items-center text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
           >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
           </button>
           
           <div className="flex space-x-3">
              <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all">
                 Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                 <Save className="h-4 w-4 mr-2" />
                 Save Changes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
