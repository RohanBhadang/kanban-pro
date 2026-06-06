import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Layout, User as UserIcon, LogOut } from "lucide-react";

const DashboardPage = () => {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("/boards");
      setBoards(res.data.data);
    } catch (err) {
      console.error("Error fetching boards", err);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      await axios.post("/boards", { title: newBoardTitle });
      setNewBoardTitle("");
      setShowModal(false);
      fetchBoards();
    } catch (err) {
      console.error("Error creating board", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Sidebar/Navbar Hybrid */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                 <Layout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter italic">KANBANPRO</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                <span className="text-xs font-medium text-slate-500">{user?.email}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200">
                 <UserIcon className="h-5 w-5 text-slate-500" />
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Manage all your active boards in one place.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Board
          </button>
        </div>

        {boards.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Link
                key={board._id}
                to={`/b/${board._id}`}
                className="group relative bg-white p-8 rounded-[2rem] border-2 border-transparent shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                    <Layout className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {board.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-6">
                  Started by <span className="text-slate-600">{board.createdBy?.name || "Member"}</span>
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                     {board.members?.length || 1} Members
                   </span>
                   <div className="text-indigo-600 font-bold text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Board
                      <Plus className="h-4 w-4 ml-1 rotate-45" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <div className="bg-slate-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Layout className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">No Boards Yet</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">
              Ready to start something big? Create your first Kanban board now.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-10 inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Get Started
            </button>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 right-0 p-8">
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="h-8 w-8 rotate-45" />
               </button>
            </div>

            <div className="mb-10">
              <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center mb-6">
                 <Plus className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Workspace</h2>
              <p className="text-slate-500 font-medium mt-1">Give your board a name to get started.</p>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Board Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Q4 Marketing Launch"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-800 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 text-lg"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
