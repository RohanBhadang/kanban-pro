import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User, MessageSquare } from "lucide-react";
import clsx from "clsx";

const SortableTask = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700"
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 h-[100px] min-h-[100px] items-center flex justify-center bg-slate-100 rounded-lg border-2 border-dashed border-indigo-300"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", priorityColors[task.priority] || "bg-slate-100 text-slate-600")}>
          {task.priority}
        </span>
        <div className="flex -space-x-1">
           {task.assignedTo && (
             <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white ring-1 ring-slate-100">
               <span className="text-[10px] font-bold text-indigo-700">
                 {task.assignedTo.name?.[0]}
               </span>
             </div>
           )}
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-slate-800 mb-3">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className="flex items-center text-[10px] font-bold px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-slate-600 shadow-sm">
              <Calendar className="h-3 w-3 mr-1.5 text-indigo-500" />
              {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          )}
          {task.comments?.length > 0 && (
            <div className="flex items-center text-[10px] font-bold text-slate-400">
              <MessageSquare className="h-3 w-3 mr-1" />
              {task.comments.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableTask;
