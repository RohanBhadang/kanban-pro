import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Layout, Users, Settings, Plus, ChevronLeft, Send, LogOut } from "lucide-react";

import useKanbanStore from "../store/useKanbanStore";
import { useAuth } from "../context/AuthContext";
import BoardColumn from "../components/BoardColumn";
import SortableTask from "../components/SortableTask";
import TaskModal from "../components/TaskModal";
import axios from "../api/axios";
import { socket } from "../socket";

const COLUMNS = [
  { id: "Todo", title: "To Do" },
  { id: "InProgress", title: "In Progress" },
  { id: "Review", title: "Review" },
  { id: "Done", title: "Done" }
];

const BoardPage = () => {
  const { boardId } = useParams();
  const { user, logout } = useAuth();
  const {
    board,
    tasks,
    loading,
    error,
    fetchBoardData,
    moveTask,
    setTasks,
    updateTaskState,
    addTask,
    removeTask
  } = useKanbanStore();

  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    fetchBoardData(boardId);
  }, [boardId]);

  useEffect(() => {
    socket.on("task_created", (newTask) => {
      if (newTask.boardId === boardId) addTask(newTask);
    });
    socket.on("task_updated", (updatedTask) => {
      if (updatedTask.boardId === boardId) updateTaskState(updatedTask);
    });
    socket.on("task_moved", ({ taskId, status, position, boardId: bId }) => {
      if (bId === boardId) {
        const updatedTasks = tasks.map(t => 
          t._id === taskId ? { ...t, status, position } : t
        );
        setTasks(updatedTasks);
      }
    });
    socket.on("task_deleted", ({ taskId, boardId: bId }) => {
       if (bId === boardId) removeTask(taskId);
    });

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_moved");
      socket.off("task_deleted");
    };
  }, [boardId, tasks]);

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Implemented logic for moving between columns
    const activeTask = active.data.current.task;
    const overTask = over.data.current?.task;

    if (isActiveATask && isOverATask) {
      if (activeTask.status !== overTask.status) {
         const newTasks = [...tasks];
         const activeIndex = newTasks.findIndex(t => t._id === activeId);
         const overIndex = newTasks.findIndex(t => t._id === overId);
         
         newTasks[activeIndex].status = overTask.status;
         setTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }

    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
       if (activeTask.status !== overId) {
         const newTasks = [...tasks];
         const activeIndex = newTasks.findIndex(t => t._id === activeId);
         newTasks[activeIndex].status = overId;
         setTasks(arrayMove(newTasks, activeIndex, activeIndex));
       }
    }
  };

  const onDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = active.data.current.task;
    const overData = over.data.current;
    
    let newStatus = activeTask.status;
    if (overData.type === "Column") newStatus = overId;
    if (overData.type === "Task") newStatus = overData.task.status;

    const newTasks = [...tasks];
    const activeIndex = newTasks.findIndex(t => t._id === activeId);
    const overIndex = newTasks.findIndex(t => t._id === overId);
    
    const finalTasks = arrayMove(newTasks, activeIndex, overIndex === -1 ? activeIndex : overIndex);
    
    // Send to backend
    moveTask(activeId, newStatus, overIndex === -1 ? 0 : overIndex);
    setTasks(finalTasks);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/boards/${boardId}/invite`, { emailOrUsername: inviteInput });
      alert("Invitation sent!");
      setInviteInput("");
      setShowInviteModal(false);
      fetchBoardData(boardId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invitation");
    }
  };

  const handleAddTask = async (status) => {
    try {
      const res = await axios.post("/tasks", {
        title: "New Task",
        boardId,
        status,
        position: tasks.filter(t => t.status === status).length
      });
      // addTask(res.data.data); // Handled by socket
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 flex items-center space-x-2 border-b border-slate-200 bg-white">
          <Layout className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-slate-900">KanbanPro</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <Link to="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 mb-4 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Board</h2>
            <div className="px-2 py-2 bg-indigo-50 rounded-lg border border-indigo-100 mb-4">
               <h3 className="font-semibold text-indigo-900 truncate">{board?.title}</h3>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Members</h2>
            <div className="space-y-1">
              {board?.members?.map((member) => (
                <div key={member.user._id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 group">
                  <div className="flex items-center min-w-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0 border border-indigo-200">
                       <span className="text-xs font-bold text-indigo-700">{member.user.name?.[0]}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                       <span className="text-sm font-bold text-slate-800 truncate">{member.user.name}</span>
                       <span className="text-[10px] font-medium text-slate-500 truncate">{member.user.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 hidden group-hover:block uppercase ml-2">{member.role}</span>
                </div>
              ))}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center w-full p-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-4">
             <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-white">{user?.name?.[0]}</span>
             </div>
             <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
             </div>
          </div>
          <button onClick={logout} className="flex items-center w-full p-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
             <LogOut className="h-4 w-4 mr-2" />
             Logout
          </button>
        </div>
      </aside>

      {/* Main Board */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">{board?.title}</h1>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center text-sm text-slate-500 font-medium">
               <Users className="h-4 w-4 mr-1" />
               {board?.members?.length || 1} members
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                <Settings className="h-5 w-5" />
             </button>
             <button onClick={() => handleAddTask("Todo")} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 shadow-sm transition-all">
                <Plus className="h-4 w-4 mr-2" />
                New Task
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-8 bg-slate-50/50">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <div className="flex space-x-6 h-full">
              {COLUMNS.map((col) => (
                <BoardColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={tasks.filter(t => t.status === col.id).sort((a,b) => a.position - b.position)}
                  onTaskClick={setSelectedTask}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>

            {createPortal(
              <DragOverlay dropAnimation={{
                 sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                       active: {
                          opacity: "0.5",
                       },
                    },
                 }),
              }}>
                {activeTask ? <SortableTask task={activeTask} /> : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowInviteModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Invite to Board</h3>
              <p className="text-sm text-slate-600 font-medium mb-6">Enter the email or username of the person you want to invite.</p>
              <form onSubmit={handleInvite}>
                <div className="flex flex-col space-y-4">
                   <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Email or username"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                        value={inviteInput}
                        onChange={(e) => setInviteInput(e.target.value)}
                      />
                   </div>
                   <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Invitation
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          boardMembers={board?.members}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
             updateTaskState(updated);
             setSelectedTask(updated);
          }}
          onDelete={(id) => {
             removeTask(id);
             setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default BoardPage;
