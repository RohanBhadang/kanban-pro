import { create } from "zustand";
import axios from "../api/axios";
import { socket } from "../socket";

const useKanbanStore = create((set, get) => ({
  board: null,
  tasks: [],
  loading: false,
  error: null,

  fetchBoardData: async (boardId) => {
    set({ loading: true, error: null });
    try {
      const [boardRes, tasksRes] = await Promise.all([
        axios.get(`/boards/${boardId}`),
        axios.get(`/tasks/${boardId}`)
      ]);
      set({
        board: boardRes.data.data,
        tasks: tasksRes.data.data,
        loading: false
      });
      
      // Join socket room
      socket.emit("join_board", boardId);
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch board data", loading: false });
    }
  },

  moveTask: async (taskId, newStatus, newPosition) => {
    const { tasks } = get();
    const oldTasks = [...tasks];
    
    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t._id === taskId ? { ...t, status: newStatus, position: newPosition } : t
    );
    set({ tasks: updatedTasks });

    try {
      await axios.put("/tasks/move", { taskId, status: newStatus, position: newPosition });
      // Socket event is usually handled by backend emitting to the room
    } catch (err) {
      // Rollback on error
      set({ tasks: oldTasks, error: "Failed to move task" });
    }
  },

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  
  updateTaskState: (updatedTask) => set((state) => ({
    tasks: state.tasks.map(t => t._id === updatedTask._id ? updatedTask : t)
  })),

  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t._id !== taskId)
  })),

  setTasks: (tasks) => set({ tasks })
}));

export default useKanbanStore;
