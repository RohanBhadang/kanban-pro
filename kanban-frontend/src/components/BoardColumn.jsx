import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import { MoreHorizontal, Plus } from "lucide-react";

const BoardColumn = ({ id, title, tasks, onTaskClick, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "Column"
    }
  });

  return (
    <div className="flex flex-col bg-slate-100 rounded-xl w-80 min-w-[320px] max-h-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-slate-700">{title}</h3>
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-3 overflow-y-auto scrollbar-hide min-h-[200px]"
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>

      <div className="p-2 mt-auto">
        <button
          onClick={() => onAddTask(id)}
          className="flex items-center w-full p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-all text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default BoardColumn;
